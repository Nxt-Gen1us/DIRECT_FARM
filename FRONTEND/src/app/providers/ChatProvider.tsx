import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fieldThreads, deskNotices } from "../../data/chats";
import { farmerById } from "../../data/farmers";
import { createRealtimeClient, radioConfigured } from "../../lib/realtime/client";
import type { RealtimeClient } from "../../lib/realtime/events";
import type {
  ChatAttachment,
  ChatMessage,
  ChatThread,
  DeskNotice,
  MessageKind,
  PresenceState,
} from "../../lib/types";
import { useApp } from "./AppProviders";
import { tokenStore } from "../../lib/api";
import { apiConfigured } from "../../lib/api";
import {
  fetchNotifications,
  markAllNotificationsRead as markAllNotificationsReadApi,
  markNotificationRead,
  type BackendNotification,
} from "../../lib/api/notifications";
import {
  fetchConversation,
  sendMessage,
  type BackendMessage,
} from "../../lib/api/messages";

const QUEUE_KEY = "fc-chat-queue";
const READ_KEY = "fc-chat-read";
const NOTICE_KEY = "fc-notices";

type ComposeInput = {
  threadId: string;
  kind: MessageKind;
  text?: string;
  attachment?: ChatAttachment;
  durationSec?: number;
  waveform?: number[];
};

type ChatContextValue = {
  threads: ChatThread[];
  notices: DeskNotice[];
  unreadNotices: number;
  unreadChats: number;
  live: boolean;
  radioReady: boolean;
  typingIn: Record<string, boolean>;
  compose: (input: ComposeInput) => ChatMessage | null;
  signalTyping: (threadId: string, on: boolean) => void;
  joinThread: (threadId: string) => void;
  markThreadRead: (id: string) => void;
  markNoticeRead: (id: string) => void;
  markAllNotices: () => void;
  openFarmerThread: (farmerId: string, recipientUserId?: string, profile?: { name: string; farmName: string; village: string; district: string; state: string; specialty: string }) => string;
  getThread: (id: string) => ChatThread | undefined;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function readQueue(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function readCleared(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function readNotices(): DeskNotice[] {
  if (typeof window === "undefined") return deskNotices;
  try {
    const raw = window.localStorage.getItem(NOTICE_KEY);
    if (!raw) return deskNotices;
    const extra = JSON.parse(raw) as DeskNotice[];
    const ids = new Set(extra.map((n) => n.id));
    return [...extra, ...deskNotices.filter((n) => !ids.has(n.id))];
  } catch {
    return deskNotices;
  }
}

function mergeThreads(queue: ChatMessage[], cleared: string[]): ChatThread[] {
  return fieldThreads.map((th) => {
    const extras = queue.filter((m) => m.threadId === th.id);
    const messages = extras.length ? [...th.messages, ...extras] : th.messages;
    const last = messages[messages.length - 1];
    return {
      ...th,
      unread: cleared.includes(th.id) ? 0 : th.unread,
      messages,
      lastMessage: last
        ? last.kind === "image"
          ? "Photo from the field"
          : last.kind === "voice"
            ? "Voice note"
            : last.kind === "file"
              ? last.attachment?.name ?? "File"
              : last.text
        : th.lastMessage,
      lastAt: last?.at ?? th.lastAt,
    };
  });
}

function adaptNotification(notification: BackendNotification): DeskNotice {
  const kind = notification.metadata?.kind;
  return {
    id: notification._id,
    kind: kind === "chat" || kind === "crate" || kind === "weather" || kind === "passport" ? kind : "system",
    title: notification.title,
    body: notification.body,
    at: notification.createdAt,
    read: Boolean(notification.readAt),
    href: notification.metadata?.href,
    threadId: notification.metadata?.threadId,
  };
}

function adaptBackendMessage(msg: BackendMessage, currentUserId?: string): ChatMessage {
  const sender = typeof msg.sender === "string" ? { _id: msg.sender } : msg.sender;
  const senderId = sender?._id ?? msg.receiver;
  const senderName =
    typeof msg.sender === "object" && msg.sender !== null
      ? msg.sender.farmName || `${msg.sender.firstName ?? ""} ${msg.sender.lastName ?? ""}`.trim()
      : undefined;

  return {
    id: msg._id,
    threadId: msg.conversationId,
    senderId,
    senderName,
    from: senderId === currentUserId ? "me" : "them",
    kind: msg.kind === "image" ? "image" : msg.kind === "system" ? "system" : "text",
    text: msg.content ?? "",
    at: msg.createdAt,
    status: "sent",
  };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const [queue, setQueue] = useState<ChatMessage[]>(readQueue);
  const [cleared, setCleared] = useState<string[]>(readCleared);
  const [localThreads, setLocalThreads] = useState<ChatThread[]>([]);
  const [notices, setNotices] = useState<DeskNotice[]>(readNotices);
  const [live, setLive] = useState(false);
  const [presence, setPresence] = useState<Record<string, PresenceState>>({});
  const [lastSeen, setLastSeen] = useState<Record<string, string>>({});
  const [typingIn, setTypingIn] = useState<Record<string, boolean>>({});
  const clientRef = useRef<RealtimeClient | null>(null);

  const persistQueue = useCallback((next: ChatMessage[]) => {
    const deduped = next.filter((message, index, arr) => arr.findIndex((candidate) => candidate.id === message.id) === index);
    setQueue(deduped);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(QUEUE_KEY, JSON.stringify(deduped));
    }
  }, []);

  const flushQueuedMessages = useCallback(async () => {
    const pending = readQueue();
    if (!pending.length || !apiConfigured() || !user?.id) return;

    const remaining: ChatMessage[] = [];
    for (const item of pending) {
      if (item.status !== "queued") continue;

      const content = item.text ?? "";
      if (!content.trim()) {
        remaining.push(item);
        continue;
      }

      const threadId = item.threadId ?? "";
      if (!threadId.trim()) {
        remaining.push(item);
        continue;
      }

      const thread = localThreads.find((t) => t.id === threadId);
      const recipientUserId = thread?.recipientUserId ?? "";
      if (!recipientUserId.trim()) {
        remaining.push(item);
        continue;
      }

      try {
        const serverMessage = await sendMessage(threadId, content, recipientUserId);
        const hydrated = adaptBackendMessage(serverMessage, user.id);

        setLocalThreads((prev) => {
          const existing = prev.find((t) => t.id === threadId) ?? fieldThreads.find((t) => t.id === threadId);
          if (!existing) return prev;

          const merged = [...existing.messages, hydrated]
            .filter((message, index, arr) => arr.findIndex((candidate) => candidate.id === message.id) === index)
            .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

          return prev.some((t) => t.id === threadId)
            ? prev.map((t) =>
                t.id === threadId
                  ? {
                      ...t,
                      messages: merged,
                      lastMessage: merged[merged.length - 1]?.text ?? t.lastMessage,
                      lastAt: merged[merged.length - 1]?.at ?? t.lastAt,
                    }
                  : t,
              )
            : [{ ...existing, messages: merged, lastMessage: merged[merged.length - 1]?.text ?? existing.lastMessage, lastAt: merged[merged.length - 1]?.at ?? existing.lastAt }, ...prev];
        });
      } catch {
        remaining.push(item);
      }
    }

    persistQueue(remaining);
  }, [localThreads, persistQueue, user?.id]);

  useEffect(() => {
    if (live && queue.length) {
      void flushQueuedMessages();
    }
  }, [flushQueuedMessages, live, queue.length]);

  useEffect(() => {
    const client = createRealtimeClient(
      {
        onConnect: () => setLive(true),
        onDisconnect: () => {
          setLive(false);
          setTypingIn({});
        },
        onMessage: (msg) => {
          setLocalThreads((prev) => {
            const existing = prev.find((thread) => thread.id === msg.threadId);
            if (!existing) {
              return [{
                id: msg.threadId,
                farmerId: msg.senderId ?? msg.threadId,
                recipientUserId: msg.senderId,
                farmerName: "Farm desk",
                farmName: "Direct Farm",
                avatar: "/images/farmer-portrait.jpg",
                lastMessage: msg.text,
                lastAt: msg.at,
                unread: 1,
                presence: "unknown",
                messages: [msg],
              }, ...prev];
            }
            const merged = [...existing.messages, msg].filter((m, index, arr) => {
              const first = arr.findIndex((candidate) => candidate.id === m.id);
              return first === index;
            }).sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
            return prev.map((th) =>
              th.id === msg.threadId
                ? {
                    ...th,
                    messages: merged,
                    lastMessage: msg.text || th.lastMessage,
                    lastAt: msg.at,
                    unread: th.unread + 1,
                  }
                : th,
            );
          });
        },
        onAck: (ack) => {
          persistQueue(
            readQueue().map((m) =>
              m.id === ack.localId ? { ...m, id: ack.serverId, status: ack.status } : m,
            ),
          );
        },
        onTyping: (payload) => {
          setTypingIn((prev) => ({ ...prev, [payload.threadId]: payload.typing }));
        },
        onPresence: (payload) => {
          setPresence((prev) => ({ ...prev, [payload.farmerId]: payload.state }));
          if (payload.lastSeen) {
            setLastSeen((prev) => ({ ...prev, [payload.farmerId]: payload.lastSeen! }));
          }
        },
        onNotice: (notice) => {
          setNotices((prev) => {
            const next = [notice, ...prev.filter((n) => n.id !== notice.id)];
            window.localStorage.setItem(NOTICE_KEY, JSON.stringify(next));
            return next;
          });
        },
      },
      { userId: user?.id, token: tokenStore.getAccess() ?? undefined },
    );
    clientRef.current = client;
    client.connect();
    return () => client.disconnect();
  }, [persistQueue, user?.id]);

  useEffect(() => {
    if (!apiConfigured() || !user?.id) return;
    void fetchNotifications()
      .then((items) => setNotices(items.map(adaptNotification)))
      .catch(() => {
        // The demo notices remain available if the backend is temporarily offline.
      });
  }, [user?.id]);

  const seedMerged = useMemo(() => mergeThreads(queue, cleared), [queue, cleared]);

  const threads = useMemo(() => {
    const extras = localThreads.filter((t) => !seedMerged.some((s) => s.id === t.id));
    return [...extras, ...seedMerged].map((th) => ({
      ...th,
      presence: presence[th.farmerId] ?? th.presence ?? "unknown",
      lastSeen: lastSeen[th.farmerId] ?? th.lastSeen,
    }));
  }, [localThreads, seedMerged, presence, lastSeen]);

  const compose = useCallback(
    (input: ComposeInput) => {
      const note: ChatMessage = {
        id: `local-${Date.now()}`,
        threadId: input.threadId,
        from: "me",
        kind: input.kind,
        text: input.text?.trim() ?? "",
        at: new Date().toISOString(),
        status: "queued",
        attachment: input.attachment,
        durationSec: input.durationSec,
        waveform: input.waveform,
      };
      const sent = clientRef.current?.send({
        localId: note.id,
        threadId: input.threadId,
        receiverId: threads.find((thread) => thread.id === input.threadId)?.recipientUserId ?? "",
        kind: note.kind,
        text: note.text,
        attachment: note.attachment,
        durationSec: note.durationSec,
        waveform: note.waveform,
      });
      const stored = { ...note, status: sent ? ("sent" as const) : ("queued" as const) };
      persistQueue([...queue, stored]);
      return stored;
    },
    [persistQueue, queue, threads],
  );

  const signalTyping = useCallback((threadId: string, on: boolean) => {
    clientRef.current?.typing(threadId, on);
  }, []);

  const joinThread = useCallback((threadId: string) => {
    clientRef.current?.join(threadId);

    if (apiConfigured() && user?.id) {
      void fetchConversation(threadId)
        .then((backendMessages) => {
          if (!backendMessages.length) return;

          const hydrated = backendMessages.map((msg) => adaptBackendMessage(msg, user.id));

          setLocalThreads((prev) => {
            const baseThread = prev.find((t) => t.id === threadId) ?? fieldThreads.find((t) => t.id === threadId);
            if (!baseThread) return prev;

            const merged = [...baseThread.messages, ...hydrated]
              .filter((message, index, arr) => arr.findIndex((candidate) => candidate.id === message.id) === index)
              .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

            return prev.some((t) => t.id === threadId)
              ? prev.map((th) =>
                  th.id === threadId
                    ? {
                        ...th,
                        messages: merged,
                        lastMessage: merged[merged.length - 1]?.text ?? th.lastMessage,
                        lastAt: merged[merged.length - 1]?.at ?? th.lastAt,
                      }
                    : th,
                )
              : [{ ...baseThread, messages: merged, lastMessage: merged[merged.length - 1]?.text ?? baseThread.lastMessage, lastAt: merged[merged.length - 1]?.at ?? baseThread.lastAt }, ...prev];
          });
        })
        .catch(() => {
          // Silently fail - thread will work with Socket.IO only.
        });
    }
  }, [user?.id]);

  const markThreadRead = useCallback((id: string) => {
    setCleared((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      window.localStorage.setItem(READ_KEY, JSON.stringify(next));
      return next;
    });
    setLocalThreads((prev) => prev.map((th) => (th.id === id ? { ...th, unread: 0 } : th)));
  }, []);

  const persistNotices = (next: DeskNotice[]) => {
    setNotices(next);
    window.localStorage.setItem(NOTICE_KEY, JSON.stringify(next));
  };

  const markNoticeRead = useCallback((id: string) => {
    persistNotices(notices.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (apiConfigured()) {
      void markNotificationRead(id).catch(() => {
        // Keep the optimistic local read state; it will reconcile on the next refresh.
      });
    }
  }, [notices]);

  const markAllNotices = useCallback(() => {
    persistNotices(notices.map((n) => ({ ...n, read: true })));
    if (apiConfigured()) {
      void markAllNotificationsReadApi().catch(() => {
        // Keep the optimistic local read state; it will reconcile on the next refresh.
      });
    }
  }, [notices]);

  const openFarmerThread = useCallback(
    (farmerId: string, recipientUserId?: string, profile?: { name: string; farmName: string; village: string; district: string; state: string; specialty: string }) => {
      const existing = threads.find((t) => t.farmerId === farmerId);
      if (existing) return existing.id;
      const farmer = farmerById(farmerId);
      const id = recipientUserId && user?.id ? [user.id, recipientUserId].sort().join(":") : `c-${farmerId}`;
      const next: ChatThread = {
        id,
        farmerId,
        recipientUserId,
        farmerName: profile?.name ?? farmer?.name ?? "Farm desk",
        farmName: profile?.farmName ?? farmer?.farmName,
        village: profile?.village ?? farmer?.village,
        district: profile?.district ?? farmer?.district,
        avatar: farmer?.avatar ?? "/images/farmer-portrait.jpg",
        cover: farmer?.cover,
        crop: profile?.specialty ?? farmer?.specialty,
        lastMessage: "",
        lastAt: new Date().toISOString(),
        unread: 0,
        presence: "unknown",
        messages: [],
      };
      setLocalThreads((prev) => [next, ...prev.filter((t) => t.id !== id)]);
      return id;
    },
    [threads],
  );

  const getThread = useCallback((id: string) => threads.find((t) => t.id === id), [threads]);

  const value = useMemo(
    () => ({
      threads,
      notices,
      unreadNotices: notices.filter((n) => !n.read).length,
      unreadChats: threads.reduce((s, t) => s + t.unread, 0),
      live,
      radioReady: radioConfigured(),
      typingIn,
      compose,
      signalTyping,
      joinThread,
      markThreadRead,
      markNoticeRead,
      markAllNotices,
      openFarmerThread,
      getThread,
    }),
    [
      threads,
      notices,
      live,
      typingIn,
      compose,
      signalTyping,
      joinThread,
      markThreadRead,
      markNoticeRead,
      markAllNotices,
      openFarmerThread,
      getThread,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
