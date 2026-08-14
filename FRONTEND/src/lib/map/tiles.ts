import type { TileSpec } from "./types";

const CARTO =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

export function resolveTiles(): TileSpec {
  const custom = import.meta.env.VITE_MAP_TILES as string | undefined;
  const mapbox = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

  if (custom && custom.includes("{z}")) {
    return {
      url: custom,
      attribution: "FarmConnect field tiles",
      maxZoom: 19,
      ready: true,
      provider: "custom",
    };
  }

  if (mapbox && mapbox.length > 12) {
    return {
      url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${mapbox}`,
      attribution: "© Mapbox © OpenStreetMap",
      maxZoom: 20,
      ready: true,
      provider: "mapbox",
    };
  }

  return {
    url: CARTO,
    attribution: "© OpenStreetMap © CARTO",
    maxZoom: 19,
    ready: true,
    provider: "carto",
  };
}

export const DESK_DEFAULT = { lat: 23.033, lng: 72.557 };
