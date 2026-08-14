import { useTranslation } from "react-i18next";

export function ConfidenceBar({ value, demo = true }: { value: number; demo?: boolean }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-muted">
        <span>
          {t("aiDesk.confidence")}
          {demo ? ` · ${t("aiDesk.demoTag")}` : ""}
        </span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-cream-deep">
        <div className="h-full rounded-full bg-nature" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
