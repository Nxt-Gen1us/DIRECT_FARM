import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Order, PaymentMethod, Role } from "./types";
import { products } from "../data/products";
import { orders as seedOrders } from "../data/orders";
import { users } from "../data/farmers";

interface Store {
  role: Role;
  setRole: (r: Role) => void;
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  orders: Order[];
  placeOrder: (address: string, method: PaymentMethod) => Order | null;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("customer");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(seedOrders);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { productId, qty }];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => {
    const p = products.find((x) => x.id === i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);

  const placeOrder = useCallback(
    (address: string, method: PaymentMethod) => {
      if (!cart.length) return null;
      const items = cart
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
      const first = products.find((p) => p.id === cart[0].productId);
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const delivery = subtotal > 999 ? 0 : 40;
      const buyer = users.find((u) => u.role === "customer")!;
      const order: Order = {
        id: `FC-${88000 + Math.floor(Math.random() * 900)}`,
        buyerId: buyer.id,
        buyerName: buyer.name,
        farmerId: first?.farmerId ?? "f-ramesh",
        farmerName: "Farm collective",
        items,
        status: "pending",
        paymentStatus: method === "cod" ? "pending" : "paid",
        paymentMethod: method,
        subtotal,
        delivery,
        total: subtotal + delivery,
        address,
        placedAt: new Date().toISOString(),
        eta: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        tracking: [
          { label: "Order placed", at: "Just now", done: true },
          { label: "Awaiting farmer confirmation", at: "", done: false },
        ],
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart],
  );

  const value = useMemo(
    () => ({
      role,
      setRole,
      cart,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      orders,
      placeOrder,
    }),
    [
      role,
      cart,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      orders,
      placeOrder,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
