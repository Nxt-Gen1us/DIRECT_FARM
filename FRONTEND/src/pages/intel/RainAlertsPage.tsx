import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IntelShell } from "../../components/intel/IntelShell";
import { AlertCard } from "../../components/intel/AlertCard";
import { rainAlerts } from "../../data/intel";
import type { WeatherAlert } from "../../lib/types";

const filters: Array<{ id: "all" | WeatherAlert["severity"] | "rain"; label: string }> = [
  { id: "all", label: "intel.all" },
  { id: "warning", label: "intel.sev.warning" },
  { id: "watch", label: "intel.sev.watch" },
  { id: "rain", label: "intel.rainOnly" },
];

export function RainAlertsPage() {
  const { t } = useTranslation();
  const [f, setF] = useState<(typeof filters)[number]["id"]>("all");
  const list = rainAlerts.filter((a) => {
    if (f === "all") return true;
    if (f === "rain") return a.kind === "rain";
    return a.severity === f;
  });

  return (
    <IntelShell title={t("intel.rainTitle")} lede={t("intel.rainLede")}>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setF(item.id)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              f === item.id ? "bg-primary text-accent" : "border border-line bg-canvas text-ink-soft"
            }`}
          >
            {t(item.label)}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((a) => (
          <AlertCard key={a.id} alert={a} />
        ))}
      </div>
    </IntelShell>
  );
}
