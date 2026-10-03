import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 py-20 lg:py-28 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {t("landing.cta.title")}
        </h2>
        <p className="text-green-200/80 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {t("landing.cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register?role=farmer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-green-950 font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
            aria-label={t("landing.cta.farmerAriaLabel")}
          >
            {t("landing.cta.farmerBtn")}
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/register?role=customer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label={t("landing.cta.customerAriaLabel")}
          >
            {t("landing.cta.customerBtn")}
          </Link>
        </div>
      </div>
    </section>
  );
}
