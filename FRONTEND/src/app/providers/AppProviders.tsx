import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Role, User } from "../../lib/types";
import { roleHome } from "../../config/roles";
import { products } from "../../data/products";

type AppContextValue = {
  role: Role;
  setRole: (role: Role) => void;
  homeForRole: string;
  user: User | null;
  signedIn: boolean;
  login: (user: User, remember: boolean) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  addMany: (items: CartItem[]) => void;
  setQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  wishlist: string[];
  toggleWish: (productId: string) => void;
  wished: (productId: string) => boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

const ROLE_KEY = "fc-role";
const USER_KEY = "fc-user";
const WISH_KEY = "fc-wish";

function readRole(): Role {
  if (typeof window === "undefined") return "customer";
  const stored = window.localStorage.getItem(ROLE_KEY);
  if (stored === "farmer" || stored === "admin" || stored === "customer") return stored;
  return "customer";
}

function readUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY) ?? window.sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(readRole);
  const [user, setUser] = useState<User | null>(readUser);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("fc-cart");
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(WISH_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    window.localStorage.setItem(ROLE_KEY, next);
  }, []);

  const login = useCallback((next: User, remember: boolean) => {
    setUser(next);
    setRoleState(next.role);
    window.localStorage.setItem(ROLE_KEY, next.role);
    window.sessionStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(USER_KEY);
    const store = remember ? window.localStorage : window.sessionStorage;
    store.setItem(USER_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(USER_KEY);
  }, []);

  const persistCart = (next: CartItem[]) => {
    setCart(next);
    window.localStorage.setItem("fc-cart", JSON.stringify(next));
  };

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId);
      const next = found
        ? prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { productId, qty }];
      window.localStorage.setItem("fc-cart", JSON.stringify(next));
      return next;
    });
  }, []);

  const addMany = useCallback((items: CartItem[]) => {
    setCart((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        const i = next.findIndex((x) => x.productId === item.productId);
        if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + item.qty };
        else next.push({ ...item });
      });
      window.localStorage.setItem("fc-cart", JSON.stringify(next));
      return next;
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) => {
      const next =
        qty <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) => (i.productId === productId ? { ...i, qty } : i));
      window.localStorage.setItem("fc-cart", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      window.localStorage.setItem("fc-cart", JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => persistCart([]), []);

  const toggleWish = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      window.localStorage.setItem(WISH_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const wished = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => {
    const p = products.find((x) => x.id === i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);

  const value = useMemo(
    () => ({
      role,
      setRole,
      homeForRole: roleHome[role],
      user,
      signedIn: Boolean(user),
      login,
      logout,
      cart,
      addToCart,
      addMany,
      setQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      wishlist,
      toggleWish,
      wished,
    }),
    [
      role,
      setRole,
      user,
      login,
      logout,
      cart,
      addToCart,
      addMany,
      setQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      wishlist,
      toggleWish,
      wished,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProviders");
  return ctx;
}
