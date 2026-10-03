import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BadgeCheck,
  Leaf,
  MapPin,
  MessageCircle,
  Plane,
  Sprout,
  Wheat,
} from "lucide-react";
import { farmerById, farmers } from "../../data/farmers";
import { profileOrFallback } from "../../data/farmerProfiles";
import { products } from "../../data/products";
import { fetchProducts } from "../../lib/api/products";
import { apiConfigured } from "../../lib/api";
import type { Product } from "../../lib/types";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ProductCard } from "../../components/marketplace/ProductCard";
import { StarRow } from "../../components/product/StarRow";
import { cn } from "../../lib/cn";
import type { TimelineKind } from "../../data/farmerProfiles";

const kindTone: Record<TimelineKind, "secondary" | "nature" | "primary" | "muted"> = {
  harvest: "secondary",
  cert: "nature",
  infra: "primary",
  story: "muted",
};

export function FarmerDirectoryPage() {
  const { t } = useTranslation();
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src="/images/harvest.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-primary-deep/70 to-nature-dark/40" />
        <div className="container-app relative py-14 md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            {t("profile.kicker")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-canvas md:text-5xl">{t("profile.directory")}</h1>
          <p className="mt-3 max-w-xl text-sm text-accent/85">{t("profile.directorySub")}</p>
        </div>
      </section>
      <div className="container-app grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {farmers.map((f) => (
          <Link key={f.id} to={`/farmers/${f.id}`} className="group">
            <article className="overflow-hidden rounded-[1.25rem] border border-line/70 bg-card shadow-[0_10px_30px_-16px_rgb(36_22_16_/_0.16)] transition group-hover:-translate-y-0.5">
              <div className="relative h-36">
                <img src={f.cover} alt="" className="h-full w-full object-cover" />
                <img
                  src={f.avatar}
                  alt=""
                  className="absolute -bottom-6 left-4 h-14 w-14 rounded-2xl border-4 border-card object-cover"
                />
              </div>
              <div className="px-4 pb-4 pt-8">
                <p className="flex items-center gap-1 text-xs text-nature">
                  <BadgeCheck size={12} /> {t("profile.verified")}
                </p>
                <h2 className="font-display text-xl">{f.farmName}</h2>
                <p className="text-sm text-ink-soft">{f.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {f.village}, {f.district} · {f.acres} {t("profile.acres")}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FarmerProfilePage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const farmer = farmerById(id ?? "");
  const [activeVideo, setActiveVideo] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lots, setLots] = useState<Product[]>(
    () => products.filter((p) => p.farmerId === (id ?? "")).slice(0, 4),
  );

  // Fetch real products from backend when API is configured
  useEffect(() => {
    if (!farmer?.id) return;
    if (!apiConfigured()) {
      setLots(products.filter((p) => p.farmerId === farmer.id).slice(0, 4));
      return;
    }
    fetchProducts({ farmer: farmer.id })
      .then((fetched) => setLots(fetched.slice(0, 4)))
      .catch(console.error);
  }, [farmer?.id]);

  if (!farmer) {
    return (
      <div className="container-app py-20 text-center text-ink-soft">{t("profile.missing")}</div>
    );
  }

  const extra = profileOrFallback(farmer.id);
  const video = extra.videos[activeVideo] ?? extra.videos[0];
  const years = extra.experienceYears || Math.max(1, new Date().getFullYear() - farmer.since);

  return (
    <div>
      <section className="relative">
        <div className="relative h-56 overflow-hidden md:h-80">
          <img src={farmer.cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        </div>
        <div className="container-app relative -mt-16 pb-6 md:-mt-20">
          <div className="flex flex-col gap-5 rounded-[1.4rem] border border-line/70 bg-card p-5 shadow-[0_18px_40px_-24px_rgb(36_22_16_/_0.28)] md:flex-row md:items-end">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="h-28 w-28 rounded-[1.25rem] border-4 border-cream object-cover md:h-32 md:w-32"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-secondary">
                {t("profile.kicker")}
              </p>
              <h1 className="mt-1 font-display text-3xl text-ink md:text-4xl">{farmer.farmName}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                {farmer.name}
                <span className="inline-flex items-center gap-1 rounded-full bg-nature-soft px-2 py-0.5 text-[11px] font-medium text-nature-dark">
                  <BadgeCheck size={12} /> {t("profile.verified")}
                </span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <MapPin size={13} /> {farmer.village}, {farmer.district}, {farmer.state}
              </p>
              <p className="mt-2 max-w-xl text-sm italic text-ink-soft">{extra.headline}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/chat?farmer=${farmer.id}`}>
                <Button>
                  <MessageCircle size={14} /> {t("profile.connect")}
                </Button>
              </Link>
              <Link to={`/market?farmer=${farmer.id}`}>
                <Button variant="secondary">{t("profile.shop")}</Button>
              </Link>
              {farmer.id === "f-ramesh" && (
                <Link to="/farmer">
                  <Button variant="ghost">{t("profile.desk")}</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-app pb-14">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [t("profile.size"), `${farmer.acres}`, t("profile.acres")],
            [t("profile.experience"), `${years}`, t("profile.years")],
            [t("profile.organic"), extra.organic ? t("profile.certified") : t("profile.conventional"), farmer.certifications[0]],
            [t("profile.rating"), farmer.rating.toFixed(1), `${farmer.reviews} ${t("profile.reviews")}`],
          ].map(([k, v, h]) => (
            <div key={String(k)} className="rounded-[1.25rem] border border-line/70 bg-card p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted">{k}</p>
              <p className="mt-1 font-display text-3xl text-primary">{v}</p>
              <p className="text-xs text-ink-soft">{h}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StarRow value={farmer.rating} size={16} />
          <span className="text-sm text-ink-soft">
            {farmer.rating} · {farmer.reviews} {t("profile.reviews")}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {farmer.certifications.map((c) => (
            <Badge key={c} tone="nature">
              <Leaf size={10} /> {c}
            </Badge>
          ))}
          {extra.crops.map((c) => (
            <Badge key={c} tone="muted">
              {c}
            </Badge>
          ))}
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-3xl">{t("profile.story")}</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
              {extra.story.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              {t("profile.members")}: {extra.members}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-line/70 bg-cream p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{t("profile.crops")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {extra.crops.map((c) => (
                <li key={c} className="rounded-full bg-canvas px-3 py-1 text-sm text-ink">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-center gap-2 text-sm text-ink-soft">
              <Sprout size={16} className="text-nature" />
              {farmer.specialty}
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl">{t("profile.gallery")}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {extra.gallery.map((g, i) => (
              <button
                key={g.src + i}
                type="button"
                onClick={() => setLightbox(g.src)}
                className={cn(
                  "group relative overflow-hidden rounded-[1.15rem]",
                  i === 0 && "md:col-span-2 md:row-span-2",
                )}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  className={cn(
                    "w-full object-cover transition duration-500 group-hover:scale-105",
                    i === 0 ? "h-64 md:h-full" : "h-36 md:h-40",
                  )}
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 py-2 text-left text-xs text-canvas">
                  {g.caption}
                </span>
              </button>
            ))}
          </div>
        </section>

        {video && (
          <section className="mt-14">
            <h2 className="font-display text-3xl">{t("profile.videos")}</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="overflow-hidden rounded-[1.25rem] border border-line bg-ink">
                <video
                  key={video.src}
                  className="aspect-video w-full object-cover"
                  controls
                  playsInline
                  poster={video.poster}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
                <p className="px-4 py-3 text-sm text-accent">{video.title}</p>
              </div>
              <div className="space-y-2">
                {extra.videos.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVideo(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-2 text-left",
                      i === activeVideo ? "border-primary bg-primary-soft" : "border-line bg-canvas",
                    )}
                  >
                    <img src={v.poster} alt="" className="h-14 w-20 rounded-xl object-cover" />
                    <span>
                      <span className="block text-sm font-medium">{v.title}</span>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted">
                        {v.kind === "drone" ? <Plane size={11} /> : v.kind === "harvest" ? <Wheat size={11} /> : <Sprout size={11} />}
                        {t(`profile.${v.kind}`)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mt-14">
          <h2 className="font-display text-3xl">{t("profile.timeline")}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t("profile.timelineSub")}</p>
          <ol className="relative mt-8 space-y-0">
            <span className="absolute bottom-2 left-[17px] top-2 w-px bg-line" />
            {extra.timeline.map((item) => (
              <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
                <span className="relative z-10 mt-1 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-primary bg-accent" />
                <div className="min-w-0 flex-1 rounded-[1.15rem] border border-line/70 bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={kindTone[item.kind]}>{t(`profile.kinds.${item.kind}`)}</Badge>
                    <span className="text-xs text-muted">
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-2 font-display text-xl text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {lots.length > 0 && (
          <section className="mt-14">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="font-display text-3xl">{t("profile.shop")}</h2>
              <Link to={`/market?farmer=${farmer.id}`} className="text-sm font-medium text-primary">
                {t("common.viewAll")} →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {lots.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {lightbox && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-[1.25rem] object-contain" />
        </button>
      )}
    </div>
  );
}
