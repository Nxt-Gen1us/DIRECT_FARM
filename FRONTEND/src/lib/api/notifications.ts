/**
 * DIRECT FARM — Notifications API
 * Wraps /api/v1/notifications/*
 */
import api from "../api";

export interface BackendNotification {
  _id: string;
  user: string;
  title: string;
  body: string;
  channel?: "email" | "sms" | "push" | "in-app";
  metadata?: { kind?: string; href?: string; threadId?: string };
  readAt?: string;
  createdAt: string;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function fetchNotifications(): Promise<BackendNotification[]> {
  const raw = await api.get<BackendNotification[]>("/notifications");
  return raw ?? [];
}

export async function markNotificationRead(id: string): Promise<BackendNotification> {
  const raw = await api.patch<BackendNotification>(`/notifications/${id}/read`, {});
  return raw;
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch<void>("/notifications/read-all", {});
}
