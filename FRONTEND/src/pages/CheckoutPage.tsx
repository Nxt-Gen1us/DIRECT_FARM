import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../app/providers/AppProviders";
import { useOrders } from "../app/providers/OrdersProvider";
import { productById } from "../data/products";
import { emptyAddress } from "../data/addresses";
import { deliveryFee, razorpayReady } from "../lib/orderFlow";
import { openRazorpayCheckout } from "../lib/razorpay";
import { inr } from "../lib/format";
import type { Address, PayChannel } from "../lib/types";
import { AddressCard } from "../components/orders/AddressCard";
import { PayMethodList } from "../components/orders/PayMethodList";
import { Button, EmptyState, Field, Input } from "../components/ui";
import { Card } from "../components/ui/Card";

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, cartTotal, user } = useApp();
  const { addresses, addAddress, placeCodOrder, placePendingOnlineOrder } = useOrders();
  const [addrId, setAddrId] = useState(addresses[0]?.id ?? "");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Address>(emptyAddress());
  const [channel, setChannel] = useState<PayChannel>("cod");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const delivery = deliveryFee(cartTotal);
  const selected = addresses.find((a) => a.id === addrId) ?? addresses[0];

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
    if (channel === "razorpay") {
      if (!razorpayReady()) {
        setNotice(t("flow.razorpayBlocked"));
        return;
      }
      setBusy(true);
      const result = await openRazorpayCheckout({
        amountPaise: Math.round((cartTotal + delivery) * 100),
        name: user?.name ?? selected.name,
        contact: selected.phone,
        email: user?.email,
        note: `FarmConnect crate · ${selected.city}`,
      });
      setBusy(false);
      if (!result.ok) {
        setNotice(
          result.reason === "dismissed" ? t("flow.razorpayDismissed") : t("flow.razorpayBlocked"),
        );
        return;
      }
      const order = placePendingOnlineOrder(selected, result.paymentId);
      if (order) navigate(`/orders/${order.id}/confirm`);
      return;
    }
    const order = placeCodOrder(selected, "cod");
    if (order) navigate(`/orders/${order.id}/confirm`);
  };

  return (
    <div className="container-app py-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">{t("flow.cart")}</p>
      <h1 className="mt-1 font-display text-4xl">{t("flow.checkoutTitle")}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div>
            <h2 className="mb-3 font-display text-2xl">{t("flow.address")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
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
              <Card className="mt-3 grid gap-3 p-4 sm:grid-cols-2">
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
            <h2 className="mb-3 font-display text-2xl">{t("flow.pay")}</h2>
            <PayMethodList value={channel} onChange={setChannel} />
            {notice && (
              <p className="mt-3 rounded-2xl bg-secondary-soft px-3 py-2 text-sm text-secondary-dark">{notice}</p>
            )}
          </div>
        </div>

        <Card className="h-fit p-5 lg:col-span-2">
          <ul className="space-y-2 text-sm">
            {cart.map((c) => {
              const p = productById(c.productId);
              if (!p) return null;
              return (
                <li key={p.id} className="flex justify-between gap-2">
                  <span className="text-ink-soft">
                    {c.qty} {p.unit} {p.name}
                  </span>
                  <span>{inr(p.price * c.qty)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <span>{t("flow.subtotal")}</span>
              <span>{inr(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("flow.delivery")}</span>
              <span>{delivery === 0 ? t("flow.free") : inr(delivery)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>{t("flow.total")}</span>
              <span className="font-display text-xl text-primary">{inr(cartTotal + delivery)}</span>
            </div>
          </div>
          <Button className="mt-5 w-full" onClick={() => void place()} disabled={busy} aria-busy={busy}>
            {busy ? t("flow.openingPay") : channel === "cod" ? t("flow.placeCod") : t("flow.placeOnline")}
          </Button>
          {channel === "razorpay" && !razorpayReady() && (
            <p className="mt-2 text-[11px] text-muted">{t("flow.razorpayWait")}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
