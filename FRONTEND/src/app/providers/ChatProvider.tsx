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
  openFarmerThread: (farmerId: string) => string;
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
    setQueue(next);
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  }, []);

  useEffect(() => {
    const client = createRealtimeClient(
      {
        onConnect: () => setLive(true),
        onDisconnect: () => {
          setLive(false);
          setTypingIn({});
        },
        onMessage: (msg) => {
          setLocalThreads((prev) =>
            prev.map((th) =>
              th.id === msg.threadId
                ? {
                    ...th,
                    messages: [...th.messages, msg],
                    lastMessage: msg.text || th.lastMessage,
                    lastAt: msg.at,
                    unread: th.unread + 1,
                  }
                : th,
            ),
          );
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
      { userId: user?.id },
    );
    clientRef.current = client;
    client.connect();
    return () => client.disconnect();
  }, [persistQueue, user?.id]);

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
    [persistQueue, queue],
  );

  const signalTyping = useCallback((threadId: string, on: boolean) => {
    clientRef.current?.typing(threadId, on);
  }, []);

  const joinThread = useCallback((threadId: string) => {
    clientRef.current?.join(threadId);
  }, []);

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
  }, [notices]);

  const markAllNotices = useCallback(() => {
    persistNotices(notices.map((n) => ({ ...n, read: true })));
  }, [notices]);

  const openFarmerThread = useCallback(
    (farmerId: string) => {
      const existing = threads.find((t) => t.farmerId === farmerId);
      if (existing) return existing.id;
      const farmer = farmerById(farmerId);
      const id = `c-${farmerId}`;
      const next: ChatThread = {
        id,
        farmerId,
        farmerName: farmer?.name ?? "Farm desk",
        farmName: farmer?.farmName,
        village: farmer?.village,
        district: farmer?.district,
        avatar: farmer?.avatar ?? "/images/farmer-portrait.jpg",
        cover: farmer?.cover,
        crop: farmer?.specialty,
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
