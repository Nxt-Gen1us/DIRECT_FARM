import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  PackageCheck,
  Plus,
  TrendingUp,
  Wallet,
  Wheat,
} from "lucide-react";
import { farmers } from "../../data/farmers";
import {
  FARMER_ID,
  farmerKpis,
  farmerOrders,
  pendingStatuses,
  farmerListings,
} from "../../data/farmerDesk";
import { compactInr, formatUnit, inr } from "../../lib/format";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { OrderStatus } from "../../lib/types";

export function FarmerDeskPage() {
  const { t } = useTranslation();
  const farmer = farmers.find((f) => f.id === FARMER_ID) ?? farmers[0];
  const [status] = useState<Record<string, OrderStatus>>(
    Object.fromEntries(farmerOrders.map((o) => [o.id, o.status]))
  );

  const pending = useMemo(
    () => farmerOrders.filter((o) => pendingStatuses.includes(status[o.id] ?? o.status)),
    [status]
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            DIRECT FARM
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display text-ink">
            {t("farmerHome.greeting", { name: farmer.name })}
          </h1>
          <p className="mt-2 text-sm text-ink-soft sm:text-base">
            {t("farmerHome.whatNext")}
          </p>
        </div>

        <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="p-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t("farmerHome.salesToday")}</p>
            <p className="mt-2 font-display text-xl text-primary">{compactInr(2450)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t("farmerHome.ordersToday")}</p>
            <p className="mt-2 font-display text-xl text-ink">8</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{t("farmerHome.productsForSale")}</p>
            <p className="mt-2 font-display text-xl text-ink">{farmerListings.length}</p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/farmer/products/new" className="block group">
          <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_30px_-20px_rgba(59,130,92,0.45)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Plus size={22} />
            </div>
            <p className="font-medium text-ink">{t("farmerHome.quickAddProduct")}</p>
            <p className="mt-1 text-sm text-muted">{t("farmerHome.quickAddProductSub")}</p>
          </Card>
        </Link>

        <Link to="/farmer/orders" className="block group">
          <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_30px_-20px_rgba(59,130,92,0.45)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <PackageCheck size={22} />
            </div>
            <p className="font-medium text-ink">{t("farmerHome.quickOrders")}</p>
            <p className="mt-1 text-sm text-muted">{t("farmerHome.quickOrdersSub", { count: pending.length })}</p>
          </Card>
        </Link>

        <Link to="/farmer/earnings" className="block group">
          <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_30px_-20px_rgba(59,130,92,0.45)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <Wallet size={22} />
            </div>
            <p className="font-medium text-ink">{t("farmerHome.quickEarnings")}</p>
            <p className="mt-1 text-sm text-muted">{compactInr(farmerKpis.profit)}</p>
          </Card>
        </Link>

        <Link to="/farmer/products" className="block group">
          <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_16px_30px_-20px_rgba(59,130,92,0.45)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-nature/20 text-nature-dark">
              <Wheat size={22} />
            </div>
            <p className="font-medium text-ink">{t("farmerHome.quickCrops")}</p>
            <p className="mt-1 text-sm text-muted">{t("farmerHome.quickCropsSub", { count: farmerListings.length })}</p>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-display text-ink">{t("farmerHome.todaysOrders")}</h2>
            <Link to="/farmer/orders" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              {t("common.viewAll")}
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {pending.length === 0 ? (
              <Card className="p-6 text-center text-sm text-muted">{t("orders.none")}</Card>
            ) : (
              pending.slice(0, 4).map((o) => {
                const st = status[o.id] ?? o.status;
                const firstItem = o.items[0];
                return (
                  <Card key={o.id} className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-display text-lg text-ink">{firstItem?.name || o.id}</p>
                          <span className="text-xs text-muted">{firstItem?.qty} {firstItem?.unit && formatUnit(firstItem.unit)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {t("farmerHome.customer")}: {o.buyerName}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                          <MapPin size={12} />
                          {t("farmerOrders.awayKm", { distance: "4.2" })}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <p className="font-display text-lg text-primary">{inr(o.total)}</p>
                        <Badge tone={st === "pending" ? "secondary" : "nature"}>
                          {st === "pending" ? t("farmerHome.statusPending") : t(`orders.status.${st}`)}
                        </Badge>
                        <Link to={`/farmer/orders/${o.id}`}>
                          <Button size="sm" variant="ghost" className="w-full sm:w-auto">
                            {t("farmerHome.viewOrder")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-display text-ink">{t("farmerHome.productsForSale")}</h2>
            <Link to="/farmer/products" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              {t("common.viewAll")}
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {farmerListings.slice(0, 4).map((p) => (
              <Card key={p.id} className="p-3">
                <div className="flex items-center gap-4">
                  <img src={p.image} alt={p.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{p.name}</p>
                    <p className="mt-1 text-sm font-medium text-primary">{inr(p.price)} / {formatUnit(p.unit)}</p>
                    <p className="mt-1 text-xs text-muted">{t("farmerProducts.available")}: {p.stock} {formatUnit(p.unit)}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone="nature">
                      {t("farmerProducts.statusAvailable")}
                    </Badge>
                    <div className="mt-2">
                      <Link to={`/farmer/products/${p.id}/edit`} className="inline-flex items-center gap-1 rounded-lg bg-canvas px-2 py-1 text-xs font-medium text-ink-soft hover:text-ink">
                        <BadgeCheck size={12} />
                        {t("farmerProducts.edit")}
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
