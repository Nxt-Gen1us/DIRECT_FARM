import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IntelShell } from "../../components/intel/IntelShell";
import { ReminderCard } from "../../components/intel/ReminderCard";
import { fieldReminders } from "../../data/intel";
import type { ReminderKind } from "../../lib/types";

const tabs: Array<ReminderKind | "all"> = ["all", "fertilizer", "harvest", "spray", "irrigate"];

export function RemindersPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const list = fieldReminders.filter((r) => (tab === "all" ? true : r.kind === tab));
  const fert = list.filter((r) => r.kind === "fertilizer").length;
  const harv = list.filter((r) => r.kind === "harvest").length;

  return (
    <IntelShell title={t("intel.remTitle")} lede={t("intel.remLede")}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`rounded-full px-3 py-1.5 text-xs ${
                tab === k ? "bg-primary text-accent" : "border border-line bg-canvas text-ink-soft"
              }`}
            >
              {k === "all" ? t("intel.all") : t(`intel.rkind.${k}`)}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">
          {fert} {t("intel.rkind.fertilizer")} · {harv} {t("intel.rkind.harvest")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <ReminderCard key={item.id} item={item} />
        ))}
      </div>
    </IntelShell>
  );
}
