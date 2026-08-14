import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../../../components/motion/Reveal";
import { images } from "../../../assets";
import { Button } from "../../../components/ui";

export function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="container-app pb-8 pt-4 md:pb-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.6rem]">
          <img src={images.hero.farm} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/92 via-primary/80 to-nature-dark/70" />
          <div className="relative grid gap-8 px-6 py-14 md:grid-cols-2 md:px-12 md:py-16">
            <div className="md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {t("landing.cta.kicker")}
              </p>
              <h2 className="mt-2 max-w-2xl font-display text-3xl text-canvas md:text-4xl">
                {t("landing.cta.title")}
              </h2>
            </div>
            <div className="rounded-2xl border border-white/15 bg-canvas/10 p-6 backdrop-blur-sm">
              <h3 className="font-display text-2xl text-canvas">{t("landing.cta.kitchens")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-accent/85">{t("landing.cta.kitchensBody")}</p>
              <Link to="/market" className="mt-5 inline-block">
                <Button variant="cream">
                  {t("landing.cta.kitchensCta")} <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-white/15 bg-canvas/10 p-6 backdrop-blur-sm">
              <h3 className="font-display text-2xl text-canvas">{t("landing.cta.farms")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-accent/85">{t("landing.cta.farmsBody")}</p>
              <Link to="/login?role=farmer" className="mt-5 inline-block">
                <Button variant="secondary">
                  {t("landing.cta.farmsCta")} <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
