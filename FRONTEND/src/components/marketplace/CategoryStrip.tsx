import { useTranslation } from "react-i18next";
import { categories } from "../../data/products";
import type { ProductCategory } from "../../lib/types";
import { cn } from "../../lib/cn";

export function CategoryStrip({
  value,
  onChange,
}: {
  value: ProductCategory | "";
  onChange: (cat: ProductCategory | "") => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onChange("")}
        className={cn(
          "shrink-0 rounded-2xl border px-4 py-3 text-sm",
          !value ? "border-primary bg-primary text-accent" : "border-line bg-canvas text-ink",
        )}
      >
        {t("market.allCats")}
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={cn(
            "relative h-20 w-36 shrink-0 overflow-hidden rounded-2xl text-left",
            value === c.id && "ring-2 ring-primary ring-offset-2 ring-offset-cream",
          )}
        >
          <img src={c.image} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
          <span className="absolute bottom-2 left-3 font-display text-sm text-canvas">
            {t(`categories.${c.id}`)}
          </span>
        </button>
      ))}
    </div>
  );
}
