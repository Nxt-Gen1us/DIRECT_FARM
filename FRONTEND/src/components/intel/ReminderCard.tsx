import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Droplets, FlaskConical, Scissors, Sprout } from "lucide-react";
import type { FieldReminder } from "../../lib/types";
import { formatDate } from "../../lib/format";
import { Badge } from "../ui";
import { Card } from "../ui/Card";

const icons = {
  fertilizer: FlaskConical,
  harvest: Scissors,
  spray: Sprout,
  irrigate: Droplets,
};

const prio: Record<FieldReminder["priority"], "primary" | "secondary" | "muted"> = {
  now: "primary",
  soon: "secondary",
  later: "muted",
};

export function ReminderCard({ item }: { item: FieldReminder }) {
  const { t } = useTranslation();
  const Icon = icons[item.kind];
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
          <Icon size={18} />
        </span>
        <Badge tone={prio[item.priority]}>{t(`intel.prio.${item.priority}`)}</Badge>
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-wider text-muted">
        {t(`intel.rkind.${item.kind}`)} · {item.crop}
      </p>
      <h3 className="mt-1 font-display text-2xl text-ink">{item.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted">{t("intel.due")}</dt>
          <dd className="font-medium">{formatDate(item.due)}</dd>
        </div>
        {item.dose && (
          <div>
            <dt className="text-muted">{t("intel.dose")}</dt>
            <dd className="font-medium">{item.dose}</dd>
          </div>
        )}
        {item.window && (
          <div className="col-span-2">
            <dt className="text-muted">{t("intel.window")}</dt>
            <dd className="font-medium">{item.window}</dd>
          </div>
        )}
      </dl>
      <p className="mt-3 text-xs text-muted">{item.farm}</p>
      <Link to={`/farmers/${item.farmerId}`} className="mt-2 text-xs font-medium text-primary">
        {t("intel.openFarm")} →
      </Link>
    </Card>
  );
}
