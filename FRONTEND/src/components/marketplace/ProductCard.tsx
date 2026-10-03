import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf, MapPin, Plus, Star } from "lucide-react";
import { WishButton } from "./WishButton";
import type { Product } from "../../lib/types";
import { farmerById } from "../../data/farmers";
import { formatUnit, inr, km } from "../../lib/format";
import { daysSinceHarvest, freshnessKey } from "../../lib/market";
import { useApp } from "../../app/providers/AppProviders";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const { addToCart, role } = useApp();
  const farmer = farmerById(product.farmerId);
  const days = daysSinceHarvest(product.harvestedOn);
  const fresh = freshnessKey(days);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line/70 bg-card shadow-[0_16px_32px_-22px_rgba(17,24,39,0.35)] transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_20px_38px_-22px_rgba(77,124,68,0.4)]">
      <Link to={`/market/${product.id}`} className="relative block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.organic && (
            <Badge tone="nature">
              <Leaf size={11} /> {t("common.organic")}
            </Badge>
          )}
          <Badge tone={fresh === "today" || fresh === "week" ? "secondary" : "muted"}>
            {t(`market.freshness.${fresh}`)}
          </Badge>
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {role === "customer" && <WishButton productId={product.id} />}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-canvas/95 px-2 py-0.5 text-xs font-medium text-ink shadow-sm">
          <Star size={11} className="mr-1 inline fill-secondary text-secondary" />
          {product.rating}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link to={`/market/${product.id}`} className="font-display text-lg leading-snug text-ink hover:text-primary">
            {product.nameKey?.startsWith("products.") ? t(product.nameKey) : product.name}
          </Link>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <MapPin size={11} /> {product.origin} · {km(product.distanceKm)}
          </p>
        </div>

        <Link to={`/farmers/${product.farmerId}`} className="flex items-center gap-2.5">
          <img src={farmer?.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          <span className="min-w-0">
            <span className="block truncate text-xs font-medium text-ink">{farmer?.name}</span>
            <span className="block truncate text-[11px] text-muted">{farmer?.farmName}</span>
          </span>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-display text-xl text-primary">{inr(product.price)}</p>
            <p className="text-[11px] text-muted">{t("market.per")} {formatUnit(product.unit)}</p>
          </div>

          <div className="flex items-center gap-1.5">
            {role === "customer" ? (
              <Button
                variant="secondary"
                className="px-3 py-2"
                onClick={() => addToCart(product.id, product.minQty)}
              >
                <Plus size={14} /> {t("market.add")}
              </Button>
            ) : (
              <Link to={`/market/${product.id}`} className="text-sm font-medium text-primary hover:underline">
                {t("common.open")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
