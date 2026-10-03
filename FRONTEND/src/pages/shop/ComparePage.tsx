import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useApp } from "../../app/providers/AppProviders";
import { useShop } from "../../app/providers/ShopProvider";
import { productById } from "../../data/products";
import { farmerById } from "../../data/farmers";
import { daysSinceHarvest, freshnessKey } from "../../lib/market";
import { formatDate, formatUnit, inr, km } from "../../lib/format";
import { Badge, Button, EmptyState } from "../../components/ui";

export function ComparePage() {
  const { t } = useTranslation();
  const { compare, toggleCompare, clearCompare } = useShop();
  const { addToCart } = useApp();
  const lots = compare.map((id) => productById(id)).filter(Boolean);

  if (lots.length < 2) {
    return (
      <div className="container-app py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">{t("shop.kicker")}</p>
        <h1 className="mt-1 font-display text-4xl">{t("shop.compareTitle")}</h1>
        <EmptyState
          title={t("shop.compareNeed")}
          action={
            <Link to="/market">
              <Button>{t("flow.shop")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const fields = [
    { k: t("shop.col.price"), v: (id: string) => inr(productById(id)!.price) },
    { k: t("shop.col.unit"), v: (id: string) => formatUnit(productById(id)!.unit) },
    { k: t("shop.col.farm"), v: (id: string) => farmerById(productById(id)!.farmerId)?.farmName ?? "—" },
    { k: t("shop.col.origin"), v: (id: string) => productById(id)!.origin },
    { k: t("shop.col.km"), v: (id: string) => km(productById(id)!.distanceKm) },
    { k: t("shop.col.harvest"), v: (id: string) => formatDate(productById(id)!.harvestedOn) },
    {
      k: t("shop.col.fresh"),
      v: (id: string) => t(`market.freshness.${freshnessKey(daysSinceHarvest(productById(id)!.harvestedOn))}`),
    },
    { k: t("shop.col.organic"), v: (id: string) => (productById(id)!.organic ? t("common.organic") : "—") },
    { k: t("shop.col.rating"), v: (id: string) => String(productById(id)!.rating) },
    { k: t("shop.col.stock"), v: (id: string) => `${productById(id)!.stock} ${formatUnit(productById(id)!.unit)}` },
    { k: t("shop.col.variety"), v: (id: string) => productById(id)!.variety },
  ];

  return (
    <div className="container-app py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">{t("shop.kicker")}</p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{t("shop.compareTitle")}</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCompare}>
          {t("shop.clear")}
        </Button>
      </div>
      <div className="mt-4 rounded-[1.2rem] border border-secondary/25 bg-secondary-soft px-4 py-3 text-xs text-secondary-dark">
        DIRECT FARM · side-by-side comparison
      </div>
      <div className="mt-8 overflow-x-auto rounded-[1.4rem] border border-line/70 bg-card p-2">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr>
              <th className="w-36 p-3 text-xs uppercase tracking-wider text-muted">{t("shop.lot")}</th>
              {lots.map((p) => (
                <th key={p!.id} className="p-3 align-top">
                  <div className="relative rounded-2xl border border-line/70 bg-canvas p-3">
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-muted"
                      onClick={() => toggleCompare(p!.id)}
                    >
                      <X size={14} />
                    </button>
                    <img src={p!.image} alt="" className="h-28 w-full rounded-2xl object-cover" />
                    <Link to={`/market/${p!.id}`} className="mt-2 block font-display text-lg text-ink hover:text-primary">
                      {p!.name}
                    </Link>
                    <Badge tone="muted">{t(`categories.${p!.category}`)}</Badge>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((row) => (
              <tr key={row.k} className="border-t border-line">
                <th className="p-3 text-xs font-medium uppercase tracking-wider text-muted">{row.k}</th>
                {lots.map((p) => (
                  <td key={p!.id} className="p-3 text-ink-soft">
                    {row.v(p!.id)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-line">
              <th />
              {lots.map((p) => (
                <td key={p!.id} className="p-3">
                  <Button size="sm" onClick={() => addToCart(p!.id, p!.minQty)}>
                    {t("market.add")}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
