import { useTranslation } from "react-i18next";

export function AuthDivider() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted">
      <span className="h-px flex-1 bg-line" />
      {t("auth.or")}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
