import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Menu, MessageCircle, ShoppingBasket, Sprout, UserRound, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NoticeBell } from "../chat/NoticeBell";
import { useChat } from "../../app/providers/ChatProvider";
import { useApp } from "../../app/providers/AppProviders";
import { headerLinks, landingAnchors, navForRole } from "../../config/navigation";
import { roleHome } from "../../config/roles";
import type { Role } from "../../lib/types";

export function Header() {
  const { t } = useTranslation();
  const { role, setRole, signedIn, user, logout, cartCount, wishlist } = useApp();
  const { unreadChats } = useChat();

  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onLanding = pathname === "/";
  const navItems = onLanding
    ? landingAnchors.map((a) => ({ id: a.id, path: a.href, labelKey: a.labelKey }))
    : headerLinks.map((item) => ({ id: item.id, path: item.path, labelKey: item.labelKey }));

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
  const iconBtn =
    "relative grid h-10 w-10 place-items-center rounded-full bg-accent text-ink transition hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-shadow duration-500 ${
        elevated
          ? "border-line/80 bg-cream/92 shadow-[0_10px_30px_-18px_rgb(36_22_16_/_0.35)]"
          : "border-transparent bg-cream/80"
      }`}
    >
      <div className="container-app flex items-center gap-3 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-accent shadow-[0_8px_20px_-10px_rgb(139_38_38_/_0.7)]">
            <Sprout size={20} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg text-primary md:text-xl">
              {t("brand")}
            </span>
            <span className="hidden text-[10px] tracking-[0.08em] text-muted sm:block">
              {t("brandLine")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) =>
            item.path.startsWith("/#") ? (
              <a
                key={item.id}
                href={item.path}
                className="rounded-full px-3 py-1.5 text-sm text-ink-soft transition hover:bg-accent/60"
              >
                {t(item.labelKey)}
              </a>
            ) : (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-sm transition ${
                    isActive ? "bg-primary text-accent" : "text-ink-soft hover:bg-accent/60"
                  }`
                }
              >
                {t(item.labelKey)}
              </NavLink>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <LanguageSwitcher compact className="hidden sm:inline-flex" />

          <select
            aria-label={t("roles.switch")}
            value={role}
            onChange={(e) => {
              const next = e.target.value as Role;
              setRole(next);
              navigate(roleHome[next]);
            }}
            className="hidden rounded-full border border-line bg-canvas px-2 py-1.5 text-xs text-ink-soft outline-none focus-visible:ring-2 focus-visible:ring-accent lg:block"
          >
            <option value="customer">{t("roles.customer")}</option>
            <option value="farmer">{t("roles.farmer")}</option>
            <option value="admin">{t("roles.admin")}</option>
          </select>

          <Link
            to="/wishlist"
            className={`${iconBtn} hidden sm:grid`}
            aria-label={t("nav.wishlist")}
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-accent">
                {wishlist.length}
              </span>
            )}
          </Link>
          <NoticeBell />
          <Link
            to="/chat"
            className={iconBtn}
            aria-label={t("nav.chat")}
          >
            <MessageCircle size={18} />
            {unreadChats > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-accent">
                {unreadChats}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className={iconBtn}
            aria-label={t("nav.cart")}
          >
            <ShoppingBasket size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-accent">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/market"
            className="hidden rounded-full bg-secondary px-4 py-2 text-xs font-medium text-white shadow-[0_10px_24px_-12px_rgb(239_105_5_/_0.5)] transition hover:bg-secondary-dark md:inline-flex"
          >
            {t("landing.hero.cta")}
          </Link>
          {signedIn ? (
            <Link
              to="/account"
              className="hidden items-center gap-2 rounded-full bg-primary-soft pl-1 pr-3 py-1 text-primary sm:inline-flex"
              aria-label={t("nav.account")}
            >
              <img src={user?.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
              <span className="hidden max-w-28 truncate text-xs font-medium lg:block">{user?.name}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden h-10 items-center gap-1.5 rounded-full bg-primary-soft px-3 text-sm font-medium text-primary sm:inline-flex"
            >
              <UserRound size={16} /> {t("nav.login")}
            </Link>
          )}
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-accent xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("common.menu")}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[min(70vh,32rem)] overflow-y-auto border-t border-line bg-cream px-4 py-4 xl:hidden">
          <div className="grid gap-1">
            {mobileNav.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-ink hover:bg-accent/70"
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
                className="rounded-xl px-3 py-2 text-left text-sm text-primary"
              >
                {t("nav.logout")}
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-primary"
              >
                {t("nav.login")}
              </NavLink>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <LanguageSwitcher />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="rounded-full border border-line bg-canvas px-2 py-1 text-xs"
            >
              <option value="customer">{t("roles.customer")}</option>
              <option value="farmer">{t("roles.farmer")}</option>
              <option value="admin">{t("roles.admin")}</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
