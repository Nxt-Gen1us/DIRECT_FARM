import { RAZORPAY_KEY, razorpayReady } from "./orderFlow";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler?: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
};

export type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

function loadScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay Checkout when VITE_RAZORPAY_KEY_ID is set.
 * Does not create a paid order here — the handler only returns the
 * payment id so a backend can verify the signature. No demo capture.
 */
export async function openRazorpayCheckout(opts: {
  amountPaise: number;
  razorpayOrderId?: string;
  name: string;
  contact?: string;
  email?: string;
  note: string;
}): Promise<
  | { ok: true; paymentId: string; razorpayOrderId: string; signature: string }
  | { ok: false; reason: "no-key" | "script" | "dismissed" }
> {
  const key = RAZORPAY_KEY;
  if (!razorpayReady() || !key) return { ok: false, reason: "no-key" };
  const loaded = await loadScript();
  const Razorpay = window.Razorpay;
  if (!loaded || !Razorpay) return { ok: false, reason: "script" };

  return new Promise((resolve) => {
    const checkout = new Razorpay({
      key,
      amount: opts.amountPaise,
      currency: "INR",
      name: "DIRECT FARM",
      description: opts.note,
      order_id: opts.razorpayOrderId,
      prefill: { name: opts.name, contact: opts.contact, email: opts.email },
      notes: { source: "directfarm-checkout" },
      theme: { color: "#15803D" },
      handler: (response) => {
        if (!response.razorpay_order_id || !response.razorpay_signature) {
          resolve({ ok: false, reason: "script" });
          return;
        }
        resolve({
          ok: true,
          paymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => resolve({ ok: false, reason: "dismissed" }),
      },
    });
    checkout.open();
  });
}
