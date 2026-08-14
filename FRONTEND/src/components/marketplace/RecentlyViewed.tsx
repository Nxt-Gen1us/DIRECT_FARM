import { useTranslation } from "react-i18next";
import { useShop } from "../../app/providers/ShopProvider";
import { productById } from "../../data/products";
import { ProductCard } from "./ProductCard";

export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const { t } = useTranslation();
  const { viewed } = useShop();
  const lots = viewed
    .filter((id) => id !== exclude)
    .map((id) => productById(id))
    .filter(Boolean)
    .slice(0, 4);

  if (!lots.length) return null;

  return (
    <section className="mt-14">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">{t("shop.viewedKicker")}</p>
      <h2 className="mt-1 font-display text-3xl text-ink">{t("shop.viewed")}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lots.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
