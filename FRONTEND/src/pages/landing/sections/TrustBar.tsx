import { useTranslation } from "react-i18next";
import { BadgeCheck, FileText, PackageCheck, ShieldCheck, Wallet } from "lucide-react";

export function TrustAndImpact() {
  const { t } = useTranslation();

  const trustItems = [
    { label: t("landing.trust.t1"), icon: BadgeCheck },
    { label: t("landing.trust.t2"), icon: FileText },
    { label: t("landing.trust.t3"), icon: Wallet },
    { label: t("landing.trust.t4"), icon: ShieldCheck },
    { label: t("landing.trust.t5"), icon: PackageCheck },
  ];

  const impacts = [
    { label: t("landing.impact.i1"), desc: t("landing.impact.i1desc") },
    { label: t("landing.impact.i2"), desc: t("landing.impact.i2desc") },
    { label: t("landing.impact.i3"), desc: t("landing.impact.i3desc") },
  ];

  return (
    <section className="bg-green-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-8 lg:p-12 mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-8 text-center">
            {t("landing.trust.title")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {trustItems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center text-green-800 font-medium text-sm flex items-center justify-center gap-2"
              >
                <Icon size={14} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            {t("landing.impact.title")}
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {impacts.map((imp, i) => (
            <div key={i} className="text-center bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <p className="font-bold text-green-900 text-xl mb-1">{imp.label}</p>
              <p className="text-gray-500 text-sm">{imp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
