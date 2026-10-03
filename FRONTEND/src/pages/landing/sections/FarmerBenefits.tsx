import { useTranslation } from "react-i18next";
import { BadgeCheck, Banknote, Handshake, PackageCheck, Sprout, TrendingUp } from "lucide-react";

export function FarmerBenefits() {
  const { t } = useTranslation();

  const benefits = [
    { icon: Banknote, title: t("landing.farmerBenefits.b1title"), desc: t("landing.farmerBenefits.b1desc") },
    { icon: Handshake, title: t("landing.farmerBenefits.b2title"), desc: t("landing.farmerBenefits.b2desc") },
    { icon: PackageCheck, title: t("landing.farmerBenefits.b3title"), desc: t("landing.farmerBenefits.b3desc") },
    { icon: TrendingUp, title: t("landing.farmerBenefits.b4title"), desc: t("landing.farmerBenefits.b4desc") },
    { icon: Sprout, title: t("landing.farmerBenefits.b5title"), desc: t("landing.farmerBenefits.b5desc") },
    { icon: BadgeCheck, title: t("landing.farmerBenefits.b6title"), desc: t("landing.farmerBenefits.b6desc") },
  ];

  return (
    <section id="farmer-benefits" className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900">
            {t("landing.farmerBenefits.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="group bg-green-50 border border-green-100 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition-all cursor-default"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
