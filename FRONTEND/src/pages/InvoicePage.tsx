import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOrders } from "../app/providers/OrdersProvider";
import { formatDate, formatUnit, inr } from "../lib/format";
import { Button } from "../components/ui";
import { Card } from "../components/ui/Card";

export function InvoicePage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { getOrder } = useOrders();
  const order = getOrder(id ?? "");

  if (!order) {
    return <div className="container-app py-20 text-center text-ink-soft">{t("flow.none")}</div>;
  }

  return (
    <div className="container-app max-w-3xl py-8 sm:py-10">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link to={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary">
          ← {order.id}
        </Link>
        <Button variant="ghost" onClick={() => window.print()}>
          {t("flow.print")}
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-line bg-primary-soft px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">{t("flow.invoice")}</p>
              <h1 className="mt-1 font-display text-3xl text-ink">
                {order.invoiceNo ?? `INV-${order.id}`}
              </h1>
            </div>
            <div className="text-left text-sm text-ink-soft sm:text-right">
              <p>{formatDate(order.placedAt)}</p>
              <p className="mt-1 text-muted">{order.id}</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="grid gap-6 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("flow.billTo")}</p>
              <p className="mt-2 font-medium text-ink">{order.shipping?.name ?? order.buyerName}</p>
              <p className="text-ink-soft">{order.address}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">{t("flow.shipTo")}</p>
              <p className="mt-2 font-medium text-ink">{order.farmerName}</p>
              <p className="text-ink-soft">
                {order.payChannel === "cod" ? t("flow.cod") : t("flow.razorpay")}
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/80 text-xs uppercase tracking-[0.15em] text-muted">
                <tr>
                  <th className="px-4 py-3">{t("flow.items")}</th>
                  <th className="px-4 py-3">{t("common.qty")}</th>
                  <th className="px-4 py-3 text-right">{t("flow.total")}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.productId} className="border-t border-line">
                    <td className="px-4 py-3 text-ink">{i.name}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {i.qty} {formatUnit(i.unit)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-ink">{inr(i.price * i.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center justify-between text-ink-soft">
              <span>{t("flow.subtotal")}</span>
              <span>{inr(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-ink-soft">
              <span>{t("flow.delivery")}</span>
              <span>{order.delivery ? inr(order.delivery) : t("flow.free")}</span>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3 font-display text-xl text-primary">
              <span>{t("flow.total")}</span>
              <span>{inr(order.total)}</span>
            </div>
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-muted">{t("flow.gst")}</p>
        </div>
      </Card>
    </div>
  );
}
