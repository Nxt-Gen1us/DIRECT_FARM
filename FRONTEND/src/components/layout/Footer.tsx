import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-green-800 bg-green-950 text-green-50">
      <div className="container-app grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="flex items-center gap-2 font-display text-2xl">
            <Leaf /> {t("brand")}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-yellow-300">{t("tagline")}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-green-100/80">
            {t("footer.aboutBody")}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-yellow-300">{t("nav.market")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/market" className="hover:text-canvas">{t("nav.market")}</Link>
            <Link to="/farmers" className="hover:text-canvas">{t("nav.farmers")}</Link>
            <Link to="/orders" className="hover:text-canvas">{t("nav.orders")}</Link>
            <Link to="/login" className="hover:text-canvas">{t("nav.login")}</Link>
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-yellow-300">{t("nav.weather")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/weather" className="hover:text-canvas">{t("nav.weather")}</Link>
            <Link to="/calendar" className="hover:text-canvas">{t("nav.calendar")}</Link>
            <Link to="/schemes" className="hover:text-canvas">{t("nav.schemes")}</Link>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.18em] text-yellow-300">{t("footer.contact")}</p>
          <p className="mt-3 flex items-start gap-2 text-sm">
            <MapPin size={14} className="mt-0.5 shrink-0" /> {t("footer.office1")}
          </p>
          <p className="mt-2 flex items-start gap-2 text-sm">
            <MapPin size={14} className="mt-0.5 shrink-0" /> {t("footer.office2")}
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <Phone size={14} /> +91 79 4000 1840
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <Mail size={14} /> hello@directfarm.com
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-green-100/70">
        © {new Date().getFullYear()} DIRECT FARM · {t("footer.rights")}
      </div>
    </footer>
  );
}
