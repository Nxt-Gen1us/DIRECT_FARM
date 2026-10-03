import type { Address, Order, TrackStageId, TrackStep } from "./types";
import { farmerById } from "../data/farmers";
import { products } from "../data/products";
import type { CartItem, PayChannel, PaymentMethod } from "./types";

export const TRACK_STAGES: TrackStageId[] = [
  "placed",
  "packed",
  "shipped",
  "out",
  "delivered",
];

export function formatAddress(a: Address) {
  return [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ");
}

export function timelineFromStage(stage: TrackStageId, placedAt: string): TrackStep[] {
  const idx = TRACK_STAGES.indexOf(stage);
  return TRACK_STAGES.map((id, i) => ({
    id,
    at: i === 0 ? placedAt : i <= idx ? placedAt : "",
    done: i <= idx,
  }));
}

export function stageFromStatus(status: Order["status"]): TrackStageId {
  if (status === "delivered") return "delivered";
  if (status === "shipped") return "out";
  if (status === "packed") return "packed";
  return "placed";
}

export function canCancel(order: Order) {
  if (order.status === "cancelled" || order.status === "delivered") return false;
  const stage = order.trackStage ?? stageFromStatus(order.status);
  return stage === "placed" || stage === "packed";
}

export function canReturn(order: Order) {
  return order.status === "delivered" && (order.returnStatus ?? "none") === "none";
}

export function deliveryFee(subtotal: number) {
  return subtotal === 0 || subtotal >= 999 ? 0 : 40;
}

export function buildOrderFromCart(opts: {
  cart: CartItem[];
  address: Address;
  channel: PayChannel;
  method: PaymentMethod;
  buyerName: string;
  buyerId: string;
}): Order | null {
  if (!opts.cart.length) return null;
  const items = opts.cart
    .map((c) => {
      const p = products.find((x) => x.id === c.productId);
      if (!p) return null;
      return {
        productId: p.id,
        name: p.name,
        image: p.image,
        qty: c.qty,
        unit: p.unit,
        price: p.price,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  if (!items.length) return null;
  const first = products.find((p) => p.id === items[0].productId);
  const farmer = first ? farmerById(first.farmerId) : undefined;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = deliveryFee(subtotal);
  const placedAt = new Date().toISOString();
  const id = `FC-${88000 + Math.floor(Math.random() * 900)}`;
  return {
    id,
    buyerId: opts.buyerId,
    buyerName: opts.buyerName,
    farmerId: first?.farmerId ?? "f-ramesh",
    farmerName: farmer?.name ?? "Farm collective",
    items,
    status: "pending",
    paymentStatus: opts.channel === "wallet" ? "paid" : "pending",
    paymentMethod: opts.method,
    subtotal,
    delivery,
    total: subtotal + delivery,
    address: formatAddress(opts.address),
    shipping: opts.address,
    placedAt,
    eta: new Date(Date.now() + 86_400_000 * 2).toISOString().slice(0, 10),
    tracking: [
      { label: "Order placed", at: "Just now", done: true },
      { label: "Packed", at: "", done: false },
    ],
    timeline: timelineFromStage("placed", placedAt),
    trackStage: "placed",
    payChannel: opts.channel,
    invoiceNo: `INV-${id}`,
    returnStatus: "none",
  };
}

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

export function razorpayReady() {
  return Boolean(RAZORPAY_KEY && RAZORPAY_KEY.length > 8);
}
