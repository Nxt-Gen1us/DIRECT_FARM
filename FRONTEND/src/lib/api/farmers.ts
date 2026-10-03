/**
 * DIRECT FARM — Farmers API
 * Wraps /api/v1/farmers/* and adapts backend FarmerProfile → frontend FarmerProfile type.
 */
import api from "../api";
import type { FarmerProfile } from "../types";

// ── Backend shapes ────────────────────────────────────────────────────────────
interface BackendFarmerProfile {
  _id: string;
  user:
    | string
    | { _id: string; firstName?: string; lastName?: string; email?: string };
  farmName: string;
  description?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    coordinates?: { type: string; coordinates: number[] };
  };
  organicCertification?: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
  trustedBadge?: boolean;
  experienceYears?: number;
  gallery?: { mediaUrl: string; type?: string }[];
  farmStory?: string;
  lastHarvestAt?: string;
  createdAt?: string;
}

// ── Adapter ───────────────────────────────────────────────────────────────────
export function adaptFarmerProfile(p: BackendFarmerProfile): FarmerProfile {
  const user =
    typeof p.user === "string" ? { _id: p.user } : p.user;
  const name =
    typeof user === "object" && user !== null
      ? `${(user as { firstName?: string }).firstName ?? ""} ${(user as { lastName?: string }).lastName ?? ""}`.trim()
      : "";

  const cover =
    p.gallery && p.gallery.length > 0
      ? p.gallery[0].mediaUrl
      : "/images/farm-default-cover.jpg";

  return {
    id: p._id,
    userId:
      typeof p.user === "string" ? p.user : (p.user as { _id: string })._id,
    farmName: p.farmName,
    name: name || p.farmName,
    village: p.location?.address ?? "",
    district: p.location?.city ?? "",
    state: p.location?.state ?? "",
    acres: 0,
    since: p.experienceYears
      ? new Date().getFullYear() - p.experienceYears
      : 2020,
    specialty: p.description?.split(",")[0]?.trim() ?? "Mixed produce",
    rating: 4.5,
    reviews: 0,
    avatar: "/images/farmer-portrait.jpg",
    cover,
    bio: p.farmStory ?? p.description ?? "",
    certifications: p.organicCertification ? ["Organic"] : [],
    languages: ["en"],
  };
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function fetchFarmers(): Promise<FarmerProfile[]> {
  const raw = await api.get<BackendFarmerProfile[]>("/farmers");
  return (raw ?? []).map(adaptFarmerProfile);
}

export async function fetchFarmer(id: string): Promise<FarmerProfile> {
  const raw = await api.get<BackendFarmerProfile>(`/farmers/${id}`);
  return adaptFarmerProfile(raw);
}

export async function createFarmerProfileApi(data: any): Promise<FarmerProfile> {
  const raw = await api.post<BackendFarmerProfile>("/farmers/profile", data);
  return adaptFarmerProfile(raw);
}

export async function updateFarmerProfileApi(data: any): Promise<FarmerProfile> {
  const raw = await api.patch<BackendFarmerProfile>("/farmers/profile", data);
  return adaptFarmerProfile(raw);
}
