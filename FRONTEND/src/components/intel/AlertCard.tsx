import { CloudRain, SunMedium, Wind, Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { WeatherAlert } from "../../lib/types";
import { Badge } from "../ui";
import { Card } from "../ui/Card";
import { cn } from "../../lib/cn";

const icons = {
  rain: CloudRain,
  heat: SunMedium,
  wind: Wind,
  advisory: Megaphone,
};

const sev: Record<WeatherAlert["severity"], "primary" | "secondary" | "muted"> = {
  warning: "primary",
  watch: "secondary",
  info: "muted",
};

export function AlertCard({ alert }: { alert: WeatherAlert }) {
  const { t } = useTranslation();
  const Icon = icons[alert.kind ?? "advisory"];
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            alert.severity === "warning"
              ? "bg-primary-soft text-primary"
              : alert.severity === "watch"
                ? "bg-secondary-soft text-secondary-dark"
                : "bg-cream-deep text-ink-soft",
          )}
        >
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={sev[alert.severity]}>{t(`intel.sev.${alert.severity}`)}</Badge>
            <span className="text-[11px] uppercase tracking-wider text-muted">{alert.district}</span>
            {alert.mm != null && <span className="text-[11px] text-primary">{alert.mm} mm</span>}
          </div>
          <h3 className="mt-1.5 font-display text-xl text-ink">{alert.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{alert.body}</p>
          {alert.window && <p className="mt-2 text-xs text-muted">{t("intel.window")}: {alert.window}</p>}
          {alert.action && (
            <p className="mt-3 rounded-xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">{alert.action}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
