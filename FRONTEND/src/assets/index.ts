/**
 * Public asset catalog. Files live in /public and are referenced by URL.
 *
 *   public/favicon.svg
 *   public/images/hero/*
 *   public/images/crops/*
 *   public/images/farmers/*
 *   public/images/categories/*
 */
export const images = {
  hero: {
    farm: "/images/hero-farm.jpg",
    harvest: "/images/harvest.jpg",
    irrigation: "/images/irrigation.jpg",
  },
  farmers: {
    portrait: "/images/farmer-portrait.jpg",
    ramesh: "/images/farmer-ramesh.jpg",
    kavita: "/images/farmer-kavita.jpg",
    harpreet: "/images/farmer-harpreet.jpg",
    lakshmi: "/images/farmer-lakshmi.jpg",
  },
  voices: {
    chef: "/images/chef-ananya.jpg",
    hotel: "/images/buyer-hotel.jpg",
    exporter: "/images/exporter-priya.jpg",
  },
  video: {
    hero: "/videos/hero-field.mp4",
  },
  categories: {
    vegetables: "/images/vegetables.jpg",
    fruits: "/images/fruits.jpg",
    grains: "/images/grains.jpg",
    spices: "/images/spices.jpg",
    dairy: "/images/dairy.jpg",
    fibre: "/images/cotton.jpg",
  },
  crops: {
    tomatoes: "/images/tomatoes.jpg",
    onions: "/images/onions.jpg",
    okra: "/images/okra.jpg",
    spinach: "/images/spinach.jpg",
    cauliflower: "/images/cauliflower.jpg",
    peas: "/images/peas.jpg",
    mangoes: "/images/mangoes.jpg",
    bananas: "/images/bananas.jpg",
    wheat: "/images/wheat.jpg",
    rice: "/images/rice.jpg",
    turmeric: "/images/turmeric.jpg",
    chili: "/images/chili.jpg",
    cotton: "/images/cotton.jpg",
    dairy: "/images/dairy.jpg",
  },
  brand: {
    favicon: "/favicon.svg",
  },
} as const;

export type ImageGroup = keyof typeof images;
