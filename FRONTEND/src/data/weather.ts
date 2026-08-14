import type { AiInsight, SustainabilityMetric, WeatherAlert, WeatherDay } from "../lib/types";

export const weatherDays: WeatherDay[] = [
  {
    date: "2026-04-13",
    label: "Mon",
    high: 39,
    low: 24,
    rain: 5,
    humidity: 38,
    wind: 14,
    condition: "haze",
    advice: "Irrigate wheat stubble plots after 5 pm. Avoid midday spraying.",
  },
  {
    date: "2026-04-14",
    label: "Tue",
    high: 40,
    low: 25,
    rain: 0,
    humidity: 32,
    wind: 12,
    condition: "sunny",
    advice: "Heat wave watch. Mulch vegetable beds and run drip at night.",
  },
  {
    date: "2026-04-15",
    label: "Wed",
    high: 38,
    low: 25,
    rain: 20,
    humidity: 48,
    wind: 18,
    condition: "cloudy",
    advice: "Light pre-monsoon shower possible. Hold urea on leafy crops.",
  },
  {
    date: "2026-04-16",
    label: "Thu",
    high: 36,
    low: 24,
    rain: 45,
    humidity: 62,
    wind: 22,
    condition: "rain",
    advice: "Thunderstorm likely after 4 pm. Secure polyhouse vents.",
  },
  {
    date: "2026-04-17",
    label: "Fri",
    high: 35,
    low: 23,
    rain: 30,
    humidity: 58,
    wind: 16,
    condition: "rain",
    advice: "Good day to transplant after the shower. Check drainage.",
  },
  {
    date: "2026-04-18",
    label: "Sat",
    high: 37,
    low: 24,
    rain: 10,
    humidity: 44,
    wind: 11,
    condition: "cloudy",
    advice: "Scout tomato for early blight after wet spell.",
  },
  {
    date: "2026-04-19",
    label: "Sun",
    high: 38,
    low: 24,
    rain: 0,
    humidity: 36,
    wind: 10,
    condition: "sunny",
    advice: "Resume harvest of okra and spinach before 8 am.",
  },
];

export const weatherAlerts: WeatherAlert[] = [
  {
    id: "wa-1",
    severity: "warning",
    title: "Heat wave — Anand & Kheda",
    body: "Day temperatures 4–5°C above normal till Tuesday. Protect livestock and irrigate orchards at night.",
    district: "Anand",
  },
  {
    id: "wa-2",
    severity: "watch",
    title: "Pre-monsoon thunderstorm",
    body: "Isolated thunder and 20–40 mm rain expected Thursday evening across central Gujarat.",
    district: "Ahmedabad",
  },
  {
    id: "wa-3",
    severity: "info",
    title: "IMD agro-advisory",
    body: "Delay sowing of summer moong until soil temperature drops below 38°C.",
    district: "Gujarat",
  },
];

export const aiInsights: AiInsight[] = [
  {
    id: "ai-1",
    type: "pest",
    title: "Early blight risk on tomato",
    summary:
      "Leaf wetness after Thursday's shower plus 36°C days raises early blight probability to 72% in Nashik polyhouses.",
    confidence: 86,
    action: "Apply copper oxychloride or a bio-fungicide 12 hours before rain.",
    crop: "Tomato",
    severity: "high",
  },
  {
    id: "ai-2",
    type: "irrigation",
    title: "Night drip recommended",
    summary:
      "Evapotranspiration is 6.8 mm/day. Shifting drip to 9 pm–2 am saves 18% water on onion and okra.",
    confidence: 91,
    action: "Reschedule the Ode pump set to a night slot.",
    crop: "Onion",
    severity: "medium",
  },
  {
    id: "ai-3",
    type: "soil",
    title: "Nitrogen drawdown in Block 3",
    summary:
      "Soil card from 8 Apr shows available N at 182 kg/ha — below the 240 kg/ha target for the next okra flush.",
    confidence: 78,
    action: "Top-dress 15 kg urea/acre after the Wednesday shower.",
    crop: "Okra",
    severity: "medium",
  },
  {
    id: "ai-4",
    type: "market",
    title: "Tomato prices firming",
    summary:
      "Ahmedabad APMC tomato is ₹38–46/kg. Nashik arrivals are 11% lower week-on-week.",
    confidence: 83,
    action: "Hold graded A fruit 48 hours if cold room space is free.",
    crop: "Tomato",
    severity: "low",
  },
  {
    id: "ai-5",
    type: "yield",
    title: "Kesar mango colour break",
    summary:
      "Orchard images show 78% of fruits at colour break. Peak harvest window: 16–22 April.",
    confidence: 88,
    action: "Book two harvest crews and pre-cool crates to 13°C.",
    crop: "Mango",
    severity: "low",
  },
];

export const sustainabilityMetrics: SustainabilityMetric[] = [
  { label: "Water saved", value: "1.8 lakh L", delta: "+12% vs last season", positive: true },
  { label: "Carbon intensity", value: "0.34 kg/kg", delta: "−9% vs district avg", positive: true },
  { label: "Organic inputs", value: "71%", delta: "+8 pts", positive: true },
  { label: "Residue compliance", value: "100%", delta: "All lots below MRL", positive: true },
];

export const yieldSeries = [
  { month: "Nov", wheat: 0, veg: 1.2, spice: 0.4 },
  { month: "Dec", wheat: 0, veg: 1.8, spice: 0.5 },
  { month: "Jan", wheat: 0, veg: 2.1, spice: 0.6 },
  { month: "Feb", wheat: 0.4, veg: 2.4, spice: 1.8 },
  { month: "Mar", wheat: 3.6, veg: 2.0, spice: 1.2 },
  { month: "Apr", wheat: 1.1, veg: 2.6, spice: 0.3 },
];

export const priceSeries = [
  { day: "7 Apr", tomato: 36, onion: 24, mango: 160 },
  { day: "8 Apr", tomato: 38, onion: 25, mango: 165 },
  { day: "9 Apr", tomato: 40, onion: 26, mango: 170 },
  { day: "10 Apr", tomato: 41, onion: 27, mango: 175 },
  { day: "11 Apr", tomato: 43, onion: 28, mango: 178 },
  { day: "12 Apr", tomato: 42, onion: 28, mango: 180 },
];

export const adminKpis = {
  gmv: 1842000,
  orders: 1284,
  farmers: 642,
  buyers: 3910,
  passports: 2118,
  disputes: 7,
};
