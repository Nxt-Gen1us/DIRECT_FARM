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
    <div className="container-app py-8 pb-28 sm:py-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">{t("shop.kicker")}</p>
      <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{t("shop.wishTitle")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">{t("shop.wishLede")}</p>
      <div className="mt-4 rounded-[1.2rem] border border-secondary/25 bg-secondary-soft px-4 py-3 text-xs text-secondary-dark">
        DIRECT FARM · {lots.length} {t("shop.wishTitle")}
      </div>
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
