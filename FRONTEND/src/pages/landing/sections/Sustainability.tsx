import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Reveal, Stagger, StaggerItem } from "../../../components/motion/Reveal";
import { sustainMetrics } from "../../../data/landing";
import { images } from "../../../assets";
import { Button } from "../../../components/ui";

export function Sustainability() {
  const { t } = useTranslation();

  return (
    <section id="sustainability" className="scroll-mt-24 bg-cream-deep/60">
      <div className="container-app grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
        <Reveal direction="left">
          <div className="overflow-hidden rounded-[1.5rem]">
            <img src={images.hero.harvest} alt="" className="h-80 w-full object-cover md:h-[28rem]" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
              {t("landing.sustain.kicker")}
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">{t("landing.sustain.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t("landing.sustain.subtitle")}</p>
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-2 gap-3">
            {sustainMetrics.map((m) => (
              <StaggerItem key={m.labelKey}>
                <div className="rounded-2xl border border-line/70 bg-card p-4">
                  <p className="font-display text-3xl text-nature">{m.value}</p>
                  <p className="mt-1 text-xs font-medium text-ink">{t(m.labelKey)}</p>
                  <p className="mt-1 text-[11px] text-muted">{t(m.deltaKey)}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-6">
            <Link to="/sustainability">
              <Button variant="nature">{t("landing.sustain.cta")}</Button>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
