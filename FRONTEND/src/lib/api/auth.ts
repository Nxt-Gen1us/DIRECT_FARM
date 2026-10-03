/**
 * DIRECT FARM — Auth API
 * Wraps /api/v1/auth/* endpoints and adapts backend shape → frontend types.
 */
import api from "../api";
import { tokenStore } from "../api";
import type { Role, User } from "../types";

// ── Backend response shapes ───────────────────────────────────────────────────
interface BackendUser {
  _id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  walletBalance?: number;
  addresses?: unknown[];
}

interface LoginResponse {
  user: BackendUser;
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponse {
  user: BackendUser;
  verificationToken?: string;
}

// ── Adapter: backend User → frontend User ─────────────────────────────────────
export function adaptUser(u: BackendUser): User {
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
  return {
    id: u._id,
    name,
    email: u.email,
    phone: "",
    role: u.role,
    avatar:
      u.role === "farmer"
        ? "/images/farmer-ramesh.jpg"
        : u.role === "admin"
          ? "/images/exporter-priya.jpg"
          : "/images/chef-ananya.jpg",
    verified: u.isVerified,
    joinedAt: u.createdAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** POST /auth/login — returns adapted User and stores tokens */
export async function loginApi(
  email: string,
  password: string,
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const data = await api.post<LoginResponse>("/auth/login", { email, password }, { public: true });
  tokenStore.setAccess(data.accessToken);
  tokenStore.setRefresh(data.refreshToken);
  return { user: adaptUser(data.user), accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export interface RegisterPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role?: "customer" | "farmer";
}

/** POST /auth/register */
export async function registerApi(payload: RegisterPayload): Promise<{ user: User }> {
  const data = await api.post<RegisterResponse>("/auth/register", payload, { public: true });
  return { user: adaptUser(data.user) };
}

/** POST /auth/logout — clears stored tokens */
export async function logoutApi(): Promise<void> {
  const refreshToken = tokenStore.getRefresh();
  if (refreshToken) {
    try {
      await api.post<void>("/auth/logout", { refreshToken });
    } catch {
      // Ignore logout errors — always clear local tokens
    }
  }
  tokenStore.clear();
}

/** POST /auth/forgot-password */
export async function forgotPasswordApi(email: string): Promise<void> {
  await api.post<void>("/auth/forgot-password", { email }, { public: true });
}

/** POST /auth/reset-password */
export async function resetPasswordApi(token: string, password: string): Promise<void> {
  await api.post<void>("/auth/reset-password", { token, password }, { public: true });
}
