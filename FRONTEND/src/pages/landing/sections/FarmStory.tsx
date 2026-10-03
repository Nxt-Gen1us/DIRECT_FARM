import { useTranslation } from "react-i18next";
import { ArrowRight, BadgeCheck, Leaf, MapPin, Sprout } from "lucide-react";

const FARMER_IMG = "https://images.unsplash.com/photo-1595880375272-26a5ba3ee7bf?auto=format&fit=crop&q=80&w=600";
const FARM_IMG = "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80&w=800";

export function FarmStory() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-amber-50 to-green-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                src={FARM_IMG}
                alt={t("landing.farmStory.farmerName")}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={FARMER_IMG}
                    alt={t("landing.farmStory.farmerName")}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-300"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-sm">{t("landing.farmStory.farmerName")}</p>
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        <BadgeCheck size={12} />
                        {t("landing.farmStory.verifiedBadge")}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5 inline-flex items-center gap-1.5">
                      <MapPin size={12} />
                      {t("landing.farmStory.village")}
                      <span className="text-gray-300">•</span>
                      <Sprout size={12} />
                      {t("landing.farmStory.acres")}
                    </p>
                    <p className="text-gray-600 text-xs mt-1 inline-flex items-center gap-1.5">
                      <Leaf size={12} />
                      {t("landing.farmStory.crops")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-green-700 font-semibold text-sm uppercase tracking-wide mb-3">
              {t("landing.farmStory.kicker")}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-snug">
              {t("landing.farmStory.title")}
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {t("landing.farmStory.subtitle")}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors shadow-sm"
              aria-label={t("landing.farmStory.cta")}
            >
              {t("landing.farmStory.cta")}
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
