import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Columns2, X } from "lucide-react";
import { useShop } from "../../app/providers/ShopProvider";
import { productById } from "../../data/products";
import { Button } from "../ui";

export function CompareBar() {
  const { t } = useTranslation();
  const { compare, toggleCompare, clearCompare } = useShop();
  if (!compare.length) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 px-4 py-3 shadow-[0_-12px_30px_-18px_rgb(36_22_16_/_0.35)] backdrop-blur">
      <div className="container-app flex flex-wrap items-center gap-3">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-secondary">
          <Columns2 size={12} /> {t("shop.compare")} · {compare.length}/4
        </p>
        <div className="flex flex-1 flex-wrap gap-2">
          {compare.map((id) => {
            const p = productById(id);
            if (!p) return null;
            return (
              <span key={id} className="inline-flex items-center gap-2 rounded-full bg-cream-deep pl-1 pr-2 py-1 text-xs">
                <img src={p.image} alt="" className="h-6 w-6 rounded-full object-cover" />
                {p.name}
                <button type="button" onClick={() => toggleCompare(id)} aria-label={t("flow.remove")}>
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
        <Link to="/compare">
          <Button size="sm" disabled={compare.length < 2}>
            {t("shop.openCompare")}
          </Button>
        </Link>
        <Button size="sm" variant="ghost" onClick={clearCompare}>
          {t("shop.clear")}
        </Button>
      </div>
    </div>
  );
}
