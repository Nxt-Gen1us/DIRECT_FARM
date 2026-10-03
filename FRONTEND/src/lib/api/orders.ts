/**
 * DIRECT FARM — Orders API
 * Wraps /api/v1/orders/* and adapts backend Order shape → frontend Order type.
 * 
 * Key schema differences handled here:
 *  - Backend items: { product (ObjectId or populated), quantity, price }
 *  - Frontend items: { productId, name, image, qty, unit, price }
 *  - Backend status has "processing" (not in frontend); mapped to "confirmed"
 *  - Backend stores separate FarmerProfile ref; frontend uses farmerId/farmerName
 *  - Delivery tracking lives in the separate DeliveryTracking collection
 */
import api from "../api";
import type { Address, Order, OrderStatus, PaymentMethod } from "../types";

// ── Backend shapes ────────────────────────────────────────────────────────────
interface BackendOrderItem {
  product:
    | string
    | { _id: string; name?: string; images?: { url: string }[]; packaging?: string };
  quantity: number;
  price: number;
}

interface BackendFarmer {
  _id: string;
  farmName?: string;
  user?: { _id: string; firstName?: string; lastName?: string };
}

interface BackendCustomer {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface BackendOrder {
  _id: string;
  customer: BackendCustomer | string;
  farmer: BackendFarmer | string;
  items: BackendOrderItem[];
  status: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  subtotal: number;
  shippingFee?: number;
  tax?: number;
  total: number;
  deliveryAddress?: {
    label?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  invoiceUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// ── Adapter ───────────────────────────────────────────────────────────────────
function statusMap(s: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    pending: "pending",
    confirmed: "confirmed",
    processing: "confirmed",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
    returned: "cancelled",
  };
  return map[s] ?? "pending";
}

export function adaptOrder(o: BackendOrder): Order {
  const customer =
    typeof o.customer === "string" ? { _id: o.customer } : o.customer;
  const farmer =
    typeof o.farmer === "string" ? { _id: o.farmer, farmName: "Farm" } : o.farmer;

  const farmerUser = farmer?.user;
  const farmerName = (
    farmer?.farmName
    ?? (farmerUser ? `${farmerUser.firstName ?? ""} ${farmerUser.lastName ?? ""}`.trim() : "")
  ) || "Farmer";

  const customerName =
    typeof customer === "object" && customer !== null
      ? `${(customer as BackendCustomer).firstName ?? ""} ${(customer as BackendCustomer).lastName ?? ""}`.trim()
      : "";

  const items = o.items.map((item) => {
    const prod =
      typeof item.product === "string"
        ? { _id: item.product, name: "Product", images: [] }
        : item.product;
    const image =
      Array.isArray((prod as { images?: { url: string }[] }).images) &&
      (prod as { images: { url: string }[] }).images.length > 0
        ? (prod as { images: { url: string }[] }).images[0].url
        : "/images/product-placeholder.jpg";

    return {
      productId: (prod as { _id: string })._id,
      name: (prod as { name?: string }).name ?? "Product",
      image,
      qty: item.quantity,
      unit: "kg",
      price: item.price,
    };
  });

  const addr = o.deliveryAddress;
  const addressStr = addr
    ? [addr.street, addr.city, addr.state, addr.postalCode, addr.country]
        .filter(Boolean)
        .join(", ")
    : "";

  const status = statusMap(o.status);

  // Build minimal tracking timeline from status
  const trackSteps = ["placed", "packed", "shipped", "out", "delivered"] as const;
  const statusToIdx: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    processing: 1,
    shipped: 2,
    delivered: 4,
    cancelled: 0,
  };
  const currentIdx = statusToIdx[o.status] ?? 0;

  return {
    id: o._id,
    buyerId: typeof o.customer === "string" ? o.customer : (o.customer as BackendCustomer)._id,
    buyerName: customerName,
    farmerId: farmer._id,
    farmerName,
    items,
    status,
    paymentStatus: o.paymentStatus ?? (status === "delivered" ? "paid" : "pending"),
    paymentMethod: o.paymentMethod ?? ("cod" as PaymentMethod),
    subtotal: o.subtotal,
    delivery: o.shippingFee ?? 0,
    total: o.total,
    address: addressStr,
    shipping: addr
      ? {
          id: o._id,
          label: addr.label ?? "",
          name: customerName,
          phone: "",
          line1: addr.street ?? "",
          city: addr.city ?? "",
          state: addr.state ?? "",
          pincode: addr.postalCode ?? "",
        }
      : undefined,
    placedAt: o.createdAt,
    eta: new Date(Date.now() + 86_400_000 * 2).toISOString().slice(0, 10),
    tracking: trackSteps.map((label, i) => ({
      label,
      at: i <= currentIdx ? o.createdAt : "",
      done: i <= currentIdx,
    })),
    trackStage: trackSteps[Math.min(currentIdx, 4)] as Order["trackStage"],
    invoiceNo: o.invoiceUrl ? `INV-${o._id}` : undefined,
    returnStatus: "none",
  };
}

// ── Create order payload ──────────────────────────────────────────────────────
export interface CreateOrderPayload {
  farmer: string; // FarmerProfile ObjectId
  items: { product: string; quantity: number; price: number }[];
  paymentMethod?: PaymentMethod;
  subtotal: number;
  shippingFee?: number;
  tax?: number;
  total: number;
  deliveryAddress: {
    label?: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function placeOrder(payload: CreateOrderPayload): Promise<Order> {
  const raw = await api.post<BackendOrder>("/orders", payload);
  return adaptOrder(raw);
}

export async function fetchMyOrders(): Promise<Order[]> {
  const raw = await api.get<BackendOrder[]>("/orders/customer");
  return (raw ?? []).map(adaptOrder);
}

export async function fetchFarmerOrders(): Promise<Order[]> {
  const raw = await api.get<BackendOrder[]>("/orders/farmer");
  return (raw ?? []).map(adaptOrder);
}

export async function fetchOrder(id: string): Promise<Order> {
  const raw = await api.get<BackendOrder>(`/orders/${id}`);
  return adaptOrder(raw);
}

export async function updateOrderStatus(
  id: string,
  status: string,
): Promise<Order> {
  const raw = await api.patch<BackendOrder>(`/orders/${id}`, { status });
  return adaptOrder(raw);
}

/** Helper: convert frontend Address → backend deliveryAddress */
export function addressToBackend(a: Address): CreateOrderPayload["deliveryAddress"] {
  return {
    label: a.label,
    street: [a.line1, a.line2].filter(Boolean).join(", "),
    city: a.city,
    state: a.state,
    postalCode: a.pincode,
    country: "India",
  };
}
