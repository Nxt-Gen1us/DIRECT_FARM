export type LatLng = { lat: number; lng: number };

export type MapLayerId = "farmers" | "customers" | "farms" | "lots" | "routes" | "live";

export type PinKind = "farmer" | "customer" | "farm" | "lot" | "vehicle" | "you";

export type MapPin = {
  id: string;
  kind: PinKind;
  title: string;
  subtitle?: string;
  position: LatLng;
  href?: string;
  image?: string;
  farmerId?: string;
  productId?: string;
  orderId?: string;
  crop?: string;
  km?: number;
};

export type DeliveryHop = {
  label: string;
  position: LatLng;
  at?: string;
};

export type DeliveryRoute = {
  id: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  buyerName: string;
  crop: string;
  origin: LatLng;
  destination: LatLng;
  waypoints: LatLng[];
  hops: DeliveryHop[];
  lastKnown?: LatLng;
  lastKnownAt?: string;
  heading?: number;
  eta?: string;
  km: number;
  status: "packed" | "shipped" | "out" | "delivered";
};

export type LivePing = {
  orderId: string;
  position: LatLng;
  heading?: number;
  speedKmh?: number;
  at: string;
};

export type TileSpec = {
  url: string;
  attribution: string;
  maxZoom: number;
  ready: boolean;
  provider: "carto" | "mapbox" | "custom";
};

export type MapViewport = {
  center: LatLng;
  zoom: number;
};
