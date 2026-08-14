import { useTranslation } from "react-i18next";
import { scoutShots } from "../../data/aiDesk";
import { cn } from "../../lib/cn";

export function ScoutPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
        {t("aiDesk.sampleShot")}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {scoutShots.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={cn(
              "overflow-hidden rounded-2xl border-2",
              value === s.id ? "border-primary" : "border-transparent",
            )}
          >
            <img src={s.src} alt={s.crop} className="h-16 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
