import type { Product, ProductCategory } from "./types";
import { products } from "../data/products";
import { FARMER_ID } from "../data/farmerDesk";
import { daysSinceHarvest, freshnessKey } from "./market";

export type PackId = "crate" | "jute" | "cloth" | "leaf" | "glass" | "steel";

export const PACK_IDS: PackId[] = ["crate", "jute", "cloth", "leaf", "glass", "steel"];

export const LIBRARY_IMAGES = [
  "/images/tomatoes.jpg",
  "/images/onions.jpg",
  "/images/okra.jpg",
  "/images/spinach.jpg",
  "/images/cauliflower.jpg",
  "/images/peas.jpg",
  "/images/mangoes.jpg",
  "/images/bananas.jpg",
  "/images/wheat.jpg",
  "/images/rice.jpg",
  "/images/turmeric.jpg",
  "/images/chili.jpg",
  "/images/dairy.jpg",
  "/images/harvest.jpg",
  "/images/vegetables.jpg",
  "/images/fruits.jpg",
];

export const LIBRARY_VIDEOS = [
  { src: "/videos/product-lot.mp4", poster: "/images/tomatoes.jpg", label: "Lot close-up" },
  { src: "/videos/farm-harvest.mp4", poster: "/images/harvest.jpg", label: "Morning harvest" },
  { src: "/videos/hero-field.mp4", poster: "/images/hero-farm.jpg", label: "Field light" },
  { src: "/videos/drone-farm.mp4", poster: "/images/irrigation.jpg", label: "Drone pass" },
];

export interface ManagedProduct extends Product {
  packaging: PackId;
  video: string;
  qrCode: string;
  active: boolean;
}

export type ProductDraft = {
  name: string;
  variety: string;
  category: ProductCategory;
  price: string;
  unit: string;
  minQty: string;
  stock: string;
  harvestedOn: string;
  packaging: PackId;
  organic: boolean;
  origin: string;
  description: string;
  image: string;
  images: string[];
  video: string;
};

export const UNITS = ["kg", "dozen", "bundle", "litre", "crate"];

export function defaultPackFor(category: ProductCategory): PackId {
  if (category === "dairy") return "glass";
  if (category === "grains" || category === "spices" || category === "pulses") return "jute";
  return "crate";
}

export function makeQrCode(name: string, harvestedOn: string) {
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 12);
  const day = harvestedOn.replace(/-/g, "").slice(4);
  return `FC-LOT-${slug || "CROP"}-${day || "0000"}`;
}

export function makePassportId(qr: string) {
  return `cp-${qr.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function seedManaged(): ManagedProduct[] {
  return products
    .filter((p) => p.farmerId === FARMER_ID)
    .map((p) => ({
      ...p,
      packaging: defaultPackFor(p.category),
      video: p.category === "fruits" || p.category === "vegetables"
        ? "/videos/product-lot.mp4"
        : "/videos/farm-harvest.mp4",
      qrCode: `FC-LOT-${p.id.replace("p-", "").toUpperCase()}-${p.harvestedOn.replace(/-/g, "").slice(4)}`,
      active: true,
    }));
}

export function emptyDraft(): ProductDraft {
  return {
    name: "",
    variety: "",
    category: "vegetables",
    price: "",
    unit: "kg",
    minQty: "1",
    stock: "",
    harvestedOn: "2026-04-13",
    packaging: "crate",
    organic: true,
    origin: "Ode, Anand",
    description: "",
    image: LIBRARY_IMAGES[0],
    images: [LIBRARY_IMAGES[0]],
    video: LIBRARY_VIDEOS[0].src,
  };
}

export function draftFromProduct(p: ManagedProduct): ProductDraft {
  return {
    name: p.name,
    variety: p.variety,
    category: p.category,
    price: String(p.price),
    unit: p.unit,
    minQty: String(p.minQty),
    stock: String(p.stock),
    harvestedOn: p.harvestedOn,
    packaging: p.packaging,
    organic: p.organic,
    origin: p.origin,
    description: p.description,
    image: p.image,
    images: p.images.length ? p.images : [p.image],
    video: p.video,
  };
}

export type DraftErrors = Partial<Record<keyof ProductDraft, string>>;

export function validateDraft(d: ProductDraft): DraftErrors {
  const errors: DraftErrors = {};
  if (!d.name.trim() || d.name.trim().length < 3) errors.name = "name";
  if (!d.variety.trim()) errors.variety = "variety";
  const price = Number(d.price);
  if (!Number.isFinite(price) || price <= 0) errors.price = "price";
  const stock = Number(d.stock);
  if (!Number.isFinite(stock) || stock < 0) errors.stock = "stock";
  const minQty = Number(d.minQty);
  if (!Number.isFinite(minQty) || minQty < 1) errors.minQty = "minQty";
  if (!d.harvestedOn) errors.harvestedOn = "harvest";
  if (!d.image) errors.image = "image";
  if (!d.origin.trim()) errors.origin = "origin";
  if (!d.description.trim() || d.description.trim().length < 12) errors.description = "description";
  return errors;
}

export function productFromDraft(d: ProductDraft, existing?: ManagedProduct): ManagedProduct {
  const qr = existing?.qrCode || makeQrCode(d.name, d.harvestedOn);
  const images = d.images.includes(d.image) ? d.images : [d.image, ...d.images];
  return {
    id: existing?.id ?? `p-ode-${Date.now()}`,
    farmerId: FARMER_ID,
    nameKey: existing?.nameKey ?? `products.custom`,
    name: d.name.trim(),
    category: d.category,
    variety: d.variety.trim(),
    price: Number(d.price),
    unit: d.unit,
    minQty: Number(d.minQty),
    stock: Number(d.stock),
    image: d.image,
    images,
    organic: d.organic,
    harvestedOn: d.harvestedOn,
    origin: d.origin.trim(),
    rating: existing?.rating ?? 0,
    reviews: existing?.reviews ?? 0,
    passportId: existing?.passportId ?? makePassportId(qr),
    description: d.description.trim(),
    tags: existing?.tags ?? ["farm lot"],
    distanceKm: existing?.distanceKm ?? 72,
    packaging: d.packaging,
    video: d.video,
    qrCode: qr,
    active: existing?.active ?? true,
  };
}

export function freshnessOf(p: Pick<ManagedProduct, "harvestedOn">) {
  return freshnessKey(daysSinceHarvest(p.harvestedOn));
}

const STORAGE_KEY = "fc-inventory";

export function loadInventory(): ManagedProduct[] {
  if (typeof window === "undefined") return seedManaged();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedManaged();
    const parsed = JSON.parse(raw) as ManagedProduct[];
    return Array.isArray(parsed) && parsed.length ? parsed : seedManaged();
  } catch {
    return seedManaged();
  }
}

export function saveInventory(items: ManagedProduct[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
