import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOrders } from "../../app/providers/OrdersProvider";
import { formatDate, inr } from "../../lib/format";
import type { OrderStatus } from "../../lib/types";
import { Badge } from "../../components/ui/Badge";
import { DeskTable } from "../../components/admin/DeskTable";

const tone: Record<OrderStatus, "primary" | "secondary" | "nature" | "accent" | "muted"> = {
  pending: "secondary",
  confirmed: "accent",
  packed: "primary",
  shipped: "primary",
  delivered: "nature",
  cancelled: "muted",
};

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const list = useMemo(
    () => (status === "all" ? orders : orders.filter((o) => o.status === status)),
    [orders, status],
  );

  return (
    <div>
      <h2 className="font-display text-3xl">{t("desk.orders")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.ordersLede")}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(["all", "pending", "packed", "shipped", "delivered", "cancelled"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              status === s ? "bg-primary text-accent" : "border border-line bg-canvas"
            }`}
          >
            {s === "all" ? t("desk.all") : t(`flow.status.${s}`)}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <DeskTable
          head={[t("desk.col.order"), t("desk.col.farm"), t("desk.col.buyer"), t("desk.col.amount"), t("desk.col.status")]}
        >
          {list.map((o) => (
            <tr key={o.id} className="border-t border-line">
              <td className="px-4 py-3">
                <Link to={`/orders/${o.id}`} className="font-medium hover:text-primary">
                  {o.id}
                </Link>
                <p className="text-[11px] text-muted">{formatDate(o.placedAt)}</p>
              </td>
              <td className="px-4 py-3 text-ink-soft">{o.farmerName}</td>
              <td className="px-4 py-3 text-ink-soft">{o.buyerName}</td>
              <td className="px-4 py-3">{inr(o.total)}</td>
              <td className="px-4 py-3">
                <Badge tone={tone[o.status]}>{t(`flow.status.${o.status}`)}</Badge>
              </td>
            </tr>
          ))}
        </DeskTable>
      </div>
    </div>
  );
}
