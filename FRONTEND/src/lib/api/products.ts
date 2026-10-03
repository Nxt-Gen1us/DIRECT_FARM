/**
 * DIRECT FARM — Products API
 * Wraps /api/v1/products/* and adapts backend shape → frontend Product type.
 */
import api from "../api";
import type { Product, ProductCategory } from "../types";

// ── Backend shapes ────────────────────────────────────────────────────────────
export interface BackendProduct {
  _id: string;
  farmer: { _id: string; farmName?: string; user?: { _id: string } } | string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  quantityAvailable: number;
  images?: { url: string; type?: string }[];
  video?: { url: string };
  shelfLifeDays?: number;
  packaging?: string;
  harvestDate?: string;
  freshnessScore?: number;
  isOrganic?: boolean;
  variety?: string;
  unit?: string;
  minQty?: number;
  tags?: string[];
  origin?: string;
  passportId?: string;
  createdAt?: string;
}

// ── Adapter ───────────────────────────────────────────────────────────────────
export function adaptProduct(p: BackendProduct): Product {
  const farmerId =
    typeof p.farmer === "string"
      ? p.farmer
      : (p.farmer as { _id: string })?._id ?? "";

  const images = (p.images ?? []).map((img) => img.url);
  const primaryImage = images[0] ?? "/images/product-placeholder.jpg";

  const category: ProductCategory = p.category?.trim() || "vegetables";

  return {
    id: p._id,
    farmerId,
    nameKey: p.name.toLowerCase().replace(/\s+/g, "-"),
    name: p.name,
    category,
    variety: p.variety ?? "",
    price: p.price,
    unit: p.unit ?? "kg",
    minQty: p.minQty ?? 1,
    stock: p.quantityAvailable,
    image: primaryImage,
    images,
    organic: p.isOrganic ?? false,
    harvestedOn: p.harvestDate ? p.harvestDate.slice(0, 10) : "",
    origin: p.origin ?? "",
    rating: 4.5,
    reviews: 0,
    passportId: p.passportId ?? "",
    description: p.description ?? "",
    tags: p.tags ?? (p.category ? [p.category] : []),
    distanceKm: 0,
  };
}

// ── Query params type ─────────────────────────────────────────────────────────
export interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  farmer?: string;
  page?: number;
  limit?: number;
  sort?: "priceAsc" | "priceDesc" | "fresh" | "name" | "newest";
  available?: boolean;
}

function buildQuery(q: ProductQuery): string {
  const params = new URLSearchParams();
  if (q.category) params.set("cat", q.category);
  if (q.search) params.set("q", q.search);
  if (q.minPrice !== undefined) params.set("minPrice", String(q.minPrice));
  if (q.maxPrice !== undefined) params.set("maxPrice", String(q.maxPrice));
  if (q.isOrganic !== undefined) params.set("organic", q.isOrganic ? "1" : "0");
  if (q.farmer) params.set("farmer", q.farmer);
  if (q.sort) params.set("sort", q.sort);
  if (q.available !== undefined) params.set("available", q.available ? "1" : "0");
  if (q.page) params.set("page", String(q.page));
  if (q.limit) params.set("limit", String(q.limit));
  const s = params.toString();
  return s ? `?${s}` : "";
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  const raw = await api.get<BackendProduct[]>(`/products${buildQuery(query)}`);
  return (raw ?? []).map(adaptProduct);
}

export async function fetchProductCategories(): Promise<string[]> {
  const raw = await api.get<string[]>("/products/categories");
  return Array.isArray(raw) ? raw : [];
}

export async function fetchProduct(id: string): Promise<Product> {
  const raw = await api.get<BackendProduct>(`/products/${id}`);
  return adaptProduct(raw);
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  category: string;
  price: number;
  quantityAvailable: number;
  images?: { url: string; type?: string }[];
  isOrganic?: boolean;
  harvestDate?: string;
  shelfLifeDays?: number;
  packaging?: string;
  freshnessScore?: number;
  variety?: string;
  unit?: string;
  minQty?: number;
  tags?: string[];
  origin?: string;
  passportId?: string;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const raw = await api.post<BackendProduct>("/products", payload);
  return adaptProduct(raw);
}

export async function updateProduct(
  id: string,
  payload: Partial<CreateProductPayload>,
): Promise<Product> {
  const raw = await api.patch<BackendProduct>(`/products/${id}`, payload);
  return adaptProduct(raw);
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete<void>(`/products/${id}`);
}
