import { useTranslation } from "react-i18next";
import { transactions } from "../../data/orders";
import { formatDate, inr } from "../../lib/format";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { DeskTable } from "../../components/admin/DeskTable";

export function AdminPaymentsPage() {
  const { t } = useTranslation();
  const paid = transactions.filter((x) => x.status === "paid").reduce((s, x) => s + x.amount, 0);
  const pending = transactions.filter((x) => x.status === "pending").reduce((s, x) => s + x.amount, 0);
 return <div className="admin-simple-page"><div className="admin-page-intro"><p className="admin-eyebrow">{t("adminUi.paymentInfo")}</p><h2>{t("desk.payments")}</h2><p>{t("desk.payLede")}</p></div><div className="admin-kpis admin-payment-kpis"><Card className="admin-kpi"><span className="admin-kpi-label">{t("desk.settled")}</span><strong>{inr(paid)}</strong><small>{t("adminUi.paymentComplete")}</small></Card><Card className="admin-kpi"><span className="admin-kpi-label">{t("desk.escrow")}</span><strong>{inr(pending)}</strong><small>{t("adminUi.reviewPending")}</small></Card></div><section className="admin-section"><div className="admin-section-heading"><div><p className="admin-eyebrow">{t("adminUi.paymentList")}</p><h3>{t("adminUi.simplePaymentInfo")}</h3></div></div><DeskTable head={[t("desk.col.tx"), t("desk.col.order"), t("desk.col.method"), t("desk.col.amount"), t("desk.col.status")]}>{transactions.map((tx) => <tr key={tx.id} className="border-t border-line"><td className="px-4 py-3 font-medium">{tx.id}</td><td className="px-4 py-3">{tx.orderId}<p className="text-[11px] text-muted">{formatDate(tx.at)}</p></td><td className="px-4 py-3">{t(`pay.${tx.method}`)}</td><td className="px-4 py-3">{inr(tx.amount)}</td><td className="px-4 py-3"><Badge tone={tx.status === "paid" ? "nature" : "secondary"}>{t(`pay.${tx.status}`)}</Badge></td></tr>)}</DeskTable></section></div>;
}
