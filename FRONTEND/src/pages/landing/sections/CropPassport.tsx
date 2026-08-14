import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BadgeCheck, QrCode } from "lucide-react";
import { Reveal } from "../../../components/motion/Reveal";
import { images } from "../../../assets";
import { Badge, Button } from "../../../components/ui";

export function CropPassport() {
  const { t } = useTranslation();

  return (
    <section id="passport" className="relative scroll-mt-24 overflow-hidden">
      <img src={images.hero.irrigation} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-primary-deep/88" />
      <div className="container-app relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
        <Reveal direction="left">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {t("landing.passport.kicker")}
          </p>
          <h2 className="mt-2 font-display text-3xl text-canvas md:text-4xl">
            {t("landing.passport.title")}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-accent/85">
            {t("landing.passport.subtitle")}
          </p>
          <Link to="/passport" className="mt-7 inline-block">
            <Button variant="cream">{t("landing.passport.cta")}</Button>
          </Link>
        </Reveal>

        <Reveal direction="right">
          <article className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-canvas text-ink shadow-[0_24px_50px_-24px_rgb(0_0_0_/_0.5)]">
            <div className="relative h-40">
              <img src={images.crops.tomatoes} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute bottom-3 left-4 text-canvas">
                <p className="text-[10px] uppercase tracking-[0.18em] text-accent">NSK-TOM-2026-W15</p>
                <p className="font-display text-2xl">Namdhari NS-4266</p>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_104px] gap-4 p-5">
              <div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="nature">GlobalG.A.P.</Badge>
                  <Badge tone="accent">FSSAI</Badge>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {[
                    [t("landing.passport.soil"), "Red laterite"],
                    [t("landing.passport.sown"), "18 Dec 2025"],
                    [t("landing.passport.harvested"), "10 Apr 2026"],
                    [t("landing.passport.residue"), "Below MRL"],
                    [t("landing.passport.carbon"), "0.42 kg"],
                    [t("landing.passport.water"), "38 L"],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="rounded-xl bg-cream px-3 py-2">
                      <dt className="text-[10px] uppercase tracking-wider text-muted">{k}</dt>
                      <dd className="mt-0.5 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-cream p-3 text-center">
                <QrCode className="text-primary" size={56} />
                <p className="mt-2 font-mono text-[9px] text-muted">FC-CP-TOM-4266</p>
                <p className="mt-2 flex items-center gap-1 text-[10px] text-nature">
                  <BadgeCheck size={11} /> {t("landing.passport.verify")}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
