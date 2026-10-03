import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, PackageCheck, Scissors, ShoppingCart, Sprout } from "lucide-react";

export function CropPassport() {
  const { t } = useTranslation();

  const steps = [
    { label: t("landing.passport.step1"), icon: Sprout },
    { label: t("landing.passport.step2"), icon: Leaf },
    { label: t("landing.passport.step3"), icon: PackageCheck },
    { label: t("landing.passport.step4"), icon: Scissors },
    { label: t("landing.passport.step5"), icon: ShoppingCart },
    { label: t("landing.passport.step6"), icon: Leaf },
  ];

  return (
    <section className="bg-green-900 py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <p className="text-yellow-400 font-semibold text-sm uppercase tracking-wide mb-3">
            {t("landing.passport.kicker")}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            {t("landing.passport.title")}
          </h2>
          <p className="text-green-200/80 text-base max-w-xl mx-auto leading-relaxed">
            {t("landing.passport.subtitle")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-0 sm:gap-0 max-w-4xl mx-auto overflow-x-auto pb-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex flex-row sm:flex-col items-center gap-3 sm:gap-0 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 hover:bg-white/20 transition-colors">
                    <Icon size={22} className="text-white" />
                  </div>
                  {i < steps.length - 1 && (
                    <>
                      <div className="hidden sm:block w-8 h-0.5 bg-green-600/60 flex-shrink-0" />
                      <div className="sm:hidden w-0.5 h-6 bg-green-600/60 flex-shrink-0 ml-7" />
                    </>
                  )}
                </div>
                <p className="text-xs text-green-200/80 text-center mt-2 sm:mt-2 whitespace-nowrap sm:w-20">
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-green-200/80 text-sm mb-6">{t("landing.passport.qrText")}</p>
          <Link
            to="/passport"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-green-950 font-bold transition-colors shadow-lg"
            aria-label={t("landing.passport.ctaAriaLabel")}
          >
            {t("landing.passport.cta")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
