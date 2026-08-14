import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { farmers } from "../../data/farmers";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const KEY = "fc-admin-verify";

function readMap(): Record<string, "approved" | "held"> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, "approved" | "held">) : {};
  } catch {
    return {};
  }
}

export function AdminVerifyPage() {
  const { t } = useTranslation();
  const [map, setMap] = useState<Record<string, "approved" | "held">>(readMap);
  const queue = farmers.filter((f) => f.sustainabilityScore < 80 || map[f.id]);

  const setState = (id: string, state: "approved" | "held") => {
    const next = { ...map, [id]: state };
    setMap(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  };

  return (
    <div>
      <h2 className="font-display text-3xl">{t("desk.verify")}</h2>
      <p className="mt-1 text-sm text-ink-soft">{t("desk.verifyLede")}</p>
      <div className="mt-6 space-y-3">
        {queue.map((f) => {
          const decided = map[f.id];
          const pending = !decided;
          return (
            <Card key={f.id} className="flex flex-wrap items-center gap-4 p-4">
              <img src={f.cover} alt="" className="h-16 w-24 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{f.farmName}</p>
                <p className="text-xs text-muted">
                  {f.name} · {f.district}, {f.state} · {f.acres} acres · score {f.sustainabilityScore}
                </p>
                <p className="mt-1 text-xs text-ink-soft">{f.certifications.join(" · ")}</p>
              </div>
              <Badge tone={decided === "approved" ? "nature" : decided === "held" ? "secondary" : "muted"}>
                {t(`desk.vstatus.${decided ?? "pending"}`)}
              </Badge>
              <Button size="sm" disabled={!pending} onClick={() => setState(f.id, "approved")}>
                {t("desk.approve")}
              </Button>
              <Button size="sm" variant="ghost" disabled={!pending} onClick={() => setState(f.id, "held")}>
                {t("desk.hold")}
              </Button>
              <Link to={`/farmers/${f.id}`} className="text-xs text-primary">
                {t("desk.openFarm")}
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
