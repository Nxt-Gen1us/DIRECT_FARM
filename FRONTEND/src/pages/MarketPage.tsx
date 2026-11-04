import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BadgeCheck, ChevronDown, Leaf, Search, ShieldCheck, ShoppingBasket, SlidersHorizontal, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { products as mockProducts, categories as fallbackCategories } from "../data/products";
import { farmerById } from "../data/farmers";
import { fetchProductCategories, fetchProducts } from "../lib/api/products";
import { apiConfigured } from "../lib/api";
import type { Product, ProductCategory } from "../lib/types";
import { ProductCard } from "../components/marketplace/ProductCard";
import { EmptyState } from "../components/ui";
import { Button } from "../components/ui/Button";
import { useApp } from "../app/providers/AppProviders";
import { PageTitle, SectionTitle } from "../components/ui/Typography";
import "../styles/market-redesign.css";

const PAGE_SIZE = 12;
type SortOption = "newest" | "priceAsc" | "priceDesc" | "fresh" | "name";
const vegetableShelf = [
  { id: "all", image: "/images/vegetables.jpg", key: "allVegetables" }, { id: "tomato", image: "/images/tomatoes.jpg", key: "tomato" },
  { id: "onion", image: "/images/onions.jpg", key: "onion" }, { id: "okra", image: "/images/okra.jpg", key: "okra" },
  { id: "spinach", image: "/images/spinach.jpg", key: "spinach" }, { id: "cauliflower", image: "/images/cauliflower.jpg", key: "cauliflower" },
  { id: "peas", image: "/images/peas.jpg", key: "peas" },
] as const;
const normalizeCategory = (value: unknown) => String(value ?? "").trim().toLowerCase();

export function MarketPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const { role, cart } = useApp();
  const category = normalizeCategory(params.get("cat") ?? "vegetables");
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
    const ids = categoryIds.length ? categoryIds.map(normalizeCategory) : fallbackCategories.map((item) => item.id);
    return [...new Set(ids)].map((id) => ({ id, image: fallbackCategories.find((item) => normalizeCategory(item.id) === id)?.image }));
  }, [categoryIds]);
  const listings = useMemo(() => {
    const source = apiConfigured() && !loadFailed && realProducts.length > 0 ? realProducts : mockProducts;
    const term = searchTerm.trim().toLowerCase();
    return source.filter((product) => product.stock > 0).filter((product) => {
      const farmer = farmerById(product.farmerId);
      const searchable = `${product.name} ${product.variety} ${product.origin} ${farmer?.name ?? ""} ${farmer?.farmName ?? ""}`.toLowerCase();
      return (!term || searchable.includes(term)) && (!category || normalizeCategory(product.category) === category) && (!farmerId || product.farmerId === farmerId) && (!organicOnly || product.organic);
    }).sort((left, right) => sort === "priceAsc" ? left.price - right.price : sort === "priceDesc" ? right.price - left.price : sort === "name" ? left.name.localeCompare(right.name) : sort === "fresh" ? right.harvestedOn.localeCompare(left.harvestedOn) : right.rating - left.rating);
  }, [category, farmerId, loadFailed, organicOnly, realProducts, searchTerm, sort]);

  const pageCount = Math.max(1, Math.ceil(listings.length / PAGE_SIZE));
  const visibleListings = listings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const updateParams = (updates: Record<string, string | null>) => { const next = new URLSearchParams(params); Object.entries(updates).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key)); setParams(next, { replace: true }); };
  const submitSearch = (event: FormEvent) => { event.preventDefault(); updateParams({ q: query.trim() || null, page: "1" }); };
  const selectCategory = (value: ProductCategory | "") => updateParams({ cat: value || "vegetables", q: null, page: "1" });
  const clearFilters = () => setParams(new URLSearchParams("cat=vegetables"), { replace: true });

  return <div className="market-storefront">
    <section className="market-store-hero"><div className="container-app"><div className="market-breadcrumb"><Link to="/">{t("marketplaceUi.breadcrumbHome")}</Link><span>/</span><span>{t("marketplaceUi.breadcrumbVegetables")}</span></div><div className="market-store-hero-grid"><div><p className="market-eyebrow"><Leaf size={15} /> {t("marketplaceUi.eyebrow")}</p><PageTitle>{t("marketplaceUi.shopTitle")}</PageTitle><p className="market-store-hero-body">{t("marketplaceUi.shopBody")}</p><div className="market-hero-actions"><a href="#vegetable-products" className="market-primary-action">{t("marketplaceUi.shopNow")} <ShoppingBasket size={16} /></a>{role === "farmer" && <Link to="/farmer/products/new" className="market-secondary-action">{t("marketplaceUi.sellHarvest")}</Link>}</div></div><div className="market-store-hero-card"><div className="market-hero-card-image"><img src="/images/vegetables.jpg" alt={t("marketplaceUi.breadcrumbVegetables")} /></div><div><p>{t("marketplaceUi.trustFresh")}</p><strong>{t("marketplaceUi.sellerNote")}</strong></div></div></div></div></section>
    <section className="market-trust-strip"><div className="container-app market-trust-grid"><span><ShieldCheck size={18} /><b>{t("marketplaceUi.trustDirect")}</b></span><span><Leaf size={18} /><b>{t("marketplaceUi.trustFresh")}</b></span><span><BadgeCheck size={18} /><b>{t("marketplaceUi.trustPrice")}</b></span><span><Truck size={18} /><b>{t("marketplaceUi.trustDelivery")}</b></span></div></section>
    <section className="container-app market-shop-head"><div className="market-shop-heading"><div><p className="market-eyebrow">{t("marketplaceUi.browseHeading")}</p><SectionTitle>{t("marketplaceUi.allVegetables")}</SectionTitle></div><Link to="/cart" className="market-cart-link"><ShoppingBasket size={17} /> {cart.length} {t("marketplaceUi.addToBasket")}</Link></div><div className="market-vegetable-rail">{vegetableShelf.map((item) => <button key={item.id} type="button" className={category === "vegetables" && (item.id === "all" ? !searchTerm : searchTerm === item.id) ? "active" : ""} onClick={() => item.id === "all" ? updateParams({ cat: "vegetables", q: null, page: "1" }) : updateParams({ cat: "vegetables", q: item.id, page: "1" })}><img src={item.image} alt="" /><span>{t(`marketplaceUi.${item.key}`)}</span></button>)}</div><form onSubmit={submitSearch} className="market-store-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("marketplaceUi.searchPlaceholder")} aria-label={t("marketplaceUi.searchPlaceholder")} /><button type="submit">{t("marketplaceUi.searchButton")}</button></form></section>
    <section id="vegetable-products" className="container-app market-products-section"><div className="market-products-heading"><div><p className="market-eyebrow">DIRECT FARM</p><SectionTitle>{t("marketplaceUi.results", { count: listings.length })}</SectionTitle></div><label className="market-sort-control"><span>{t("marketplaceUi.sort")}</span><select value={sort} onChange={(event) => updateParams({ sort: event.target.value, page: "1" })}><option value="newest">{t("marketplaceUi.featured")}</option><option value="priceAsc">{t("marketplaceUi.priceLow")}</option><option value="priceDesc">{t("marketplaceUi.priceHigh")}</option><option value="fresh">{t("marketplaceUi.freshness")}</option></select><ChevronDown size={15} /></label></div><div className="market-product-layout"><aside className="market-filter-panel"><div className="market-filter-title"><h3>{t("marketplaceUi.filters")}</h3><button type="button" onClick={clearFilters}>{t("marketplaceUi.reset")}</button></div><div className="market-filter-group"><p>{t("marketplaceUi.category")}</p><button type="button" className={category === "vegetables" ? "selected" : ""} onClick={() => selectCategory("vegetables")}>{t("marketplaceUi.allVegetables")}</button>{categoryOptions.filter((item) => normalizeCategory(item.id) !== "vegetables").map((item) => <button key={item.id} type="button" onClick={() => selectCategory(item.id as ProductCategory)}>{t(`categories.${normalizeCategory(item.id)}`, { defaultValue: item.id })}</button>)}</div><div className="market-filter-group"><p>{t("marketplaceUi.quality")}</p><label><input type="checkbox" checked={organicOnly} onChange={(event) => updateParams({ organic: event.target.checked ? "1" : null, page: "1" })} /> {t("marketplaceUi.organic")}</label><label><input type="checkbox" defaultChecked /> {t("marketplaceUi.availability")}</label></div></aside><div className="market-product-results"><div className="market-mobile-summary"><SlidersHorizontal size={16} /> {t("marketplaceUi.filters")}</div>{loading ? <EmptyState title={t("marketplaceUi.loading")} /> : visibleListings.length === 0 ? <EmptyState title={t("marketplaceUi.empty")} /> : <><div className="market-product-grid">{visibleListings.map((product) => <ProductCard key={product.id} product={product} />)}</div>{pageCount > 1 && <div className="market-pagination"><Button variant="secondary" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>{t("marketplaceUi.previous")}</Button><span>{page} / {pageCount}</span><Button variant="secondary" disabled={page >= pageCount} onClick={() => updateParams({ page: String(page + 1) })}>{t("marketplaceUi.next")}</Button></div>}</>}</div></div></section>
  </div>;
}
