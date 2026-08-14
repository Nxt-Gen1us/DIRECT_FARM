import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Search } from "lucide-react";
import { products } from "../data/products";
import { farmerById } from "../data/farmers";
import type { ProductCategory } from "../lib/types";
import {
  PAGE_SIZE,
  daysSinceHarvest,
  defaultFilters,
  matchesFresh,
  type FreshBand,
  type MarketFilters,
  type SortKey,
} from "../lib/market";
import { ProductCard } from "../components/marketplace/ProductCard";
import { CategoryStrip } from "../components/marketplace/CategoryStrip";
import { MarketFilters as FilterPanel } from "../components/marketplace/MarketFilters";
import { Pagination } from "../components/marketplace/Pagination";
import { CompareBar } from "../components/marketplace/CompareBar";
import { RecentlyViewed } from "../components/marketplace/RecentlyViewed";
import { EmptyState, Select } from "../components/ui";

function readFilters(params: URLSearchParams): MarketFilters {
  const base = defaultFilters();
  const cat = params.get("cat") as ProductCategory | "";
  const sort = (params.get("sort") as SortKey) || base.sort;
  const fresh = (params.get("fresh") as FreshBand) || base.fresh;
  return {
    ...base,
    q: params.get("q") ?? "",
    cat: cat || "",
    farmerId: params.get("farmer") ?? "",
    organic: params.get("organic") === "1",
    inStock: params.get("stock") === "1",
    fresh,
    maxKm: Number(params.get("km") ?? base.maxKm),
    minPrice: Number(params.get("min") ?? base.minPrice),
    maxPrice: Number(params.get("max") ?? base.maxPrice),
    sort,
    page: Math.max(1, Number(params.get("page") ?? 1)),
  };
}

function writeFilters(f: MarketFilters) {
  const next = new URLSearchParams();
  if (f.q) next.set("q", f.q);
  if (f.cat) next.set("cat", f.cat);
  if (f.farmerId) next.set("farmer", f.farmerId);
  if (f.organic) next.set("organic", "1");
  if (f.inStock) next.set("stock", "1");
  if (f.fresh !== "any") next.set("fresh", f.fresh);
  if (f.maxKm < 2000) next.set("km", String(f.maxKm));
  if (f.minPrice > 0) next.set("min", String(f.minPrice));
  if (f.maxPrice < 2000) next.set("max", String(f.maxPrice));
  if (f.sort !== "popular") next.set("sort", f.sort);
  if (f.page > 1) next.set("page", String(f.page));
  return next;
}

export function MarketPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const [query, setQuery] = useState(filters.q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setQuery(filters.q), [filters.q]);

  const patch = (partial: Partial<MarketFilters>) => {
    setParams(writeFilters({ ...filters, ...partial }), { replace: true });
  };

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    let next = products.filter((p) => {
      const farmer = farmerById(p.farmerId);
      const hay = `${p.name} ${p.variety} ${p.origin} ${p.tags.join(" ")} ${farmer?.name ?? ""} ${farmer?.farmName ?? ""}`.toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (filters.cat && p.category !== filters.cat) return false;
      if (filters.organic && !p.organic) return false;
      if (filters.farmerId && p.farmerId !== filters.farmerId) return false;
      if (filters.inStock && p.stock <= 0) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (p.distanceKm > filters.maxKm) return false;
      if (!matchesFresh(daysSinceHarvest(p.harvestedOn), filters.fresh)) return false;
      return true;
    });
    next = [...next].sort((a, b) => {
      if (filters.sort === "priceAsc") return a.price - b.price;
      if (filters.sort === "priceDesc") return b.price - a.price;
      if (filters.sort === "fresh") return b.harvestedOn.localeCompare(a.harvestedOn);
      if (filters.sort === "distance") return a.distanceKm - b.distanceKm;
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });
    return next;
  }, [filters]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, filtered.length);
  const farmer = filters.farmerId ? farmerById(filters.farmerId) : null;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    patch({ q: query, page: 1 });
  };

  return (
    <div className="pb-24">
      <section className="border-b border-line bg-canvas">
        <div className="container-app py-8 md:py-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
            {t("market.kicker")}
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-4xl text-ink md:text-5xl">{t("market.title")}</h1>
              <p className="mt-2 max-w-2xl text-sm text-ink-soft">{t("market.subtitle")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link to="/wishlist" className="rounded-full bg-primary-soft px-3 py-1.5 text-primary">
                {t("shop.wishTitle")}
              </Link>
              <Link to="/compare" className="rounded-full bg-cream-deep px-3 py-1.5 text-ink-soft">
                {t("shop.compare")}
              </Link>
              <Link to="/box" className="rounded-full bg-nature-soft px-3 py-1.5 text-nature-dark">
                {t("shop.boxTitle")}
              </Link>
              <span className="flex items-center gap-1 text-muted">
                <MapPin size={12} /> {t("market.hub")}
              </span>
            </div>
          </div>
          <form
            onSubmit={onSearch}
            className="mt-6 flex items-center rounded-full border border-line bg-cream px-4 py-2"
          >
            <Search size={16} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("market.search")}
              aria-label={t("market.searchAria")}
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="mt-6">
            <CategoryStrip value={filters.cat} onChange={(cat) => patch({ cat, page: 1 })} />
          </div>
        </div>
      </section>

      <div className="container-app py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <FilterPanel
            value={filters}
            onChange={patch}
            onReset={() => setParams(new URLSearchParams(), { replace: true })}
            open={filtersOpen}
            onToggle={() => setFiltersOpen((v) => !v)}
          />

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">
                  {t("market.results", { count: filtered.length })}
                </p>
                <p className="text-xs text-muted">
                  {t("market.showing", { from, to, total: filtered.length })}
                  {farmer ? ` · ${farmer.farmName}` : ""}
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs text-muted">
                {t("market.sort")}
                <Select
                  value={filters.sort}
                  onChange={(e) => patch({ sort: e.target.value as SortKey, page: 1 })}
                  className="w-auto py-2"
                >
                  <option value="popular">{t("market.sortPopular")}</option>
                  <option value="priceAsc">{t("market.sortPrice")}</option>
                  <option value="priceDesc">{t("market.sortPriceDesc")}</option>
                  <option value="fresh">{t("market.sortFresh")}</option>
                  <option value="distance">{t("market.sortDistance")}</option>
                  <option value="name">{t("market.sortName")}</option>
                </Select>
              </label>
            </div>

            {slice.length === 0 ? (
              <EmptyState title={t("market.empty")} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {slice.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
            <Pagination page={page} pages={pages} onPage={(p) => patch({ page: p })} />
            <RecentlyViewed />
          </div>
        </div>
      </div>
      <CompareBar />
    </div>
  );
}
