import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CloudSun } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/intel", end: true, label: "intel.hub" },
  { to: "/weather", end: true, label: "intel.weather" },
  { to: "/weather/alerts", end: false, label: "intel.rainTab" },
  { to: "/calendar", end: true, label: "intel.calendar" },
  { to: "/reminders", end: true, label: "intel.reminders" },
  { to: "/schemes", end: true, label: "intel.schemes" },
  { to: "/sustainability", end: true, label: "nav.sustainability" },
];

export function IntelShell({
  kicker,
  title,
  lede,
  children,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src="/images/irrigation.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-primary-deep/70 to-nature-dark/40" />
        <div className="container-app relative py-12 md:py-16">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-accent">
            <CloudSun size={14} /> {kicker ?? t("intel.kicker")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-canvas md:text-5xl">{title}</h1>
          {lede && <p className="mt-3 max-w-2xl text-sm text-accent/90">{lede}</p>}
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
                  isActive ? "bg-primary text-accent" : "bg-canvas text-ink-soft border border-line"
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
