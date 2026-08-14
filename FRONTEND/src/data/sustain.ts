export type BadgeTier = "seed" | "grove" | "canopy";

export type KitchenBadge = {
  id: string;
  name: string;
  place: string;
  avatar: string;
  localPct: number;
  crates: number;
  kmSaved: number;
  tier: BadgeTier;
};

export type DonationLot = {
  id: string;
  crop: string;
  kg: number;
  to: string;
  place: string;
  farm: string;
  farmerId: string;
  at: string;
  note: string;
  image: string;
};

export type FarmFootprint = {
  farmerId: string;
  carbonSavedT: number;
  wasteKg: number;
  localPct: number;
  kmCut: number;
  donatedKg: number;
};

export const seasonGoals = {
  carbonT: 48,
  wasteKg: 12000,
  localPct: 80,
  kmCut: 180000,
  donateKg: 4200,
  badgeKitchens: 40,
};

export const seasonNow = {
  carbonT: 36.4,
  wasteKg: 9180,
  localPct: 73,
  kmCut: 142600,
  donateKg: 3140,
  badgeKitchens: 28,
};

export const carbonMonths = [
  { month: "Nov", saved: 2.1, cold: 5.8 },
  { month: "Dec", saved: 2.8, cold: 6.1 },
  { month: "Jan", saved: 3.4, cold: 5.4 },
  { month: "Feb", saved: 4.1, cold: 5.9 },
  { month: "Mar", saved: 5.6, cold: 6.4 },
  { month: "Apr", saved: 6.2, cold: 4.8 },
];

export const wasteMonths = [
  { month: "Nov", rescued: 820, landfill: 210 },
  { month: "Dec", rescued: 940, landfill: 180 },
  { month: "Jan", rescued: 1100, landfill: 140 },
  { month: "Feb", rescued: 1480, landfill: 120 },
  { month: "Mar", rescued: 1720, landfill: 90 },
  { month: "Apr", rescued: 2120, landfill: 70 },
];

export const localShare = [
  { belt: "Anand–Ahmedabad", pct: 88, crates: 640 },
  { belt: "Nashik–Pune", pct: 76, crates: 410 },
  { belt: "Doaba–Delhi", pct: 54, crates: 180 },
  { belt: "Erode–Coimbatore", pct: 81, crates: 220 },
  { belt: "Malwa–Indore", pct: 69, crates: 150 },
];

export const distanceStories = [
  {
    id: "d-ode",
    crop: "Ode morning crate",
    from: "Ode, Anand",
    to: "Satellite Road kitchen",
    farmKm: 86,
    mandiKm: 340,
    note: "Direct crate, no APMC hop. Same-day palak still dew-wet.",
    image: "/images/spinach.jpg",
  },
  {
    id: "d-nashik",
    crop: "Nashik vine tomato",
    from: "Dindori polyhouse",
    to: "Ahmedabad last mile",
    farmKm: 412,
    mandiKm: 980,
    note: "Breaker-red fruit, not pink from a distant cold store.",
    image: "/images/tomatoes.jpg",
  },
  {
    id: "d-gir",
    crop: "Gir Kesar",
    from: "Ode south grove",
    to: "Heritage Plaza kitchen",
    farmKm: 78,
    mandiKm: 620,
    note: "Colour-break fruit, not trucked from a distant packhouse.",
    image: "/images/mangoes.jpg",
  },
];

export const donations: DonationLot[] = [
  {
    id: "dn-1",
    crop: "Breaker tomato",
    kg: 180,
    to: "Satellite langar",
    place: "Ahmedabad",
    farm: "Nashik Valley",
    farmerId: "f-kavita",
    at: "2026-04-12",
    note: "Grade B fruit, still sweet. Kitchen turned it into rasam the same evening.",
    image: "/images/tomatoes.jpg",
  },
  {
    id: "dn-2",
    crop: "Palak leaves",
    kg: 64,
    to: "Anganwadi no. 14",
    place: "Ode",
    farm: "Ode Organic Acres",
    farmerId: "f-ramesh",
    at: "2026-04-11",
    note: "Last cut of the canal bed. Too small for hotel crates, perfect for midday meal.",
    image: "/images/spinach.jpg",
  },
  {
    id: "dn-3",
    crop: "Kesar seconds",
    kg: 42,
    to: "House of Millet kitchen",
    place: "Bodakdev",
    farm: "Ode Organic Acres",
    farmerId: "f-ramesh",
    at: "2026-04-10",
    note: "Soft shoulders, full flavour. Pulped for aamras, not dumped.",
    image: "/images/mangoes.jpg",
  },
  {
    id: "dn-4",
    crop: "Sannam chili",
    kg: 28,
    to: "Temple kitchen",
    place: "Guntur",
    farm: "Guntur Chili Ridge",
    farmerId: "f-suresh",
    at: "2026-04-08",
    note: "Broken pods after sun-dry. Heat still honest.",
    image: "/images/chili.jpg",
  },
];

export const kitchenBadges: KitchenBadge[] = [
  {
    id: "kb-ananya",
    name: "Ananya Mehta",
    place: "Satellite Road",
    avatar: "/images/chef-ananya.jpg",
    localPct: 91,
    crates: 48,
    kmSaved: 6240,
    tier: "canopy",
  },
  {
    id: "kb-spice",
    name: "Spice Route Kitchen",
    place: "CG Road",
    avatar: "/images/buyer-hotel.jpg",
    localPct: 78,
    crates: 112,
    kmSaved: 14800,
    tier: "grove",
  },
  {
    id: "kb-millet",
    name: "House of Millet",
    place: "Bodakdev",
    avatar: "/images/buyer-hotel.jpg",
    localPct: 84,
    crates: 36,
    kmSaved: 4100,
    tier: "grove",
  },
  {
    id: "kb-coastal",
    name: "Coastal Spice Export",
    place: "Krishnapatnam",
    avatar: "/images/exporter-priya.jpg",
    localPct: 42,
    crates: 18,
    kmSaved: 920,
    tier: "seed",
  },
];

export const farmFootprints: FarmFootprint[] = [
  { farmerId: "f-lakshmi", carbonSavedT: 8.4, wasteKg: 640, localPct: 81, kmCut: 12400, donatedKg: 210 },
  { farmerId: "f-ramesh", carbonSavedT: 7.1, wasteKg: 1820, localPct: 88, kmCut: 28600, donatedKg: 860 },
  { farmerId: "f-kavita", carbonSavedT: 6.2, wasteKg: 1540, localPct: 76, kmCut: 31200, donatedKg: 540 },
  { farmerId: "f-harpreet", carbonSavedT: 5.4, wasteKg: 420, localPct: 54, kmCut: 9800, donatedKg: 80 },
  { farmerId: "f-suresh", carbonSavedT: 4.8, wasteKg: 310, localPct: 69, kmCut: 7200, donatedKg: 180 },
  { farmerId: "f-mohan", carbonSavedT: 4.5, wasteKg: 280, localPct: 69, kmCut: 6400, donatedKg: 60 },
];

export const fieldNotes = [
  {
    id: "n1",
    title: "The crate that never went to mandi",
    body: "Ode palak used to sit a night in Anand APMC. Now it leaves the canal bed at 6:20 and is on a Satellite chopping board by noon. That is 254 km the truck does not drive, and a leaf that still holds its water.",
    image: "/images/harvest.jpg",
  },
  {
    id: "n2",
    title: "Ugly fruit, honest kitchen",
    body: "Grade B tomato is not waste. Kavita’s breaker fruit that will not travel two days still makes rasam. The passport stays on the crate. The landfill does not get a vote.",
    image: "/images/tomatoes.jpg",
  },
  {
    id: "n3",
    title: "A badge is not a sticker",
    body: "The Local Buying Badge is earned when seven of ten crates come from a farm inside the belt. Lose the habit, lose the canopy. The desk does not sell the badge.",
    image: "/images/irrigation.jpg",
  },
];

export function pctOf(now: number, goal: number) {
  return Math.min(100, Math.round((now / goal) * 100));
}
