import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { deskUsers } from "../../data/admin";
import { farmers } from "../../data/farmers";
import { formatDate } from "../../lib/format";
import type { Role } from "../../lib/types";
import { Badge } from "../../components/ui/Badge";
import { DeskTable } from "../../components/admin/DeskTable";

export function AdminPeoplePage({ mode }: { mode: "users" | "farmers" | "customers" }) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [role, setRole] = useState<Role | "all">("all");

  const people = useMemo(() => {
    let list = deskUsers;
    if (mode === "farmers") list = deskUsers.filter((u) => u.role === "farmer");
    if (mode === "customers") list = deskUsers.filter((u) => u.role === "customer");
    if (role !== "all") list = list.filter((u) => u.role === role);
    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((u) =>
        `${u.name} ${u.email} ${u.place}`.toLowerCase().includes(needle),
      );
    }
    return list;
  }, [mode, q, role]);

  const title =
    mode === "farmers" ? t("desk.farmers") : mode === "customers" ? t("desk.customers") : t("desk.users");

  return (
    <div>
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.peopleLede")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("desk.searchPeople")}
          className="min-w-[200px] flex-1 rounded-full border border-line bg-canvas px-4 py-2 text-sm outline-none"
        />
        {mode === "users" && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role | "all")}
            className="rounded-full border border-line bg-canvas px-3 py-2 text-sm"
          >
            <option value="all">{t("desk.allRoles")}</option>
            <option value="customer">{t("roles.customer")}</option>
            <option value="farmer">{t("roles.farmer")}</option>
            <option value="admin">{t("roles.admin")}</option>
          </select>
        )}
      </div>
      <div className="mt-5">
        <DeskTable head={[t("desk.col.name"), t("desk.col.role"), t("desk.col.place"), t("desk.col.joined"), t("desk.col.status")]}>
          {people.map((u) => {
            const farm = farmers.find((f) => f.userId === u.id || f.name === u.name);
            return (
              <tr key={u.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-[11px] text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{t(`roles.${u.role}`)}</td>
                <td className="px-4 py-3 text-ink-soft">{u.place}</td>
                <td className="px-4 py-3 text-ink-soft">{formatDate(u.joinedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge tone={u.status === "active" ? "nature" : u.status === "held" ? "secondary" : "muted"}>
                      {t(`desk.ustatus.${u.status}`)}
                    </Badge>
                    {farm && (
                      <Link to={`/farmers/${farm.id}`} className="text-xs text-primary">
                        {t("desk.openFarm")}
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </DeskTable>
      </div>
    </div>
  );
}
