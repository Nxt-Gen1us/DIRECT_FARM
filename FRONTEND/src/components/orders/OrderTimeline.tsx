import { useTranslation } from "react-i18next";
import { Check, Package, ShoppingBag, Truck, Warehouse } from "lucide-react";
import type { Order, TrackStageId } from "../../lib/types";
import { TRACK_STAGES, stageFromStatus } from "../../lib/orderFlow";
import { formatDate } from "../../lib/format";
import { cn } from "../../lib/cn";

const icons: Record<TrackStageId, typeof Check> = {
  placed: ShoppingBag,
  packed: Package,
  shipped: Truck,
  out: Truck,
  delivered: Warehouse,
};

export function OrderTimeline({ order }: { order: Order }) {
  const { t } = useTranslation();
  const stage = order.trackStage ?? stageFromStatus(order.status);
  const cancelled = order.status === "cancelled";
  const steps =
    order.timeline && order.timeline.length
      ? order.timeline
      : TRACK_STAGES.map((id) => ({
          id,
          at: id === "placed" ? order.placedAt : "",
          done: TRACK_STAGES.indexOf(id) <= TRACK_STAGES.indexOf(stage),
        }));

  return (
    <div>
      <ol className="hidden md:grid md:grid-cols-5 md:gap-2">
        {steps.map((step, i) => {
          const Icon = icons[step.id];
          return (
            <li key={step.id} className="relative flex flex-col items-center text-center">
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[58%] top-4 h-px w-[84%]",
                    step.done ? "bg-nature" : "bg-line",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 grid h-9 w-9 place-items-center rounded-full border-2",
                  step.done ? "border-nature bg-nature text-accent" : "border-line bg-canvas text-muted",
                )}
              >
                <Icon size={15} />
              </span>
              <p className={cn("mt-2 text-xs font-medium", step.done ? "text-ink" : "text-muted")}>
                {t(`flow.stages.${step.id}`)}
              </p>
              {step.at && <p className="mt-0.5 text-[10px] text-muted">{formatDate(step.at)}</p>}
            </li>
          );
        })}
      </ol>

      <ol className="relative md:hidden">
        <span className="absolute bottom-2 left-[15px] top-2 w-px bg-line" />
        {steps.map((step) => {
          const Icon = icons[step.id];
          return (
            <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
              <span
                className={cn(
                  "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2",
                  step.done
                    ? "border-nature bg-nature text-accent"
                    : cancelled
                      ? "border-line bg-canvas text-muted"
                      : "border-line bg-canvas text-muted",
                )}
              >
                <Icon size={14} />
              </span>
              <div className="pt-1">
                <p className={cn("text-sm font-medium", step.done ? "text-ink" : "text-muted")}>
                  {t(`flow.stages.${step.id}`)}
                </p>
                {step.at && <p className="text-[11px] text-muted">{formatDate(step.at)}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
