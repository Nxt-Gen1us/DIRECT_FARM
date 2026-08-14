import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../app/providers/AppProviders";
import { cn } from "../../lib/cn";

export function WishButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const { toggleWish, wished } = useApp();
  const on = wished(productId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWish(productId);
      }}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border bg-canvas/95 text-ink shadow-sm",
        on ? "border-primary text-primary" : "border-line text-ink-soft",
        className,
      )}
      aria-label={on ? t("common.unsaveLot") : t("common.saveLot")}
    >
      <Heart size={14} className={on ? "fill-primary" : ""} />
    </button>
  );
}
