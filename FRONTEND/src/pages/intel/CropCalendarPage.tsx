import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IntelShell } from "../../components/intel/IntelShell";
import { CalendarTimeline } from "../../components/intel/CalendarTimeline";
import { calendarEvents } from "../../data/intel";
import type { CalendarKind } from "../../lib/types";

const kinds: Array<CalendarKind | "all"> = [
  "all",
  "sow",
  "transplant",
  "fertilize",
  "protect",
  "harvest",
  "cure",
];

export function CropCalendarPage() {
  const { t } = useTranslation();
  const [kind, setKind] = useState<(typeof kinds)[number]>("all");
  const [crop, setCrop] = useState("all");
  const crops = useMemo(
    () => ["all", ...Array.from(new Set(calendarEvents.map((e) => e.crop)))],
    [],
  );
  const events = calendarEvents.filter((e) => {
    if (kind !== "all" && e.kind !== kind) return false;
    if (crop !== "all" && e.crop !== crop) return false;
    return true;
  });

  return (
    <IntelShell title={t("intel.calTitle")} lede={t("intel.calLede")}>
      <div className="mb-6 flex flex-wrap gap-2">
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              kind === k ? "bg-primary text-accent" : "border border-line bg-canvas text-ink-soft"
            }`}
          >
            {k === "all" ? t("intel.all") : t(`intel.ckind.${k}`)}
          </button>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap gap-1.5">
        {crops.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCrop(c)}
            className={`rounded-full px-3 py-1 text-xs ${
              crop === c ? "bg-ink text-accent" : "bg-cream-deep text-ink-soft"
            }`}
          >
            {c === "all" ? t("intel.allCrops") : c}
          </button>
        ))}
      </div>
      <CalendarTimeline events={events} />
    </IntelShell>
  );
}
