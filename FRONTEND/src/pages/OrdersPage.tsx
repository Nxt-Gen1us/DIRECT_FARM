import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOrders } from "../app/providers/OrdersProvider";
import { useApp } from "../app/providers/AppProviders";
import { inr, formatDate } from "../lib/format";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import type { OrderStatus } from "../lib/types";

const tone: Record<OrderStatus, "primary" | "secondary" | "nature" | "accent" | "muted"> = {
  pending: "secondary",
  confirmed: "accent",
  packed: "primary",
  shipped: "primary",
  delivered: "nature",
  cancelled: "muted",
};

export function OrdersPage() {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const { addMany } = useApp();
  const navigate = useNavigate();
  const repeat = (id: string) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    addMany(o.items.map((i) => ({ productId: i.productId, qty: i.qty })));
    navigate("/cart");
  };

  return (
    <div className="container-app py-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">{t("nav.orders")}</p>
      <h1 className="mt-1 font-display text-4xl">{t("flow.ordersTitle")}</h1>
      <p className="mt-2 text-sm text-ink-soft">{t("flow.ordersSub")}</p>
      {orders.length === 0 ? (
        <EmptyState
          title={t("flow.none")}
          action={
            <Link to="/market">
              <Button>{t("flow.shop")}</Button>
            </Link>
          }
        />
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <Link to={`/orders/${o.id}`} className="min-w-0 flex-1">
                <p className="font-display text-xl hover:text-primary">{o.id}</p>
                <p className="text-xs text-muted">
                  {o.farmerName} · {formatDate(o.placedAt)} · {o.items.length} {t("flow.items")}
                </p>
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={tone[o.status]}>{t(`flow.status.${o.status}`)}</Badge>
                <span className="font-display text-lg">{inr(o.total)}</span>
                {o.status !== "cancelled" && (
                  <Button size="sm" variant="ghost" onClick={() => repeat(o.id)}>
                    {t("shop.repeat")}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
