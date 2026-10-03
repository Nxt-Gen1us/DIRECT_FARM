import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../app/providers/AppProviders";
import { useOrders } from "../app/providers/OrdersProvider";
import { productById } from "../data/products";
import { emptyAddress } from "../data/addresses";
import { deliveryFee, razorpayReady } from "../lib/orderFlow";
import { openRazorpayCheckout } from "../lib/razorpay";
import { formatUnit, inr } from "../lib/format";
import type { Address, PayChannel } from "../lib/types";
import { AddressCard } from "../components/orders/AddressCard";
import { PayMethodList } from "../components/orders/PayMethodList";
import { Button, EmptyState, Field, Input } from "../components/ui";
import { Card } from "../components/ui/Card";
import { fetchProduct } from "../lib/api/products";
import { apiConfigured } from "../lib/api";
import { createRazorpayOrder, verifyPayment, fetchWalletBalance } from "../lib/api/payments";

type CachedProduct = { name: string; unit: string; price: number };

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, cartTotal, user } = useApp();
  const { addresses, addAddress, placeCodOrder, placeWalletOrder, placePendingOnlineOrder } = useOrders();
  const [addrId, setAddrId] = useState(addresses[0]?.id ?? "");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Address>(emptyAddress());
  const [channel, setChannel] = useState<PayChannel>("cod");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  // Backend-resolved product info keyed by productId
  const [productCache, setProductCache] = useState<Record<string, CachedProduct>>({});

  const delivery = deliveryFee(cartTotal);
  const totalDue = cartTotal + delivery;
  const selected = addresses.find((a) => a.id === addrId) ?? addresses[0];

  // Resolve product details from backend when API is configured
  useEffect(() => {
    if (!apiConfigured() || !cart.length) return;
    cart.forEach(({ productId }) => {
      if (productCache[productId]) return;
      fetchProduct(productId)
        .then((p) => {
          setProductCache((prev) => ({
            ...prev,
            [productId]: { name: p.name, unit: p.unit, price: p.price },
          }));
        })
        .catch(() => {
          // silently fall back to mock data
        });
    });
  }, [cart, productCache]);

  useEffect(() => {
    if (!apiConfigured()) return;
    fetchWalletBalance()
      .then((wallet) => setWalletBalance(wallet.balance))
      .catch(() => setWalletBalance(0));
  }, []);

  // Helper: resolve product display info (API cache → mock fallback)
  const resolveProduct = (productId: string): CachedProduct => {
    if (productCache[productId]) return productCache[productId];
    const mock = productById(productId);
    if (mock) return { name: mock.name, unit: mock.unit, price: mock.price };
    return { name: productId, unit: "unit", price: 0 };
  };

  if (!cart.length) {
    return (
      <div className="container-app py-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">{t("flow.cart")}</p>
        <h1 className="mt-1 font-display text-4xl">{t("flow.checkoutTitle")}</h1>
        <EmptyState
          title={t("flow.cartEmpty")}
          action={
            <Link to="/market">
              <Button>{t("flow.shop")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const saveDraft = () => {
    if (!draft.name.trim() || !draft.line1.trim() || !draft.pincode.trim()) return;
    addAddress(draft);
    setAddrId(draft.id);
    setAdding(false);
    setDraft(emptyAddress());
  };

  const place = async () => {
    if (!selected) return;
    setNotice("");
    if (channel === "wallet") {
      if (walletBalance === null) {
        setNotice("Checking wallet balance...");
        return;
      }
      if (walletBalance < totalDue) {
        setNotice(`Wallet balance is insufficient. Need ₹${(totalDue - walletBalance).toLocaleString("en-IN")} more.`);
        return;
      }
      setBusy(true);
      const order = await placeWalletOrder(selected);
      setBusy(false);
      if (!order) {
        setNotice("Unable to place wallet order. Please try again.");
        return;
      }
      navigate(`/orders/${order.id}/confirm`);
      return;
    }
    if (channel === "razorpay") {
      if (!razorpayReady()) {
        setNotice(t("flow.razorpayBlocked"));
        return;
      }
      setBusy(true);
      // The backend creates the order first, calculates its total independently,
      // then creates the Razorpay order from that stored amount.
      const order = await placePendingOnlineOrder(selected, "");
      if (!order) {
        setBusy(false);
        setNotice("Unable to create your order. Please try again.");
        return;
      }
      let razorpayOrder;
      try {
        razorpayOrder = await createRazorpayOrder(order.id);
      } catch (error) {
        setBusy(false);
        setNotice(error instanceof Error ? error.message : "Unable to start online payment.");
        return;
      }
      const result = await openRazorpayCheckout({
        amountPaise: razorpayOrder.amount,
        razorpayOrderId: razorpayOrder.id,
        name: user?.name ?? selected.name,
        contact: selected.phone,
        email: user?.email,
        note: `DIRECT FARM crate · ${selected.city}`,
      });
      setBusy(false);
      if (!result.ok) {
        setNotice(
          result.reason === "dismissed" ? t("flow.razorpayDismissed") : t("flow.razorpayBlocked"),
        );
        return;
      }
      try {
        await verifyPayment({
          orderId: order.id,
          razorpay_order_id: result.razorpayOrderId,
          razorpay_payment_id: result.paymentId,
          razorpay_signature: result.signature,
        });
        navigate(`/orders/${order.id}/confirm`);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Payment verification failed. Please contact support.");
      }
      return;
    }
    setBusy(true);
    const order = await placeCodOrder(selected, "cod");
    setBusy(false);
    if (order) navigate(`/orders/${order.id}/confirm`);
  };

  return (
    <div className="container-app py-6 sm:py-8 md:py-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
      <h1 className="mt-1 font-display text-2xl text-ink sm:text-3xl md:text-4xl">{t("flow.checkoutTitle")}</h1>

      <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <div>
            <h2 className="mb-3 font-display text-xl text-ink sm:mb-4 sm:text-2xl">{t("flow.address")}</h2>
            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              {addresses.map((a) => (
                <AddressCard
                  key={a.id}
                  address={a}
                  selected={a.id === selected?.id}
                  onSelect={() => setAddrId(a.id)}
                />
              ))}
            </div>
            <Button variant="ghost" className="mt-3" onClick={() => setAdding((v) => !v)}>
              {t("flow.newAddress")}
            </Button>
            {adding && (
              <Card className="mt-3 grid gap-2.5 p-3 sm:grid-cols-2 sm:gap-3 sm:p-4">
                <Field label={t("flow.name")}>
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </Field>
                <Field label={t("flow.phone")}>
                  <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
                </Field>
                <Field label={t("flow.line1")}>
                  <Input value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} />
                </Field>
                <Field label={t("flow.line2")}>
                  <Input value={draft.line2 ?? ""} onChange={(e) => setDraft({ ...draft, line2: e.target.value })} />
                </Field>
                <Field label={t("flow.city")}>
                  <Input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
                </Field>
                <Field label={t("flow.pin")}>
                  <Input value={draft.pincode} onChange={(e) => setDraft({ ...draft, pincode: e.target.value })} />
                </Field>
                <div className="sm:col-span-2">
                  <Button onClick={saveDraft}>{t("flow.saveAddress")}</Button>
                </div>
              </Card>
            )}
          </div>

          <div>
            <h2 className="mb-3 font-display text-xl text-ink sm:mb-4 sm:text-2xl">{t("flow.pay")}</h2>
            <PayMethodList value={channel} onChange={setChannel} walletBalance={walletBalance} totalDue={totalDue} />
            {notice && (
              <p className="mt-3 rounded-2xl bg-secondary-soft px-3 py-2 text-xs text-secondary-dark sm:text-sm">
                {notice}
              </p>
            )}
          </div>
        </div>

        <Card className="h-fit p-4 sm:p-5 lg:col-span-2">
          <ul className="space-y-2 text-xs sm:text-sm">
            {cart.map((c) => {
              const { name, unit, price } = resolveProduct(c.productId);
              return (
                <li key={c.productId} className="flex items-center justify-between gap-2 text-ink-soft">
                  <span>
                    {c.qty} {formatUnit(unit)} {name}
                  </span>
                  <span className="font-medium text-ink">{inr(price * c.qty)}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-2 border-t border-line pt-3 text-xs sm:text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>{t("flow.subtotal")}</span>
              <span>{inr(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>{t("flow.delivery")}</span>
              <span>{delivery === 0 ? t("flow.free") : inr(delivery)}</span>
            </div>
            <div className="flex justify-between text-ink">
              <span>{t("flow.total")}</span>
              <span className="font-display text-lg text-primary sm:text-xl">{inr(cartTotal + delivery)}</span>
            </div>
          </div>

          <Button className="mt-4 w-full" onClick={() => void place()} disabled={busy} aria-busy={busy}>
            {busy
              ? t("flow.openingPay")
              : channel === "wallet"
                ? "Pay with wallet"
                : channel === "cod"
                  ? t("flow.placeCod")
                  : t("flow.placeOnline")}
          </Button>
          {channel === "razorpay" && !razorpayReady() && (
            <p className="mt-2 text-[10px] text-muted sm:text-[11px]">{t("flow.razorpayWait")}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
