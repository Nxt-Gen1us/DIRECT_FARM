import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../../app/providers/AppProviders";
import { productById } from "../../data/products";
import { ProductCard } from "../../components/marketplace/ProductCard";
import { CompareBar } from "../../components/marketplace/CompareBar";
import { Button, EmptyState } from "../../components/ui";

export function WishlistPage() {
  const { t } = useTranslation();
  const { wishlist, addToCart } = useApp();
  const lots = wishlist.map((id) => productById(id)).filter(Boolean);

  return (
    <div className="container-app py-10 pb-28">
      <p className="text-xs uppercase tracking-[0.2em] text-secondary">{t("shop.kicker")}</p>
      <h1 className="mt-1 font-display text-4xl">{t("shop.wishTitle")}</h1>
      <p className="mt-2 text-sm text-ink-soft">{t("shop.wishLede")}</p>
      {lots.length === 0 ? (
        <EmptyState
          title={t("shop.wishEmpty")}
          action={
            <Link to="/market">
              <Button>{t("flow.shop")}</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="mt-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => lots.forEach((p) => p && addToCart(p.id, p.minQty))}
            >
              {t("shop.addAll")}
            </Button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lots.map((p) => p && <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
      <CompareBar />
    </div>
  );
}
