import { io, type Socket } from "socket.io-client";
import { SOCKET_URL, radioConfigured } from "../realtime/client";
import type { LivePing } from "./types";

export const TRACK_EVENTS = {
  subscribe: "track:subscribe",
  unsubscribe: "track:unsubscribe",
  update: "track:update",
} as const;

export type TrackHandlers = {
  onPing?: (ping: LivePing) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export type TrackClient = {
  live: () => boolean;
  connect: () => void;
  disconnect: () => void;
  watch: (orderId: string) => void;
  unwatch: (orderId: string) => void;
};

export function createTrackClient(handlers: TrackHandlers): TrackClient {
  if (!radioConfigured() || !SOCKET_URL) {
    return {
      live: () => false,
      connect: () => undefined,
      disconnect: () => undefined,
      watch: () => undefined,
      unwatch: () => undefined,
    };
  }

  let socket: Socket | null = null;
  let on = false;

  return {
    live: () => on,
    connect: () => {
      if (socket) return;
      socket = io(SOCKET_URL, { transports: ["websocket"], autoConnect: true });
      socket.on("connect", () => {
        on = true;
        handlers.onConnect?.();
      });
      socket.on("disconnect", () => {
        on = false;
        handlers.onDisconnect?.();
      });
      socket.on(TRACK_EVENTS.update, (ping: LivePing) => handlers.onPing?.(ping));
    },
    disconnect: () => {
      socket?.disconnect();
      socket = null;
      on = false;
    },
    watch: (orderId) => {
      socket?.emit(TRACK_EVENTS.subscribe, { orderId });
    },
    unwatch: (orderId) => {
      socket?.emit(TRACK_EVENTS.unsubscribe, { orderId });
    },
  };
}
