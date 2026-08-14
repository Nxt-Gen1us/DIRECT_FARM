import { useTranslation } from "react-i18next";
import { Cloud, CloudRain, Droplets, Sun, Wind } from "lucide-react";
import { weatherAlerts, weatherDays } from "../data/weather";
import { Card, SectionHead } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const icon = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  storm: CloudRain,
  haze: Sun,
};

export function WeatherPage() {
  const { t } = useTranslation();
  const today = weatherDays[0];
  const Icon = icon[today.condition];

  return (
    <div className="container-app py-10">
      <SectionHead kicker={t("nav.weather")} title={t("weather.title")} />
      <p className="-mt-4 mb-8 text-sm text-ink-soft">{t("weather.subtitle")}</p>

      <div
        className="relative mb-8 overflow-hidden rounded-[1.5rem] p-6 text-canvas md:p-8"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(36,22,16,0.72), rgba(139,38,38,0.45)), url(/images/irrigation.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{t("weather.now")}</p>
        <div className="mt-3 flex flex-wrap items-end gap-6">
          <div>
            <p className="font-display text-6xl">{today.high}°</p>
            <p className="text-sm text-accent/80">
              {today.low}° / {today.high}°
            </p>
          </div>
          <Icon size={48} className="text-accent" />
        </div>
        <p className="mt-4 max-w-xl text-sm text-accent/90">{today.advice}</p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-canvas/10 p-3 backdrop-blur">
            <Droplets size={14} /> {t("weather.rain")}
            <p className="font-display text-xl">{today.rain}%</p>
          </div>
          <div className="rounded-2xl bg-canvas/10 p-3 backdrop-blur">
            <Droplets size={14} /> {t("weather.humidity")}
            <p className="font-display text-xl">{today.humidity}%</p>
          </div>
          <div className="rounded-2xl bg-canvas/10 p-3 backdrop-blur">
            <Wind size={14} /> {t("weather.wind")}
            <p className="font-display text-xl">{today.wind} km/h</p>
          </div>
        </div>
      </div>

      <h3 className="mb-3 font-display text-2xl">{t("weather.week")}</h3>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {weatherDays.map((d) => {
          const I = icon[d.condition];
          return (
            <Card key={d.date} className="p-3 text-center">
              <p className="text-xs font-medium text-muted">{d.label}</p>
              <I size={22} className="mx-auto my-2 text-secondary" />
              <p className="font-display text-xl">{d.high}°</p>
              <p className="text-xs text-muted">{d.low}°</p>
              <p className="mt-1 text-[11px] text-info">{d.rain}%</p>
            </Card>
          );
        })}
      </div>

      <h3 className="mb-3 font-display text-2xl">{t("weather.alerts")}</h3>
      <div className="grid gap-3">
        {weatherAlerts.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                tone={a.severity === "warning" ? "primary" : a.severity === "watch" ? "secondary" : "muted"}
              >
                {a.severity}
              </Badge>
              <p className="font-medium">{a.title}</p>
              <span className="text-xs text-muted">{a.district}</span>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{a.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
