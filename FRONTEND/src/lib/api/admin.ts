import api from "../api";
import type { Product } from "../types";
import { adaptProduct, type BackendProduct } from "./products";

export type AdminStats = {
  gmv: number;
  orders: number;
  farmers: number;
  buyers: number;
  admins: number;
  lots: number;
  pendingFarms: number;
  roleMix: { name: string; value: number }[];
  categoryMix: { name: string; value: number }[];
};

export async function fetchAdminStats(): Promise<AdminStats> {
  return await api.get<AdminStats>("/admin/stats");
}

export type AdminUser = { _id: string; firstName: string; lastName?: string; email: string; role: "customer" | "farmer" | "admin"; isVerified: boolean; createdAt: string };
export type AdminFarmer = { _id: string; farmName: string; verificationStatus: "pending" | "verified" | "rejected"; location?: { city?: string; state?: string }; user?: { firstName?: string; lastName?: string; email?: string } };

export async function fetchAdminUsers(params: { role?: string; search?: string } = {}): Promise<AdminUser[]> {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value).map(([key, value]) => [key, value as string]));
  return (await api.get<AdminUser[]>(`/admin/users${query.size ? `?${query}` : ""}`)) ?? [];
}

export async function fetchAdminFarmers(status?: string): Promise<AdminFarmer[]> {
  return (await api.get<AdminFarmer[]>(`/admin/farmers${status ? `?status=${status}` : ""}`)) ?? [];
}

export async function setFarmerVerification(id: string, verificationStatus: "verified" | "rejected"): Promise<AdminFarmer> {
  return await api.patch<AdminFarmer>(`/admin/farmers/${id}/verification`, { verificationStatus });
}

export type AdminUserInput = { firstName: string; lastName?: string; email: string; password?: string; role: "customer" | "farmer" | "admin"; isVerified?: boolean };
export async function createAdminUser(payload: AdminUserInput): Promise<AdminUser> { return await api.post<AdminUser>("/admin/users", payload); }
export async function updateAdminUser(id: string, payload: Partial<AdminUserInput>): Promise<AdminUser> { return await api.patch<AdminUser>(`/admin/users/${id}`, payload); }
export async function deleteAdminUser(id: string): Promise<void> { await api.delete<void>(`/admin/users/${id}`); }
export async function createAdminProduct(payload: { farmerId: string; name: string; category: string; price: number; quantityAvailable: number }): Promise<Product> { return adaptProduct(await api.post<BackendProduct>("/admin/products", payload)); }
export async function updateAdminProduct(id: string, payload: { name?: string; price?: number; quantityAvailable?: number }): Promise<Product> { return adaptProduct(await api.patch<BackendProduct>(`/admin/products/${id}`, payload)); }
export async function deleteAdminProduct(id: string): Promise<void> { await api.delete<void>(`/admin/products/${id}`); }
