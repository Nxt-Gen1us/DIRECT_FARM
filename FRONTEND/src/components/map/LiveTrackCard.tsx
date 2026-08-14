import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Radio, Truck } from "lucide-react";
import type { DeliveryRoute, LivePing } from "../../lib/map/types";
import { formatWhen } from "../../lib/format";
import { Button } from "../ui";

export function LiveTrackCard({
  route,
  ping,
  live,
}: {
  route: DeliveryRoute;
  ping?: LivePing;
  live?: boolean;
}) {
  const { t } = useTranslation();
  const at = ping?.at ?? route.lastKnownAt;
  return (
    <article className="rounded-[1.15rem] border border-line bg-card p-4">
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-secondary">
        <Truck size={12} /> {route.orderId}
      </p>
      <h3 className="mt-1 font-display text-2xl text-ink">{route.crop}</h3>
      <p className="text-sm text-ink-soft">
        {route.farmerName} → {route.buyerName}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted">{t("atlas.eta")}</dt>
          <dd className="font-medium">{route.eta ? formatWhen(route.eta) : "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("atlas.lastPing")}</dt>
          <dd className="font-medium">{at ? formatWhen(at) : t("atlas.noPing")}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("atlas.distance")}</dt>
          <dd className="font-medium">{route.km} km</dd>
        </div>
        <div>
          <dt className="text-muted">{t("atlas.status")}</dt>
          <dd className="font-medium">{t(`flow.stages.${route.status === "out" ? "out" : route.status}`)}</dd>
        </div>
      </dl>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
        <Radio size={12} />
        {live ? t("atlas.following") : t("atlas.lastKnownOnly")}
      </p>
      <div className="mt-3 flex gap-2">
        <Link to={`/orders/${route.orderId}/track`}>
          <Button size="sm" variant="ghost">
            {t("atlas.timeline")}
          </Button>
        </Link>
        <Link to={`/map/track/${route.orderId}`}>
          <Button size="sm">{t("atlas.followCrate")}</Button>
        </Link>
      </div>
    </article>
  );
}
