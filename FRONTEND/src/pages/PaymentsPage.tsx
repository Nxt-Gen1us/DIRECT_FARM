import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { transactions } from "../data/orders";
import { useOrders } from "../app/providers/OrdersProvider";
import { razorpayReady } from "../lib/orderFlow";
import { inr, formatDate } from "../lib/format";
import { Card, SectionHead } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export function PaymentsPage() {
  const { t } = useTranslation();
  const { orders } = useOrders();
  const paid = transactions.filter((x) => x.status === "paid").reduce((s, x) => s + x.amount, 0);
  const pending = transactions
    .filter((x) => x.status === "pending")
    .reduce((s, x) => s + x.amount, 0);

  return (
    <div className="container-app py-10">
      <SectionHead kicker={t("nav.payments")} title={t("payments.title")} />
      <p className="-mt-4 mb-4 text-sm text-ink-soft">{t("payments.subtitle")}</p>
      <p className="mb-6 rounded-2xl border border-secondary/30 bg-secondary-soft px-4 py-3 text-xs text-secondary-dark">
        {razorpayReady() ? t("flow.razorpayReady") : t("flow.razorpayWait")}
      </p>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-widest text-muted">{t("payments.wallet")}</p>
          <p className="mt-2 font-display text-3xl text-nature">{inr(2480)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-widest text-muted">{t("payments.escrow")}</p>
          <p className="mt-2 font-display text-3xl text-secondary">{inr(pending)}</p>
          <p className="mt-1 text-xs text-muted">
            {t("pay.paid")}: {inr(paid)}
          </p>
        </Card>
      </div>
      {orders[0] && (
        <p className="mb-4 text-sm">
          <Link to={`/orders/${orders[0].id}`} className="text-primary">
            {t("flow.viewOrder")} · {orders[0].id}
          </Link>
        </p>
      )}
      <h3 className="mb-3 font-display text-2xl">{t("payments.recent")}</h3>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-deep text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">{t("nav.orders")}</th>
                <th className="px-4 py-3">{t("payments.method")}</th>
                <th className="px-4 py-3">{t("payments.amount")}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{tx.id}</td>
                  <td className="px-4 py-3">
                    {tx.orderId}
                    <p className="text-xs text-muted">{formatDate(tx.at)}</p>
                  </td>
                  <td className="px-4 py-3">{t(`pay.${tx.method}`)}</td>
                  <td className="px-4 py-3">{inr(tx.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tx.status === "paid" ? "nature" : "secondary"}>
                      {t(`pay.${tx.status}`)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
