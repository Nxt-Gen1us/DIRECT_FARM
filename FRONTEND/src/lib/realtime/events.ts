import type {
  ChatMessage,
  DeskNotice,
  PresenceState,
} from "../types";

/** Socket.IO contract the field radio will speak when VITE_SOCKET_URL is set. */
export const RADIO_EVENTS = {
  connect: "connect",
  disconnect: "disconnect",
  messageNew: "message:new",
  messageAck: "message:ack",
  typing: "typing",
  presence: "presence:update",
  notice: "notice:new",
  join: "thread:join",
  leave: "thread:leave",
  send: "message:send",
  typingStart: "typing:start",
  typingStop: "typing:stop",
} as const;

export type IncomingMessage = ChatMessage & { threadId: string };

export type MessageAck = {
  localId: string;
  serverId: string;
  threadId: string;
  status: "sent" | "delivered" | "read" | "failed";
};

export type TypingPayload = {
  threadId: string;
  from: string;
  typing: boolean;
};

export type PresencePayload = {
  farmerId: string;
  state: PresenceState;
  lastSeen?: string;
};

export type RealtimeHandlers = {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onMessage?: (msg: IncomingMessage) => void;
  onAck?: (ack: MessageAck) => void;
  onTyping?: (payload: TypingPayload) => void;
  onPresence?: (payload: PresencePayload) => void;
  onNotice?: (notice: DeskNotice) => void;
};

export type OutgoingNote = {
  localId: string;
  threadId: string;
  kind: ChatMessage["kind"];
  text: string;
  attachment?: ChatMessage["attachment"];
  durationSec?: number;
  waveform?: number[];
};

export type RealtimeClient = {
  connected: () => boolean;
  connect: () => void;
  disconnect: () => void;
  join: (threadId: string) => void;
  leave: (threadId: string) => void;
  send: (note: OutgoingNote) => boolean;
  typing: (threadId: string, on: boolean) => void;
};
