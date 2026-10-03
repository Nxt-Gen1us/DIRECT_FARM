import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOrders } from "../app/providers/OrdersProvider";
import { useApp } from "../app/providers/AppProviders";
import { canCancel, canReturn } from "../lib/orderFlow";
import { formatDate, formatUnit, inr } from "../lib/format";
import { Badge, Button, Field, Textarea } from "../components/ui";
import { Card } from "../components/ui/Card";
import { OrderTimeline } from "../components/orders/OrderTimeline";

export function OrderDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { getOrder, cancelOrder, returnOrder } = useOrders();
  const { addMany } = useApp();
  const navigate = useNavigate();
  const order = getOrder(id ?? "");
  const [why, setWhy] = useState("");
  const [mode, setMode] = useState<"none" | "cancel" | "return">("none");

  if (!order) {
    return <div className="container-app py-20 text-center text-ink-soft">{t("flow.none")}</div>;
  }

  return (
    <div className="container-app py-8 sm:py-10">
      <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-medium text-primary">
        ← {t("flow.ordersTitle")}
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
          <h1 className="mt-1 font-display text-2xl text-ink sm:text-3xl">{order.id}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {order.farmerName} · {formatDate(order.placedAt)} · {t("flow.eta")} {order.eta}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{t(`flow.status.${order.status}`)}</Badge>
          <Badge tone="muted">{t(`flow.payStatus.${order.paymentStatus}`)}</Badge>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 font-display text-2xl text-ink">{t("flow.track")}</h2>
            <OrderTimeline order={order} />
            {order.status === "cancelled" && (
              <p className="mt-4 text-sm text-primary">
                {t("flow.cancelled")} {order.cancelReason ? `· ${order.cancelReason}` : ""}
              </p>
            )}
            {order.returnStatus && order.returnStatus !== "none" && (
              <p className="mt-4 text-sm text-nature">{t("flow.returned")}</p>
            )}
          </Card>

          <Card className="p-5">
            {order.items.map((i) => (
              <div key={i.productId} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
                <img src={i.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1 text-sm">
                  <Link to={`/market/${i.productId}`} className="font-medium text-ink hover:text-primary">
                    {i.name}
                  </Link>
                  <p className="text-muted">
                    {i.qty} {formatUnit(i.unit)} · {inr(i.price)}
                  </p>
                </div>
                <span className="text-sm font-medium text-ink">{inr(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="mt-3 flex justify-between text-sm">
              <span>{t("flow.total")}</span>
              <span className="font-display text-xl text-primary">{inr(order.total)}</span>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("flow.shipTo")}</p>
            <p className="mt-2 font-medium text-ink">{order.shipping?.name ?? order.buyerName}</p>
            <p className="text-ink-soft">{order.address}</p>
            <p className="mt-3 text-xs text-muted">
              {order.payChannel === "cod" ? t("flow.cod") : t("flow.razorpay")}
            </p>
          </Card>

          <div className="flex flex-col gap-2">
            <Link to={`/orders/${order.id}/track`}>
              <Button variant="ghost" className="w-full">
                {t("flow.track")}
              </Button>
            </Link>
            <Link to={`/orders/${order.id}/invoice`}>
              <Button variant="ghost" className="w-full">
                {t("flow.invoice")}
              </Button>
            </Link>
            {order.status !== "cancelled" && (
              <Button
                variant="secondary"
                onClick={() => {
                  addMany(order.items.map((i) => ({ productId: i.productId, qty: i.qty })));
                  navigate("/cart");
                }}
              >
                {t("shop.repeat")}
              </Button>
            )}
            {canCancel(order) && (
              <Button variant="ghost" onClick={() => setMode("cancel")}>
                {t("flow.cancel")}
              </Button>
            )}
            {canReturn(order) && (
              <Button variant="ghost" onClick={() => setMode("return")}>
                {t("flow.return")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {mode !== "none" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="font-display text-2xl text-ink">
              {mode === "cancel" ? t("flow.cancelTitle") : t("flow.returnTitle")}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              {mode === "cancel" ? t("flow.cancelBody") : t("flow.returnBody")}
            </p>
            <Field label={mode === "cancel" ? t("flow.cancelWhy") : t("flow.returnWhy")}>
              <Textarea value={why} onChange={(e) => setWhy(e.target.value)} rows={3} />
            </Field>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setMode("none")}>
                {t("common.close")}
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (mode === "cancel") void cancelOrder(order.id, why);
                  else returnOrder(order.id, why);
                  setMode("none");
                  setWhy("");
                }}
              >
                {mode === "cancel" ? t("flow.cancelGo") : t("flow.returnGo")}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
