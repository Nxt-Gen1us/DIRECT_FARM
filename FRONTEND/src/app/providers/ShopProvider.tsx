import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { VegBoxSub } from "../../lib/types";
import { COMPARE_MAX, VIEWED_MAX, nextBoxDate } from "../../lib/shop";
import type { BoxCadence } from "../../lib/types";

const VIEW_KEY = "fc-viewed";
const CMP_KEY = "fc-compare";
const SUB_KEY = "fc-boxes";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function readSubs(): VegBoxSub[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SUB_KEY);
    return raw ? (JSON.parse(raw) as VegBoxSub[]) : [];
  } catch {
    return [];
  }
}

type ShopContextValue = {
  viewed: string[];
  markViewed: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => { ok: boolean; reason?: "full" };
  inCompare: (id: string) => boolean;
  clearCompare: () => void;
  subscriptions: VegBoxSub[];
  startBox: (boxId: string, cadence: BoxCadence) => VegBoxSub;
  pauseBox: (id: string) => void;
  resumeBox: (id: string) => void;
  stopBox: (id: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [viewed, setViewed] = useState<string[]>(() => readList(VIEW_KEY));
  const [compare, setCompare] = useState<string[]>(() => readList(CMP_KEY));
  const [subscriptions, setSubscriptions] = useState<VegBoxSub[]>(readSubs);

  const persistView = (next: string[]) => {
    setViewed(next);
    window.localStorage.setItem(VIEW_KEY, JSON.stringify(next));
  };
  const persistCmp = (next: string[]) => {
    setCompare(next);
    window.localStorage.setItem(CMP_KEY, JSON.stringify(next));
  };
  const persistSubs = (next: VegBoxSub[]) => {
    setSubscriptions(next);
    window.localStorage.setItem(SUB_KEY, JSON.stringify(next));
  };

  const markViewed = useCallback((id: string) => {
    setViewed((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, VIEWED_MAX);
      window.localStorage.setItem(VIEW_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCompare = useCallback((id: string) => {
    const has = compare.includes(id);
    if (!has && compare.length >= COMPARE_MAX) return { ok: false as const, reason: "full" as const };
    persistCmp(has ? compare.filter((x) => x !== id) : [...compare, id]);
    return { ok: true as const };
  }, [compare]);

  const inCompare = useCallback((id: string) => compare.includes(id), [compare]);
  const clearCompare = useCallback(() => persistCmp([]), []);

  const startBox = useCallback((boxId: string, cadence: BoxCadence) => {
    const sub: VegBoxSub = {
      id: `box-${Date.now()}`,
      boxId,
      cadence,
      nextAt: nextBoxDate(cadence),
      status: "active",
      startedAt: new Date().toISOString(),
    };
    persistSubs([sub, ...subscriptions]);
    return sub;
  }, [subscriptions]);

  const pauseBox = useCallback((id: string) => {
    persistSubs(subscriptions.map((s) => (s.id === id ? { ...s, status: "paused" } : s)));
  }, [subscriptions]);

  const resumeBox = useCallback((id: string) => {
    persistSubs(
      subscriptions.map((s) =>
        s.id === id ? { ...s, status: "active", nextAt: nextBoxDate(s.cadence) } : s,
      ),
    );
  }, [subscriptions]);

  const stopBox = useCallback((id: string) => {
    persistSubs(subscriptions.filter((s) => s.id !== id));
  }, [subscriptions]);

  const value = useMemo(
    () => ({
      viewed,
      markViewed,
      compare,
      toggleCompare,
      inCompare,
      clearCompare,
      subscriptions,
      startBox,
      pauseBox,
      resumeBox,
      stopBox,
    }),
    [
      viewed,
      markViewed,
      compare,
      toggleCompare,
      inCompare,
      clearCompare,
      subscriptions,
      startBox,
      pauseBox,
      resumeBox,
      stopBox,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
