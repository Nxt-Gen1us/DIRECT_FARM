import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOrders } from "../app/providers/OrdersProvider";
import { formatDate, inr } from "../lib/format";
import { Button } from "../components/ui";

export function InvoicePage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { getOrder } = useOrders();
  const order = getOrder(id ?? "");

  if (!order) {
    return <div className="container-app py-20 text-center">{t("flow.none")}</div>;
  }

  return (
    <div className="container-app max-w-3xl py-10">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link to={`/orders/${order.id}`} className="text-xs text-primary">
          ← {order.id}
        </Link>
        <Button variant="ghost" onClick={() => window.print()}>
          {t("flow.print")}
        </Button>
      </div>
      <article className="rounded-[1.25rem] border border-line bg-card p-8">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-secondary">{t("flow.invoice")}</p>
            <h1 className="font-display text-3xl">{order.invoiceNo ?? `INV-${order.id}`}</h1>
            <p className="text-sm text-muted">{t("flow.invoiceFrom")}</p>
          </div>
          <div className="text-right text-sm">
            <p>{formatDate(order.placedAt)}</p>
            <p className="text-muted">{order.id}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">{t("flow.billTo")}</p>
            <p className="mt-1 font-medium">{order.shipping?.name ?? order.buyerName}</p>
            <p className="text-ink-soft">{order.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">{t("flow.shipTo")}</p>
            <p className="mt-1 font-medium">{order.farmerName}</p>
            <p className="text-ink-soft">{order.payChannel === "cod" ? t("flow.cod") : t("flow.razorpay")}</p>
          </div>
        </div>
        <table className="mt-8 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="pb-2">{t("flow.items")}</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2 text-right">{t("flow.total")}</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.productId} className="border-t border-line">
                <td className="py-2">{i.name}</td>
                <td className="py-2">
                  {i.qty} {i.unit}
                </td>
                <td className="py-2 text-right">{inr(i.price * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{t("flow.subtotal")}</span>
            <span>{inr(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("flow.delivery")}</span>
            <span>{order.delivery ? inr(order.delivery) : t("flow.free")}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 font-display text-xl text-primary">
            <span>{t("flow.total")}</span>
            <span>{inr(order.total)}</span>
          </div>
        </div>
        <p className="mt-6 text-[11px] text-muted">{t("flow.gst")}</p>
      </article>
    </div>
  );
}
