import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IntelShell } from "../../components/intel/IntelShell";
import { SchemeCard } from "../../components/intel/SchemeCard";
import { govSchemes } from "../../data/intel";
import type { SchemeLevel } from "../../lib/types";

export function SchemesPage() {
  const { t } = useTranslation();
  const [level, setLevel] = useState<SchemeLevel | "all">("all");
  const [q, setQ] = useState("");
  const list = govSchemes.filter((s) => {
    if (level !== "all" && s.level !== level) return false;
    if (!q.trim()) return true;
    const hay = `${s.name} ${s.short} ${s.tags.join(" ")} ${s.states.join(" ")}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <IntelShell title={t("intel.schemeTitle")} lede={t("intel.schemeLede")}>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(["all", "central", "state"] as const).map((lv) => (
          <button
            key={lv}
            type="button"
            onClick={() => setLevel(lv)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              level === lv ? "bg-primary text-accent" : "border border-line bg-canvas text-ink-soft"
            }`}
          >
            {lv === "all" ? t("intel.all") : t(`intel.level.${lv}`)}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("intel.searchScheme")}
          className="ml-auto min-w-[200px] flex-1 rounded-full border border-line bg-canvas px-4 py-2 text-sm outline-none"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <SchemeCard key={s.id} scheme={s} />
        ))}
      </div>
    </IntelShell>
  );
}
