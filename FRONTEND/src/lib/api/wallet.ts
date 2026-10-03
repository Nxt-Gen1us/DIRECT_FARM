/**
 * DIRECT FARM — Wallet API
 * Wraps /api/v1/wallet/topup endpoints
 */
import api from "../api";

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

export async function createWalletTopup(amount: number): Promise<RazorpayOrderResponse & { record?: any }> {
  return await api.post<RazorpayOrderResponse & { record?: any }>(`/wallet/topup`, { amount });
}

export async function verifyWalletTopup(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<void> {
  return await api.post<void>(`/wallet/topup/verify`, payload);
}
