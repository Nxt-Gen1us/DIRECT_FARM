/**
 * DIRECT FARM — Payments API
 * Wraps /api/v1/payments/* and /api/v1/wallet/* endpoints
 */
import api from "../api";

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

export interface PaymentRecord {
  _id: string;
  order: string | { _id: string };
  method: "razorpay" | "cod" | "wallet" | "escrow";
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: string;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function createRazorpayOrder(orderId: string): Promise<RazorpayOrderResponse> {
  const raw = await api.post<RazorpayOrderResponse>(`/payments/razorpay/create-order`, { orderId });
  return raw;
}

export async function verifyPayment(payload: VerifyPaymentPayload): Promise<void> {
  await api.post<void>(`/payments/razorpay/verify`, payload);
}

export async function fetchWalletBalance(): Promise<{ balance: number }> {
  const raw = await api.get<{ balance: number }>("/wallet");
  return raw ?? { balance: 0 };
}

export async function fetchPayments(): Promise<PaymentRecord[]> {
  return (await api.get<PaymentRecord[]>("/payments")) ?? [];
}
