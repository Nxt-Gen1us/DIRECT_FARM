/**
 * DIRECT FARM — Messages API
 * Wraps /api/v1/messages/* for REST fallback
 */
import api from "../api";

export interface BackendMessage {
  _id: string;
  sender: { _id: string; firstName?: string; lastName?: string; farmName?: string } | string;
  receiver: string;
  conversationId: string;
  content: string;
  kind: "text" | "image" | "system";
  isRead: boolean;
  createdAt: string;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function fetchRecentConversations(): Promise<BackendMessage[]> {
  const raw = await api.get<BackendMessage[]>("/messages/recent");
  return raw ?? [];
}

export async function fetchConversation(id: string): Promise<BackendMessage[]> {
  const raw = await api.get<BackendMessage[]>(`/messages/conversation/${id}`);
  return raw ?? [];
}

export async function markMessageRead(id: string): Promise<void> {
  await api.patch<void>(`/messages/${id}/read`, {});
}

export async function sendMessage(conversationId: string, content: string, receiverId: string): Promise<BackendMessage> {
  const raw = await api.post<BackendMessage>("/messages", {
    conversationId,
    content,
    receiver: receiverId,
    kind: "text"
  });
  return raw;
}
