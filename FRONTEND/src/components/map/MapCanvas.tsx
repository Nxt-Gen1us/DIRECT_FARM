import { useEffect, type ReactNode } from "react";
import { Circle, MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import { resolveTiles } from "../../lib/map/tiles";
import { boundsOf, INDIA_CENTER } from "../../lib/map/geo";
import type { LatLng, MapViewport } from "../../lib/map/types";
import { cn } from "../../lib/cn";
import "leaflet/dist/leaflet.css";
import "./leaflet.css";

function Fit({ points, pad = 0.35 }: { points: LatLng[]; pad?: number }) {
  const map = useMap();
  useEffect(() => {
    const b = boundsOf(points);
    if (!b) return;
    map.fitBounds(
      [
        [b.sw.lat, b.sw.lng],
        [b.ne.lat, b.ne.lng],
      ],
      { padding: [48, 48], maxZoom: 11, animate: true },
    );
  }, [map, points, pad]);
  return null;
}

function Fly({ target, zoom = 10 }: { target: LatLng | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], zoom, { duration: 0.8 });
  }, [map, target, zoom]);
  return null;
}

export function MapCanvas({
  className,
  children,
  viewport,
  fit,
  flyTo,
  you,
  radiusKm,
}: {
  className?: string;
  children?: ReactNode;
  viewport?: MapViewport;
  fit?: LatLng[];
  flyTo?: LatLng | null;
  you?: LatLng;
  radiusKm?: number;
}) {
  const tiles = resolveTiles();
  const center = viewport?.center ?? INDIA_CENTER;
  const zoom = viewport?.zoom ?? 5;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className={cn("fc-map h-full w-full", className)}
      zoomControl={false}
      scrollWheelZoom
    >
      <TileLayer attribution={tiles.attribution} url={tiles.url} maxZoom={tiles.maxZoom} />
      <ZoomControl position="bottomright" />
      {fit && fit.length > 1 && <Fit points={fit} />}
      {flyTo && <Fly target={flyTo} />}
      {you && (
        <Circle
          center={[you.lat, you.lng]}
          radius={(radiusKm ?? 0) * 1000}
          pathOptions={{ color: "#8b2626", weight: 1, fillColor: "#8b2626", fillOpacity: 0.05 }}
        />
      )}
      {children}
    </MapContainer>
  );
}
