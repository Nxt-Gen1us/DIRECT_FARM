import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  Landmark,
  Package,
  ShieldCheck,
  UsersRound,
  Users,
} from "lucide-react";

const links = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "desk.overview" },
  { to: "/admin/users", end: false, icon: Users, label: "desk.users" },
  { to: "/admin/farmers", end: false, icon: Landmark, label: "desk.farmers" },
  { to: "/admin/customers", end: false, icon: UsersRound, label: "desk.customers" },
  { to: "/admin/products", end: false, icon: Package, label: "desk.products" },
  { to: "/admin/orders", end: false, icon: ClipboardList, label: "desk.orders" },
  { to: "/admin/payments", end: false, icon: CreditCard, label: "desk.payments" },
  { to: "/admin/verify", end: false, icon: ShieldCheck, label: "desk.verify" },
  { to: "/admin/complaints", end: false, icon: AlertTriangle, label: "desk.complaints" },
  { to: "/admin/reports", end: false, icon: FileSpreadsheet, label: "desk.reports" },
];

export function AdminShell() {
  const { t } = useTranslation();
  return (
    <div className="workspace-redesign admin-redesign">
      <section className="border-b border-line bg-canvas">
        <div className="container-app py-8">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">{t("desk.kicker")}</p>
          <h1 className="mt-1 font-display text-4xl text-ink">{t("desk.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">{t("desk.lede")}</p>
        </div>
      </section>
      <div className="container-app grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-[1.25rem] border border-line bg-card p-2 lg:sticky lg:top-24">
          <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                      isActive ? "bg-primary text-accent" : "text-ink-soft hover:bg-cream"
                    }`
                  }
                >
                  <Icon size={15} />
                  {t(l.label)}
                </NavLink>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
