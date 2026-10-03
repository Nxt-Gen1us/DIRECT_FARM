import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileSpreadsheet } from "lucide-react";
import { deskReports } from "../../data/admin";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function AdminReportsPage() {
  const { t } = useTranslation();
  const [queued, setQueued] = useState<string[]>([]);

  return (
    <div>
      <h2 className="font-display text-3xl">{t("desk.reports")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.reportsLede")}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {deskReports.map((r) => {
          const asked = queued.includes(r.id);
          return (
            <Card key={r.id} className="p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
                <FileSpreadsheet size={18} />
              </span>
              <h3 className="mt-3 font-display text-xl">{t(`adminUi.report${r.kind === "gmv" ? "Gmv" : "Farm"}Title`)}</h3>
              <p className="text-xs text-muted">{t(`adminUi.${r.kind === "gmv" ? "reportAprilPeriod" : "reportWeekPeriod"}`)}</p>
              <div className="mt-3 flex items-center justify-between">
                <Badge tone={r.ready ? "nature" : "muted"}>{r.ready ? t("desk.ready") : t("desk.draft")}</Badge>
                <Button
                  size="sm"
                  variant={asked ? "ghost" : "primary"}
                  onClick={() => setQueued((q) => (q.includes(r.id) ? q : [...q, r.id]))}
                >
                  {asked ? t("desk.queued") : t("desk.queue")}
                </Button>
              </div>
              {asked && <p className="mt-3 text-xs text-ink-soft">{t("desk.queueNote")}</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
