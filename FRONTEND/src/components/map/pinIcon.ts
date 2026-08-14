import L from "leaflet";
import type { PinKind } from "../../lib/map/types";

const fill: Record<PinKind, string> = {
  farmer: "#8b2626",
  farm: "#486c2f",
  customer: "#ef6905",
  lot: "#c9a227",
  vehicle: "#2f5d8c",
  you: "#241610",
};

const glyph: Record<PinKind, string> = {
  farmer: "ஃ",
  farm: "⌂",
  customer: "◎",
  lot: "◇",
  vehicle: "▸",
  you: "·",
};

export function pinIcon(kind: PinKind, selected = false) {
  return L.divIcon({
    className: `fc-pin${selected ? " is-on" : ""}`,
    html: `<span style="background:${fill[kind]}"><i>${glyph[kind]}</i></span>`,
    iconSize: selected ? [34, 34] : [28, 28],
    iconAnchor: selected ? [17, 30] : [14, 26],
    popupAnchor: [0, -22],
  });
}
