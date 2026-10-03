import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, FileCheck2, MessageSquareWarning, UsersRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { complaints, deskKpis } from "../../data/admin";
import { compactInr } from "../../lib/format";
import { Badge } from "../../components/ui/Badge";
import { apiConfigured } from "../../lib/api";
import { fetchAdminStats, type AdminStats } from "../../lib/api/admin";

export function AdminOverviewPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  useEffect(() => { if (apiConfigured()) void fetchAdminStats().then(setStats).catch(() => setStats(null)); }, []);
  const live = stats ?? { gmv: deskKpis.gmv, orders: deskKpis.orders, farmers: deskKpis.farmers, buyers: deskKpis.buyers, lots: deskKpis.lots };
  const kpis = [
    { k: t("desk.gmv"), v: compactInr(live.gmv), to: "/admin/orders", icon: "₹" },
    { k: t("desk.orders"), v: live.orders.toLocaleString("gu-IN"), to: "/admin/orders", icon: <ClipboardList size={18} /> },
    { k: t("desk.farmers"), v: String(live.farmers), to: "/admin/farmers", icon: <UsersRound size={18} /> },
    { k: t("desk.buyers"), v: live.buyers.toLocaleString("gu-IN"), to: "/admin/customers", icon: <UsersRound size={18} /> },
    { k: t("desk.lots"), v: String(live.lots), to: "/admin/products", icon: <CheckCircle2 size={18} /> },
  ];
  const actions = [
    { to: "/admin/verify", icon: <FileCheck2 size={20} />, title: t("desk.verify"), body: t("desk.verifyLede") },
    { to: "/admin/orders", icon: <ClipboardList size={20} />, title: t("desk.orders"), body: t("desk.ordersLede") },
    { to: "/admin/complaints", icon: <MessageSquareWarning size={20} />, title: t("desk.complaints"), body: t("desk.compLede") },
  ];
  return <div className="admin-home">
    <div className="admin-welcome"><p className="admin-eyebrow">DIRECT FARM</p><h2>{t("desk.overview")}</h2><p>{t("desk.overviewLede")}</p></div>
    <div className="admin-kpis">{kpis.map((item) => <Link key={item.k} to={item.to} className="admin-kpi"><span className="admin-kpi-icon">{item.icon}</span><span className="admin-kpi-label">{item.k}</span><strong>{item.v}</strong></Link>)}</div>
    <section className="admin-section"><div className="admin-section-heading"><div><p className="admin-eyebrow">{t("adminUi.todayTasks")}</p><h3>{t("adminUi.mainTaskList")}</h3></div></div><div className="admin-action-grid">{actions.map((action) => <Link key={action.to} to={action.to} className="admin-action"><span>{action.icon}</span><div><h4>{action.title}</h4><p>{action.body}</p></div></Link>)}</div></section>
    <section className="admin-section"><div className="admin-section-heading"><div><p className="admin-eyebrow">{t("adminUi.attention")}</p><h3>{t("desk.openTickets")}</h3></div><Link to="/admin/complaints" className="admin-text-link">{t("common.viewAll")} <span aria-hidden="true">→</span></Link></div><div className="admin-list">{complaints.filter((c) => c.status !== "closed").slice(0, 4).map((c) => <div key={c.id} className="admin-list-row"><div><strong>{t(`adminData.complaints.${c.id}.title`)}</strong><small>{c.id} · {c.from}</small></div><Badge tone={c.status === "open" ? "primary" : "secondary"}>{t(`desk.tstatus.${c.status}`)}</Badge></div>)}</div></section>
  </div>;
}
