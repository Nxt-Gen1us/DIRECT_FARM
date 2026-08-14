/**
 * Premium desk client.
 * When VITE_PREMIUM_API is set, calls go to the farm API.
 * Until then every write is queued on this desk — no invented settlement.
 */
import type { BookStatus } from "./types";

export const PREMIUM_API = import.meta.env.VITE_PREMIUM_API as string | undefined;

export function premiumLive() {
  return Boolean(PREMIUM_API && PREMIUM_API.startsWith("http"));
}

export type QueueKind = "bid" | "consult" | "sign" | "rent" | "store";

export type PremiumQueue = {
  id: string;
  kind: QueueKind;
  ref: string;
  note: string;
  at: string;
  status: BookStatus;
};

const QKEY = "fc-premium-queue";

export function readQueue(): PremiumQueue[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QKEY);
    return raw ? (JSON.parse(raw) as PremiumQueue[]) : [];
  } catch {
    return [];
  }
}

export function enqueue(kind: QueueKind, ref: string, note: string): PremiumQueue {
  const item: PremiumQueue = {
    id: `pq-${Date.now()}`,
    kind,
    ref,
    note,
    at: new Date().toISOString(),
    status: premiumLive() ? "queued" : "held",
  };
  const next = [item, ...readQueue()];
  window.localStorage.setItem(QKEY, JSON.stringify(next));
  return item;
}
