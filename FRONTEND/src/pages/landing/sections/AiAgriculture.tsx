import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../../../components/motion/Reveal";
import { aiCards } from "../../../data/landing";
import { Badge } from "../../../components/ui";

export function AiAgriculture() {
  const { t } = useTranslation();

  return (
    <section id="ai" className="container-app scroll-mt-24 py-16 md:py-20">
      <Reveal>
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-secondary">
          <Sparkles size={14} /> {t("landing.ai.kicker")}
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">{t("landing.ai.title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{t("landing.ai.subtitle")}</p>
        <Link
          to="/ai"
          className="mt-6 flex max-w-2xl items-center justify-between gap-3 rounded-full border border-line bg-canvas px-5 py-3 text-sm text-muted shadow-[0_10px_24px_-16px_rgb(36_22_16_/_0.2)] transition hover:border-secondary/40"
        >
          <span>{t("landing.ai.prompt")}</span>
          <span className="rounded-full bg-primary px-3 py-1 text-xs text-accent">{t("landing.ai.cta")}</span>
        </Link>
      </Reveal>

      <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
        {aiCards.map((card) => (
          <StaggerItem key={card.titleKey}>
            <article className="flex h-full flex-col rounded-[1.25rem] border border-line/70 bg-card p-6 shadow-[0_10px_30px_-16px_rgb(36_22_16_/_0.16)]">
              <Badge tone="secondary">{t(card.typeKey)}</Badge>
              <h3 className="mt-4 font-display text-2xl leading-snug">{t(card.titleKey)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{t(card.bodyKey)}</p>
              <div className="mt-5">
                <div className="mb-1 flex justify-between text-[11px] text-muted">
                  <span>{card.score}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-cream-deep">
                  <div className="h-full rounded-full bg-nature" style={{ width: `${card.score}%` }} />
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">
                {t(card.actionKey)}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>


    </section>
  );
}
