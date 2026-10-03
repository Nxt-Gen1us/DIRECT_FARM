import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CloudSun,
  Home,
  Leaf,
  LogOut,
  MessageSquareText,
  Package,
  Settings,
  Sprout,
  Tractor,
  Wallet,
} from "lucide-react";
import { useApp } from "../../app/providers/AppProviders";

export function FarmerSidebar() {
  const { t } = useTranslation();
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-primary text-accent shadow-[0_12px_24px_-18px_rgba(72,92,52,0.8)]"
        : "text-ink-soft hover:bg-canvas-soft hover:text-ink"
    }`;

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-line/70 bg-cream sm:w-72">
      <div className="flex h-16 items-center border-b border-line/70 px-6">
        <Link to="/" className="flex items-center gap-2 text-primary font-display text-xl">
          <Sprout size={22} />
          {t("brand")}
        </Link>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
        <nav className="space-y-1.5">
          <NavLink to="/farmer" end className={navItemClass}>
            <Home size={18} />
            <span>{t("farmerNav.home")}</span>
          </NavLink>
          <NavLink to="/farmer/products" className={navItemClass}>
            <Leaf size={18} />
            <span>{t("farmerNav.products")}</span>
          </NavLink>
          <NavLink to="/farmer/orders" className={navItemClass}>
            <Package size={18} />
            <span>{t("farmerNav.orders")}</span>
          </NavLink>
          <NavLink to="/farmer/earnings" className={navItemClass}>
            <Wallet size={18} />
            <span>{t("farmerNav.earnings")}</span>
          </NavLink>
          <NavLink to="/farmer/farm" className={navItemClass}>
            <Tractor size={18} />
            <span>{t("farmerNav.farm")}</span>
          </NavLink>
        </nav>

        <div>
          <p className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {t("farmerNav.more")}
          </p>
          <nav className="space-y-1.5">
            <NavLink to="/farmer/weather" className={navItemClass}>
              <CloudSun size={18} />
              <span>{t("farmerNav.weather")}</span>
            </NavLink>
            <NavLink to="/farmer/messages" className={navItemClass}>
              <MessageSquareText size={18} />
              <span>{t("farmerNav.messages")}</span>
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="space-y-1.5 border-t border-line/70 p-4">
        <NavLink to="/farmer/settings" className={navItemClass}>
          <Settings size={18} />
          <span>{t("farmerNav.settings")}</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-canvas-soft hover:text-ink"
        >
          <LogOut size={18} />
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </aside>
  );
}
