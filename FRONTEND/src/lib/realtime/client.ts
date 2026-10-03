import { io, type Socket } from "socket.io-client";
import { RADIO_EVENTS, type OutgoingNote, type RealtimeClient, type RealtimeHandlers } from "./events";

export const SOCKET_URL = (import.meta.env.VITE_WS_URL || import.meta.env.VITE_SOCKET_URL) as string | undefined;

export function radioConfigured() {
  return Boolean(SOCKET_URL && SOCKET_URL.startsWith("http"));
}

function darkClient(): RealtimeClient {
  return {
    connected: () => false,
    connect: () => undefined,
    disconnect: () => undefined,
    join: () => undefined,
    leave: () => undefined,
    send: () => false,
    typing: () => undefined,
  };
}

export function createRealtimeClient(
  handlers: RealtimeHandlers,
  auth?: { token?: string; userId?: string },
): RealtimeClient {
  if (!radioConfigured() || !SOCKET_URL) return darkClient();

  let socket: Socket | null = null;
  let live = false;

  return {
    connected: () => live,
    connect: () => {
      if (socket) return;
      socket = io(SOCKET_URL, {
        autoConnect: true,
        transports: ["websocket"],
        auth: { token: auth?.token, userId: auth?.userId },
      });
      socket.on(RADIO_EVENTS.connect, () => {
        live = true;
        handlers.onConnect?.();
      });
      socket.on(RADIO_EVENTS.disconnect, (reason) => {
        live = false;
        handlers.onDisconnect?.(String(reason));
      });
      socket.on(RADIO_EVENTS.messageNew, (msg) => handlers.onMessage?.(msg));
      socket.on(RADIO_EVENTS.messageAck, (ack) => handlers.onAck?.(ack));
      socket.on(RADIO_EVENTS.typing, (payload) => handlers.onTyping?.(payload));
      socket.on(RADIO_EVENTS.presence, (payload) => handlers.onPresence?.(payload));
      socket.on(RADIO_EVENTS.notice, (notice) => handlers.onNotice?.(notice));
    },
    disconnect: () => {
      socket?.disconnect();
      socket = null;
      live = false;
    },
    join: (threadId) => {
      socket?.emit(RADIO_EVENTS.join, { threadId });
    },
    leave: (threadId) => {
      socket?.emit(RADIO_EVENTS.leave, { threadId });
    },
    send: (note: OutgoingNote) => {
      if (!socket || !live) return false;
      socket.emit(RADIO_EVENTS.send, note);
      return true;
    },
    typing: (threadId, on) => {
      if (!socket || !live) return;
      socket.emit(on ? RADIO_EVENTS.typingStart : RADIO_EVENTS.typingStop, { threadId });
    },
  };
}
