import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../app/providers/AppProviders";
import { useOrders } from "../app/providers/OrdersProvider";
import { productById } from "../data/products";
import { emptyAddress } from "../data/addresses";
import { DEMO_PAYMENTS, deliveryFee, razorpayReady } from "../lib/orderFlow";
import { openRazorpayCheckout } from "../lib/razorpay";
import { formatUnit, inr } from "../lib/format";
import type { Address, PayChannel } from "../lib/types";
import { AddressCard } from "../components/orders/AddressCard";
import { PayMethodList } from "../components/orders/PayMethodList";
import { Button, EmptyState, Field, Input } from "../components/ui";
import { Card } from "../components/ui/Card";
import { PageTitle, SectionTitle } from "../components/ui/Typography";
import { fetchProduct } from "../lib/api/products";
import { apiConfigured } from "../lib/api";
import { completeDemoPayment, createRazorpayOrder, verifyPayment, fetchWalletBalance } from "../lib/api/payments";

type CachedProduct = { name: string; unit: string; price: number };

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, cartTotal, user, clearCart } = useApp();
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

  // Use the displayed product prices while the API prices are loading. The
  // backend remains authoritative when the order is created.
  const checkoutSubtotal = cart.reduce((sum, item) => sum + resolveProduct(item.productId).price * item.qty, 0);
  const delivery = deliveryFee(checkoutSubtotal || cartTotal);
  const totalDue = (checkoutSubtotal || cartTotal) + delivery;
  const selected = addresses.find((a) => a.id === addrId) ?? addresses[0];

  if (!cart.length) {
    return (
      <div className="container-app py-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">{t("flow.cart")}</p>
        <PageTitle>{t("checkoutUi.title")}</PageTitle>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">{t("checkoutUi.subtitle")}</p>
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
    if (!(draft.name ?? "").trim() || !(draft.line1 ?? "").trim() || !(draft.pincode ?? "").trim()) return;
    addAddress(draft);
    setAddrId(draft.id ?? "");
    setAdding(false);
    setDraft(emptyAddress());
  };

  const place = async () => {
    if (!selected) return;
    setNotice("");
    if (channel === "wallet") {
      if (walletBalance === null) {
        setNotice(t("paymentUi.checkingBalance"));
        return;
      }
      if (walletBalance < totalDue) {
        setNotice(`${t("paymentUi.walletShort")} ₹${(totalDue - walletBalance).toLocaleString("en-IN")}`);
        return;
      }
      setBusy(true);
      try {
        const order = await placeWalletOrder(selected);
        if (!order) {
          setNotice(t("paymentUi.orderFailed"));
          return;
        }
        navigate(`/orders/${order.id}/confirm`);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : t("paymentUi.orderFailed"));
      } finally {
        setBusy(false);
      }
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
      let order;
      try {
        order = await placePendingOnlineOrder(selected, "");
      } catch (error) {
        setBusy(false);
        setNotice(error instanceof Error ? error.message : t("paymentUi.orderFailed"));
        return;
      }
      if (!order) {
        setBusy(false);
        setNotice(t("paymentUi.orderFailed"));
        return;
      }
      if (DEMO_PAYMENTS) {
        try {
          if (apiConfigured() && /^[a-f\d]{24}$/i.test(order.id)) await completeDemoPayment(order.id);
          clearCart();
          navigate(`/orders/${order.id}/confirm`);
        } catch (error) {
          setNotice(error instanceof Error ? error.message : t("paymentUi.verificationFailed"));
        } finally {
          setBusy(false);
        }
        return;
      }
      let razorpayOrder;
      try {
        razorpayOrder = await createRazorpayOrder(order.id);
      } catch (error) {
        setBusy(false);
        setNotice(error instanceof Error ? error.message : t("paymentUi.paymentStartFailed"));
        return;
      }
      const result = await openRazorpayCheckout({
        amountPaise: razorpayOrder.amount,
        razorpayOrderId: razorpayOrder.id,
        name: user?.name ?? (selected.name ?? ""),
        contact: selected.phone ?? "",
        email: user?.email ?? "",
        note: `DIRECT FARM crate · ${selected.city ?? ""}`,
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
        clearCart();
        navigate(`/orders/${order.id}/confirm`);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : t("paymentUi.verificationFailed"));
      }
      return;
    }
    setBusy(true);
    try {
      const order = await placeCodOrder(selected, "cod");
      if (order) navigate(`/orders/${order.id}/confirm`);
      else setNotice(t("paymentUi.orderFailed"));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : t("paymentUi.orderFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-app py-6 sm:py-8 md:py-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
      <PageTitle>{t("flow.checkoutTitle")}</PageTitle>

      <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <div>
            <SectionTitle className="mb-1">{t("checkoutUi.deliverTo")}</SectionTitle>
            <p className="mb-3 text-xs text-ink-soft sm:mb-4 sm:text-sm">{t("checkoutUi.addressHint")}</p>
            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              {addresses.map((a) => (
                <AddressCard
                  key={a.id}
                  address={a}
                  selected={a.id === selected?.id}
                  onSelect={() => setAddrId(a.id ?? "")}
                />
              ))}
            </div>
            <Button variant="ghost" className="mt-3" onClick={() => setAdding((v) => !v)}>
              {t("checkoutUi.newAddress")}
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
            <SectionTitle className="mb-1">{t("checkoutUi.payment")}</SectionTitle>
            <p className="mb-3 text-xs text-ink-soft sm:mb-4 sm:text-sm">{t("checkoutUi.paymentHint")}</p>
            <PayMethodList value={channel} onChange={setChannel} walletBalance={walletBalance} totalDue={totalDue} />
            {DEMO_PAYMENTS && <p className="mt-3 rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary">{t("checkoutUi.demoNote")}</p>}
            {notice && (
              <p className="mt-3 rounded-2xl bg-secondary-soft px-3 py-2 text-xs text-secondary-dark sm:text-sm">
                {notice}
              </p>
            )}
          </div>
        </div>

        <Card className="h-fit p-4 sm:p-5 lg:col-span-2">
          <SectionTitle className="mb-4">{t("checkoutUi.orderSummary")}</SectionTitle>
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
              <span>{inr(checkoutSubtotal || cartTotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>{t("flow.delivery")}</span>
              <span>{delivery === 0 ? t("flow.free") : inr(delivery)}</span>
            </div>
            <div className="flex justify-between text-ink">
              <span>{t("flow.total")}</span>
              <span className="font-display text-lg text-primary sm:text-xl">{inr(totalDue)}</span>
            </div>
          </div>

          <Button className="mt-4 w-full" onClick={() => void place()} disabled={busy} aria-busy={busy}>
            {busy
              ? t("flow.openingPay")
              : channel === "wallet"
                ? t("paymentUi.payWallet")
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
