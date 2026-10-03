import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Search, Truck, Users } from "lucide-react";

const PRODUCE_IMG = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=900";

export function CustomerSection() {
  const { t } = useTranslation();

  const cards = [
    { icon: Leaf, title: t("landing.customer.c1title"), desc: t("landing.customer.c1desc") },
    { icon: Users, title: t("landing.customer.c2title"), desc: t("landing.customer.c2desc") },
    { icon: Search, title: t("landing.customer.c3title"), desc: t("landing.customer.c3desc") },
    { icon: Truck, title: t("landing.customer.c4title"), desc: t("landing.customer.c4desc") },
  ];

  return (
    <section id="customer" className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
            <img
              src={PRODUCE_IMG}
              alt={t("landing.customer.c1title")}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-8">
              {t("landing.customer.title")}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {cards.map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-700">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <Link
              to="/market"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors shadow-sm"
              aria-label={t("landing.customer.ctaAriaLabel")}
            >
              {t("landing.customer.cta")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
