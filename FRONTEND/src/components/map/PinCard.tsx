import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MapPin } from "../../lib/map/types";
import { Button } from "../ui";

export function PinCard({ pin }: { pin: MapPin }) {
  const { t } = useTranslation();
  return (
    <article className="rounded-[1.15rem] border border-line bg-card p-4 shadow-[0_12px_28px_-18px_rgb(36_22_16_/_0.35)]">
      <div className="flex gap-3">
        {pin.image && <img src={pin.image} alt="" className="h-16 w-16 rounded-xl object-cover" />}
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted">{t(`atlas.kind.${pin.kind}`)}</p>
          <h3 className="font-display text-xl text-ink">{pin.title}</h3>
          {pin.subtitle && <p className="text-xs text-ink-soft">{pin.subtitle}</p>}
          {pin.km != null && <p className="mt-1 text-xs text-primary">{pin.km} km</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pin.href && (
          <Link to={pin.href}>
            <Button size="sm">{t("atlas.open")}</Button>
          </Link>
        )}
        {pin.farmerId && (
          <Link to={`/chat?farmer=${pin.farmerId}`}>
            <Button size="sm" variant="ghost">
              {t("atlas.write")}
            </Button>
          </Link>
        )}
        {pin.orderId && (
          <Link to={`/map/track/${pin.orderId}`}>
            <Button size="sm" variant="secondary">
              {t("atlas.followCrate")}
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}
