import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { carbonMonths, farmFootprints, seasonNow } from "../../data/sustain";
import { farmers } from "../../data/farmers";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const tooltip = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

export function AdminSustainPage() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl">{t("desk.earth")}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t("desk.earthLede")}</p>
        </div>
        <Link to="/sustainability">
          <Button size="sm" variant="ghost">
            {t("nav.sustainability")}
          </Button>
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [t("earth.carbon"), `${seasonNow.carbonT} t`],
          [t("earth.waste"), "9.2 t"],
          [t("earth.local"), `${seasonNow.localPct}%`],
          [t("earth.donate"), "3.1 t"],
        ].map(([k, v]) => (
          <Card key={k} className="p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted">{k}</p>
            <p className="font-display text-2xl text-nature">{v}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-5 p-5">
        <h3 className="font-display text-xl">{t("earth.carbonChart")}</h3>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={carbonMonths}>
              <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltip} />
              <Area type="monotone" dataKey="saved" stroke="#486c2f" fill="#eef4e6" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="mt-5 space-y-2">
        {farmFootprints.map((f) => {
          const farm = farmers.find((x) => x.id === f.farmerId);
          return (
            <Card key={f.farmerId} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
              <Link to={`/farmers/${f.farmerId}`} className="font-medium hover:text-primary">
                {farm?.farmName}
              </Link>
              <p className="text-ink-soft">
                {f.carbonSavedT} t · {f.localPct}% {t("earth.localShare")} · {f.donatedKg} kg {t("earth.given")}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
