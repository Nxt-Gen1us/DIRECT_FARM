import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { aiCallsWeek, aiUsage } from "../../data/admin";
import { formatWhen } from "../../lib/format";
import { Card } from "../../components/ui/Card";
import { DeskTable } from "../../components/admin/DeskTable";

const tooltip = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

export function AdminAiPage() {
  const { t } = useTranslation();
  const total = aiUsage.reduce((s, x) => s + x.calls, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl">{t("desk.ai")}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t("desk.aiLede")}</p>
        </div>
        <Link to="/ai" className="text-sm text-primary">
          {t("nav.ai")} →
        </Link>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted">{t("desk.aiCalls")}</p>
          <p className="font-display text-3xl text-primary">{total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted">{t("desk.tools")}</p>
          <p className="font-display text-3xl">{aiUsage.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted">{t("desk.avgConf")}</p>
          <p className="font-display text-3xl">
            {Math.round(aiUsage.reduce((s, x) => s + x.confidence, 0) / aiUsage.length)}%
          </p>
        </Card>
      </div>
      <Card className="mt-5 p-5">
        <h3 className="font-display text-xl">{t("desk.aiWeek")}</h3>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aiCallsWeek}>
              <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltip} />
              <Bar dataKey="calls" fill="#8b2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="mt-5">
        <DeskTable head={[t("desk.col.tool"), t("desk.col.farm"), t("desk.col.calls"), t("desk.col.conf"), t("desk.col.last")]}>
          {aiUsage.map((row) => (
            <tr key={row.id} className="border-t border-line">
              <td className="px-4 py-3 font-medium">{row.tool}</td>
              <td className="px-4 py-3 text-ink-soft">{row.farm}</td>
              <td className="px-4 py-3">{row.calls}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-cream-deep">
                    <div className="h-full bg-nature" style={{ width: `${row.confidence}%` }} />
                  </div>
                  {row.confidence}%
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted">{formatWhen(row.last)}</td>
            </tr>
          ))}
        </DeskTable>
      </div>
    </div>
  );
}
