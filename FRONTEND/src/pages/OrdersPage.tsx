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
    <div className="container-app py-8 sm:py-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
      <h1 className="mt-1 font-display text-2xl text-ink sm:text-3xl md:text-4xl">{t("flow.ordersTitle")}</h1>
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
        <div className="mt-6 space-y-4 sm:mt-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{t("nav.orders")}</p>
              <p className="mt-2 font-display text-xl text-ink">{orders.length}</p>
            </Card>
            <Card className="p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{t("flow.total")}</p>
              <p className="mt-2 font-display text-xl text-primary">{inr(orders.reduce((sum, o) => sum + o.total, 0))}</p>
            </Card>
            <Card className="p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{t("flow.track")}</p>
              <p className="mt-2 font-display text-xl text-ink">{orders.filter((o) => o.status !== "cancelled").length}</p>
            </Card>
          </div>

          {orders.map((o) => (
            <Card key={o.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <Link to={`/orders/${o.id}`} className="min-w-0 flex-1">
                  <p className="font-display text-xl text-ink hover:text-primary">{o.id}</p>
                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    {o.farmerName} · {formatDate(o.placedAt)} · {o.items.length} {t("flow.items")}
                  </p>
                </Link>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={tone[o.status]}>{t(`flow.status.${o.status}`)}</Badge>
                  <span className="font-display text-lg text-primary">{inr(o.total)}</span>
                  <Link to={`/orders/${o.id}/track`}>
                    <Button size="sm" variant="ghost">
                      {t("flow.track")}
                    </Button>
                  </Link>
                  {o.status !== "cancelled" && (
                    <Button size="sm" variant="secondary" onClick={() => repeat(o.id)}>
                      {t("shop.repeat")}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
