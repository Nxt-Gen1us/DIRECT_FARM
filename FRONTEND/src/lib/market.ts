import type { Product, ProductCategory } from "./types";

export const MARKET_TODAY = "2026-04-13";

export const originDistance: Record<string, number> = {
  "Dindori, Nashik": 208,
  "Ode, Anand": 72,
  "Depalpur, Indore": 398,
  "Talala, Gir": 336,
  "Kodumudi, Erode": 1674,
  "Bhikhiwind, Tarn Taran": 1248,
  "Guntur Rural": 1316,
};

export function distanceOf(product: Product) {
  return product.distanceKm || originDistance[product.origin] || 400;
}

export function daysSinceHarvest(iso: string, today = MARKET_TODAY) {
  const a = new Date(`${iso}T00:00:00`);
  const b = new Date(`${today}T00:00:00`);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

export function freshnessKey(days: number): "today" | "week" | "cured" | "aged" {
  if (days <= 1) return "today";
  if (days <= 7) return "week";
  if (days <= 45) return "cured";
  return "aged";
}

export const categoryIds: ProductCategory[] = [
  "vegetables",
  "fruits",
  "grains",
  "spices",
  "dairy",
  "pulses",
];

