/**
 * DIRECT FARM — Typed API Client
 * ──────────────────────────────
 * Central fetch wrapper that:
 *  - Prepends VITE_API_URL to every request
 *  - Attaches Authorization: Bearer <accessToken> from localStorage
 *  - Unwraps the backend's { status, data } envelope
 *  - On 401 attempts a single token refresh via POST /token/refresh
 *  - Throws ApiError with statusCode + message on failure
 */

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

/** True when the backend URL is configured */
export const apiConfigured = () => Boolean(API_BASE && API_BASE.startsWith("http"));

// ── Token storage keys (must match AppProviders) ─────────────────────────────
const ACCESS_KEY = "fc-access-token";
const REFRESH_KEY = "fc-refresh-token";

export const tokenStore = {
  getAccess: () => window.localStorage.getItem(ACCESS_KEY),
  setAccess: (t: string) => window.localStorage.setItem(ACCESS_KEY, t),
  getRefresh: () => window.localStorage.getItem(REFRESH_KEY),
  setRefresh: (t: string) => window.localStorage.setItem(REFRESH_KEY, t),
  clear: () => {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};

// ── Error type ────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Internal: one token-refresh attempt ──────────────────────────────────────
let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new ApiError(401, "No refresh token");

  const res = await fetch(`${API_BASE}/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    tokenStore.clear();
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  const json = await res.json();
  const newAccess: string = json?.data?.accessToken ?? json?.accessToken;
  const newRefresh: string | undefined = json?.data?.refreshToken ?? json?.refreshToken;
  if (!newAccess) throw new ApiError(401, "Token refresh failed");

  tokenStore.setAccess(newAccess);
  if (newRefresh) tokenStore.setRefresh(newRefresh);
  return newAccess;
}

// ── Core request function ─────────────────────────────────────────────────────
type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Skip Authorization header (e.g. login/register) */
  public?: boolean;
  /** Skip the JSON body wrapping */
  rawBody?: boolean;
};

async function request<T>(
  path: string,
  opts: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const { body, public: isPublic, rawBody, ...fetchOpts } = opts;

  const headers: Record<string, string> = {
    ...(body !== undefined && !rawBody ? { "Content-Type": "application/json" } : {}),
    ...(fetchOpts.headers as Record<string, string> | undefined),
  };

  if (!isPublic) {
    const token = tokenStore.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOpts,
    headers,
    body: body !== undefined ? (rawBody ? (body as BodyInit) : JSON.stringify(body)) : undefined,
  });

  // 401 → attempt token refresh once
  if (res.status === 401 && !isRetry && !isPublic) {
    try {
      if (!refreshing) refreshing = refreshAccessToken().finally(() => (refreshing = null));
      await refreshing;
      return request<T>(path, opts, true);
    } catch {
      tokenStore.clear();
      // Dispatch a custom event so AppProviders can force logout
      window.dispatchEvent(new CustomEvent("fc:session-expired"));
      throw new ApiError(401, "Session expired. Please log in again.");
    }
  }

  // Parse response
  let json: { status: string; data?: T; message?: string } | T;
  const contentType = res.headers.get("content-type") ?? "";
  try {
    json = contentType.includes("json") ? await res.json() : (await res.text()) as unknown as T;
  } catch {
    throw new ApiError(res.status, `Unexpected response from server`);
  }

  if (!res.ok) {
    const msg =
      (json as { message?: string })?.message ??
      `Request failed with status ${res.status}`;
    throw new ApiError(res.status, msg);
  }

  // Unwrap { status, data } envelope if present
  if (
    json !== null &&
    typeof json === "object" &&
    "status" in (json as object) &&
    "data" in (json as object)
  ) {
    return (json as { data: T }).data;
  }
  return json as T;
}

// ── Public helpers ────────────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "body">) =>
    request<T>(path, { method: "GET", ...opts }),

  post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: "POST", body, ...opts }),

  patch: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: "PATCH", body, ...opts }),

  put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    request<T>(path, { method: "PUT", body, ...opts }),

  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...opts }),
};

export default api;
