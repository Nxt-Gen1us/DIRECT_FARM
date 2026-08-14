import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Search } from "lucide-react";
import { useInventory } from "../../app/providers/InventoryProvider";
import { ManageProductCard } from "../../components/farmer/ManageProductCard";
import { DeleteConfirm } from "../../components/farmer/DeleteConfirm";
import { Button } from "../../components/ui";
import type { ManagedProduct } from "../../lib/inventory";

export function ProductListPage() {
  const { t } = useTranslation();
  const { listings, deleteListing, toggleActive } = useInventory();
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<ManagedProduct | null>(null);

  const list = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return listings;
    return listings.filter((p) =>
      `${p.name} ${p.variety} ${p.qrCode}`.toLowerCase().includes(key),
    );
  }, [listings, q]);

  return (
    <div>
      <section className="border-b border-line bg-canvas">
        <div className="container-app flex flex-wrap items-end justify-between gap-4 py-8 md:py-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
              {t("nav.farmer")}
            </p>
            <h1 className="mt-1 font-display text-4xl text-ink">{t("manage.title")}</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">{t("manage.subtitle")}</p>
          </div>
          <Link to="/farmer/products/new">
            <Button>
              <Plus size={16} /> {t("manage.add")}
            </Button>
          </Link>
        </div>
      </section>

      <div className="container-app py-8">
        <div className="mb-6 flex items-center rounded-full border border-line bg-canvas px-4 py-2">
          <Search size={16} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("manage.search")}
            className="ml-2 w-full bg-transparent text-sm outline-none"
          />
        </div>

        {list.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-canvas p-10 text-center text-ink-soft">
            {t("manage.empty")}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => (
              <ManageProductCard
                key={p.id}
                product={p}
                onToggle={() => toggleActive(p.id)}
                onDelete={() => setPending(p)}
              />
            ))}
          </div>
        )}
      </div>

      {pending && (
        <DeleteConfirm
          name={pending.name}
          onCancel={() => setPending(null)}
          onConfirm={() => {
            deleteListing(pending.id);
            setPending(null);
          }}
        />
      )}
    </div>
  );
}
