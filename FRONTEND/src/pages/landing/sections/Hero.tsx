import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, QrCode } from "lucide-react";
import { images } from "../../../assets";
import { Button } from "../../../components/ui";

export function Hero() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <motion.img
        src={images.hero.harvest}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduce ? false : { scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: [0.22, 1, 0.36, 1] }}
      />
      <video
        className="absolute inset-0 hidden h-full w-full object-cover opacity-40 mix-blend-soft-light md:block"
        autoPlay
        muted
        loop
        playsInline
        poster={images.hero.harvest}
      >
        <source src="/videos/hero-field.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-primary-deep/75 to-primary/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/25" />

      <div className="container-app relative grid min-h-[92vh] items-end gap-10 pb-16 pt-28 lg:grid-cols-12 lg:items-center lg:pb-24">
        <motion.div
          className="lg:col-span-7"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-accent">
            {t("landing.hero.kicker")}
          </p>
          <h1 className="font-display text-4xl leading-[1.06] text-canvas sm:text-5xl lg:text-[3.75rem]">
            {t("landing.hero.title")}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-accent/90 md:text-[1.05rem]">
            {t("landing.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/market">
              <Button variant="secondary" size="lg">
                {t("landing.hero.cta")} <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/farmer">
              <Button variant="cream" size="lg">
                {t("landing.hero.cta2")}
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              { n: "642", l: t("landing.hero.farms") },
              { n: "2,118", l: t("landing.hero.passports") },
              { n: t("landing.hero.hoursVal"), l: t("landing.hero.hours") },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-white/15 bg-canvas/10 px-3 py-4 text-center backdrop-blur-sm"
              >
                <p className="font-display text-2xl text-accent md:text-3xl">{s.n}</p>
                <p className="mt-1 text-[11px] leading-snug text-accent/80">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          className="hidden lg:col-span-5 lg:block"
          initial={reduce ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/passport" className="block">
            <article className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-canvas text-ink shadow-[0_30px_60px_-28px_rgb(0_0_0_/_0.55)] transition hover:-translate-y-1">
              <div className="relative h-40">
                <img src={images.crops.tomatoes} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                <p className="absolute left-4 top-3 rounded-full bg-accent/95 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink">
                  {t("nav.passport")}
                </p>
                <div className="absolute bottom-3 left-4 text-canvas">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-accent">NSK-TOM-2026-W15</p>
                  <p className="font-display text-2xl">Namdhari NS-4266</p>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_88px] gap-3 p-4">
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-cream px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted">{t("landing.passport.soil")}</dt>
                    <dd className="font-medium">Red laterite</dd>
                  </div>
                  <div className="rounded-xl bg-cream px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted">{t("landing.passport.residue")}</dt>
                    <dd className="font-medium">Below MRL</dd>
                  </div>
                  <div className="rounded-xl bg-cream px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted">{t("landing.passport.carbon")}</dt>
                    <dd className="font-medium">0.42 kg</dd>
                  </div>
                  <div className="rounded-xl bg-cream px-3 py-2">
                    <dt className="text-[10px] uppercase tracking-wider text-muted">{t("landing.passport.water")}</dt>
                    <dd className="font-medium">38 L</dd>
                  </div>
                </dl>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-cream text-center">
                  <QrCode className="text-primary" size={40} />
                  <p className="mt-1 flex items-center gap-0.5 text-[9px] text-nature">
                    <BadgeCheck size={10} /> {t("landing.passport.verify")}
                  </p>
                </div>
              </div>
            </article>
          </Link>
        </motion.aside>
      </div>
    </section>
  );
}
