import { useTranslation } from "react-i18next";
import { IndianRupee, TrendingUp, Calendar } from "lucide-react";
import { farmerKpis } from "../../data/farmerDesk";
import { compactInr, inr } from "../../lib/format";
import { Card } from "../../components/ui/Card";

const earningsHistory = [
  { id: "ORD-9281", date: "2026-04-12T14:30:00Z", amount: 4500, status: "completed" },
  { id: "ORD-9275", date: "2026-04-11T09:15:00Z", amount: 2100, status: "completed" },
  { id: "ORD-9260", date: "2026-04-10T16:45:00Z", amount: 8400, status: "completed" },
  { id: "ORD-9244", date: "2026-04-09T11:20:00Z", amount: 3250, status: "completed" },
  { id: "ORD-9221", date: "2026-04-08T13:10:00Z", amount: 5600, status: "completed" },
];

export function FarmerEarningsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-display text-ink">{t("farmerEarnings.title")}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-6 bg-primary text-accent border-none shadow-md">
          <div className="flex items-center gap-3 mb-4 opacity-90">
            <IndianRupee size={24} />
            <span className="font-medium">{t("farmerEarnings.thisMonth")}</span>
          </div>
          <p className="text-4xl sm:text-5xl font-display">{compactInr(farmerKpis.profit)}</p>
          <p className="mt-4 text-sm bg-accent/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
            <TrendingUp size={16} /> +12% from last month
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 text-ink-soft">
            <Calendar size={24} />
            <span className="font-medium">{t("farmerEarnings.totalSales")} (Year)</span>
          </div>
          <p className="text-3xl sm:text-4xl font-display text-ink">{compactInr(farmerKpis.revenue)}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4 text-ink-soft">
            <span className="font-medium">{t("farmerEarnings.completedOrders")}</span>
          </div>
          <p className="text-3xl sm:text-4xl font-display text-ink">142</p>
        </Card>
      </div>

      {/* Basic History Table */}
      <Card className="p-6">
        <h2 className="text-xl font-display mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-line/70 text-sm text-muted">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Order / Product</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {earningsHistory.slice(0, 10).map((row, i) => (
                <tr key={i} className="border-b border-line/30 hover:bg-canvas-soft transition-colors">
                  <td className="py-4 text-sm font-medium text-ink-soft">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <p className="font-medium">{row.id}</p>
                    <p className="text-xs text-muted">Sold to customer</p>
                  </td>
                  <td className="py-4 text-right font-display text-primary text-lg">
                    +{inr(row.amount)}
                  </td>
                  <td className="py-4 text-center text-sm font-medium text-nature">
                    Completed
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
