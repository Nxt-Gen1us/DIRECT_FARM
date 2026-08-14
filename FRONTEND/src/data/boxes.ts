import type { VegBox } from "../lib/types";

export const vegBoxes: VegBox[] = [
  {
    id: "box-kitchen",
    name: "Kitchen crate",
    size: "kitchen",
    cadence: "weekly",
    price: 499,
    blurb: "Tomato, onion, palak and bhindi — enough for a small kitchen through the week.",
    image: "/images/vegetables.jpg",
    farms: ["f-ramesh", "f-kavita"],
    items: [
      { productId: "p-tomato", qty: 2 },
      { productId: "p-onion", qty: 3 },
      { productId: "p-spinach", qty: 1 },
      { productId: "p-okra", qty: 1 },
    ],
  },
  {
    id: "box-family",
    name: "Family crate",
    size: "family",
    cadence: "weekly",
    price: 899,
    blurb: "A fuller table — the kitchen crate plus peas and a tin of ghee every other week.",
    image: "/images/harvest.jpg",
    farms: ["f-ramesh", "f-kavita"],
    items: [
      { productId: "p-tomato", qty: 4 },
      { productId: "p-onion", qty: 5 },
      { productId: "p-spinach", qty: 2 },
      { productId: "p-okra", qty: 2 },
      { productId: "p-peas-anand", qty: 1 },
    ],
  },
  {
    id: "box-chef",
    name: "Chef crate",
    size: "chef",
    cadence: "fortnight",
    price: 1490,
    blurb: "Hotel-grade lots: vine tomato, kesar when in colour, A2 ghee and a spice card.",
    image: "/images/mangoes.jpg",
    farms: ["f-ramesh", "f-kavita", "f-lakshmi"],
    items: [
      { productId: "p-tomato", qty: 6 },
      { productId: "p-mango", qty: 1 },
      { productId: "p-ghee", qty: 1 },
      { productId: "p-turmeric", qty: 1 },
      { productId: "p-spinach", qty: 2 },
    ],
  },
];

export const boxById = (id: string) => vegBoxes.find((b) => b.id === id);
