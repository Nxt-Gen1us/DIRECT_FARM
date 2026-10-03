import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Menu, MessageCircle, Moon, ShoppingBasket, Sprout, Sun, UserRound, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NoticeBell } from "../chat/NoticeBell";
import { useChat } from "../../app/providers/ChatProvider";
import { useApp } from "../../app/providers/AppProviders";
import { headerLinks, navForRole } from "../../config/navigation";

export function Header() {
  const { t } = useTranslation();
  const { role, signedIn, user, logout, cartCount, wishlist, theme, toggleTheme } = useApp();
  const { unreadChats } = useChat();

  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navItems = (signedIn ? navForRole(role) : headerLinks)
    .filter((item) => ["home", "market", "orders", "farms", "farmer", "admin", "account"].includes(item.id))
    .map((item) => ({ id: item.id, path: item.path, labelKey: item.labelKey }));

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const mobileNav = navForRole(role).filter((item) => item.id !== "system");
  const isCustomer = !signedIn || role === "customer";
  const iconBtn =
    "relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg bg-green-50 text-green-800 transition hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700/30";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-shadow duration-500 ${
        elevated
          ? "border-green-100 bg-white/95 shadow-[0_10px_30px_-18px_rgb(20_35_26_/_0.2)]"
          : "border-transparent bg-white/90"
      }`}
    >
      <div className="container-app flex items-center gap-2 sm:gap-3 lg:gap-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg bg-green-700 text-white shadow-sm">
            <Sprout size={18} className="sm:hidden" />
            <Sprout size={20} className="hidden sm:block" />
          </span>
          <span className="leading-tight">
              <span className="block whitespace-nowrap font-display text-base sm:text-lg text-green-900 md:text-xl">
              {t("brand")}
            </span>
              <span className="hidden whitespace-nowrap text-[10px] tracking-[0.08em] text-gray-500 sm:block">
              {t("brandLine")}
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 xl:flex">
          {navItems.map((item) =>
            item.path.startsWith("/#") ? (
              <a
                key={item.id}
                href={item.path}
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-800"
              >
                {t(item.labelKey)}
              </a>
            ) : (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                    isActive ? "bg-green-700 text-white" : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ),
          )}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher compact className="hidden sm:inline-flex" />

          <button type="button" onClick={toggleTheme} className={iconBtn} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isCustomer && <Link
            to="/wishlist"
            className={`${iconBtn} hidden sm:grid`}
            aria-label={t("nav.wishlist")}
          >
            <Heart size={16} className="sm:hidden" />
            <Heart size={18} className="hidden sm:block" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-accent">
                {wishlist.length}
              </span>
            )}
          </Link>}
          <NoticeBell />
          <Link
            to="/chat"
            className={iconBtn}
            aria-label={t("nav.chat")}
          >
            <MessageCircle size={16} className="sm:hidden" />
            <MessageCircle size={18} className="hidden sm:block" />
            {unreadChats > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-accent">
                {unreadChats}
              </span>
            )}
          </Link>
          {isCustomer && <Link
            to="/cart"
            className={iconBtn}
            aria-label={t("nav.cart")}
          >
            <ShoppingBasket size={16} className="sm:hidden" />
            <ShoppingBasket size={18} className="hidden sm:block" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-accent">
                {cartCount}
              </span>
            )}
          </Link>}
          
          {/* Action Buttons Container - Always Horizontal */}
          <div className="flex flex-row items-center gap-1.5 sm:gap-2">
            {signedIn ? (
              <Link
                to="/account"
                className="hidden items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-lg bg-green-50 pl-1 sm:pl-1.5 pr-3 sm:pr-4 py-2 sm:py-2.5 text-green-800 transition-all duration-300 hover:bg-green-100 sm:inline-flex"
                aria-label={t("nav.account")}
              >
                <img src={user?.avatar} alt="" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full object-cover border-2 border-primary/10" />
                <span className="hidden max-w-28 truncate text-xs sm:text-sm font-medium lg:block">{user?.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-lg bg-green-700 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-green-800"
              >
                <UserRound size={16} className="shrink-0 sm:hidden" />
                <UserRound size={18} className="shrink-0 hidden sm:block" />
                <span className="hidden xs:inline">{t("nav.login")}</span>
              </Link>
            )}
          </div>
          
          <button
            className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg bg-green-700 text-white xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("common.menu")}
          >
            {open ? <X size={16} className="sm:hidden" /> : <Menu size={16} className="sm:hidden" />}
            {open ? <X size={18} className="hidden sm:block" /> : <Menu size={18} className="hidden sm:block" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[min(70vh,32rem)] overflow-y-auto border-t border-green-100 bg-white px-4 py-4 xl:hidden">
          <div className="grid gap-1">
            {mobileNav.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
              >
                {t(item.labelKey)}
              </NavLink>
            ))}
            {signedIn ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
                className="rounded-lg px-3 py-2 text-left text-sm text-green-800"
              >
                {t("nav.logout")}
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-green-800"
              >
                {t("nav.login")}
              </NavLink>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
