import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { useMapDesk } from "../../app/providers/MapProvider";
import { cn } from "../../lib/cn";
import type { PinKind } from "../../lib/map/types";

const tone: Record<PinKind, string> = {
  farmer: "text-primary",
  farm: "text-nature",
  customer: "text-secondary",
  lot: "text-secondary-dark",
  vehicle: "text-info",
  you: "text-ink",
};

export function NearbyPanel({ kinds }: { kinds?: PinKind[] }) {
  const { t } = useTranslation();
  const { nearby, focus, setFocus } = useMapDesk();
  const rows = kinds ? nearby.filter((p) => kinds.includes(p.kind)) : nearby;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-line px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-secondary">{t("atlas.nearby")}</p>
        <h2 className="font-display text-xl text-ink">{t("atlas.within")}</h2>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {rows.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted">{t("atlas.noneNear")}</li>
        )}
        {rows.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setFocus(p.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-cream",
                focus === p.id && "bg-accent/50",
              )}
            >
              {p.image ? (
                <img src={p.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
              ) : (
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-cream-deep text-muted">
                  <MapPin size={16} />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-medium text-ink">{p.title}</span>
                  <span className="shrink-0 text-[11px] text-primary">{p.km} km</span>
                </span>
                <span className={cn("block text-[11px] uppercase tracking-wider", tone[p.kind])}>
                  {t(`atlas.kind.${p.kind}`)}
                </span>
                {p.subtitle && <span className="block truncate text-xs text-ink-soft">{p.subtitle}</span>}
                {p.href && (
                  <Link to={p.href} className="mt-0.5 inline-block text-[11px] text-primary" onClick={(e) => e.stopPropagation()}>
                    {t("atlas.open")} →
                  </Link>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
