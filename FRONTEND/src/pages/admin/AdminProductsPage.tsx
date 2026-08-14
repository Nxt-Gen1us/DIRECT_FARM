import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { products } from "../../data/products";
import { farmerById } from "../../data/farmers";
import { inr } from "../../lib/format";
import { Badge } from "../../components/ui/Badge";
import { DeskTable } from "../../components/admin/DeskTable";
import type { ProductCategory } from "../../lib/types";

export function AdminProductsPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ProductCategory | "all">("all");
  const list = useMemo(() => {
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      const hay = `${p.name} ${p.variety} ${p.origin}`.toLowerCase();
      return !q.trim() || hay.includes(q.trim().toLowerCase());
    });
  }, [q, cat]);

  return (
    <div>
      <h2 className="font-display text-3xl">{t("desk.products")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.productsLede")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("desk.searchLots")}
          className="min-w-[200px] flex-1 rounded-full border border-line bg-canvas px-4 py-2 text-sm outline-none"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as ProductCategory | "all")}
          className="rounded-full border border-line bg-canvas px-3 py-2 text-sm"
        >
          <option value="all">{t("desk.allCats")}</option>
          {["vegetables", "fruits", "grains", "spices", "dairy", "pulses"].map((c) => (
            <option key={c} value={c}>
              {t(`categories.${c}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-5">
        <DeskTable
          head={[t("desk.col.lot"), t("desk.col.farm"), t("desk.col.price"), t("desk.col.stock"), t("desk.col.flags")]}
        >
          {list.map((p) => {
            const f = farmerById(p.farmerId);
            return (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <Link to={`/market/${p.id}`} className="flex items-center gap-2 hover:text-primary">
                    <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span>
                      <span className="block font-medium">{p.name}</span>
                      <span className="block text-[11px] text-muted">{p.variety}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">{f?.farmName}</td>
                <td className="px-4 py-3">
                  {inr(p.price)} / {p.unit}
                </td>
                <td className="px-4 py-3">
                  {p.stock} {p.unit}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.organic && <Badge tone="nature">{t("common.organic")}</Badge>}
                    {p.stock < 80 && <Badge tone="secondary">{t("desk.low")}</Badge>}
                  </div>
                </td>
              </tr>
            );
          })}
        </DeskTable>
      </div>
    </div>
  );
}
