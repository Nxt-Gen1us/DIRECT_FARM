import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PremiumShell } from "../../components/premium/PremiumShell";
import { Badge } from "../../components/ui";
import { Card } from "../../components/ui/Card";
import { seasonBelts } from "../../data/premium";

const tooltip = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

export function ForecastPage() {
  const { t } = useTranslation();
  const [id, setId] = useState(seasonBelts[0].id);
  const belt = seasonBelts.find((b) => b.id === id) ?? seasonBelts[0];

  return (
    <PremiumShell title={t("plus.forecastTitle")} lede={t("plus.forecastLede")}>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {seasonBelts.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setId(b.id)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              id === b.id ? "bg-primary text-accent" : "border border-line bg-canvas"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">{belt.name}</h2>
            <p className="text-sm text-ink-soft">{belt.crop}</p>
          </div>
          <Badge tone={belt.risk === "high" ? "primary" : belt.risk === "watch" ? "secondary" : "nature"}>
            {t(`plus.risk.${belt.risk}`)}
          </Badge>
        </div>
        <p className="mt-3 rounded-xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">{belt.outlook}</p>
        <div className="mt-5 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={belt.series}>
              <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltip} />
              <Area type="monotone" dataKey="rain" name="mm" stroke="#2f5d8c" fill="#e8eef4" strokeWidth={2} />
              <Line type="monotone" dataKey="heat" name="°C" stroke="#ef6905" strokeWidth={2} />
              <Line type="monotone" dataKey="yieldIdx" name="idx" stroke="#486c2f" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </PremiumShell>
  );
}
