import { useTranslation } from "react-i18next";

export function TypingDots({ name }: { name?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-end gap-2 px-1">
      <span className="flex h-8 items-center gap-1 rounded-2xl rounded-bl-md bg-cream-deep px-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
      </span>
      <span className="pb-1 text-[11px] text-muted">
        {name ? t("radio.typingNamed", { name }) : t("radio.typing")}
      </span>
    </div>
  );
}
