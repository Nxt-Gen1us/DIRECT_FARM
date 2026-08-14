export type AuctionStatus = "live" | "upcoming" | "closed";
export type ContractStatus = "draft" | "awaiting" | "signed" | "live";
export type StoreKind = "warehouse" | "cold";
export type BookStatus = "held" | "queued";

export type LotAuction = {
  id: string;
  crop: string;
  variety: string;
  farm: string;
  farmerId: string;
  image: string;
  qty: number;
  unit: string;
  floor: number;
  lastBid: number;
  bids: number;
  endsAt: string;
  status: AuctionStatus;
  passportId?: string;
};

export type CirclePost = {
  id: string;
  author: string;
  farm: string;
  farmerId: string;
  avatar: string;
  crop: string;
  title: string;
  body: string;
  at: string;
  replies: number;
  likes: number;
};

export type FieldExpert = {
  id: string;
  name: string;
  title: string;
  belt: string;
  languages: string[];
  rate: number;
  slots: string[];
  avatar: string;
  focus: string;
};

export type SeasonPoint = {
  month: string;
  rain: number;
  heat: number;
  yieldIdx: number;
};

export type SeasonBelt = {
  id: string;
  name: string;
  crop: string;
  outlook: string;
  risk: "low" | "watch" | "high";
  series: SeasonPoint[];
};

export type FieldContract = {
  id: string;
  crop: string;
  farm: string;
  farmerId: string;
  kitchen: string;
  qty: string;
  value: number;
  start: string;
  end: string;
  status: ContractStatus;
};

export type Machine = {
  id: string;
  name: string;
  kind: "tractor" | "thresher" | "sprayer" | "pump";
  owner: string;
  place: string;
  rate: number;
  unit: "day" | "hour";
  available: boolean;
  image: string;
};

export type StoreBay = {
  id: string;
  name: string;
  kind: StoreKind;
  place: string;
  temp?: string;
  capacityT: number;
  freeT: number;
  rate: number;
  nextSlot: string;
};
