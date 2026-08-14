import { useTranslation } from "react-i18next";

export function QueueNote({ text }: { text: string }) {
  const { t } = useTranslation();
  return (
    <p className="mt-3 rounded-2xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">
      {text}
      <span className="mt-1 block text-[11px] text-nature">{t("plus.heldNote")}</span>
    </p>
  );
}
