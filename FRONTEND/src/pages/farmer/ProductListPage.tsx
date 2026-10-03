import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PencilLine, Plus, Search } from "lucide-react";
import { useInventory } from "../../app/providers/InventoryProvider";
import { Button } from "../../components/ui";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { formatUnit, inr } from "../../lib/format";

export function ProductListPage() {
  const { t } = useTranslation();
  const { listings } = useInventory();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return listings;
    return listings.filter((p) =>
      `${p.name} ${p.variety} ${p.qrCode}`.toLowerCase().includes(key),
    );
  }, [listings, q]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">DIRECT FARM</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-display text-ink">{t("farmerProducts.title")}</h1>
        </div>

        <Link to="/farmer/products/new">
          <Button size="lg">
            <Plus size={18} />
            {t("farmerHome.quickAddProduct")}
          </Button>
        </Link>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex items-center rounded-2xl border border-line bg-canvas px-4 py-3">
          <Search size={18} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("farmerProducts.searchPlaceholder")}
            className="ml-3 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-canvas p-10 text-center text-ink-soft">
            {t("manage.empty")}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <Card key={p.id} className="overflow-hidden p-0">
                <img src={p.image} alt={p.name} className="h-44 w-full object-cover" />
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl text-ink">{p.name}</p>
                      {p.variety && <p className="text-xs text-muted">{p.variety}</p>}
                    </div>
                    <Badge tone={p.active ? "nature" : "muted"}>
                      {p.active ? t("farmerProducts.statusAvailable") : t("farmerProducts.status")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-canvas p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{t("farmerProducts.price")}</p>
                      <p className="mt-1 font-medium text-primary">{inr(p.price)}</p>
                    </div>
                    <div className="rounded-xl bg-canvas p-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{t("farmerProducts.available")}</p>
                      <p className="mt-1 font-medium text-ink">{p.stock} {formatUnit(p.unit)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <Link to={`/farmer/products/${p.id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10">
                      <PencilLine size={14} />
                      {t("farmerProducts.edit")}
                    </Link>
                    <span className="text-xs text-muted">{p.active ? "Online" : "Offline"}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
