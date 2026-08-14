import type { CartItem, Product } from "./types";
import { products, productById } from "../data/products";
import { deliveryFee } from "./orderFlow";

export const COMPARE_MAX = 4;
export const VIEWED_MAX = 12;

const pairs: Record<string, string[]> = {
  "p-tomato": ["p-onion", "p-spinach", "p-okra"],
  "p-onion": ["p-tomato", "p-chili"],
  "p-spinach": ["p-tomato", "p-ghee"],
  "p-okra": ["p-onion", "p-tomato"],
  "p-mango": ["p-ghee"],
  "p-ghee": ["p-wheat", "p-rice"],
  "p-rice": ["p-ghee", "p-chili"],
  "p-wheat": ["p-ghee", "p-onion"],
  "p-chili": ["p-onion", "p-turmeric"],
  "p-turmeric": ["p-chili", "p-ghee"],
};

export type SmartHint = {
  product: Product;
  reason: "pair" | "farm" | "viewed" | "threshold" | "organic";
};

export function smartHints(cart: CartItem[], viewed: string[]): SmartHint[] {
  const inCart = new Set(cart.map((c) => c.productId));
  const out: SmartHint[] = [];
  const push = (id: string, reason: SmartHint["reason"]) => {
    if (inCart.has(id) || out.some((h) => h.product.id === id)) return;
    const p = productById(id);
    if (!p || p.stock <= 0) return;
    out.push({ product: p, reason });
  };

  cart.forEach((c) => (pairs[c.productId] ?? []).forEach((id) => push(id, "pair")));

  const farms = new Set(
    cart.map((c) => productById(c.productId)?.farmerId).filter(Boolean) as string[],
  );
  products
    .filter((p) => farms.has(p.farmerId) && p.organic)
    .slice(0, 4)
    .forEach((p) => push(p.id, "farm"));

  viewed.forEach((id) => push(id, "viewed"));

  const subtotal = cart.reduce((s, i) => {
    const p = productById(i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  if (deliveryFee(subtotal) > 0) {
    const gap = 999 - subtotal;
    products
      .filter((p) => p.price <= gap + 80 && p.category === "vegetables")
      .sort((a, b) => a.price - b.price)
      .slice(0, 2)
      .forEach((p) => push(p.id, "threshold"));
  }

  return out.slice(0, 6);
}

export function nextBoxDate(cadence: "weekly" | "fortnight") {
  const d = new Date();
  d.setDate(d.getDate() + (cadence === "weekly" ? 7 : 14));
  return d.toISOString();
}
