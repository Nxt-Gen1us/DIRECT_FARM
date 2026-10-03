import { useTranslation } from "react-i18next";
import { Camera, Coins, ShoppingCart, Truck } from "lucide-react";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { icon: Camera, title: t("landing.how.s1title"), desc: t("landing.how.s1desc"), num: "1" },
    { icon: Coins, title: t("landing.how.s2title"), desc: t("landing.how.s2desc"), num: "2" },
    { icon: ShoppingCart, title: t("landing.how.s3title"), desc: t("landing.how.s3desc"), num: "3" },
    { icon: Truck, title: t("landing.how.s4title"), desc: t("landing.how.s4desc"), num: "4" },
  ];

  return (
    <section id="how-it-works" className="bg-green-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900">
            {t("landing.how.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-1rem)] w-8 border-t-2 border-dashed border-green-300 z-0" />
                )}
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100 hover:shadow-md transition-shadow h-full relative z-10">
                  <div className="w-8 h-8 rounded-full bg-green-700 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4">
                    {step.num}
                  </div>
                  <div className="mb-4 flex justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                      <Icon size={22} />
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
