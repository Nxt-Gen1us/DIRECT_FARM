import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout, ChevronDown, Menu, X } from "lucide-react";
import { clsx } from "clsx";

const LANGS = [
  { code: "gu", label: "ગુજરાતી" },
  { code: "hi", label: "हिन्दी" },
  { code: "en", label: "English" },
];

export function LandingNavbar() {
  const { t, i18n } = useTranslation();
  const [elevated, setElevated] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
  }, [pathname]);

  const currentLang = LANGS.find((l) => i18n.language?.startsWith(l.code)) ?? LANGS[0];

  const navLinks = [
    { labelKey: "landing.nav.home", href: "#home" },
    { labelKey: "landing.nav.forFarmers", href: "#farmer-benefits" },
    { labelKey: "landing.nav.forCustomers", href: "#customer" },
    { labelKey: "landing.nav.howItWorks", href: "#how-it-works" },
  ];

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-all duration-300",
        elevated
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-green-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label={`${t("brand")} - ${t("landing.nav.home")}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-white shadow-sm">
              <Sprout size={20} />
            </span>
            <span className="font-bold text-lg text-green-900 tracking-tight leading-none">
              DIRECT FARM
            </span>
          </Link>

          {/* Center Nav — Desktop */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-800 transition-colors"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>

          {/* Right Actions — Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-800 transition-colors"
                aria-label={t("landing.footer.langLabel")}
                aria-expanded={langOpen}
              >
                {currentLang.label}
                <ChevronDown size={14} className={clsx("transition-transform", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden z-50">
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={clsx(
                        "w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 transition-colors",
                        i18n.language?.startsWith(lang.code)
                          ? "text-green-800 font-semibold bg-green-50"
                          : "text-gray-700"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-green-800 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
            >
              {t("landing.nav.login")}
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-sm"
              aria-label={t("landing.cta.farmerAriaLabel")}
            >
              {t("landing.nav.getStarted")}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-green-50"
            aria-label={t("landing.nav.menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.labelKey}
              href={link.href}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-800"
              onClick={() => setMobileOpen(false)}
            >
              {t(link.labelKey)}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              {LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setMobileOpen(false);
                  }}
                  className={clsx(
                    "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                    i18n.language?.startsWith(lang.code)
                      ? "border-green-600 bg-green-50 text-green-800 font-semibold"
                      : "border-gray-200 text-gray-600"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2.5 text-sm font-medium border border-green-300 text-green-800 rounded-lg"
            >
              {t("landing.nav.login")}
            </Link>
            <Link
              to="/register"
              className="block w-full text-center px-4 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-lg"
            >
              {t("landing.nav.getStarted")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
