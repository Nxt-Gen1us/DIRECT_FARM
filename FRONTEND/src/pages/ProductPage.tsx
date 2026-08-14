import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BadgeCheck,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Plus,
  QrCode,
  Share2,
} from "lucide-react";
import { daysSinceHarvest, freshnessKey } from "../lib/market";
import { formatDate, inr, km } from "../lib/format";
import { productById, products } from "../data/products";
import { farmerById } from "../data/farmers";
import { passportById } from "../data/passports";
import { packOptionsFor, reviewsFor } from "../lib/productDetail";
import { useApp } from "../app/providers/AppProviders";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ProductCard } from "../components/marketplace/ProductCard";
import { RecentlyViewed } from "../components/marketplace/RecentlyViewed";
import { CompareToggle } from "../components/marketplace/CompareToggle";
import { useShop } from "../app/providers/ShopProvider";
import { ProductGallery } from "../components/product/ProductGallery";
import { StarRow } from "../components/product/StarRow";
import { cn } from "../lib/cn";

export function ProductPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, toggleWish, wished } = useApp();
  const { markViewed } = useShop();
  const product = productById(id ?? "");
  const packs = useMemo(() => (product ? packOptionsFor(product) : []), [product]);
  const [qty, setQty] = useState(product?.minQty ?? 1);
  const [pack, setPack] = useState(packs[0]?.id ?? "crate");
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState<"about" | "farm" | "passport" | "reviews">("about");

  useEffect(() => {
    if (!product) return;
    setQty(product.minQty);
    setPack(packOptionsFor(product)[0]?.id ?? "crate");
    setTab("about");
    setToast("");
    markViewed(product.id);
  }, [product, markViewed]);

  if (!product) {
    return (
      <div className="container-app py-10">
        <EmptyState
          title={t("market.empty")}
          action={
            <Link to="/market">
              <Button>{t("flow.shop")}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const farmer = farmerById(product.farmerId);
  const passport = passportById(product.passportId);
  const notes = reviewsFor(product.id);
  const packMeta = packs.find((p) => p.id === pack) ?? packs[0];
  const price = product.price + (packMeta?.extra ?? 0);
  const saved = wished(product.id);
  const fresh = freshnessKey(daysSinceHarvest(product.harvestedOn));
  const related = products
    .filter((p) => p.farmerId === product.farmerId && p.id !== product.id)
    .slice(0, 4);
  const more =
    related.length >= 3
      ? related
      : products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const bump = (n: number) => {
    setQty((q) => Math.min(product.stock, Math.max(product.minQty, q + n)));
  };

  const add = () => {
    addToCart(product.id, qty);
    setToast(t("detail.addedToast"));
    window.setTimeout(() => setToast(""), 2400);
  };

  const buy = () => {
    addToCart(product.id, qty);
    navigate("/cart");
  };

  return (
    <div>
      <div className="border-b border-line bg-canvas">
        <div className="container-app py-4 text-xs text-muted">
          <Link to="/market" className="hover:text-primary">
            {t("detail.crumb")}
          </Link>
          <span className="mx-1.5">/</span>
          <Link to={`/market?cat=${product.category}`} className="hover:text-primary">
            {t(`categories.${product.category}`)}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">{product.name}</span>
        </div>
      </div>

      <div className="container-app py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery product={product} />

          <div>
            <div className="flex flex-wrap gap-2">
              {product.organic && (
                <Badge tone="nature">
                  <Leaf size={11} /> {t("common.organic")}
                </Badge>
              )}
              <Badge tone="accent">{t(`categories.${product.category}`)}</Badge>
              <Badge tone={fresh === "today" || fresh === "week" ? "secondary" : "muted"}>
                {t(`market.freshness.${fresh}`)}
              </Badge>
            </div>

            <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-[2.75rem]">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              {product.variety} · {t("detail.sku")} {passport?.lotCode ?? product.passportId}
            </p>

            {farmer && (
              <Link
                to={`/farmers/${farmer.id}`}
                className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-card p-3"
              >
                <img src={farmer.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                    {farmer.name}
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-nature-soft px-2 py-0.5 text-[10px] font-medium text-nature-dark">
                      <BadgeCheck size={11} /> {t("detail.verified")}
                    </span>
                  </p>
                  <p className="truncate text-xs text-muted">
                    {farmer.farmName} · {farmer.village}, {farmer.district}
                  </p>
                </div>
                <StarRow value={farmer.rating} />
              </Link>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <StarRow value={product.rating} />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted">
                {t("detail.reviewsCount", { count: product.reviews })}
              </span>
            </div>

            <p className="mt-5 font-display text-4xl text-primary">
              {inr(price)}
              <span className="ml-2 text-base font-normal text-muted">
                / {product.unit}
                {packMeta?.extra ? ` · +${inr(packMeta.extra)}` : ""}
              </span>
            </p>
            <p className="mt-1 text-xs text-muted">
              {t("detail.minNote", { n: product.minQty, unit: product.unit })} ·{" "}
              {t("detail.stockLeft", { n: product.stock, unit: product.unit })}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [t("product.freshness"), t(`market.freshness.${fresh}`)],
                [t("product.harvest"), formatDate(product.harvestedOn)],
                [t("product.distance"), km(product.distanceKm)],
                [t("product.origin"), product.origin],
              ].map(([k, v]) => (
                <div key={String(k)} className="rounded-2xl border border-line/70 bg-canvas p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted">{k}</p>
                  <p className="mt-1 text-sm font-medium leading-snug">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                {t("detail.pack.label")}
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {packs.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPack(p.id)}
                    className={cn(
                      "rounded-2xl border px-3 py-2.5 text-left",
                      pack === p.id
                        ? "border-primary bg-primary-soft"
                        : "border-line bg-canvas hover:border-secondary/40",
                    )}
                  >
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <Package size={13} /> {t(p.labelKey)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">{t(p.noteKey)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                {t("detail.qty")}
              </p>
              <div className="inline-flex items-center rounded-full border border-line bg-canvas">
                <button type="button" className="grid h-11 w-11 place-items-center" onClick={() => bump(-1)}>
                  <Minus size={14} />
                </button>
                <span className="min-w-10 text-center text-sm font-medium">
                  {qty} {product.unit}
                </span>
                <button type="button" className="grid h-11 w-11 place-items-center" onClick={() => bump(1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={add}>
                {t("detail.add")}
              </Button>
              <Button size="lg" variant="secondary" onClick={buy}>
                {t("detail.buy")}
              </Button>
              <Button
                size="lg"
                variant={saved ? "nature" : "ghost"}
                onClick={() => toggleWish(product.id)}
              >
                <Heart size={16} className={saved ? "fill-accent" : ""} />
                {saved ? t("detail.wished") : t("detail.wish")}
              </Button>
              <CompareToggle productId={product.id} className="h-11 w-11" />
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-soft"
                aria-label={t("detail.share")}
                onClick={() => {
                  void navigator.clipboard?.writeText(window.location.href);
                  setToast(t("detail.share"));
                  window.setTimeout(() => setToast(""), 1600);
                }}
              >
                <Share2 size={16} />
              </button>
            </div>
            {toast && (
              <p className="mt-3 rounded-2xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">{toast}</p>
            )}
            <p className="mt-4 text-sm text-ink-soft">{t("product.trust")}</p>
          </div>
        </div>

        <div className="mt-14">
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line pb-px">
            {(["about", "farm", "passport", "reviews"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "-mb-px rounded-t-2xl px-4 py-2.5 text-sm",
                  tab === id ? "border border-b-canvas border-line bg-canvas font-medium text-primary" : "text-muted",
                )}
              >
                {t(`detail.${id}`)}
              </button>
            ))}
          </div>

          <div className="rounded-b-[1.25rem] rounded-tr-[1.25rem] border border-t-0 border-line bg-canvas p-6">
            {tab === "about" && (
              <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-ink-soft">
                <p>{product.description}</p>
                <p>
                  {t("product.variety")}: <span className="text-ink">{product.variety}</span>
                  {" · "}
                  {t("product.lot")}: <span className="text-ink">{passport?.lotCode ?? "—"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} tone="muted">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {tab === "farm" && farmer && (
              <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <img src={farmer.cover} alt="" className="h-48 w-full rounded-2xl object-cover" />
                <div>
                  <p className="flex items-center gap-2 font-display text-2xl">
                    {farmer.farmName}
                    <BadgeCheck className="text-nature" size={18} />
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                    <MapPin size={12} /> {farmer.village}, {farmer.district}, {farmer.state}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{farmer.bio}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-2xl bg-cream p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted">{t("detail.since")}</p>
                      <p className="font-display text-xl">{farmer.since}</p>
                    </div>
                    <div className="rounded-2xl bg-cream p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted">{t("detail.acres")}</p>
                      <p className="font-display text-xl">{farmer.acres}</p>
                    </div>
                    <div className="rounded-2xl bg-cream p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted">{t("detail.score")}</p>
                      <p className="font-display text-xl text-nature">{farmer.sustainabilityScore}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {farmer.certifications.map((c) => (
                      <Badge key={c} tone="nature">
                        {c}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link to={`/chat?farmer=${farmer.id}`}>
                      <Button variant="ghost">
                        <MessageCircle size={14} /> {t("detail.chat")}
                      </Button>
                    </Link>
                    <Link to="/map/lots">
                      <Button variant="ghost">{t("nav.map")}</Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {tab === "passport" && passport && (
              <div className="grid gap-6 md:grid-cols-[1fr_160px]">
                <div>
                  <p className="font-display text-2xl">
                    {passport.crop} · {passport.variety}
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                    {[
                      [t("detail.sku"), passport.lotCode],
                      [t("detail.soil"), passport.soilType],
                      [t("detail.sown"), formatDate(passport.sownOn)],
                      [t("product.harvest"), formatDate(passport.harvestedOn)],
                      [t("detail.residue"), passport.residueStatus],
                      [t("detail.grade"), passport.grade],
                      [t("detail.carbon"), `${passport.carbonKg} kg`],
                      [t("detail.water"), `${passport.waterLitres} L`],
                    ].map(([k, v]) => (
                      <div key={String(k)} className="rounded-xl bg-cream px-3 py-2">
                        <dt className="text-[10px] uppercase tracking-wider text-muted">{k}</dt>
                        <dd className="mt-0.5 font-medium leading-snug">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted">
                    {t("detail.inputs")}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {passport.inputs.map((i) => (
                      <li key={i.name} className="flex justify-between rounded-xl bg-cream px-3 py-2">
                        <span>{i.name}</span>
                        {i.organic && <Badge tone="nature">{t("common.organic")}</Badge>}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/passport/${passport.id}`} className="mt-5 inline-block">
                    <Button variant="ghost">{t("detail.openPassport")}</Button>
                  </Link>
                </div>
                <aside className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-cream p-4 text-center">
                  <QrCode size={88} className="text-primary" />
                  <p className="mt-2 font-mono text-[10px]">{passport.qr}</p>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-nature">
                    <BadgeCheck size={12} /> {t("detail.sealed")}
                  </p>
                </aside>
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-4">
                {notes.length === 0 && <p className="text-sm text-muted">{t("detail.noReviews")}</p>}
                {notes.map((n) => (
                  <figure key={n.id} className="rounded-2xl border border-line bg-cream p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium text-ink">{n.name}</p>
                        <p className="text-xs text-muted">{n.role}</p>
                      </div>
                      <div className="text-right">
                        <StarRow value={n.rating} />
                        <p className="mt-1 text-[11px] text-muted">{formatDate(n.date)}</p>
                      </div>
                    </div>
                    <p className="mt-3 font-display text-xl">{n.title}</p>
                    <blockquote className="mt-1 text-sm leading-relaxed text-ink-soft">{n.body}</blockquote>
                    {n.verified && (
                      <p className="mt-2 text-[11px] font-medium text-nature">{t("detail.verifiedBuy")}</p>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>

        {more.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-6 font-display text-3xl">{t("detail.moreLots")}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {more.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
        <RecentlyViewed exclude={product.id} />
      </div>
    </div>
  );
}
