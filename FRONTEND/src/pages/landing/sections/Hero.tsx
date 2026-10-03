import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, BadgeCheck, ShieldCheck, ShoppingCart, Sprout, Users } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1920";

export function LandingHero() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: { duration: 0.7, delay, ease: "easeOut" as const },
        };

  const trustItems = [
    { label: t("landing.hero.trust1"), icon: ShieldCheck },
    { label: t("landing.hero.trust2"), icon: BadgeCheck },
    { label: t("landing.hero.trust3"), icon: Sprout },
    { label: t("landing.hero.trust4"), icon: ShoppingCart },
  ];

  const flowItems = [
    { icon: Users, label: t("landing.value.farmerLabel"), desc: t("landing.value.farmerDesc"), color: "bg-green-500/20 border-green-400/40" },
    { icon: Sprout, label: "DIRECT FARM", desc: t("landing.value.platformDesc"), color: "bg-yellow-400/20 border-yellow-400/40" },
    { icon: ShoppingCart, label: t("landing.value.customerLabel"), desc: t("landing.value.customerDesc"), color: "bg-blue-400/20 border-blue-400/40" },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800 min-h-[88vh] flex items-center">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, ease: "linear" }}
      >
        <img
          src={HERO_IMG}
          alt={t("landing.hero.imgAlt")}
          className="w-full h-full object-cover object-center opacity-30"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-900/60 to-green-800/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div {...fade(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-sm font-medium mb-6">
                <Sprout size={16} />
                {t("landing.hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              {...fade(0.1)}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-6"
            >
              <span className="block">{t("landing.hero.title1")}</span>
              <span className="block text-yellow-300">{t("landing.hero.title2")}</span>
            </motion.h1>

            <motion.p
              {...fade(0.2)}
              className="text-green-100/90 text-base sm:text-lg leading-relaxed max-w-lg mb-8"
            >
              {t("landing.hero.subtitle")}
            </motion.p>

            <motion.div {...fade(0.3)} className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to="/register?role=farmer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-green-950 font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                aria-label={t("landing.cta.farmerAriaLabel")}
              >
                {t("landing.hero.farmerCta")}
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/market"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label={t("landing.cta.customerAriaLabel")}
              >
                {t("landing.hero.customerCta")}
              </Link>
            </motion.div>

            <motion.div {...fade(0.4)} className="flex flex-wrap gap-x-5 gap-y-2">
              {trustItems.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2 text-sm text-green-200/80 font-medium">
                  <Icon size={14} className="text-yellow-300" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="hidden lg:block"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="space-y-1">
                {flowItems.map((item, i) => (
                  <div key={item.label} className={`rounded-2xl border p-4 ${item.color}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <item.icon size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{item.label}</p>
                        <p className="text-white/60 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center py-2 text-white/60">
                  <ArrowDown size={18} />
                </div>
              </div>
              <p className="mt-5 text-center text-xs text-white/50 leading-relaxed">
                {t("landing.value.delivery")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
