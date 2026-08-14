import { useState } from "react";
import { useTranslation } from "react-i18next";
import { farmers } from "../../data/farmers";
import { adminKpis } from "../../data/weather";
import { compactInr } from "../../lib/format";
import { Card, SectionHead } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

export function AdminDeskPage() {
  const { t } = useTranslation();
  const [held, setHeld] = useState<string[]>([]);
  const [approved, setApproved] = useState<string[]>([]);
  const pending = farmers.slice(3);

  const kpis = [
    { k: t("admin.gmv"), v: compactInr(adminKpis.gmv) },
    { k: t("admin.orders"), v: adminKpis.orders.toLocaleString("en-IN") },
    { k: t("admin.farmers"), v: adminKpis.farmers.toLocaleString("en-IN") },
    { k: t("admin.buyers"), v: adminKpis.buyers.toLocaleString("en-IN") },
    { k: t("admin.passports"), v: adminKpis.passports.toLocaleString("en-IN") },
    { k: t("admin.disputes"), v: String(adminKpis.disputes) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <SectionHead kicker={t("nav.admin")} title={t("admin.title")} />
      <p className="-mt-4 mb-8 text-sm text-ink-soft">{t("admin.subtitle")}</p>
      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {kpis.map((x) => (
          <Card key={x.k} className="p-5">
            <p className="text-xs uppercase tracking-widest text-muted">{x.k}</p>
            <p className="mt-2 font-display text-3xl text-primary">{x.v}</p>
          </Card>
        ))}
      </div>

      <h3 className="mb-4 font-display text-2xl">{t("admin.review")}</h3>
      <div className="space-y-3">
        {pending.map((f) => {
          const state = approved.includes(f.id)
            ? "approved"
            : held.includes(f.id)
              ? "held"
              : "pending";
          return (
            <Card key={f.id} className="flex flex-wrap items-center gap-4 p-4">
              <img src={f.cover} alt="" className="h-16 w-24 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{f.farmName}</p>
                <p className="text-xs text-muted">
                  {f.name} · {f.district}, {f.state} · {f.acres} acres
                </p>
              </div>
              <Badge
                tone={state === "approved" ? "nature" : state === "held" ? "secondary" : "muted"}
              >
                {state}
              </Badge>
              <Button
                className="px-3 py-1.5 text-xs"
                onClick={() => setApproved((a) => [...a, f.id])}
                disabled={state !== "pending"}
              >
                {t("admin.approve")}
              </Button>
              <Button
                variant="ghost"
                className="px-3 py-1.5 text-xs"
                onClick={() => setHeld((a) => [...a, f.id])}
                disabled={state !== "pending"}
              >
                {t("admin.hold")}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
