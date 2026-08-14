import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import type { Language } from "../../lib/types";
import { cn } from "../../lib/cn";

export function LanguageSwitcher({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useLanguage();

  return (
    <label className={cn("inline-flex items-center gap-1.5", className)}>
      <Globe size={14} className="shrink-0 text-muted" aria-hidden />
      <span className="sr-only">{t("common.language")}</span>
      <select
        aria-label={t("common.language")}
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className={cn(
          "rounded-full border border-line bg-canvas text-ink-soft outline-none focus:border-primary/40 focus:ring-2 focus:ring-accent",
          compact ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm",
        )}
      >
        {languages.map((lng) => (
          <option key={lng} value={lng}>
            {compact ? t(`langShort.${lng}`) : t(`lang.${lng}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
