import type { LatLng } from "./types";

export const INDIA_CENTER: LatLng = { lat: 22.5, lng: 78.5 };

export function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function bearingDeg(a: LatLng, b: LatLng) {
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
  const x =
    Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) -
    Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

export function interpolate(a: LatLng, b: LatLng, t: number): LatLng {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

export function boundsOf(points: LatLng[]): { sw: LatLng; ne: LatLng } | null {
  if (!points.length) return null;
  return points.reduce(
    (acc, p) => ({
      sw: { lat: Math.min(acc.sw.lat, p.lat), lng: Math.min(acc.sw.lng, p.lng) },
      ne: { lat: Math.max(acc.ne.lat, p.lat), lng: Math.max(acc.ne.lng, p.lng) },
    }),
    { sw: { ...points[0] }, ne: { ...points[0] } },
  );
}

export function pathLengthKm(path: LatLng[]) {
  return path.slice(1).reduce((s, p, i) => s + haversineKm(path[i], p), 0);
}

function rad(n: number) {
  return (n * Math.PI) / 180;
}
function deg(n: number) {
  return (n * 180) / Math.PI;
}
