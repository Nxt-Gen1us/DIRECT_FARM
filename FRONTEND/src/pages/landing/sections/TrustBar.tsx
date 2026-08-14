import { useTranslation } from "react-i18next";
import { BadgeCheck, Droplets, QrCode, ShieldCheck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../../../components/motion/Reveal";
import { trustMarks } from "../../../data/landing";

const stats = [
  { icon: ShieldCheck, key: "landing.trust.residue", value: "100%" },
  { icon: BadgeCheck, key: "landing.trust.payouts", value: "Direct" },
  { icon: QrCode, key: "landing.trust.qr", value: "1 : 1" },
  { icon: Droplets, key: "landing.trust.labs", value: "SGS · APEDA" },
];

export function TrustBar() {
  const { t } = useTranslation();

  return (
    <section id="trust" className="scroll-mt-24 border-y border-line bg-canvas">
      <div className="container-app py-14 md:py-16">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
            {t("landing.trust.kicker")}
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl text-ink md:text-4xl">
            {t("landing.trust.title")}
          </h2>
        </Reveal>

        <Stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.key}>
              <div className="rounded-2xl border border-line/70 bg-card p-5">
                <s.icon className="text-secondary" size={20} />
                <p className="mt-4 font-display text-2xl text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-ink-soft">{t(s.key)}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {trustMarks.map((mark) => (
              <span
                key={mark}
                className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-medium text-ink-soft"
              >
                {mark}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
