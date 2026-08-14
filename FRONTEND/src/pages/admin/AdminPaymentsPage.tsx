import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { transactions } from "../../data/orders";
import { payMix } from "../../data/admin";
import { formatDate, inr } from "../../lib/format";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { DeskTable } from "../../components/admin/DeskTable";

const tooltip = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

const colors = ["#8b2626", "#486c2f", "#ef6905", "#c9a227"];

export function AdminPaymentsPage() {
  const { t } = useTranslation();
  const paid = transactions.filter((x) => x.status === "paid").reduce((s, x) => s + x.amount, 0);
  const pending = transactions.filter((x) => x.status === "pending").reduce((s, x) => s + x.amount, 0);

  return (
    <div>
      <h2 className="font-display text-3xl">{t("desk.payments")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.payLede")}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted">{t("desk.settled")}</p>
          <p className="mt-1 font-display text-3xl text-nature">{inr(paid)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted">{t("desk.escrow")}</p>
          <p className="mt-1 font-display text-3xl text-secondary">{inr(pending)}</p>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display text-xl">{t("desk.payMix")}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={payMix} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                  {payMix.map((_, i) => (
                    <Cell key={i} fill={colors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-xl">{t("desk.payBars")}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payMix}>
                <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltip} />
                <Bar dataKey="value" fill="#8b2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-5">
        <DeskTable head={[t("desk.col.tx"), t("desk.col.order"), t("desk.col.method"), t("desk.col.amount"), t("desk.col.status")]}>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-t border-line">
              <td className="px-4 py-3 font-medium">{tx.id}</td>
              <td className="px-4 py-3">
                {tx.orderId}
                <p className="text-[11px] text-muted">{formatDate(tx.at)}</p>
              </td>
              <td className="px-4 py-3 uppercase">{tx.method}</td>
              <td className="px-4 py-3">{inr(tx.amount)}</td>
              <td className="px-4 py-3">
                <Badge tone={tx.status === "paid" ? "nature" : "secondary"}>{tx.status}</Badge>
              </td>
            </tr>
          ))}
        </DeskTable>
      </div>
    </div>
  );
}
