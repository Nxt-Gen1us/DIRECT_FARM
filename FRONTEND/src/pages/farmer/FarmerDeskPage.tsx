import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
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
import {
  IndianRupee,
  Leaf,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { farmers } from "../../data/farmers";
import {
  FARMER_ID,
  farmerKpis,
  farmerListings,
  farmerOrders,
  monthlySales,
  pendingStatuses,
  productMix,
  todayHarvest,
  weeklySales,
} from "../../data/farmerDesk";
import { compactInr, inr } from "../../lib/format";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { OrderStatus } from "../../lib/types";

const tooltipStyle = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

export function FarmerDeskPage() {
  const { t } = useTranslation();
  const farmer = farmers.find((f) => f.id === FARMER_ID) ?? farmers[0];
  const [status, setStatus] = useState<Record<string, OrderStatus>>(
    Object.fromEntries(farmerOrders.map((o) => [o.id, o.status])),
  );

  const pending = useMemo(
    () => farmerOrders.filter((o) => pendingStatuses.includes(status[o.id] ?? o.status)),
    [status],
  );

  const kpis = [
    {
      label: t("farmer.revenue"),
      value: compactInr(farmerKpis.revenue),
      hint: `${t("farmer.thisMonth")} ${compactInr(farmerKpis.monthRevenue)} · ${farmerKpis.revenueDelta}`,
      icon: IndianRupee,
    },
    {
      label: t("farmer.orders"),
      value: String(farmerKpis.orders),
      hint: `${t("farmer.thisMonth")} ${farmerKpis.monthOrders} · ${farmerKpis.ordersDelta}`,
      icon: ShoppingBag,
    },
    {
      label: t("farmer.profit"),
      value: compactInr(farmerKpis.profit),
      hint: `${farmerKpis.margin}% ${t("farmer.margin")} · ${farmerKpis.profitDelta}`,
      icon: TrendingUp,
    },
    {
      label: t("farmer.products"),
      value: String(farmerKpis.listings),
      hint: t("farmer.listings"),
      icon: Package,
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={farmer.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-primary-deep/70 to-nature-dark/40" />
        <div className="container-app relative flex flex-wrap items-end gap-5 py-12 md:py-16">
          <img
            src={farmer.avatar}
            alt=""
            className="h-20 w-20 rounded-2xl border-4 border-cream object-cover"
          />
          <div className="min-w-0 flex-1 text-canvas">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {t("farmer.kicker")}
            </p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl">{t("farmer.title")}</h1>
            <p className="mt-1 text-sm text-accent/85">
              {farmer.name} · {farmer.village}, {farmer.district} · {farmer.acres} {t("farmer.acres")} ·{" "}
              {t("farmer.since")} {farmer.since}
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-canvas/10 px-5 py-3 text-right text-canvas backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-wider text-accent/80">{t("farmer.score")}</p>
            <p className="font-display text-4xl text-accent">{farmer.sustainabilityScore}</p>
          </div>
        </div>
      </section>

      <div className="container-app py-8 md:py-10">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{k.label}</p>
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-accent text-primary">
                  <k.icon size={16} />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl text-primary">{k.value}</p>
              <p className="mt-1 text-xs text-ink-soft">{k.hint}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl">{t("farmer.monthly")}</h2>
                <p className="text-xs text-muted">{t("farmer.monthlyHint")}</p>
              </div>
              <p className="text-xs text-nature">
                {t("farmer.thisSeason")} · {compactInr(farmerKpis.revenue)}
              </p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B2626" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#8B2626" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF6905" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#EF6905" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e6d8b4" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8A7363" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#8A7363" }} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => compactInr(Number(value ?? 0))}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name={t("farmer.revenue")}
                    stroke="#8B2626"
                    strokeWidth={2.2}
                    fill="url(#revFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    name={t("farmer.cost")}
                    stroke="#EF6905"
                    strokeWidth={1.8}
                    fill="url(#costFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-2xl">{t("farmer.mix")}</h2>
            <p className="text-xs text-muted">{t("farmer.mixHint")}</p>
            <div className="mt-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productMix}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={74}
                    paddingAngle={3}
                  >
                    {productMix.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => compactInr(Number(value ?? 0))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl bg-cream p-3 text-center">
              <p className="font-display text-xl text-primary">{farmerKpis.bestProduct}</p>
              <p className="text-xs text-muted">
                {farmerKpis.bestShare}% {t("farmer.bestShare")}
              </p>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs">
              {productMix.map((m) => (
                <li key={m.key} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: m.fill }} />
                    {m.name}
                  </span>
                  <span className="font-medium">{compactInr(m.value)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="mt-6 p-5">
          <h2 className="font-display text-2xl">{t("farmer.veg")} · {t("farmer.mango")} · {t("farmer.dairy")}</h2>
          <p className="mb-4 text-xs text-muted">{t("farmer.monthlyHint")}</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySales}>
                <CartesianGrid stroke="#e6d8b4" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8A7363" }} />
                <YAxis tick={{ fontSize: 12, fill: "#8A7363" }} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => compactInr(Number(value ?? 0))}
                />
                <Bar dataKey="mango" name={t("farmer.mango")} fill="#8B2626" radius={[6, 6, 0, 0]} />
                <Bar dataKey="veg" name={t("farmer.veg")} fill="#486C2F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="dairy" name={t("farmer.dairy")} fill="#EF6905" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-3">
              <h2 className="font-display text-2xl">{t("farmer.harvest")}</h2>
              <p className="text-xs text-muted">{t("farmer.harvestHint")}</p>
            </div>
            <div className="space-y-3">
              {todayHarvest.map((h) => (
                <Card key={h.productId} className="flex items-center gap-3 p-3">
                  <img src={h.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{h.name}</p>
                    <p className="text-xs text-muted">
                      {t("farmer.field")} {h.field} · {t("farmer.window")} {h.window}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl text-primary">
                      {h.qty} {h.unit}
                    </p>
                    <Badge tone={h.status === "limited" ? "secondary" : "nature"}>
                      {t(`farmer.harvestStatus.${h.status}`)}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <h2 className="font-display text-2xl">{t("farmer.pending")}</h2>
              <p className="text-xs text-muted">{t("farmer.pendingHint")}</p>
            </div>
            <div className="space-y-3">
              {pending.length === 0 && (
                <Card className="p-6 text-sm text-muted">{t("farmer.emptyPending")}</Card>
              )}
              {pending.map((o) => {
                const st = status[o.id] ?? o.status;
                return (
                  <Card key={o.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-lg">{o.id}</p>
                        <p className="text-xs text-muted">{o.buyerName}</p>
                      </div>
                      <Badge tone={st === "pending" ? "secondary" : "accent"}>
                        {t(`orders.status.${st}`)}
                      </Badge>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm">
                      {o.items.map((i) => (
                        <li key={i.productId} className="flex justify-between text-ink-soft">
                          <span>
                            {i.qty} {i.unit} {i.name}
                          </span>
                          <span>{inr(i.price * i.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-xl text-primary">{inr(o.total)}</span>
                      <div className="flex gap-2">
                        {st === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => setStatus((s) => ({ ...s, [o.id]: "confirmed" }))}
                          >
                            {t("farmer.confirm")}
                          </Button>
                        )}
                        {st === "confirmed" && (
                          <Button
                            size="sm"
                            variant="nature"
                            onClick={() => setStatus((s) => ({ ...s, [o.id]: "packed" }))}
                          >
                            {t("farmer.pack")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl">{t("farmer.listings")}</h2>
            <Link to="/farmer/products" className="text-sm font-medium text-primary">
              {t("nav.lots")} →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {farmerListings.map((p) => (
              <Card key={p.id} className="flex items-center gap-3 p-3">
                <img src={p.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-xs text-muted">
                    {inr(p.price)} / {p.unit} · {p.stock} {t("market.stock")}
                  </p>
                </div>
                {p.organic && (
                  <Badge tone="nature">
                    <Leaf size={10} /> {t("common.organic")}
                  </Badge>
                )}
                <Link to={`/market/${p.id}`} className="text-xs font-medium text-primary">
                  {t("farmer.viewLot")}
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
