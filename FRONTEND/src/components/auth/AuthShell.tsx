import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Sprout } from "lucide-react";
import type { ReactNode } from "react";
import type { Role } from "../../lib/types";
import { images } from "../../assets";
import { useLanguage } from "../../hooks/useLanguage";

const panels: Record<Role, { image: string; kicker: string; title: string; body: string }> = {
  customer: {
    image: images.crops.mangoes,
    kicker: "auth.panel.customerKicker",
    title: "auth.panel.customerTitle",
    body: "auth.panel.customerBody",
  },
  farmer: {
    image: images.hero.harvest,
    kicker: "auth.panel.farmerKicker",
    title: "auth.panel.farmerTitle",
    body: "auth.panel.farmerBody",
  },
  admin: {
    image: images.hero.irrigation,
    kicker: "auth.panel.adminKicker",
    title: "auth.panel.adminTitle",
    body: "auth.panel.adminBody",
  },
};

export function AuthShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useLanguage();
  const reduce = useReducedMotion();
  const panel = panels[role];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden min-h-screen overflow-hidden lg:block">
        <motion.img
          key={panel.image}
          src={panel.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={reduce ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-primary-deep/55 to-ink/20" />
        <div className="relative flex h-full flex-col justify-between p-10 text-canvas">
          <Link to="/" className="inline-flex items-center gap-2 text-accent">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-accent">
              <Sprout size={18} />
            </span>
            <span className="font-display text-xl">{t("brand")}</span>
          </Link>
          <motion.div
            key={role}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {t(panel.kicker)}
            </p>
            <h2 className="mt-3 max-w-md font-display text-4xl leading-tight">{t(panel.title)}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-accent/85">{t(panel.body)}</p>
          </motion.div>
        </div>
      </aside>

      <section className="relative flex min-h-screen flex-col bg-cream grain">
        <div className="flex items-center justify-between px-5 py-4 md:px-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-primary">
            <ArrowLeft size={14} /> {t("auth.back")}
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-2 lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-accent">
                <Sprout size={14} />
              </span>
              <span className="font-display text-primary">{t("brand")}</span>
            </Link>
            <select
              aria-label={t("foundation.i18n")}
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="rounded-full border border-line bg-canvas px-2 py-1 text-xs text-ink-soft"
            >
              {languages.map((lng) => (
                <option key={lng} value={lng}>
                  {lng.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-8 md:px-10">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </section>
    </div>
  );
}
