import api from "../api";

export type DeliveryTracking = {
  currentStatus: "pending" | "picked" | "in_transit" | "delivered" | "delayed" | "returned";
  courier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  events: { status: string; location?: string; recordedAt: string }[];
};

export async function fetchDeliveryTracking(orderId: string): Promise<DeliveryTracking | null> {
  return await api.get<DeliveryTracking | null>(`/delivery/${orderId}`);
}

export type DeliveryUpdatePayload = {
  currentStatus?: "pending" | "picked" | "in_transit" | "delivered" | "delayed" | "returned";
  courier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
};

export async function updateDeliveryTracking(orderId: string, payload: DeliveryUpdatePayload): Promise<DeliveryTracking> {
  return await api.patch<DeliveryTracking>(`/delivery/${orderId}`, payload);
}

export type DeliveryEventPayload = {
  status: string;
  location?: string;
};

export async function addDeliveryEvent(orderId: string, event: DeliveryEventPayload): Promise<DeliveryTracking> {
  return await api.post<DeliveryTracking>(`/delivery/${orderId}/events`, event);
}
