import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CalendarEvent, CalendarKind } from "../../lib/types";
import { formatDate } from "../../lib/format";
import { Badge } from "../ui";
import { cn } from "../../lib/cn";

const tone: Record<CalendarKind, "primary" | "secondary" | "nature" | "accent" | "muted"> = {
  sow: "nature",
  transplant: "nature",
  fertilize: "secondary",
  protect: "primary",
  harvest: "accent",
  cure: "muted",
};

export function CalendarTimeline({ events }: { events: CalendarEvent[] }) {
  const { t } = useTranslation();
  const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
  return (
    <ol className="relative space-y-0">
      <span className="absolute bottom-2 left-[15px] top-2 w-px bg-line" />
      {sorted.map((ev) => (
        <li key={ev.id} className="relative flex gap-4 pb-7 last:pb-0">
          <span
            className={cn(
              "relative z-10 mt-1 h-8 w-8 shrink-0 rounded-full border-2 border-canvas",
              ev.kind === "harvest"
                ? "bg-secondary"
                : ev.kind === "protect"
                  ? "bg-primary"
                  : ev.kind === "fertilize"
                    ? "bg-secondary-dark"
                    : "bg-nature",
            )}
          />
          <div className="min-w-0 flex-1 rounded-[1.15rem] border border-line bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={tone[ev.kind]}>{t(`intel.ckind.${ev.kind}`)}</Badge>
              <span className="text-xs text-muted">
                {formatDate(ev.start)}
                {ev.end !== ev.start ? ` – ${formatDate(ev.end)}` : ""}
              </span>
            </div>
            <h3 className="mt-1.5 font-display text-xl text-ink">
              {ev.crop} · {ev.field}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">{ev.note}</p>
            <Link to={`/farmers/${ev.farmerId}`} className="mt-2 inline-block text-xs font-medium text-primary">
              {ev.farm} →
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
