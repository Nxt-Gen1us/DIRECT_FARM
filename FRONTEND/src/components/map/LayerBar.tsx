import { useTranslation } from "react-i18next";
import { Crosshair, LocateFixed } from "lucide-react";
import type { MapLayerId } from "../../lib/map/types";
import { cn } from "../../lib/cn";
import { MAP_LAYERS, useMapDesk } from "../../app/providers/MapProvider";

const keys: Record<MapLayerId, string> = {
  farmers: "atlas.layerFarmers",
  customers: "atlas.layerKitchens",
  farms: "atlas.layerFarms",
  lots: "atlas.layerLots",
  routes: "atlas.layerRoutes",
  live: "atlas.layerLive",
};

export function LayerBar() {
  const { t } = useTranslation();
  const { layers, toggleLayer, locate, youSource, radiusKm, setRadiusKm, live, radioReady } = useMapDesk();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {MAP_LAYERS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => toggleLayer(id)}
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider",
            layers.includes(id) ? "bg-primary text-accent" : "bg-canvas text-ink-soft border border-line",
          )}
        >
          {t(keys[id])}
        </button>
      ))}
      <label className="ml-1 flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1 text-[11px] text-ink-soft">
        {t("atlas.radius")}
        <input
          type="range"
          min={50}
          max={2000}
          step={50}
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
        />
        <span className="w-12 text-ink">{radiusKm} km</span>
      </label>
      <button
        type="button"
        onClick={locate}
        className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-3 py-1 text-[11px] text-ink-soft"
      >
        {youSource === "gps" ? <LocateFixed size={12} /> : <Crosshair size={12} />}
        {youSource === "gps" ? t("atlas.gpsOn") : t("atlas.useGps")}
      </button>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider",
          live ? "bg-nature-soft text-nature-dark" : "bg-cream-deep text-muted",
        )}
      >
        {live ? t("atlas.radioLive") : radioReady ? t("atlas.radioWait") : t("atlas.radioDark")}
      </span>
    </div>
  );
}
