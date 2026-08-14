import { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Marker } from "react-leaflet";
import { useTranslation } from "react-i18next";
import { useMapDesk } from "../../app/providers/MapProvider";
import { deliveryRoutes } from "../../data/geo";
import type { MapLayerId, PinKind } from "../../lib/map/types";
import { LayerBar } from "../../components/map/LayerBar";
import { LiveTrackCard } from "../../components/map/LiveTrackCard";
import { MapCanvas } from "../../components/map/MapCanvas";
import { MapPins } from "../../components/map/MapPins";
import { MapRoute } from "../../components/map/MapRoute";
import { NearbyPanel } from "../../components/map/NearbyPanel";
import { PinCard } from "../../components/map/PinCard";
import { pinIcon } from "../../components/map/pinIcon";

export type AtlasMode = "atlas" | "farmers" | "customers" | "farms" | "lots" | "routes" | "live";

const modeLayers: Record<AtlasMode, MapLayerId[]> = {
  atlas: ["farmers", "farms", "lots", "routes", "live"],
  farmers: ["farmers"],
  customers: ["customers"],
  farms: ["farms"],
  lots: ["lots"],
  routes: ["routes", "farms", "customers"],
  live: ["live", "routes"],
};

const modeKinds: Record<AtlasMode, PinKind[] | undefined> = {
  atlas: undefined,
  farmers: ["farmer"],
  customers: ["customer"],
  farms: ["farm"],
  lots: ["lot"],
  routes: ["vehicle", "farm", "customer"],
  live: ["vehicle"],
};

const tabs: { mode: AtlasMode; to: string; label: string }[] = [
  { mode: "atlas", to: "/map", label: "atlas.title" },
  { mode: "farmers", to: "/map/farmers", label: "atlas.farmersTitle" },
  { mode: "customers", to: "/map/customers", label: "atlas.kitchensTitle" },
  { mode: "farms", to: "/map/farms", label: "atlas.farmsTitle" },
  { mode: "lots", to: "/map/lots", label: "atlas.lotsTitle" },
  { mode: "routes", to: "/map/routes", label: "atlas.routesTitle" },
  { mode: "live", to: "/map/live", label: "atlas.liveTitle" },
];

const titles: Record<AtlasMode, string> = {
  atlas: "atlas.title",
  farmers: "atlas.farmersTitle",
  customers: "atlas.kitchensTitle",
  farms: "atlas.farmsTitle",
  lots: "atlas.lotsTitle",
  routes: "atlas.routesTitle",
  live: "atlas.liveTitle",
};

export function MapDeskPage({ mode = "atlas" }: { mode?: AtlasMode }) {
  const { t } = useTranslation();
  const { setLayers, pins, focus, setFocus, you, radiusKm, pings, live, watchOrder } = useMapDesk();

  useEffect(() => {
    setLayers(modeLayers[mode]);
    setFocus(null);
  }, [mode, setLayers, setFocus]);

  useEffect(() => {
    if (mode === "live" || mode === "routes") {
      deliveryRoutes.forEach((r) => watchOrder(r.orderId));
    }
  }, [mode, watchOrder]);

  const selected = pins.find((p) => p.id === focus) ?? null;
  const fly = selected?.position ?? null;
  const fit = useMemo(() => {
    const pts = pins.map((p) => p.position);
    if (you) pts.push(you);
    return pts;
  }, [pins, you]);

  const routes =
    mode === "routes" || mode === "live" || mode === "atlas"
      ? deliveryRoutes.filter((r) => mode !== "live" || r.status === "out" || r.status === "shipped")
      : [];

  return (
    <div className="container-app py-4 md:py-6">
      <p className="text-xs uppercase tracking-[0.2em] text-secondary">{t("atlas.kicker")}</p>
      <h1 className="mt-1 font-display text-4xl text-ink">{t(titles[mode])}</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-soft">{t("atlas.subtitle")}</p>
      <nav className="mt-4 flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/map"}
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 text-xs ${
                isActive ? "bg-ink text-accent" : "bg-canvas text-ink-soft border border-line"
              }`
            }
          >
            {t(tab.label)}
          </NavLink>
        ))}
      </nav>
      <div className="mt-3">
        <LayerBar />
      </div>
      <div className="mt-4 grid h-[calc(100dvh-14rem)] overflow-hidden rounded-[1.35rem] border border-line bg-card shadow-[0_16px_40px_-20px_rgb(36_22_16_/_0.28)] lg:grid-cols-[320px_1fr]">
        <div className="hidden min-h-0 border-r border-line lg:block">
          <NearbyPanel kinds={modeKinds[mode]} />
        </div>
        <div className="relative min-h-[420px]">
          <MapCanvas fit={fit} flyTo={fly} you={you} radiusKm={radiusKm}>
            <MapPins pins={pins} selectedId={focus} onSelect={setFocus} />
            {(mode === "routes" || mode === "live" || mode === "atlas") &&
              routes.map((r) => (
                <MapRoute
                  key={r.id}
                  route={r}
                  live={pings[r.orderId]?.position}
                  accent={r.status === "out"}
                />
              ))}
            <Marker position={[you.lat, you.lng]} icon={pinIcon("you", true)} />
          </MapCanvas>
          {selected && (
            <div className="absolute bottom-4 left-4 right-4 z-[400] max-w-sm">
              <PinCard pin={selected} />
            </div>
          )}
          {mode === "live" && !selected && routes[0] && (
            <div className="absolute bottom-4 left-4 right-4 z-[400] max-w-sm">
              <LiveTrackCard route={routes[0]} ping={pings[routes[0].orderId]} live={live} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
