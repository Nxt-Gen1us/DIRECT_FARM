import type { Order, OrderStatus } from "../lib/types";
import { products } from "./products";
import { orders } from "./orders";

export const FARMER_ID = "f-ramesh";

export const monthlySales = [
  { month: "Nov", revenue: 48200, cost: 29100, orders: 18 },
  { month: "Dec", revenue: 61400, cost: 35200, orders: 24 },
  { month: "Jan", revenue: 73800, cost: 40100, orders: 31 },
  { month: "Feb", revenue: 89100, cost: 46800, orders: 36 },
  { month: "Mar", revenue: 126400, cost: 64200, orders: 48 },
  { month: "Apr", revenue: 98450, cost: 51200, orders: 41 },
];

export const weeklySales = [
  { day: "7 Apr", mango: 7200, veg: 4100, dairy: 1960 },
  { day: "8 Apr", mango: 5400, veg: 3800, dairy: 980 },
  { day: "9 Apr", mango: 9000, veg: 5200, dairy: 1960 },
  { day: "10 Apr", mango: 10800, veg: 4600, dairy: 2940 },
  { day: "11 Apr", mango: 7200, veg: 6100, dairy: 980 },
  { day: "12 Apr", mango: 3600, veg: 7800, dairy: 1960 },
  { day: "13 Apr", mango: 5400, veg: 5400, dairy: 980 },
];

export const productMix = [
  { name: "Gir Kesar", key: "mango", value: 41200, fill: "#15803D" },
  { name: "A2 Ghee", key: "ghee", value: 19600, fill: "#A16207" },
  { name: "Onions", key: "onion", value: 14800, fill: "#EAB308" },
  { name: "Bhindi", key: "okra", value: 9200, fill: "#486C2F" },
  { name: "Palak", key: "spinach", value: 6400, fill: "#6A8F48" },
  { name: "Other", key: "other", value: 7250, fill: "#22C55E" },
];

export const farmerKpis = {
  revenue: monthlySales.reduce((s, m) => s + m.revenue, 0),
  monthRevenue: 98450,
  revenueDelta: "+18%",
  orders: monthlySales.reduce((s, m) => s + m.orders, 0),
  monthOrders: 41,
  ordersDelta: "+9",
  profit: monthlySales.reduce((s, m) => s + (m.revenue - m.cost), 0),
  monthProfit: 47250,
  profitDelta: "+14%",
  margin: 48,
  listings: products.filter((p) => p.farmerId === FARMER_ID).length,
  bestProduct: "Gir Kesar Mangoes",
  bestShare: 42,
};

export const todayHarvest = [
  {
    productId: "p-okra",
    name: "Tender Bhindi",
    image: "/images/okra.jpg",
    qty: 42,
    unit: "kg",
    window: "5:40–7:10 am",
    field: "Block 2",
    status: "picked" as const,
  },
  {
    productId: "p-spinach",
    name: "Palak Leaves",
    image: "/images/spinach.jpg",
    qty: 28,
    unit: "bundle",
    window: "5:20–6:00 am",
    field: "Canal bed",
    status: "chilled" as const,
  },
  {
    productId: "p-tomato-ode",
    name: "Ode Salad Tomatoes",
    image: "/images/tomatoes.jpg",
    qty: 36,
    unit: "kg",
    window: "6:15–7:40 am",
    field: "Open field A",
    status: "packing" as const,
  },
  {
    productId: "p-peas-anand",
    name: "Anand Sweet Peas",
    image: "/images/peas.jpg",
    qty: 12,
    unit: "kg",
    window: "Last flush",
    field: "Winter strip",
    status: "limited" as const,
  },
];

export const extraFarmerOrders: Order[] = [
  {
    id: "FC-88502",
    buyerId: "u-customer",
    buyerName: "Ananya Mehta",
    farmerId: FARMER_ID,
    farmerName: "Ramesh Patel",
    items: [
      {
        productId: "p-spinach",
        name: "Palak Leaves",
        image: "/images/spinach.jpg",
        qty: 6,
        unit: "bundle",
        price: 24,
      },
      {
        productId: "p-okra",
        name: "Tender Bhindi",
        image: "/images/okra.jpg",
        qty: 4,
        unit: "kg",
        price: 36,
      },
    ],
    status: "pending",
    paymentStatus: "paid",
    paymentMethod: "upi",
    subtotal: 288,
    delivery: 40,
    total: 328,
    address: "12, Satellite Road, Ahmedabad 380015",
    placedAt: "2026-04-13T06:12:00+05:30",
    eta: "2026-04-13",
    tracking: [
      { label: "Order placed", at: "13 Apr, 6:12 am", done: true },
      { label: "Awaiting confirmation", at: "", done: false },
    ],
  },
  {
    id: "FC-88488",
    buyerId: "u-hotel",
    buyerName: "Spice Route Kitchen",
    farmerId: FARMER_ID,
    farmerName: "Ramesh Patel",
    items: [
      {
        productId: "p-tomato-ode",
        name: "Ode Salad Tomatoes",
        image: "/images/tomatoes.jpg",
        qty: 20,
        unit: "kg",
        price: 38,
      },
    ],
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "netbanking",
    subtotal: 760,
    delivery: 60,
    total: 820,
    address: "CG Road, Navrangpura, Ahmedabad",
    placedAt: "2026-04-13T07:05:00+05:30",
    eta: "2026-04-13",
    tracking: [
      { label: "Order placed", at: "13 Apr, 7:05 am", done: true },
      { label: "Awaiting confirmation", at: "", done: false },
    ],
  },
  {
    id: "FC-88312",
    buyerId: "u-customer",
    buyerName: "Meera Shah",
    farmerId: FARMER_ID,
    farmerName: "Ramesh Patel",
    items: [
      {
        productId: "p-banana-anand",
        name: "Anand Robusta Bananas",
        image: "/images/bananas.jpg",
        qty: 8,
        unit: "kg",
        price: 42,
      },
    ],
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "upi",
    subtotal: 336,
    delivery: 40,
    total: 376,
    address: "Bodakdev, Ahmedabad",
    placedAt: "2026-04-12T19:40:00+05:30",
    eta: "2026-04-13",
    tracking: [
      { label: "Order placed", at: "12 Apr, 7:40 pm", done: true },
      { label: "Farmer confirmed", at: "12 Apr, 8:10 pm", done: true },
    ],
  },
];

export const farmerOrders: Order[] = [
  ...extraFarmerOrders,
  ...orders.filter((o) => o.farmerId === FARMER_ID),
];

export const pendingStatuses: OrderStatus[] = ["pending", "confirmed"];

export const farmerListings = products.filter((p) => p.farmerId === FARMER_ID);
