import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import { Reveal, Stagger, StaggerItem, hoverLift } from "../../../components/motion/Reveal";
import { featuredFarmers } from "../../../data/landing";

export function FeaturedFarmers() {
  const { t } = useTranslation();

  return (
    <section id="farmers" className="scroll-mt-24 bg-nature text-accent">
      <div className="container-app py-16 md:py-20">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent/75">
            {t("landing.farmers.kicker")}
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">{t("landing.farmers.title")}</h2>
          <p className="mt-3 max-w-xl text-sm text-accent/85">{t("landing.farmers.subtitle")}</p>
        </Reveal>

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredFarmers.map((f) => (
            <StaggerItem key={f.id}>
              <motion.article
                {...hoverLift}
                className="overflow-hidden rounded-[1.25rem] bg-canvas text-ink shadow-[0_16px_36px_-20px_rgb(0_0_0_/_0.35)]"
              >
              <Link to={`/farmers/${f.id}`} className="block">
                <div className="relative h-36">
                  <img src={f.cover} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="absolute -bottom-7 left-4 h-16 w-16 rounded-2xl border-4 border-canvas object-cover"
                  />
                </div>
                <div className="px-4 pb-5 pt-9">
                  <p className="flex items-center gap-1 text-xs text-nature">
                    <BadgeCheck size={12} /> {t("common.verified")}
                  </p>
                  <h3 className="mt-1 font-display text-xl leading-tight">{f.farm}</h3>
                  <p className="text-sm text-ink-soft">{f.name}</p>
                  <p className="mt-1 text-xs text-muted">{f.place}</p>
                  <p className="mt-3 text-sm">{f.specialty}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {f.certs.map((c) => (
                      <span key={c} className="rounded-full bg-nature-soft px-2 py-0.5 text-[10px] text-nature-dark">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-end justify-between text-xs text-muted">
                    <span>
                      {t("landing.farmers.since")} {f.since}
                    </span>
                    <span className="flex items-center gap-1 text-ink">
                      <Star size={12} className="fill-secondary text-secondary" /> {f.rating}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted">
                      {f.acres} {t("landing.farmers.acres")}
                    </span>
                    <span className="font-display text-2xl text-nature">{f.score}</span>
                  </div>
                </div>
              </Link>
              </motion.article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-8">
          <Link to="/farmers" className="text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4">
            {t("common.viewAll")} →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
