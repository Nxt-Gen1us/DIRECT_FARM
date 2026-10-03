import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Sprout } from "lucide-react";
import type { ReactNode } from "react";
import type { Role } from "../../lib/types";
import { images } from "../../assets";
import { useLanguage } from "../../hooks/useLanguage";
import "./auth-redesign.css";

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
    <div className="auth-redesign min-h-screen bg-green-950 lg:grid lg:grid-cols-[1.08fr_.92fr]">
      <aside className="auth-visual relative min-h-[32vh] overflow-hidden sm:min-h-[38vh] lg:min-h-screen">
        <motion.img
          key={panel.image}
          src={panel.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={reduce ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-900/65 to-green-800/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/75 via-transparent to-green-950/15" />
        <div className="relative flex min-h-[32vh] flex-col justify-between p-5 text-white sm:min-h-[38vh] sm:p-8 lg:min-h-screen lg:p-12">
          <Link to="/" className="inline-flex items-center gap-2 text-accent">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-700 text-white">
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
            <p className="auth-kicker text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {t(panel.kicker)}
            </p>
            <h2 className="auth-visual-title mt-3 max-w-xl font-display text-2xl leading-tight sm:text-3xl lg:text-5xl">{t(panel.title)}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-green-50/90 sm:mt-4 sm:text-base">{t(panel.body)}</p>
          </motion.div>
        </div>
      </aside>

      <section className="auth-form-side relative flex min-h-[68vh] flex-col bg-[#f5f8f2] lg:min-h-screen">
        <div className="auth-topbar flex items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-primary">
            <ArrowLeft size={14} /> {t("auth.back")}
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-2 lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-green-700 text-white">
                <Sprout size={14} />
              </span>
              <span className="font-display text-primary">{t("brand")}</span>
            </Link>
            <select
              aria-label={t("foundation.i18n")}
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="rounded-md border border-green-200 bg-white px-2.5 py-1.5 text-xs text-green-950"
            >
              {languages.map((lng) => (
                <option key={lng} value={lng}>
                  {t(`langShort.${lng}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
          <div className="auth-card w-full max-w-lg rounded-lg border border-green-100 bg-white p-5 shadow-[0_24px_70px_-38px_rgb(20_83_45_/_0.35)] sm:p-8 lg:p-10">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
