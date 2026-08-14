import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";

export function DemoBanner({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  return (
    <p
      className={`flex items-start gap-2 rounded-2xl border border-secondary/30 bg-secondary-soft text-secondary-dark ${
        compact ? "px-3 py-2 text-[11px]" : "px-4 py-3 text-xs"
      }`}
    >
      <ShieldAlert size={compact ? 14 : 16} className="mt-0.5 shrink-0" />
      <span>{t("aiDesk.disclaimer")}</span>
    </p>
  );
}
