import type { Role } from "../lib/types";

export type DeskUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  place: string;
  status: "active" | "invited" | "held";
  joinedAt: string;
  avatar: string;
};

export type Complaint = {
  id: string;
  kind: "crate" | "quality" | "pay" | "passport";
  title: string;
  body: string;
  from: string;
  against: string;
  orderId?: string;
  at: string;
  status: "open" | "looking" | "closed";
};

export type AiToolUse = {
  id: string;
  tool: string;
  farm: string;
  calls: number;
  last: string;
  confidence: number;
};

export type DeskReport = {
  id: string;
  title: string;
  period: string;
  kind: "gmv" | "farm" | "earth" | "ai";
  ready: boolean;
};

export const deskUsers: DeskUser[] = [
  {
    id: "u-admin",
    name: "Priya Desai",
    email: "priya@farmconnect.ai",
    phone: "+91 99099 22110",
    role: "admin",
    place: "Gandhinagar",
    status: "active",
    joinedAt: "2022-11-01",
    avatar: "/images/farmer-portrait.jpg",
  },
  {
    id: "u-customer",
    name: "Ananya Mehta",
    email: "ananya@farmconnect.ai",
    phone: "+91 98250 11420",
    role: "customer",
    place: "Ahmedabad",
    status: "active",
    joinedAt: "2024-08-12",
    avatar: "/images/chef-ananya.jpg",
  },
  {
    id: "u-spice",
    name: "Spice Route Kitchen",
    email: "orders@spiceroute.in",
    phone: "+91 79 4000 2211",
    role: "customer",
    place: "CG Road",
    status: "active",
    joinedAt: "2025-01-18",
    avatar: "/images/buyer-hotel.jpg",
  },
  {
    id: "u-coastal",
    name: "Priya Iyer · Coastal Spice",
    email: "priya@coastalspice.in",
    phone: "+91 98400 11880",
    role: "customer",
    place: "Krishnapatnam",
    status: "active",
    joinedAt: "2025-06-02",
    avatar: "/images/exporter-priya.jpg",
  },
  {
    id: "u-farmer",
    name: "Ramesh Patel",
    email: "ramesh@khedut.farm",
    phone: "+91 98765 43021",
    role: "farmer",
    place: "Ode, Anand",
    status: "active",
    joinedAt: "2023-03-04",
    avatar: "/images/farmer-ramesh.jpg",
  },
  {
    id: "u-kavita",
    name: "Kavita Sharma",
    email: "kavita@nashikvalley.farm",
    phone: "+91 98220 44110",
    role: "farmer",
    place: "Dindori, Nashik",
    status: "active",
    joinedAt: "2023-07-21",
    avatar: "/images/farmer-kavita.jpg",
  },
  {
    id: "u-mohan",
    name: "Mohan Yadav",
    email: "mohan@malwa.coop",
    phone: "+91 94250 33021",
    role: "farmer",
    place: "Depalpur, Indore",
    status: "invited",
    joinedAt: "2026-04-02",
    avatar: "/images/farmer-portrait.jpg",
  },
  {
    id: "u-suresh",
    name: "Suresh Reddy",
    email: "suresh@guntur.ridge",
    phone: "+91 98481 22009",
    role: "farmer",
    place: "Guntur Rural",
    status: "held",
    joinedAt: "2026-03-28",
    avatar: "/images/farmer-portrait.jpg",
  },
];

export const complaints: Complaint[] = [
  {
    id: "CP-441",
    kind: "crate",
    title: "Tomato crate late on last mile",
    body: "FC-88421 was promised Sunday noon. Kitchen opened at 11; crate arrived 4:40.",
    from: "Ananya Mehta",
    against: "Nashik Valley",
    orderId: "FC-88421",
    at: "2026-04-13T17:10:00+05:30",
    status: "open",
  },
  {
    id: "CP-438",
    kind: "quality",
    title: "Ghee grain not as last tin",
    body: "A2 tin from Ode was smoother than the last lot. Kitchen wants the granular set.",
    from: "Spice Route Kitchen",
    against: "Ode Organic Acres",
    orderId: "FC-88390",
    at: "2026-04-08T09:20:00+05:30",
    status: "looking",
  },
  {
    id: "CP-429",
    kind: "pay",
    title: "NEFT still in escrow",
    body: "FC-88211 packed but payout not released. Spice Route says the transfer left Friday.",
    from: "Ramesh Patel",
    against: "Spice Route Kitchen",
    orderId: "FC-88211",
    at: "2026-04-12T19:05:00+05:30",
    status: "open",
  },
  {
    id: "CP-418",
    kind: "passport",
    title: "QR missing on basmati sack",
    body: "Cloth bags arrived without the lot QR. Moisture card was inside, passport was not.",
    from: "Ananya Mehta",
    against: "Doaba Basmati Fields",
    orderId: "FC-88102",
    at: "2026-04-12T14:40:00+05:30",
    status: "closed",
  },
  {
    id: "CP-401",
    kind: "quality",
    title: "Chili heat below card",
    body: "Sannam lot tested milder than the lab card attached to the passport.",
    from: "Coastal Spice",
    against: "Guntur Chili Ridge",
    orderId: "FC-87940",
    at: "2026-04-10T11:15:00+05:30",
    status: "looking",
  },
];

export const aiUsage: AiToolUse[] = [
  { id: "ai-detect", tool: "Scout detect", farm: "Nashik Valley", calls: 186, last: "2026-04-13T07:40:00+05:30", confidence: 86 },
  { id: "ai-grade", tool: "Grade fruit", farm: "Ode Organic Acres", calls: 142, last: "2026-04-13T06:10:00+05:30", confidence: 91 },
  { id: "ai-price", tool: "Mandi price", farm: "Malwa Cooperative", calls: 98, last: "2026-04-12T18:22:00+05:30", confidence: 83 },
  { id: "ai-disease", tool: "Leaf disease", farm: "Nashik Valley", calls: 74, last: "2026-04-13T08:05:00+05:30", confidence: 78 },
  { id: "ai-harvest", tool: "Harvest window", farm: "Ode Organic Acres", calls: 61, last: "2026-04-11T19:12:00+05:30", confidence: 88 },
  { id: "ai-describe", tool: "Lot copy", farm: "Erode Spice Garden", calls: 44, last: "2026-04-10T16:40:00+05:30", confidence: 80 },
];

export const deskReports: DeskReport[] = [
  { id: "rp-gmv", title: "April GMV & last-mile", period: "1–13 Apr 2026", kind: "gmv", ready: true },
  { id: "rp-farm", title: "Farm verification queue", period: "Week 15", kind: "farm", ready: true },
  { id: "rp-earth", title: "Carbon & rescue ledger", period: "Nov–Apr", kind: "earth", ready: true },
  { id: "rp-ai", title: "Scout tool use", period: "Last 30 days", kind: "ai", ready: false },
];

export const gmvSeries = [
  { week: "W10", gmv: 218000, orders: 164, farms: 38 },
  { week: "W11", gmv: 246000, orders: 188, farms: 41 },
  { week: "W12", gmv: 271000, orders: 201, farms: 44 },
  { week: "W13", gmv: 254000, orders: 192, farms: 46 },
  { week: "W14", gmv: 312000, orders: 228, farms: 51 },
  { week: "W15", gmv: 341000, orders: 246, farms: 54 },
];

export const roleMix = [
  { name: "Kitchens", value: 3910 },
  { name: "Farms", value: 642 },
  { name: "Desk", value: 18 },
];

export const categoryMix = [
  { name: "Vegetables", value: 42 },
  { name: "Fruits", value: 18 },
  { name: "Grains", value: 14 },
  { name: "Dairy", value: 11 },
  { name: "Spices", value: 9 },
  { name: "Pulses", value: 6 },
];

export const payMix = [
  { name: "UPI", value: 54 },
  { name: "Card", value: 18 },
  { name: "NEFT", value: 16 },
  { name: "COD", value: 12 },
];

export const aiCallsWeek = [
  { day: "Mon", calls: 42 },
  { day: "Tue", calls: 51 },
  { day: "Wed", calls: 38 },
  { day: "Thu", calls: 67 },
  { day: "Fri", calls: 58 },
  { day: "Sat", calls: 29 },
  { day: "Sun", calls: 18 },
];

export const deskKpis = {
  gmv: 1842000,
  orders: 1284,
  farmers: 642,
  buyers: 3910,
  passports: 2118,
  disputes: 7,
  lots: 248,
  pendingFarms: 3,
  aiCalls: 605,
  carbonT: 36.4,
};
