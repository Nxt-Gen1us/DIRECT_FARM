import { CircleMarker, Polyline } from "react-leaflet";
import type { DeliveryRoute, LatLng } from "../../lib/map/types";

export function MapRoute({
  route,
  live,
  accent = false,
}: {
  route: DeliveryRoute;
  live?: LatLng;
  accent?: boolean;
}) {
  const path = route.waypoints.map((p) => [p.lat, p.lng] as [number, number]);
  const last = live ?? route.lastKnown;
  return (
    <>
      <Polyline
        positions={path}
        pathOptions={{
          color: accent ? "#8b2626" : "#c9a227",
          weight: accent ? 4 : 3,
          opacity: 0.85,
          dashArray: route.status === "delivered" ? undefined : "8 8",
        }}
      />
      {route.hops.map((h) => (
        <CircleMarker
          key={h.label}
          center={[h.position.lat, h.position.lng]}
          radius={5}
          pathOptions={{ color: "#486c2f", fillColor: "#486c2f", fillOpacity: 1, weight: 1 }}
        />
      ))}
      {last && (
        <CircleMarker
          center={[last.lat, last.lng]}
          radius={accent ? 8 : 6}
          pathOptions={{ color: "#2f5d8c", fillColor: "#2f5d8c", fillOpacity: 0.9, weight: 2 }}
        />
      )}
    </>
  );
}
