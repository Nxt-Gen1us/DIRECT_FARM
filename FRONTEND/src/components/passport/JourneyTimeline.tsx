import { useTranslation } from "react-i18next";
import {
  Flower2,
  Leaf,
  Package,
  Sprout,
  Truck,
  Warehouse,
  Wheat,
} from "lucide-react";
import type { CropPassport, JourneyStageId } from "../../lib/types";
import { formatDate } from "../../lib/format";
import { cn } from "../../lib/cn";

const icons: Record<JourneyStageId, typeof Sprout> = {
  seed: Sprout,
  growing: Leaf,
  flowering: Flower2,
  harvested: Wheat,
  packed: Package,
  shipped: Truck,
  delivered: Warehouse,
};

export function JourneyTimeline({ passport }: { passport: CropPassport }) {
  const { t } = useTranslation();
  const current = passport.currentStage;

  return (
    <section>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
        {t("passport.journey")}
      </p>
      <h2 className="mt-1 font-display text-3xl text-ink">{t("passport.journey")}</h2>
      <p className="mt-2 text-sm text-ink-soft">{t("passport.journeySub")}</p>
      <p className="mt-2 text-xs text-muted">
        {t("passport.current")}:{" "}
        <span className="font-medium text-primary">{t(`passport.stages.${current}`)}</span>
      </p>

      <ol className="mt-8 hidden lg:grid lg:grid-cols-7 lg:gap-3">
        {passport.journey.map((step, i) => {
          const Icon = icons[step.id];
          const active = step.id === current;
          return (
            <li key={step.id} className="relative flex flex-col items-center text-center">
              {i < passport.journey.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[58%] top-5 h-px w-[84%]",
                    step.done ? "bg-nature" : "bg-line",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 grid h-11 w-11 place-items-center rounded-full border-2",
                  step.done && !active && "border-nature bg-nature text-accent",
                  active && "border-primary bg-primary text-accent shadow-[0_10px_24px_-12px_rgb(139_38_38_/_0.6)]",
                  !step.done && !active && "border-line bg-canvas text-muted",
                )}
              >
                <Icon size={18} />
              </span>
              <p className="mt-3 font-display text-lg text-ink">{t(`passport.stages.${step.id}`)}</p>
              <p className="mt-1 text-[11px] text-muted">{step.at ? formatDate(step.at) : "—"}</p>
              <p className="mt-2 text-xs leading-snug text-ink-soft">{step.note}</p>
            </li>
          );
        })}
      </ol>

      <ol className="relative mt-8 space-y-0 lg:hidden">
        <span className="absolute bottom-3 left-[21px] top-3 w-px bg-line" />
        {passport.journey.map((step) => {
          const Icon = icons[step.id];
          const active = step.id === current;
          return (
            <li key={step.id} className="relative flex gap-4 pb-7 last:pb-0">
              <span
                className={cn(
                  "relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2",
                  step.done && !active && "border-nature bg-nature text-accent",
                  active && "border-primary bg-primary text-accent",
                  !step.done && !active && "border-line bg-canvas text-muted",
                )}
              >
                <Icon size={18} />
              </span>
              <div className="min-w-0 pt-1">
                <p className="font-display text-xl text-ink">{t(`passport.stages.${step.id}`)}</p>
                <p className="text-xs text-muted">{step.at ? formatDate(step.at) : "—"}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
