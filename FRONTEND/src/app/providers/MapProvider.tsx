import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  deliveryRoutes,
  farmPins,
  farmerPins,
  kitchenPins,
  lotPins,
} from "../../data/geo";
import { DESK_DEFAULT } from "../../lib/map/tiles";
import { haversineKm } from "../../lib/map/geo";
import { createTrackClient, type TrackClient } from "../../lib/map/live";
import { radioConfigured } from "../../lib/realtime/client";
import type { LatLng, LivePing, MapLayerId, MapPin } from "../../lib/map/types";

const ALL: MapLayerId[] = ["farmers", "customers", "farms", "lots", "routes", "live"];

type MapContextValue = {
  layers: MapLayerId[];
  toggleLayer: (id: MapLayerId) => void;
  setLayers: (ids: MapLayerId[]) => void;
  focus: string | null;
  setFocus: (id: string | null) => void;
  you: LatLng;
  youSource: "gps" | "desk";
  locate: () => void;
  radiusKm: number;
  setRadiusKm: (n: number) => void;
  pings: Record<string, LivePing>;
  radioReady: boolean;
  live: boolean;
  watchOrder: (id: string) => void;
  pins: MapPin[];
  nearby: MapPin[];
};

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<MapLayerId[]>(["farmers", "farms", "lots", "routes", "live"]);
  const [focus, setFocus] = useState<string | null>(null);
  const [you, setYou] = useState<LatLng>(DESK_DEFAULT);
  const [youSource, setYouSource] = useState<"gps" | "desk">("desk");
  const [radiusKm, setRadiusKm] = useState(250);
  const [pings, setPings] = useState<Record<string, LivePing>>({});
  const [live, setLive] = useState(false);
  const client = useRef<TrackClient | null>(null);

  useEffect(() => {
    const c = createTrackClient({
      onConnect: () => setLive(true),
      onDisconnect: () => setLive(false),
      onPing: (ping) => setPings((prev) => ({ ...prev, [ping.orderId]: ping })),
    });
    client.current = c;
    c.connect();
    return () => c.disconnect();
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setYou({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setYouSource("gps");
      },
      () => {
        setYou(DESK_DEFAULT);
        setYouSource("desk");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  const toggleLayer = useCallback((id: MapLayerId) => {
    setLayers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const watchOrder = useCallback((id: string) => {
    client.current?.watch(id);
  }, []);

  const pins = useMemo(() => {
    const list: MapPin[] = [];
    if (layers.includes("farmers")) list.push(...farmerPins);
    if (layers.includes("farms")) list.push(...farmPins);
    if (layers.includes("customers")) list.push(...kitchenPins);
    if (layers.includes("lots")) list.push(...lotPins);
    if (layers.includes("live") || layers.includes("routes")) {
      deliveryRoutes.forEach((r) => {
        const ping = pings[r.orderId];
        const pos = ping?.position ?? r.lastKnown;
        if (!pos) return;
        list.push({
          id: `veh-${r.orderId}`,
          kind: "vehicle",
          title: r.orderId,
          subtitle: `${r.crop} · ${r.farmerName}`,
          position: pos,
          orderId: r.orderId,
          farmerId: r.farmerId,
          href: `/map/track/${r.orderId}`,
          crop: r.crop,
        });
      });
    }
    return list;
  }, [layers, pings]);

  const nearby = useMemo(
    () =>
      pins
        .filter((p) => p.kind !== "vehicle")
        .map((p) => ({ ...p, km: Math.round(haversineKm(you, p.position)) }))
        .filter((p) => (p.km ?? 0) <= radiusKm)
        .sort((a, b) => (a.km ?? 0) - (b.km ?? 0)),
    [pins, you, radiusKm],
  );

  const value = useMemo(
    () => ({
      layers,
      toggleLayer,
      setLayers,
      focus,
      setFocus,
      you,
      youSource,
      locate,
      radiusKm,
      setRadiusKm,
      pings,
      radioReady: radioConfigured(),
      live,
      watchOrder,
      pins,
      nearby,
    }),
    [
      layers,
      toggleLayer,
      focus,
      you,
      youSource,
      locate,
      radiusKm,
      pings,
      live,
      watchOrder,
      pins,
      nearby,
    ],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapDesk() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapDesk must be used within MapProvider");
  return ctx;
}

export { ALL as MAP_LAYERS };
