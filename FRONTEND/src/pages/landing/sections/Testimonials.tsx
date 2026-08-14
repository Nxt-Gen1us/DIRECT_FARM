import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../../../components/motion/Reveal";
import { testimonials } from "../../../data/landing";

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section id="voices" className="container-app scroll-mt-24 py-16 md:py-20">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
          {t("landing.voices.kicker")}
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">{t("landing.voices.title")}</h2>
      </Reveal>

      <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
        {testimonials.map((v) => (
          <StaggerItem key={v.nameKey}>
            <figure className="flex h-full flex-col rounded-[1.25rem] border border-line/70 bg-card p-6 shadow-[0_10px_30px_-16px_rgb(36_22_16_/_0.16)]">
              <Quote className="text-secondary" size={22} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                {t(v.quoteKey)}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img src={v.image} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-ink">{t(v.nameKey)}</p>
                  <p className="text-xs text-muted">{t(v.roleKey)}</p>
                </div>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
