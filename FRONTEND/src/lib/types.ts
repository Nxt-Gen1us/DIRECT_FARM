export type Language = "en" | "hi" | "gu";
export type Role = "customer" | "farmer" | "admin";
export type OrderStatus = "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "upi" | "card" | "wallet" | "cod" | "netbanking";
export type TrackStageId = "placed" | "packed" | "shipped" | "out" | "delivered";
export type ReturnStatus = "none" | "requested" | "approved" | "received";
export type PayChannel = "razorpay" | "cod";

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface TrackStep {
  id: TrackStageId;
  at: string;
  done: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  village?: string;
  district?: string;
  state?: string;
  avatar: string;
  verified: boolean;
  joinedAt: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmName: string;
  name: string;
  village: string;
  district: string;
  state: string;
  acres: number;
  since: number;
  specialty: string;
  rating: number;
  reviews: number;
  avatar: string;
  cover: string;
  bio: string;
  certifications: string[];
  languages: Language[];
  sustainabilityScore: number;
}

export interface Product {
  id: string;
  farmerId: string;
  nameKey: string;
  name: string;
  category: ProductCategory;
  variety: string;
  price: number;
  unit: string;
  minQty: number;
  stock: number;
  image: string;
  images: string[];
  organic: boolean;
  harvestedOn: string;
  origin: string;
  rating: number;
  reviews: number;
  passportId: string;
  description: string;
  tags: string[];
  distanceKm: number;
}

export type ProductCategory =
  | "vegetables"
  | "fruits"
  | "grains"
  | "spices"
  | "dairy"
  | "pulses";

export interface CartItem {
  productId: string;
  qty: number;
}

export type BoxCadence = "weekly" | "fortnight";
export type BoxSize = "kitchen" | "family" | "chef";
export type BoxStatus = "active" | "paused";

export interface VegBoxLine {
  productId: string;
  qty: number;
}

export interface VegBox {
  id: string;
  name: string;
  size: BoxSize;
  cadence: BoxCadence;
  price: number;
  blurb: string;
  image: string;
  farms: string[];
  items: VegBoxLine[];
}

export interface VegBoxSub {
  id: string;
  boxId: string;
  cadence: BoxCadence;
  nextAt: string;
  status: BoxStatus;
  startedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  qty: number;
  unit: string;
  price: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  delivery: number;
  total: number;
  address: string;
  shipping?: Address;
  placedAt: string;
  eta: string;
  tracking: { label: string; at: string; done: boolean }[];
  timeline?: TrackStep[];
  trackStage?: TrackStageId;
  payChannel?: PayChannel;
  invoiceNo?: string;
  cancelReason?: string;
  returnStatus?: ReturnStatus;
  returnReason?: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  at: string;
  note: string;
}

export type MessageKind = "text" | "image" | "file" | "voice";
export type MessageStatus = "queued" | "sent" | "delivered" | "read" | "failed";
export type PresenceState = "online" | "away" | "offline" | "unknown";
export type NoticeKind = "chat" | "crate" | "weather" | "passport" | "system";

export interface ChatAttachment {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
  local?: boolean;
}

export interface ChatMessage {
  id: string;
  threadId?: string;
  from: "me" | "them";
  kind?: MessageKind;
  text: string;
  at: string;
  status?: MessageStatus;
  attachment?: ChatAttachment;
  durationSec?: number;
  waveform?: number[];
}

export interface ChatThread {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName?: string;
  village?: string;
  district?: string;
  avatar: string;
  cover?: string;
  crop?: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  presence?: PresenceState;
  lastSeen?: string;
  messages: ChatMessage[];
}

export interface DeskNotice {
  id: string;
  kind: NoticeKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
  threadId?: string;
}

export interface WeatherDay {
  date: string;
  label: string;
  high: number;
  low: number;
  rain: number;
  humidity: number;
  wind: number;
  condition: "sunny" | "cloudy" | "rain" | "storm" | "haze";
  advice: string;
}

export interface WeatherAlert {
  id: string;
  severity: "info" | "watch" | "warning";
  title: string;
  body: string;
  district: string;
  kind?: "rain" | "heat" | "wind" | "advisory";
  mm?: number;
  window?: string;
  issuedAt?: string;
  action?: string;
}

export type CalendarKind = "sow" | "transplant" | "fertilize" | "protect" | "harvest" | "cure";

export interface CalendarEvent {
  id: string;
  crop: string;
  farm: string;
  farmerId: string;
  kind: CalendarKind;
  start: string;
  end: string;
  note: string;
  field: string;
}

export type ReminderKind = "fertilizer" | "harvest" | "spray" | "irrigate";

export interface FieldReminder {
  id: string;
  kind: ReminderKind;
  crop: string;
  farm: string;
  farmerId: string;
  due: string;
  title: string;
  detail: string;
  dose?: string;
  window?: string;
  priority: "now" | "soon" | "later";
}

export type SchemeLevel = "central" | "state";

export interface GovScheme {
  id: string;
  name: string;
  short: string;
  ministry: string;
  level: SchemeLevel;
  states: string[];
  benefit: string;
  who: string;
  deadline?: string;
  href: string;
  tags: string[];
}

export type JourneyStageId =
  | "seed"
  | "growing"
  | "flowering"
  | "harvested"
  | "packed"
  | "shipped"
  | "delivered";

export interface JourneyStage {
  id: JourneyStageId;
  at: string;
  note: string;
  done: boolean;
}

export interface CropPassport {
  id: string;
  crop: string;
  variety: string;
  lotCode: string;
  farmerId: string;
  farmName: string;
  field: string;
  village: string;
  district: string;
  state: string;
  sownOn: string;
  harvestedOn: string;
  soilType: string;
  soilPh: number;
  irrigation: string;
  fertilizer: string;
  seedSource: string;
  inputs: { name: string; date: string; organic: boolean }[];
  certifications: string[];
  moisture: number;
  residueStatus: string;
  carbonKg: number;
  carbonSavedKg: number;
  waterLitres: number;
  distanceKm: number;
  grade: string;
  image: string;
  qr: string;
  currentStage: JourneyStageId;
  journey: JourneyStage[];
}

export interface AiInsight {
  id: string;
  type: "pest" | "soil" | "yield" | "irrigation" | "market";
  title: string;
  summary: string;
  confidence: number;
  action: string;
  crop: string;
  severity: "low" | "medium" | "high";
}

export interface SustainabilityMetric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}
