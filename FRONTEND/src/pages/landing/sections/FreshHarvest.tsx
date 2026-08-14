import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Leaf, QrCode } from "lucide-react";
import { Reveal, Stagger, StaggerItem, hoverLift } from "../../../components/motion/Reveal";
import { harvestLots } from "../../../data/landing";
import { Badge } from "../../../components/ui";

export function FreshHarvest() {
  const { t } = useTranslation();

  return (
    <section id="harvest" className="container-app scroll-mt-24 py-16 md:py-20">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
          {t("landing.harvest.kicker")}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl text-ink md:text-4xl">{t("landing.harvest.title")}</h2>
          <Link to="/market" className="text-sm font-medium text-primary">
            {t("common.viewAll")} →
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft">{t("landing.harvest.subtitle")}</p>
      </Reveal>

      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {harvestLots.map((lot) => (
          <StaggerItem key={lot.id}>
            <Link to={`/market/${lot.id}`}>
              <motion.article
                {...hoverLift}
                className="group overflow-hidden rounded-[1.25rem] border border-line/70 bg-card shadow-[0_10px_30px_-16px_rgb(36_22_16_/_0.16)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={lot.image}
                    alt={lot.name}
                    className="h-52 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    {lot.organic && (
                      <Badge tone="nature">
                        <Leaf size={11} /> {t("common.organic")}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl leading-snug text-ink">{lot.name}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {t("landing.harvest.from")} {lot.farm} · {lot.origin}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{lot.note}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <p className="font-display text-xl text-primary">{lot.price}</p>
                    <p className="text-xs text-muted">
                      {t("landing.harvest.harvested")} {lot.harvested}
                    </p>
                  </div>
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-nature">
                    <QrCode size={12} /> {t("landing.harvest.passport")}
                  </p>
                </div>
              </motion.article>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
