import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { IntelShell } from "../../components/intel/IntelShell";
import { AlertCard } from "../../components/intel/AlertCard";
import { Card } from "../../components/ui/Card";
import { weatherDays } from "../../data/weather";
import { monthRain, rainHours, rainAlerts } from "../../data/intel";
import { cn } from "../../lib/cn";

const tooltip = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

const condIcon = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  storm: CloudRain,
  haze: Wind,
};

export function WeatherPage() {
  const { t } = useTranslation();
  const now = weatherDays[0];
  return (
    <IntelShell kicker={t("intel.kicker")} title={t("intel.weatherTitle")} lede={t("intel.weatherLede")}>
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="p-5 lg:col-span-2">
          <p className="text-xs uppercase tracking-wider text-secondary">{t("intel.nowAnand")}</p>
          <div className="mt-2 flex items-end gap-4">
            <p className="font-display text-6xl text-ink">{now.high}°</p>
            <div className="pb-2 text-sm text-ink-soft">
              <p>
                {t("intel.low")} {now.low}°
              </p>
              <p>
                {t("intel.feels")} 42°
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-cream p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted">{t("intel.rain")}</p>
              <p className="font-display text-2xl">{now.rain}%</p>
            </div>
            <div className="rounded-2xl bg-cream p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted">{t("intel.humidity")}</p>
              <p className="font-display text-2xl">{now.humidity}%</p>
            </div>
            <div className="rounded-2xl bg-cream p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted">{t("intel.wind")}</p>
              <p className="font-display text-2xl">{now.wind}</p>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">{now.advice}</p>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">{t("intel.todayCurve")}</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainHours}>
                <defs>
                  <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f5d8c" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2f5d8c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltip} />
                <Area type="monotone" dataKey="temp" stroke="#ef6905" strokeWidth={2} fill="none" name="°C" />
                <Area type="monotone" dataKey="rain" stroke="#2f5d8c" strokeWidth={2} fill="url(#rainFill)" name="mm" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <h2 className="mt-10 mb-4 font-display text-3xl">{t("intel.week")}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {weatherDays.map((d, i) => {
          const Icon = condIcon[d.condition];
          return (
            <Card key={d.date} className={cn("p-4", i === 0 && "ring-2 ring-primary/30")}>
              <p className="text-xs uppercase tracking-wider text-muted">{d.label}</p>
              <Icon size={18} className="mt-2 text-secondary" />
              <p className="mt-2 font-display text-2xl">{d.high}°</p>
              <p className="text-xs text-muted">{d.low}°</p>
              <p className="mt-2 text-xs text-primary">{d.rain}% rain</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">{t("intel.seasonRain")}</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthRain}>
                <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltip} />
                <Bar dataKey="mm" fill="#8b2626" radius={[6, 6, 0, 0]} name="mm" />
                <Bar dataKey="normal" fill="#c9a227" radius={[6, 6, 0, 0]} name="normal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="space-y-3">
          <h2 className="font-display text-2xl">{t("intel.advisories")}</h2>
          {rainAlerts.slice(0, 2).map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
      </div>
    </IntelShell>
  );
}
