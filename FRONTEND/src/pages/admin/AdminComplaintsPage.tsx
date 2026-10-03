import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { complaints as seed } from "../../data/admin";
import type { Complaint } from "../../data/admin";
import { formatWhen } from "../../lib/format";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const KEY = "fc-admin-tickets";

function read(): Complaint[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Complaint[]) : seed;
  } catch {
    return seed;
  }
}

export function AdminComplaintsPage() {
  const { t } = useTranslation();
  const [list, setList] = useState<Complaint[]>(read);
  const [filter, setFilter] = useState<Complaint["status"] | "all">("all");

  const persist = (next: Complaint[]) => {
    setList(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  };

  const shown = filter === "all" ? list : list.filter((c) => c.status === filter);

  return (
    <div>
      <h2 className="font-display text-3xl">{t("desk.complaints")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.compLede")}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(["all", "open", "looking", "closed"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              filter === s ? "bg-primary text-accent" : "border border-line bg-canvas"
            }`}
          >
            {s === "all" ? t("desk.all") : t(`desk.tstatus.${s}`)}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {shown.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted">
                  {c.id} · {t(`desk.ckind.${c.kind}`)} · {formatWhen(c.at)}
                </p>
                <h3 className="mt-1 font-display text-xl">{t(`adminData.complaints.${c.id}.title`)}</h3>
                <p className="mt-1 text-sm text-ink-soft">{t(`adminData.complaints.${c.id}.body`)}</p>
                <p className="mt-2 text-xs text-muted">
                  {c.from} → {c.against}
                  {c.orderId && (
                    <>
                      {" · "}
                      <Link to={`/orders/${c.orderId}`} className="text-primary">
                        {c.orderId}
                      </Link>
                    </>
                  )}
                </p>
              </div>
              <Badge tone={c.status === "open" ? "primary" : c.status === "looking" ? "secondary" : "muted"}>
                {t(`desk.tstatus.${c.status}`)}
              </Badge>
            </div>
            {c.status !== "closed" && (
              <div className="mt-3 flex gap-2">
                {c.status === "open" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => persist(list.map((x) => (x.id === c.id ? { ...x, status: "looking" } : x)))}
                  >
                    {t("desk.look")}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => persist(list.map((x) => (x.id === c.id ? { ...x, status: "closed" } : x)))}
                >
                  {t("desk.closeTicket")}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
