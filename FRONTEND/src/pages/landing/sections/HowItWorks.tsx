import { useTranslation } from "react-i18next";
import { Package, QrCode, Sparkles, Sprout } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../../../components/motion/Reveal";
import { howSteps } from "../../../data/landing";

const icons = {
  sprout: Sprout,
  spark: Sparkles,
  qr: QrCode,
  crate: Package,
};

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how" className="container-app scroll-mt-24 py-16 md:py-20">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
          {t("landing.how.kicker")}
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">{t("landing.how.title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-base">
          {t("landing.how.subtitle")}
        </p>
      </Reveal>

      <Stagger className="relative mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4" delay={0.1}>
        <span className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent lg:block" />
        {howSteps.map((step) => {
          const Icon = icons[step.icon as keyof typeof icons];
          return (
            <StaggerItem key={step.id}>
              <article className="group relative h-full overflow-hidden rounded-[1.25rem] border border-line/70 bg-card p-6 shadow-[0_10px_30px_-16px_rgb(36_22_16_/_0.16)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgb(139_38_38_/_0.2)]">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-primary">
                    <Icon size={18} />
                  </span>
                  <span className="font-display text-3xl text-cream-deep">{step.n}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl text-ink">{t(step.titleKey)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t(step.bodyKey)}</p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-secondary transition-all duration-500 group-hover:w-full" />
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
