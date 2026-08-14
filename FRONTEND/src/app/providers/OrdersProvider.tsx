import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Address, CartItem, Order, PayChannel, PaymentMethod } from "../../lib/types";
import { orders as seedOrders } from "../../data/orders";
import { savedAddresses } from "../../data/addresses";
import { buildOrderFromCart, canCancel, canReturn } from "../../lib/orderFlow";
import { useApp } from "./AppProviders";

const ORDERS_KEY = "fc-customer-orders";
const ADDR_KEY = "fc-addresses";

function readOrders(): Order[] {
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
  addAddress: (a: Address) => void;
  placeCodOrder: (address: Address, method: PaymentMethod) => Order | null;
  placePendingOnlineOrder: (address: Address, paymentRef: string) => Order | null;
  cancelOrder: (id: string, reason: string) => boolean;
  returnOrder: (id: string, reason: string) => boolean;
  getOrder: (id: string) => Order | undefined;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { cart, user, clearCart } = useApp();
  const [orders, setOrders] = useState<Order[]>(readOrders);
  const [addresses, setAddresses] = useState<Address[]>(readAddresses);

  const persistOrders = useCallback((next: Order[]) => {
    setOrders(next);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  }, []);

  const addAddress = useCallback((a: Address) => {
    setAddresses((prev) => {
      const next = [a, ...prev.filter((x) => x.id !== a.id)];
      window.localStorage.setItem(ADDR_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const placeCodOrder = useCallback(
    (address: Address, method: PaymentMethod) => {
      const order = buildOrderFromCart({
        cart,
        address,
        channel: "cod" as PayChannel,
        method,
        buyerName: user?.name ?? "Guest kitchen",
        buyerId: user?.id ?? "u-guest",
      });
      if (!order) return null;
      persistOrders([order, ...orders]);
      clearCart();
      return order;
    },
    [cart, user, orders, persistOrders, clearCart],
  );

  const placePendingOnlineOrder = useCallback(
    (address: Address, paymentRef: string) => {
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
      order.cancelReason = `Razorpay ref ${paymentRef} — awaiting farm API verify`;
      persistOrders([order, ...orders]);
      clearCart();
      return order;
    },
    [cart, user, orders, persistOrders, clearCart],
  );

  const cancelOrder = useCallback(
    (id: string, reason: string) => {
      const current = orders.find((o) => o.id === id);
      if (!current || !canCancel(current)) return false;
      persistOrders(
        orders.map((o) =>
          o.id === id
            ? { ...o, status: "cancelled", cancelReason: reason, paymentStatus: o.paymentStatus === "paid" ? "refunded" : o.paymentStatus }
            : o,
        ),
      );
      return true;
    },
    [orders, persistOrders],
  );

  const returnOrder = useCallback(
    (id: string, reason: string) => {
      const current = orders.find((o) => o.id === id);
      if (!current || !canReturn(current)) return false;
      persistOrders(
        orders.map((o) =>
          o.id === id ? { ...o, returnStatus: "requested", returnReason: reason } : o,
        ),
      );
      return true;
    },
    [orders, persistOrders],
  );

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const value = useMemo(
    () => ({
      orders,
      addresses,
      addAddress,
      placeCodOrder,
      placePendingOnlineOrder,
      cancelOrder,
      returnOrder,
      getOrder,
    }),
    [orders, addresses, addAddress, placeCodOrder, placePendingOnlineOrder, cancelOrder, returnOrder, getOrder],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
