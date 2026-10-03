/**
 * DIRECT FARM — Delivery Tracking Socket.IO Client
 * Real-time GPS tracking and delivery status updates
 */

import { io, Socket } from "socket.io-client";

export type DeliveryLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: string;
};

export type DeliveryUpdate = {
  orderId: string;
  status: string;
  location: string | null;
  message: string | null;
  timestamp: string;
  updatedBy: string;
};

export type DeliveryLocationUpdate = {
  orderId: string;
  location: DeliveryLocation;
  updatedBy: string;
};

type DeliverySocketCallbacks = {
  onLocation?: (update: DeliveryLocationUpdate) => void;
  onUpdate?: (update: DeliveryUpdate) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export class DeliverySocket {
  private socket: Socket | null = null;
  private callbacks: DeliverySocketCallbacks;
  private subscribedOrders: Set<string> = new Set();

  constructor(callbacks: DeliverySocketCallbacks, token?: string) {
    this.callbacks = callbacks;
    
    if (!token) return;

    const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:3000";
    
    this.socket = io(wsUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      this.callbacks.onConnect?.();
      // Re-subscribe to orders after reconnection
      this.subscribedOrders.forEach((orderId) => this.subscribe(orderId));
    });

    this.socket.on("disconnect", () => {
      this.callbacks.onDisconnect?.();
    });

    this.socket.on("delivery:location", (data: DeliveryLocationUpdate) => {
      this.callbacks.onLocation?.(data);
    });

    this.socket.on("delivery:update", (data: DeliveryUpdate) => {
      this.callbacks.onUpdate?.(data);
    });
  }

  subscribe(orderId: string) {
    if (!this.socket || !orderId) return;
    this.subscribedOrders.add(orderId);
    this.socket.emit("delivery:subscribe", { orderId });
  }

  unsubscribe(orderId: string) {
    if (!this.socket || !orderId) return;
    this.subscribedOrders.delete(orderId);
    this.socket.emit("delivery:unsubscribe", { orderId });
  }

  broadcastGPS(orderId: string, latitude: number, longitude: number, accuracy?: number) {
    if (!this.socket || !orderId) return;
    this.socket.emit("delivery:gps", {
      orderId,
      latitude,
      longitude,
      accuracy,
      timestamp: new Date().toISOString(),
    });
  }

  broadcastStatus(orderId: string, status: string, location?: string, message?: string) {
    if (!this.socket || !orderId) return;
    this.socket.emit("delivery:status", {
      orderId,
      status,
      location,
      message,
    });
  }

  disconnect() {
    this.subscribedOrders.clear();
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
