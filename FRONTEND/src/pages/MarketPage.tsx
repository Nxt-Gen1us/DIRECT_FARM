import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronDown, Filter, Leaf, Search, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { products as mockProducts, categories as fallbackCategories } from "../data/products";
import { farmerById } from "../data/farmers";
import { fetchProductCategories, fetchProducts } from "../lib/api/products";
import { apiConfigured } from "../lib/api";
import type { Product, ProductCategory } from "../lib/types";
import { ProductCard } from "../components/marketplace/ProductCard";
import { CategoryStrip } from "../components/marketplace/CategoryStrip";
import { EmptyState } from "../components/ui";
import { Button } from "../components/ui/Button";
import { useApp } from "../app/providers/AppProviders";
import "../styles/market-redesign.css";

const PAGE_SIZE = 12;
type SortOption = "newest" | "priceAsc" | "priceDesc" | "fresh" | "name";

export function MarketPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const { role } = useApp();
  const category = params.get("cat") ?? "";
  const farmerId = params.get("farmer") ?? "";
  const searchTerm = params.get("q") ?? "";
  const sort = (params.get("sort") as SortOption | null) ?? "newest";
  const page = Math.max(1, Number(params.get("page") ?? 1) || 1);
  const organicOnly = params.get("organic") === "1";
  const [query, setQuery] = useState(searchTerm);
  const [realProducts, setRealProducts] = useState<Product[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => setQuery(searchTerm), [searchTerm]);
  useEffect(() => {
    if (!apiConfigured()) return;
    let cancelled = false;
    setLoading(true); setLoadFailed(false);
    Promise.all([fetchProducts({ search: searchTerm, category, isOrganic: organicOnly, available: true, limit: 100 }), fetchProductCategories()])
      .then(([loaded, categories]) => { if (!cancelled) { setRealProducts(loaded); setCategoryIds(categories); } })
      .catch(() => { if (!cancelled) { setRealProducts([]); setLoadFailed(true); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [category, organicOnly, searchTerm]);

  const categoryOptions = useMemo(() => {
    const ids = categoryIds.length ? categoryIds : fallbackCategories.map((item) => item.id);
    return ids.map((id) => ({ id, image: fallbackCategories.find((item) => item.id === id)?.image }));
  }, [categoryIds]);
  const listings = useMemo(() => {
    const source = apiConfigured() && !loadFailed ? realProducts : mockProducts;
    const term = searchTerm.trim().toLowerCase();
    return source.filter((product) => product.stock > 0).filter((product) => {
      const farmer = farmerById(product.farmerId);
      const searchable = `${product.name} ${product.variety} ${product.origin} ${farmer?.name ?? ""} ${farmer?.farmName ?? ""}`.toLowerCase();
      return (!term || searchable.includes(term)) && (!category || product.category === category) && (!farmerId || product.farmerId === farmerId) && (!organicOnly || product.organic);
    }).sort((left, right) => sort === "priceAsc" ? left.price - right.price : sort === "priceDesc" ? right.price - left.price : sort === "name" ? left.name.localeCompare(right.name) : sort === "fresh" ? right.harvestedOn.localeCompare(left.harvestedOn) : right.rating - left.rating);
  }, [category, farmerId, loadFailed, organicOnly, realProducts, searchTerm, sort]);
  const pageCount = Math.max(1, Math.ceil(listings.length / PAGE_SIZE));
  const visibleListings = listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const updateParams = (updates: Record<string, string | null>) => { const next = new URLSearchParams(params); Object.entries(updates).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key)); setParams(next, { replace: true }); };
  const submitSearch = (event: FormEvent) => { event.preventDefault(); updateParams({ q: query.trim() || null, page: "1" }); };
  const selectCategory = (value: ProductCategory | "") => updateParams({ cat: value || null, page: "1" });
  const clearFilters = () => setParams(new URLSearchParams(), { replace: true });

  return <div className="market-redesign pb-16">
    <section className="market-hero"><div className="container-app market-hero-inner"><div className="market-hero-copy"><p className="market-eyebrow"><Leaf size={15} /> {t("marketplaceUi.eyebrow")}</p><h1>{t("marketplaceUi.title")}</h1><p className="market-hero-body">{t("marketplaceUi.body")}</p>{role === "farmer" && <Link to="/farmer/products/new" className="market-hero-link">{t("marketplaceUi.sellHarvest")} <ArrowRight size={16} /></Link>}</div><div className="market-hero-note"><span className="market-hero-note-line" /><p>{t("marketplaceUi.from")} {t("marketplaceUi.farmer")}</p><strong>ખેતરથી સીધું</strong><small>ભાવ, સ્થળ અને ઉપલબ્ધતાની સ્પષ્ટ માહિતી</small></div></div></section>
    <section className="container-app market-tools"><form onSubmit={submitSearch} className="market-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("marketplaceUi.searchPlaceholder")} aria-label={t("marketplaceUi.searchPlaceholder")} /><button type="submit">{t("marketplaceUi.searchButton")}</button></form><div className="market-browse-heading"><div><p className="market-eyebrow">{t("marketplaceUi.browseBy")}</p><h2>{t("marketplaceUi.allProducts")}</h2></div><SlidersHorizontal size={19} className="text-primary" /></div><CategoryStrip value={category} onChange={selectCategory} categories={categoryOptions} /></section>
    <section className="container-app market-results"><div className="market-result-bar"><div><p className="market-eyebrow">DIRECT FARM</p><h2>{t("marketplaceUi.resultCount", { count: listings.length })}</h2></div><div className="market-mobile-filter"><Filter size={16} /> {t("marketplaceUi.filterTitle")}</div></div><div className="market-shop-layout"><aside className="market-filters"><div className="market-filter-heading"><h3>{t("marketplaceUi.filterTitle")}</h3><button type="button" onClick={clearFilters}>{t("marketplaceUi.clearFilters")}</button></div><div className="market-filter-block"><p>{t("marketplaceUi.categoryFilter")}</p><button type="button" className={!category ? "selected" : ""} onClick={() => selectCategory("")}>{t("marketplaceUi.allProducts")}</button>{categoryOptions.map((item) => <button key={item.id} type="button" className={category === item.id ? "selected" : ""} onClick={() => selectCategory(item.id as ProductCategory)}>{t(`categories.${item.id}`)}</button>)}</div><div className="market-filter-block"><p>{t("marketplaceUi.qualityFilter")}</p><label><input type="checkbox" checked={organicOnly} onChange={(event) => updateParams({ organic: event.target.checked ? "1" : null, page: "1" })} /> {t("marketplaceUi.organicOnly")}</label></div></aside><div className="market-products-area"><div className="market-controls"><label className="market-sort"><span>{t("marketplaceUi.sortLabel")}</span><select value={sort} onChange={(event) => updateParams({ sort: event.target.value, page: "1" })}><option value="newest">{t("marketplaceUi.newest")}</option><option value="priceAsc">{t("marketplaceUi.lowPrice")}</option><option value="priceDesc">{t("marketplaceUi.highPrice")}</option><option value="fresh">{t("marketplaceUi.freshest")}</option><option value="name">{t("marketplaceUi.name")}</option></select><ChevronDown size={15} /></label></div>{loading ? <EmptyState title={t("marketplaceUi.loading")} /> : visibleListings.length === 0 ? <EmptyState title={t("marketplaceUi.empty")} /> : <><div className="market-grid">{visibleListings.map((product) => <ProductCard key={product.id} product={product} />)}</div>{pageCount > 1 && <div className="market-pagination"><Button variant="secondary" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>{t("marketplaceUi.previous")}</Button><span>{page} / {pageCount}</span><Button variant="secondary" disabled={page >= pageCount} onClick={() => updateParams({ page: String(page + 1) })}>{t("marketplaceUi.next")}</Button></div>}</>}</div></div></section>
  </div>;
}
