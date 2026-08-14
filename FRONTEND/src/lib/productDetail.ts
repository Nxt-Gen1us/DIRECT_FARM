import type { Product } from "./types";

export type PackOption = { id: string; labelKey: string; noteKey: string; extra: number };

export function packOptionsFor(product: Product): PackOption[] {
  if (product.category === "dairy") {
    return [
      { id: "glass", labelKey: "detail.pack.glass", noteKey: "detail.pack.glassNote", extra: 0 },
      { id: "steel", labelKey: "detail.pack.steel", noteKey: "detail.pack.steelNote", extra: 40 },
    ];
  }
  if (product.category === "grains" || product.category === "spices" || product.category === "pulses") {
    return [
      { id: "cloth", labelKey: "detail.pack.cloth", noteKey: "detail.pack.clothNote", extra: 0 },
      { id: "jute", labelKey: "detail.pack.jute", noteKey: "detail.pack.juteNote", extra: 0 },
      { id: "crate", labelKey: "detail.pack.crate", noteKey: "detail.pack.crateNote", extra: 20 },
    ];
  }
  return [
    { id: "crate", labelKey: "detail.pack.crate", noteKey: "detail.pack.crateNote", extra: 0 },
    { id: "jute", labelKey: "detail.pack.jute", noteKey: "detail.pack.juteNote", extra: 0 },
    { id: "leaf", labelKey: "detail.pack.leaf", noteKey: "detail.pack.leafNote", extra: 8 },
  ];
}

export function galleryFor(product: Product) {
  const extras = product.images.filter((src) => src !== product.image);
  const pool = [
    product.image,
    ...extras,
    product.category === "vegetables" ? "/images/vegetables.jpg" : "",
    product.category === "fruits" ? "/images/fruits.jpg" : "",
    product.category === "grains" ? "/images/grains.jpg" : "",
    product.category === "spices" ? "/images/spices.jpg" : "",
    "/images/harvest.jpg",
  ].filter(Boolean);
  return [...new Set(pool)];
}

export function videoFor(product: Product) {
  if (product.category === "vegetables" || product.category === "fruits") {
    return "/videos/product-lot.mp4";
  }
  return "/videos/hero-field.mp4";
}

export type Review = {
  id: string;
  productId: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
};

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p-tomato",
    name: "Meera Shah",
    role: "Chef, Spice Route Kitchen",
    rating: 5,
    date: "2026-04-11",
    title: "Still smells of the vine",
    body: "Breaker-red fruit arrived with the passport QR on the crate. We held them four days and they stayed firm. The brigade has stopped guessing.",
    verified: true,
  },
  {
    id: "r2",
    productId: "p-tomato",
    name: "Ananya Mehta",
    role: "Household, Satellite",
    rating: 5,
    date: "2026-04-08",
    title: "Sweet, not watery",
    body: "Sliced for salad the evening they arrived. Seeds held, juice was thick. Kavita-ji packed them the morning of dispatch.",
    verified: true,
  },
  {
    id: "r3",
    productId: "p-tomato",
    name: "Karan Desai",
    role: "Hotel procurement",
    rating: 4,
    date: "2026-04-04",
    title: "Uniform grade",
    body: "55–70 mm as promised. Two fruits had a small shoulder scar — noted on the lot card. We will reorder weekly.",
    verified: true,
  },
  {
    id: "r4",
    productId: "p-mango",
    name: "Priya Nair",
    role: "Exporter desk",
    rating: 5,
    date: "2026-04-07",
    title: "GI Kesar that tastes of Gir",
    body: "Colour break at 80%, no carbide. The passport lists the orchard and the kaolin spray. This is how kesar should travel.",
    verified: true,
  },
  {
    id: "r5",
    productId: "p-mango",
    name: "Meera Shah",
    role: "Chef",
    rating: 5,
    date: "2026-04-06",
    title: "Aamras without apology",
    body: "Two dozen, fibre-light, saffron flesh. We served them as they were. Guests asked for the farm name.",
    verified: true,
  },
  {
    id: "r6",
    productId: "p-rice",
    name: "Karan Desai",
    role: "Hotel group",
    rating: 5,
    date: "2026-04-02",
    title: "Aged, not dusty",
    body: "8.4 mm grain, cloth bags, no plastic. Cooked length was honest. Harpreet packed moisture at 12%.",
    verified: true,
  },
  {
    id: "r7",
    productId: "p-ghee",
    name: "Ananya Mehta",
    role: "Household",
    rating: 5,
    date: "2026-04-07",
    title: "Granular, nutty, A2",
    body: "Sets like the ghee my grandmother kept. The passport names the twelve Gir cows. Worth every rupee on thepla.",
    verified: true,
  },
  {
    id: "r8",
    productId: "p-turmeric",
    name: "Priya Nair",
    role: "Spice exporter, Kochi",
    rating: 5,
    date: "2026-03-20",
    title: "4.1% curcumin, clean sheet",
    body: "Rotterdam opened the lot on the QR. Residue was nil. Lakshmi’s fingers are what we want on the dock.",
    verified: true,
  },
  {
    id: "r9",
    productId: "p-onion",
    name: "Karan Desai",
    role: "Hotel kitchen",
    rating: 4,
    date: "2026-04-01",
    title: "Tight necks, honest dry matter",
    body: "Fifty kilos for the week. No sprouting in the crate. Ramesh grades 50–70 mm as written.",
    verified: true,
  },
  {
    id: "r10",
    productId: "p-chili",
    name: "Priya Nair",
    role: "Exporter",
    rating: 5,
    date: "2026-03-18",
    title: "ASTA 90, as laboured",
    body: "Capsaicin and colour matched the passport. Stem-on lots packed clean. We will take the next ridge.",
    verified: true,
  },
];

export function reviewsFor(productId: string): Review[] {
  const own = reviews.filter((r) => r.productId === productId);
  if (own.length >= 2) return own;
  return [...own, ...reviews.filter((r) => r.productId !== productId).slice(0, 3 - own.length)];
}
