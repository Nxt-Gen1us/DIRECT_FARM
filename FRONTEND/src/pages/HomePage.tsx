import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Leaf, QrCode, Sun } from "lucide-react";
import { products, categories } from "../data/products";
import { farmers } from "../data/farmers";
import { ProductCard } from "../components/marketplace/ProductCard";
import { Button } from "../components/ui/Button";
import { Card, SectionHead } from "../components/ui/Card";

export function HomePage() {
  const { t } = useTranslation();
  const featured = products.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="/images/hero-farm.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-primary-deep/70 to-primary/20" />
        <div className="container-app relative grid items-center gap-10 py-20 md:grid-cols-12 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-7"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {t("hero.kicker")}
            </p>
            <h1 className="font-display text-4xl leading-[1.1] text-canvas sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-accent/90 md:text-base">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/market">
                <Button variant="secondary">
                  {t("hero.cta")} <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/farmer">
                <Button variant="cream">{t("hero.cta2")}</Button>
              </Link>
            </div>
          </motion.div>
          <div className="grid grid-cols-3 gap-3 md:col-span-5">
            {[
              { n: "642", l: t("hero.statFarms") },
              { n: "2,118", l: t("hero.statPassports") },
              { n: "36 hrs", l: t("hero.statHours") },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-white/15 bg-canvas/10 p-4 text-center backdrop-blur-sm"
              >
                <p className="font-display text-2xl text-accent md:text-3xl">{s.n}</p>
                <p className="mt-1 text-[11px] leading-snug text-accent/80">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app py-14">
        <SectionHead title={t("categories.title")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/market?cat=${c.id}`}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img
                src={c.image}
                alt=""
                className="h-36 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
              <p className="absolute bottom-3 left-3 font-display text-lg text-canvas">
                {t(`categories.${c.id}`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-app pb-8">
        <SectionHead
          kicker={t("market.title")}
          title={t("market.title")}
          action={
            <Link to="/market" className="text-sm font-medium text-primary">
              {t("common.viewAll")} →
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 md:grid-cols-3 md:px-6">
        {[
          {
            icon: QrCode,
            title: t("nav.passport"),
            body: t("product.trust"),
            to: "/passport",
          },
          {
            icon: Sun,
            title: t("nav.ai"),
            body: t("ai.subtitle"),
            to: "/ai",
          },
          {
            icon: Leaf,
            title: t("nav.sustainability"),
            body: t("sustain.subtitle"),
            to: "/sustainability",
          },
        ].map((f) => (
          <Link key={f.to} to={f.to}>
            <Card className="h-full p-6 transition hover:-translate-y-0.5">
              <f.icon className="text-secondary" />
              <h3 className="mt-4 font-display text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </Card>
          </Link>
        ))}
      </section>

      <section className="bg-nature text-accent">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:px-6">
          <img
            src="/images/harvest.jpg"
            alt=""
            className="h-72 w-full rounded-[1.5rem] object-cover shadow-[0_20px_40px_-20px_rgb(0_0_0_/_0.4)]"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent/80">
              {t("common.verified")}
            </p>
            <h2 className="mt-2 font-display text-4xl">{farmers[0].farmName}</h2>
            <p className="mt-3 text-sm leading-relaxed text-accent/90">{farmers[0].bio}</p>
            <p className="mt-4 flex items-center gap-2 text-sm">
              <BadgeCheck size={16} /> {farmers[0].name} · {farmers[0].village}, {farmers[0].district}
            </p>
            <Link to="/farmer" className="mt-6 inline-block">
              <Button variant="cream">{t("hero.cta2")}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
