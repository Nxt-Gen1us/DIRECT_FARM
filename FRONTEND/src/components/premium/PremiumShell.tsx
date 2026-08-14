import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Crown } from "lucide-react";
import type { ReactNode } from "react";
import { premiumLive } from "../../lib/premium/api";

const tabs = [
  { to: "/premium", end: true, label: "plus.hub" },
  { to: "/premium/auction", end: false, label: "plus.auction" },
  { to: "/premium/community", end: false, label: "plus.circle" },
  { to: "/premium/experts", end: false, label: "plus.experts" },
  { to: "/premium/forecast", end: false, label: "plus.forecast" },
  { to: "/premium/contracts", end: false, label: "plus.contracts" },
  { to: "/premium/equipment", end: false, label: "plus.equipment" },
  { to: "/premium/warehouse", end: false, label: "plus.warehouse" },
  { to: "/premium/cold", end: false, label: "plus.cold" },
];

export function PremiumShell({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const live = premiumLive();
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src="/images/harvest.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-primary-deep/70 to-secondary/30" />
        <div className="container-app relative py-12 md:py-16">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-accent">
            <Crown size={14} /> {t("plus.kicker")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-canvas md:text-5xl">{title}</h1>
          {lede && <p className="mt-3 max-w-2xl text-sm text-accent/90">{lede}</p>}
          <p className="mt-4 inline-flex rounded-full bg-canvas/15 px-3 py-1 text-[11px] uppercase tracking-wider text-accent">
            {live ? t("plus.apiLive") : t("plus.apiDark")}
          </p>
        </div>
      </section>
      <div className="border-b border-line bg-cream/90">
        <nav className="container-app flex gap-1 overflow-x-auto py-3 no-scrollbar">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${
                  isActive ? "bg-primary text-accent" : "border border-line bg-canvas text-ink-soft"
                }`
              }
            >
              {t(tab.label)}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="container-app py-8 md:py-10">{children}</div>
    </div>
  );
}
