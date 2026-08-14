import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { categoryMix, deskKpis, gmvSeries, roleMix } from "../../data/admin";
import { complaints } from "../../data/admin";
import { compactInr } from "../../lib/format";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

const tooltip = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

const pieColors = ["#8b2626", "#486c2f", "#ef6905", "#c9a227", "#2f5d8c", "#5c4638"];

export function AdminOverviewPage() {
  const { t } = useTranslation();
  const kpis = [
    { k: t("desk.gmv"), v: compactInr(deskKpis.gmv), to: "/admin/orders" },
    { k: t("desk.orders"), v: deskKpis.orders.toLocaleString("en-IN"), to: "/admin/orders" },
    { k: t("desk.farmers"), v: String(deskKpis.farmers), to: "/admin/farmers" },
    { k: t("desk.buyers"), v: deskKpis.buyers.toLocaleString("en-IN"), to: "/admin/customers" },
    { k: t("desk.lots"), v: String(deskKpis.lots), to: "/admin/products" },
    { k: t("desk.disputes"), v: String(deskKpis.disputes), to: "/admin/complaints" },
    { k: t("desk.aiCalls"), v: String(deskKpis.aiCalls), to: "/admin/ai" },
    { k: t("desk.carbon"), v: `${deskKpis.carbonT} t`, to: "/admin/sustain" },
  ];

  return (
    <div>
      <h2 className="font-display text-3xl text-ink">{t("desk.overview")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.overviewLede")}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((x) => (
          <Link key={x.k} to={x.to}>
            <Card className="p-4 transition hover:-translate-y-0.5">
              <p className="text-[11px] uppercase tracking-wider text-muted">{x.k}</p>
              <p className="mt-1 font-display text-2xl text-primary">{x.v}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h3 className="font-display text-xl">{t("desk.gmvChart")}</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvSeries}>
                <defs>
                  <linearGradient id="gmvFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b2626" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8b2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltip} />
                <Area type="monotone" dataKey="gmv" stroke="#8b2626" fill="url(#gmvFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-display text-xl">{t("desk.roleMix")}</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleMix} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                  {roleMix.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display text-xl">{t("desk.catMix")}</h3>
          <div className="mt-4 space-y-2">
            {categoryMix.map((c) => (
              <div key={c.name} className="flex items-center gap-3 text-sm">
                <span className="w-24 text-ink-soft">{c.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-deep">
                  <div className="h-full rounded-full bg-nature" style={{ width: `${c.value * 2}%` }} />
                </div>
                <span className="w-8 text-right font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl">{t("desk.openTickets")}</h3>
            <Link to="/admin/complaints" className="text-xs text-primary">
              {t("common.viewAll")} →
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {complaints
              .filter((c) => c.status !== "closed")
              .slice(0, 4)
              .map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-muted">
                      {c.id} · {c.from}
                    </p>
                  </div>
                  <Badge tone={c.status === "open" ? "primary" : "secondary"}>{c.status}</Badge>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
