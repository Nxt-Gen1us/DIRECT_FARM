import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarDays, CloudRain, Landmark, SunMedium } from "lucide-react";
import { IntelShell } from "../../components/intel/IntelShell";
import { AlertCard } from "../../components/intel/AlertCard";
import { ReminderCard } from "../../components/intel/ReminderCard";
import { SchemeCard } from "../../components/intel/SchemeCard";
import { Card } from "../../components/ui/Card";
import { intelKpis, rainAlerts, fieldReminders, govSchemes } from "../../data/intel";
import { weatherDays } from "../../data/weather";

const doors = [
  { to: "/weather", icon: SunMedium, title: "intel.weather", body: "intel.weatherLede" },
  { to: "/weather/alerts", icon: CloudRain, title: "intel.rainTab", body: "intel.rainLede" },
  { to: "/calendar", icon: CalendarDays, title: "intel.calendar", body: "intel.calLede" },
  { to: "/schemes", icon: Landmark, title: "intel.schemes", body: "intel.schemeLede" },
];

export function IntelHubPage() {
  const { t } = useTranslation();
  const today = weatherDays[0];
  return (
    <IntelShell title={t("intel.title")} lede={t("intel.lede")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {intelKpis.map((k) => (
          <Card key={k.id} className="p-5">
            <p className="text-[11px] uppercase tracking-wider text-muted">{k.label}</p>
            <p className="mt-1 font-display text-4xl text-primary">{k.value}</p>
            <p className="mt-1 text-xs text-ink-soft">{k.hint}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {doors.map((d) => {
          const Icon = d.icon;
          return (
            <Link key={d.to} to={d.to} className="group">
              <Card className="h-full p-5 transition group-hover:-translate-y-0.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                  <Icon size={18} />
                </span>
                <h2 className="mt-3 font-display text-2xl">{t(d.title)}</h2>
                <p className="mt-1 text-sm text-ink-soft">{t(d.body)}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-2xl">{t("intel.today")}</h2>
          <Card className="p-5">
            <p className="text-xs uppercase tracking-wider text-secondary">{today.label} · Anand</p>
            <p className="mt-1 font-display text-5xl text-ink">{today.high}°</p>
            <p className="text-sm text-ink-soft">
              {t("intel.low")} {today.low}° · {t("intel.rain")} {today.rain}% · {today.wind} km/h
            </p>
            <p className="mt-3 rounded-xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">{today.advice}</p>
            <Link to="/weather" className="mt-3 inline-block text-sm font-medium text-primary">
              {t("intel.openWeather")} →
            </Link>
          </Card>
        </div>
        <div>
          <h2 className="mb-3 font-display text-2xl">{t("intel.rainTab")}</h2>
          <AlertCard alert={rainAlerts[0]} />
        </div>
      </div>

      <h2 className="mt-10 mb-3 font-display text-2xl">{t("intel.dueNow")}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fieldReminders
          .filter((r) => r.priority === "now")
          .map((r) => (
            <ReminderCard key={r.id} item={r} />
          ))}
      </div>

      <h2 className="mt-10 mb-3 font-display text-2xl">{t("intel.schemes")}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {govSchemes.slice(0, 3).map((s) => (
          <SchemeCard key={s.id} scheme={s} />
        ))}
      </div>
    </IntelShell>
  );
}
