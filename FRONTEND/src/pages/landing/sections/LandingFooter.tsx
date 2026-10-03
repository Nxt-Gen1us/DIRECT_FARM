import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout } from "lucide-react";

export function LandingFooter() {
  const { t } = useTranslation();

  const links = [
    { key: "landing.footer.home", href: "#home" },
    { key: "landing.footer.about", href: "#" },
    { key: "landing.footer.forFarmers", href: "#farmer-benefits" },
    { key: "landing.footer.forCustomers", href: "#customer" },
    { key: "landing.footer.howItWorks", href: "#how-it-works" },
    { key: "landing.footer.contact", href: "#" },
    { key: "landing.footer.privacy", href: "#" },
    { key: "landing.footer.terms", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-white">
                <Sprout size={16} />
              </span>
              <span className="font-bold text-white text-base">DIRECT FARM</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("landing.footer.tagline")}
            </p>
          </div>

          {/* Links */}
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3" aria-label="Footer navigation">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">{t("landing.footer.copyright")}</p>
          <p className="text-xs text-gray-600">{t("landing.footer.langLabel")}: ગુજરાતી</p>
        </div>
      </div>
    </footer>
  );
}
