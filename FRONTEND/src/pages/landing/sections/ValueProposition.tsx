import { useTranslation } from "react-i18next";
import { ArrowDown, ShoppingCart, Sprout, Users } from "lucide-react";

export function ValueProposition() {
  const { t } = useTranslation();

  const cards = [
    { Icon: Users, title: t("landing.value.farmerLabel"), desc: t("landing.value.farmerDesc"), className: "bg-green-50 border-green-200 text-green-900" },
    { Icon: Sprout, title: t("landing.value.platformLabel"), desc: t("landing.value.platformDesc"), className: "bg-yellow-50 border-yellow-300 text-yellow-900" },
    { Icon: ShoppingCart, title: t("landing.value.customerLabel"), desc: t("landing.value.customerDesc"), className: "bg-blue-50 border-blue-200 text-blue-900" },
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
            {t("landing.value.title")}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("landing.value.subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
          {cards.map(({ Icon, title, desc, className }) => (
            <div key={title} className="w-full max-w-sm">
              <div className={`border-2 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow ${className}`}>
                <div className="mb-3 flex justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                    <Icon size={26} />
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-1">{title}</h3>
                <p className="text-sm opacity-80">{desc}</p>
              </div>

              {title !== cards[cards.length - 1].title && (
                <div className="flex flex-col items-center py-3">
                  <div className="w-0.5 h-8 bg-green-300" />
                  <div className="text-green-600"><ArrowDown size={18} /></div>
                  <div className="w-0.5 h-4 bg-green-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
          {t("landing.value.delivery")}
        </p>
      </div>
    </section>
  );
}
