import { Columns2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShop } from "../../app/providers/ShopProvider";
import { cn } from "../../lib/cn";

export function CompareToggle({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const { toggleCompare, inCompare } = useShop();
  const on = inCompare(productId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(productId);
      }}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border bg-canvas/95 shadow-sm",
        on ? "border-nature text-nature" : "border-line text-ink-soft",
        className,
      )}
      aria-label={on ? t("common.uncompareLot") : t("common.compareLot")}
    >
      <Columns2 size={14} />
    </button>
  );
}
