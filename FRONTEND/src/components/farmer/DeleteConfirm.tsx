import { useTranslation } from "react-i18next";
import { Button } from "../ui";

export function DeleteConfirm({
  name,
  onCancel,
  onConfirm,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4">
      <div className="w-full max-w-md rounded-[1.25rem] border border-line bg-card p-6 shadow-[0_20px_50px_-24px_rgb(36_22_16_/_0.4)]">
        <p className="text-xs uppercase tracking-wider text-secondary">{t("manage.delete")}</p>
        <h2 className="mt-1 font-display text-2xl">{t("manage.deleteTitle")}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t("manage.deleteBody", { name })}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>
            {t("common.close")}
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            {t("manage.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
