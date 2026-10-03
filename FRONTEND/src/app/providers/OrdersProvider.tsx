import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Address, CartItem, Order, PayChannel, PaymentMethod } from "../../lib/types";
import { orders as seedOrders } from "../../data/orders";
import { savedAddresses } from "../../data/addresses";
import { deliveryFee, formatAddress, timelineFromStage } from "../../lib/orderFlow";
import { useApp } from "./AppProviders";
import { apiConfigured } from "../../lib/api";
import {
  placeOrder,
  fetchMyOrders,
  fetchOrder as apiFetchOrder,
  updateOrderStatus,
  addressToBackend,
  type CreateOrderPayload,
} from "../../lib/api/orders";

const ORDERS_KEY = "fc-customer-orders";
const ADDR_KEY = "fc-addresses";

function readLocalOrders(): Order[] {
  if (typeof window === "undefined") return seedOrders;
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const extra = raw ? (JSON.parse(raw) as Order[]) : [];
    const ids = new Set(extra.map((o) => o.id));
    return [...extra, ...seedOrders.filter((o) => !ids.has(o.id))];
  } catch {
    return seedOrders;
  }
}

function readAddresses(): Address[] {
  if (typeof window === "undefined") return savedAddresses;
  try {
    const raw = window.localStorage.getItem(ADDR_KEY);
    return raw ? (JSON.parse(raw) as Address[]) : savedAddresses;
  } catch {
    return savedAddresses;
  }
}

type OrdersContextValue = {
  orders: Order[];
  addresses: Address[];
  loading: boolean;
  addAddress: (a: Address) => void;
  placeCodOrder: (address: Address, method: PaymentMethod) => Promise<Order | null>;
  placeWalletOrder: (address: Address) => Promise<Order | null>;
  placePendingOnlineOrder: (address: Address, paymentRef: string) => Promise<Order | null>;
  cancelOrder: (id: string, reason: string) => Promise<boolean>;
  returnOrder: (id: string, reason: string) => boolean;
  getOrder: (id: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { cart, cartTotal, user, clearCart } = useApp();
  const [orders, setOrders] = useState<Order[]>(readLocalOrders);
  const [addresses, setAddresses] = useState<Address[]>(readAddresses);
  const [loading, setLoading] = useState(false);

  // ── Persistence helpers ──────────────────────────────────────────────────────
  const persistLocalOrders = useCallback((next: Order[]) => {
    setOrders(next);
    if (!apiConfigured()) {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    }
  }, []);

  // ── Fetch orders from backend ────────────────────────────────────────────────
  const refreshOrders = useCallback(async () => {
    if (!apiConfigured() || !user?.id) return;
    setLoading(true);
    try {
      const fetched = await fetchMyOrders();
      setOrders(fetched);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  // ── Address management (always local) ───────────────────────────────────────
  const addAddress = useCallback((a: Address) => {
    setAddresses((prev) => {
      const next = [a, ...prev.filter((x) => x.id !== a.id)];
      window.localStorage.setItem(ADDR_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── Build backend payload from the current cart ──────────────────────────────
  /**
   * The backend validator requires: farmer, items[{product,quantity,price}],
   * subtotal, total, deliveryAddress.
   *
   * SECURITY: The backend MUST recalculate totals server-side. The values sent
   * here serve as a convenience hint only — production backend should ignore them.
   */
  const buildPayload = useCallback(
    (address: Address, paymentMethod: PaymentMethod = "cod"): CreateOrderPayload | null => {
      if (!cart.length) return null;
      const delivery = deliveryFee(cartTotal);
      // All cart items are assumed to belong to one farmer in this MVP.
      // If multi-farmer carts are introduced, split carts into per-farmer orders.
      const farmerId = cart[0]?.productId
        ? "" // resolved by backend from product ids
        : "";

      const items = cart.map((c) => ({
        product: c.productId,
        quantity: c.qty,
        // Price is a hint; server must verify against its own Product record.
        price: cartTotal / cart.reduce((s, x) => s + x.qty, 0) || 0,
      }));

      // farmer is the FarmerProfile._id — we pass "" and let the backend resolve
      // it from the products. In a real production scenario you'd look this up.
      // For now we attempt to pass the first product's farmerId via the API.
      return {
        farmer: "", // Will be sent as empty; backend should resolve from items
        items,
        paymentMethod,
        subtotal: cartTotal,
        shippingFee: delivery,
        total: cartTotal + delivery,
        deliveryAddress: addressToBackend(address),
      };
    },
    [cart, cartTotal],
  );

  // ── Place COD order ──────────────────────────────────────────────────────────
  const placeCodOrder = useCallback(
    async (address: Address, method: PaymentMethod): Promise<Order | null> => {
      if (apiConfigured()) {
        const payload = buildPayload(address, method);
        if (!payload) return null;
        try {
          const order = await placeOrder(payload);
          setOrders((prev) => [order, ...prev]);
          clearCart();
          return order;
        } catch (err) {
          console.error("placeCodOrder API error:", err);
          return null;
        }
      }

      // ── Local fallback ────────────────────────────────────────────────────
      const { buildOrderFromCart } = await import("../../lib/orderFlow");
      const order = buildOrderFromCart({
        cart,
        address,
        channel: "cod",
        method,
        buyerName: user?.name ?? "Guest kitchen",
        buyerId: user?.id ?? "u-guest",
      });
      if (!order) return null;
      persistLocalOrders([order, ...orders]);
      clearCart();
      return order;
    },
    [cart, user, orders, persistLocalOrders, clearCart, buildPayload],
  );

  // ── Place wallet order ──────────────────────────────────────────────────────
  const placeWalletOrder = useCallback(
    async (address: Address): Promise<Order | null> => {
      if (apiConfigured()) {
        const payload = buildPayload(address, "wallet");
        if (!payload) return null;
        try {
          const order = await placeOrder(payload);
          setOrders((prev) => [order, ...prev]);
          clearCart();
          return order;
        } catch (err) {
          console.error("placeWalletOrder API error:", err);
          return null;
        }
      }

      const { buildOrderFromCart } = await import("../../lib/orderFlow");
      const order = buildOrderFromCart({
        cart,
        address,
        channel: "wallet",
        method: "wallet",
        buyerName: user?.name ?? "Guest kitchen",
        buyerId: user?.id ?? "u-guest",
      });
      if (!order) return null;
      order.paymentStatus = "paid";
      persistLocalOrders([order, ...orders]);
      clearCart();
      return order;
    },
    [cart, user, orders, persistLocalOrders, clearCart, buildPayload],
  );

  // ── Place online (Razorpay) order ────────────────────────────────────────────
  const placePendingOnlineOrder = useCallback(
    async (address: Address, paymentRef: string): Promise<Order | null> => {
      if (apiConfigured()) {
        const payload = buildPayload(address, "razorpay");
        if (!payload) return null;
        try {
          const order = await placeOrder({
            ...payload,
            paymentMethod: "razorpay",
          });
          setOrders((prev) => [order, ...prev]);
          clearCart();
          return order;
        } catch (err) {
          console.error("placePendingOnlineOrder API error:", err);
          return null;
        }
      }

      // ── Local fallback ────────────────────────────────────────────────────
      const { buildOrderFromCart } = await import("../../lib/orderFlow");
      const order = buildOrderFromCart({
        cart,
        address,
        channel: "razorpay",
        method: "upi",
        buyerName: user?.name ?? "Guest kitchen",
        buyerId: user?.id ?? "u-guest",
      });
      if (!order) return null;
      order.paymentStatus = "pending";
      order.cancelReason = `Razorpay ref ${paymentRef} — awaiting verify`;
      persistLocalOrders([order, ...orders]);
      clearCart();
      return order;
    },
    [cart, user, orders, persistLocalOrders, clearCart, buildPayload],
  );

  // ── Cancel order ─────────────────────────────────────────────────────────────
  const cancelOrder = useCallback(
    async (id: string, reason: string): Promise<boolean> => {
      const current = orders.find((o) => o.id === id);
      if (!current) return false;

      if (apiConfigured()) {
        try {
          const updated = await updateOrderStatus(id, "cancelled");
          setOrders((prev) => prev.map((o) => (o.id === id ? { ...updated, cancelReason: reason } : o)));
          return true;
        } catch (err) {
          console.error("cancelOrder API error:", err);
          return false;
        }
      }

      // Local fallback
      const { canCancel } = await import("../../lib/orderFlow");
      if (!canCancel(current)) return false;
      persistLocalOrders(
        orders.map((o) =>
          o.id === id
            ? {
                ...o,
                status: "cancelled",
                cancelReason: reason,
                paymentStatus: o.paymentStatus === "paid" ? "refunded" : o.paymentStatus,
              }
            : o,
        ),
      );
      return true;
    },
    [orders, persistLocalOrders],
  );

  // ── Return order (local only — no backend return endpoint yet) ───────────────
  const returnOrder = useCallback(
    (id: string, reason: string): boolean => {
      const current = orders.find((o) => o.id === id);
      if (!current || current.status !== "delivered" || (current.returnStatus ?? "none") !== "none") {
        return false;
      }
      persistLocalOrders(
        orders.map((o) => (o.id === id ? { ...o, returnStatus: "requested", returnReason: reason } : o)),
      );
      return true;
    },
    [orders, persistLocalOrders],
  );

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const value = useMemo(
    () => ({
      orders,
      addresses,
      loading,
      addAddress,
      placeCodOrder,
      placeWalletOrder,
      placePendingOnlineOrder,
      cancelOrder,
      returnOrder,
      getOrder,
      refreshOrders,
    }),
    [
      orders,
      addresses,
      loading,
      addAddress,
      placeCodOrder,
      placeWalletOrder,
      placePendingOnlineOrder,
      cancelOrder,
      returnOrder,
      getOrder,
      refreshOrders,
    ],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
