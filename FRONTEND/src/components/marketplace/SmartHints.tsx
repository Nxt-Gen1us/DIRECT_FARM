import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { useApp } from "../../app/providers/AppProviders";
import { useShop } from "../../app/providers/ShopProvider";
import { smartHints } from "../../lib/shop";
import { inr } from "../../lib/format";
import { Button } from "../ui";

export function SmartHints() {
  const { t } = useTranslation();
  const { cart, addToCart } = useApp();
  const { viewed } = useShop();
  const hints = smartHints(cart, viewed);
  if (!hints.length) return null;

  return (
    <div className="mt-6">
      <p className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider text-secondary">
        <Sparkles size={12} /> {t("shop.smart")}
      </p>
      <ul className="space-y-2">
        {hints.map((h) => (
          <li key={h.product.id} className="flex items-center gap-3 rounded-2xl border border-line bg-canvas p-2">
            <img src={h.product.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <Link to={`/market/${h.product.id}`} className="block truncate text-sm font-medium hover:text-primary">
                {h.product.name}
              </Link>
              <p className="text-[11px] text-muted">{t(`shop.reason.${h.reason}`)}</p>
            </div>
            <span className="text-xs font-medium">{inr(h.product.price)}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addToCart(h.product.id, h.product.minQty)}
            >
              {t("market.add")}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
