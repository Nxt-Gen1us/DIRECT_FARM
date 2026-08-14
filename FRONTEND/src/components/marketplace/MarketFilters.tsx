import { useTranslation } from "react-i18next";
import { SlidersHorizontal, X } from "lucide-react";
import { farmers } from "../../data/farmers";
import type { MarketFilters as Filters, FreshBand } from "../../lib/market";
import { Checkbox, Select } from "../ui";
import { Button } from "../ui/Button";

export function MarketFilters({
  value,
  onChange,
  onReset,
  open,
  onToggle,
}: {
  value: Filters;
  onChange: (next: Partial<Filters>) => void;
  onReset: () => void;
  open: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const freshOpts: FreshBand[] = ["any", "today", "3d", "7d"];

  return (
    <div className="rounded-[1.25rem] border border-line/70 bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium text-ink">
          <SlidersHorizontal size={16} className="text-secondary" />
          {t("market.filters")}
        </p>
        <button type="button" className="lg:hidden text-sm text-primary" onClick={onToggle}>
          {open ? t("common.close") : t("market.filters")}
        </button>
      </div>

      <div className={`${open ? "mt-4 grid" : "hidden"} gap-4 lg:mt-4 lg:grid`}>
        <Checkbox
          label={t("market.organic")}
          checked={value.organic}
          onChange={(e) => onChange({ organic: e.target.checked, page: 1 })}
        />
        <Checkbox
          label={t("market.inStock")}
          checked={value.inStock}
          onChange={(e) => onChange({ inStock: e.target.checked, page: 1 })}
        />

        <label className="block text-xs font-medium uppercase tracking-wider text-muted">
          {t("market.farmer")}
          <Select
            className="mt-1.5"
            value={value.farmerId}
            onChange={(e) => onChange({ farmerId: e.target.value, page: 1 })}
          >
            <option value="">{t("market.anyFarmer")}</option>
            {farmers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} · {f.district}
              </option>
            ))}
          </Select>
        </label>

        <fieldset>
          <legend className="text-xs font-medium uppercase tracking-wider text-muted">
            {t("market.freshLabel")}
          </legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {freshOpts.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ fresh: opt, page: 1 })}
                className={`rounded-full px-3 py-1 text-xs ${
                  value.fresh === opt ? "bg-primary text-accent" : "border border-line bg-canvas"
                }`}
              >
                {t(`market.freshBand.${opt}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block text-xs font-medium uppercase tracking-wider text-muted">
          {t("market.distance")} · {value.maxKm >= 2000 ? t("market.anyDistance") : `${value.maxKm} km`}
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={value.maxKm}
            onChange={(e) => onChange({ maxKm: Number(e.target.value), page: 1 })}
            className="mt-2 w-full accent-primary"
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wider text-muted">
          {t("market.price")} · ₹{value.minPrice}–₹{value.maxPrice}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              max={value.maxPrice}
              value={value.minPrice}
              onChange={(e) => onChange({ minPrice: Number(e.target.value), page: 1 })}
              className="w-full rounded-2xl border border-line bg-canvas px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={value.minPrice}
              max={2000}
              value={value.maxPrice}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value), page: 1 })}
              className="w-full rounded-2xl border border-line bg-canvas px-3 py-2 text-sm"
            />
          </div>
        </label>

        <Button type="button" variant="ghost" className="w-full" onClick={onReset}>
          <X size={14} /> {t("market.reset")}
        </Button>
      </div>
    </div>
  );
}
