export type AiToolId =
  | "detect"
  | "grade"
  | "price"
  | "describe"
  | "demand"
  | "disease"
  | "harvest"
  | "remind";

export type CropKey = "tomato" | "okra" | "mango" | "wheat" | "spinach" | "chili";

export const scoutShots: {
  id: string;
  src: string;
  crop: string;
  field: string;
  key: CropKey;
}[] = [
  { id: "s-tom", src: "/images/tomatoes.jpg", crop: "Tomato", field: "Nashik polyhouse B", key: "tomato" },
  { id: "s-okr", src: "/images/okra.jpg", crop: "Okra", field: "Ode Block 2", key: "okra" },
  { id: "s-mng", src: "/images/mangoes.jpg", crop: "Mango", field: "Gir orchard", key: "mango" },
  { id: "s-wht", src: "/images/wheat.jpg", crop: "Wheat", field: "Malwa 118/2", key: "wheat" },
  { id: "s-spi", src: "/images/spinach.jpg", crop: "Spinach", field: "Ode canal bed", key: "spinach" },
  { id: "s-chi", src: "/images/chili.jpg", crop: "Chili", field: "Guntur ridge 7", key: "chili" },
];

export type DetectSample = {
  crop: string;
  variety: string;
  confidence: number;
  also: { label: string; p: number }[];
  note: string;
};

export type GradeSample = {
  grade: string;
  score: number;
  checks: { label: string; value: number }[];
  hold: string;
};

export type PriceSample = {
  crop: string;
  mandi: string;
  low: number;
  mid: number;
  high: number;
  recommend: number;
  unit: string;
  series: { day: string; apmc: number; farm: number }[];
  reason: string;
};

export type DescribeSample = { title: string; body: string; tags: string[] };

export type DemandSample = {
  crop: string;
  city: string;
  series: { week: string; demand: number; supply: number }[];
  peak: string;
  note: string;
};

export type DiseaseSample = {
  name: string;
  confidence: number;
  risk: "high" | "medium" | "low";
  crop: string;
  signs: string;
  action: string;
};

export type HarvestSample = {
  crop: string;
  window: string;
  readiness: number;
  series: { day: string; ready: number }[];
  note: string;
};

export const cropSamples: Record<
  CropKey,
  {
    detect: DetectSample;
    grade: GradeSample;
    price: PriceSample;
    describe: DescribeSample;
    demand: DemandSample;
    disease: DiseaseSample;
    harvest: HarvestSample;
  }
> = {
  tomato: {
    detect: {
      crop: "Tomato",
      variety: "Namdhari NS-4266",
      confidence: 91,
      also: [
        { label: "Cherry tomato", p: 6 },
        { label: "Capsicum (red)", p: 3 },
      ],
      note: "Breaker-red fruit, 55–70 mm, greenhouse shine. Matches Nashik polyhouse lots listed this week.",
    },
    grade: {
      grade: "A",
      score: 88,
      checks: [
        { label: "Colour uniformity", value: 92 },
        { label: "Size band 55–70 mm", value: 90 },
        { label: "Shoulder scar", value: 78 },
        { label: "Soft fruit", value: 94 },
      ],
      hold: "2 of 24 fruits show a small shoulder scar. Still A if packed stem-up.",
    },
    price: {
      crop: "Tomato",
      mandi: "Ahmedabad APMC",
      low: 38,
      mid: 42,
      high: 46,
      recommend: 43,
      unit: "kg",
      series: [
        { day: "7 Apr", apmc: 36, farm: 34 },
        { day: "8 Apr", apmc: 38, farm: 36 },
        { day: "9 Apr", apmc: 40, farm: 38 },
        { day: "10 Apr", apmc: 41, farm: 40 },
        { day: "11 Apr", apmc: 43, farm: 41 },
        { day: "12 Apr", apmc: 42, farm: 42 },
        { day: "13 Apr", apmc: 44, farm: 43 },
      ],
      reason: "Nashik arrivals are 11% lower week-on-week. Graded A fruit can hold ₹1–2 above APMC mid.",
    },
    describe: {
      title: "Nashik vine tomatoes — breaker-red, same-morning crate",
      body: "Firm, deep-red greenhouse tomatoes picked at breaker-red in Polyhouse B, Dindori. High lycopene, low bruise, six-day cold-chain life. Every crate carries passport NSK-TOM-2026-W15 — soil, drip and residue on the QR.",
      tags: ["polyhouse", "same-day", "passport"],
    },
    demand: {
      crop: "Tomato",
      city: "Ahmedabad kitchens",
      series: [
        { week: "W12", demand: 18, supply: 22 },
        { week: "W13", demand: 20, supply: 19 },
        { week: "W14", demand: 24, supply: 17 },
        { week: "W15", demand: 26, supply: 16 },
        { week: "W16", demand: 23, supply: 18 },
      ],
      peak: "Week 15",
      note: "Hotel kitchens and Satellite households both pull harder before Akshaya Tritiya. Hold graded A 48 hours if the cold room is free.",
    },
    disease: {
      name: "Early blight (Alternaria solani)",
      confidence: 86,
      risk: "high",
      crop: "Tomato",
      signs: "Concentric leaf spots on older foliage after Thursday’s wet spell and 36°C days.",
      action: "Bio-fungicide or copper 12 hours before the next shower. Drop night humidity in the bay.",
    },
    harvest: {
      crop: "Nashik vine tomato",
      window: "Daily · 6:30–8:00 am",
      readiness: 84,
      series: [
        { day: "10 Apr", ready: 70 },
        { day: "11 Apr", ready: 76 },
        { day: "12 Apr", ready: 81 },
        { day: "13 Apr", ready: 84 },
        { day: "14 Apr", ready: 86 },
        { day: "15 Apr", ready: 80 },
        { day: "16 Apr", ready: 74 },
      ],
      note: "Breaker-red share is high. Pick before Wednesday’s shower; skip overripe fruit on the truss.",
    },
  },
  okra: {
    detect: {
      crop: "Okra",
      variety: "Parbhani Kranti",
      confidence: 89,
      also: [
        { label: "Cluster bean", p: 7 },
        { label: "Ridge gourd", p: 4 },
      ],
      note: "8–10 cm pods, low fibre, morning pick. Matches Ode Block 2 same-day crates.",
    },
    grade: {
      grade: "A",
      score: 90,
      checks: [
        { label: "Pod length 8–10 cm", value: 93 },
        { label: "Fibre", value: 88 },
        { label: "Tip dryness", value: 86 },
        { label: "Bruise", value: 94 },
      ],
      hold: "A few pods over 11 cm — pull them for home use. Hotel crate stays A.",
    },
    price: {
      crop: "Okra",
      mandi: "Ahmedabad APMC",
      low: 32,
      mid: 36,
      high: 44,
      recommend: 38,
      unit: "kg",
      series: [
        { day: "7 Apr", apmc: 30, farm: 32 },
        { day: "8 Apr", apmc: 32, farm: 34 },
        { day: "9 Apr", apmc: 34, farm: 35 },
        { day: "10 Apr", apmc: 36, farm: 36 },
        { day: "11 Apr", apmc: 38, farm: 36 },
        { day: "12 Apr", apmc: 40, farm: 38 },
        { day: "13 Apr", apmc: 38, farm: 38 },
      ],
      reason: "Same-morning 8–10 cm pods earn a premium over mandi mix. Heat will lift arrivals mid-week.",
    },
    describe: {
      title: "Tender bhindi — morning-picked, 8–10 cm",
      body: "Parbhani Kranti from Ode Block 2, cut before 7 am. Low fibre, packed in ventilated crates within two hours. Passport on the lid. Best in the kitchen the same evening.",
      tags: ["same-day", "hotel", "organic"],
    },
    demand: {
      crop: "Okra",
      city: "Ahmedabad kitchens",
      series: [
        { week: "W12", demand: 9, supply: 11 },
        { week: "W13", demand: 11, supply: 10 },
        { week: "W14", demand: 13, supply: 9 },
        { week: "W15", demand: 12, supply: 10 },
        { week: "W16", demand: 10, supply: 12 },
      ],
      peak: "Week 14",
      note: "Hotel thali lines pull harder this week. Keep the 8–10 cm band; longer pods go to the mandi mix.",
    },
    disease: {
      name: "Yellow vein mosaic",
      confidence: 74,
      risk: "medium",
      crop: "Okra",
      signs: "Vein yellowing on a few older leaves. Whitefly pressure after the dry spell.",
      action: "Rogue the yellow plants. Neem spray at dusk. Do not hold seed from this strip.",
    },
    harvest: {
      crop: "Ode okra",
      window: "Daily · 5:40–7:10 am",
      readiness: 92,
      series: [
        { day: "10 Apr", ready: 80 },
        { day: "11 Apr", ready: 86 },
        { day: "12 Apr", ready: 90 },
        { day: "13 Apr", ready: 92 },
        { day: "14 Apr", ready: 91 },
        { day: "15 Apr", ready: 88 },
        { day: "16 Apr", ready: 84 },
      ],
      note: "Flush is on. Skip tomorrow if Thursday rain wets the beds after 4 pm.",
    },
  },
  mango: {
    detect: {
      crop: "Mango",
      variety: "Gir Kesar",
      confidence: 94,
      also: [
        { label: "Alphonso", p: 4 },
        { label: "Dasheri", p: 2 },
      ],
      note: "GI Kesar at colour break, 220–280 g. Matches the Talala orchard lot.",
    },
    grade: {
      grade: "GI-A",
      score: 91,
      checks: [
        { label: "Colour break ~80%", value: 90 },
        { label: "Weight 220–280 g", value: 93 },
        { label: "Sap burn", value: 88 },
        { label: "Soft shoulder", value: 92 },
      ],
      hold: "Three fruits with light sap — wipe and pack separately. Rest are GI-A.",
    },
    price: {
      crop: "Kesar mango",
      mandi: "Ahmedabad fruit yard",
      low: 160,
      mid: 180,
      high: 210,
      recommend: 186,
      unit: "dozen",
      series: [
        { day: "7 Apr", apmc: 160, farm: 165 },
        { day: "8 Apr", apmc: 165, farm: 170 },
        { day: "9 Apr", apmc: 170, farm: 175 },
        { day: "10 Apr", apmc: 175, farm: 178 },
        { day: "11 Apr", apmc: 178, farm: 180 },
        { day: "12 Apr", apmc: 180, farm: 182 },
        { day: "13 Apr", apmc: 184, farm: 186 },
      ],
      reason: "First colour-break lots of the week. GI paper and no carbide hold a premium over mandi mix.",
    },
    describe: {
      title: "Gir Kesar — tree-ripened, GI tagged",
      body: "Kesar from the Talala orchard, picked at 80% colour break, ethylene-free. Fibre-light, saffron flesh. Passport lists the eighty grafts and the kaolin spray. Two dozen to a paper-lined crate.",
      tags: ["GI", "seasonal", "passport"],
    },
    demand: {
      crop: "Kesar mango",
      city: "Ahmedabad + export desks",
      series: [
        { week: "W13", demand: 6, supply: 4 },
        { week: "W14", demand: 9, supply: 6 },
        { week: "W15", demand: 14, supply: 8 },
        { week: "W16", demand: 16, supply: 11 },
        { week: "W17", demand: 12, supply: 14 },
      ],
      peak: "Week 16",
      note: "Kitchen and gift crates peak next week. Do not flood the yard — hold the last flush for hotels.",
    },
    disease: {
      name: "Anthracnose (Colletotrichum)",
      confidence: 69,
      risk: "medium",
      crop: "Mango",
      signs: "Pin-prick black on two shoulders after the last basin irrigation.",
      action: "Cull marked fruit. Keep the crate dry. Do not mix with the GI-A dozen.",
    },
    harvest: {
      crop: "Gir Kesar mango",
      window: "16–22 Apr 2026",
      readiness: 78,
      series: [
        { day: "10 Apr", ready: 62 },
        { day: "12 Apr", ready: 70 },
        { day: "14 Apr", ready: 74 },
        { day: "16 Apr", ready: 78 },
        { day: "18 Apr", ready: 86 },
        { day: "20 Apr", ready: 91 },
        { day: "22 Apr", ready: 88 },
      ],
      note: "Orchard stills show 78% at colour break. Book two crews and pre-cool crates to 13°C.",
    },
  },
  wheat: {
    detect: {
      crop: "Wheat",
      variety: "HI 1544 Sharbati",
      confidence: 87,
      also: [
        { label: "Durum", p: 9 },
        { label: "Barley", p: 4 },
      ],
      note: "Amber grain, FAQ look, 12% moisture class. Matches Malwa cooperative lots.",
    },
    grade: {
      grade: "FAQ",
      score: 84,
      checks: [
        { label: "Moisture ~11–12%", value: 88 },
        { label: "Foreign matter", value: 90 },
        { label: "Broken grain", value: 80 },
        { label: "Protein look", value: 82 },
      ],
      hold: "FAQ for chapati flour. Keep the lot destoned; do not mix with the durum bin.",
    },
    price: {
      crop: "Sharbati wheat",
      mandi: "Indore / Ahmedabad grain",
      low: 30,
      mid: 34,
      high: 37,
      recommend: 34,
      unit: "kg",
      series: [
        { day: "7 Apr", apmc: 31, farm: 32 },
        { day: "8 Apr", apmc: 32, farm: 33 },
        { day: "9 Apr", apmc: 33, farm: 33 },
        { day: "10 Apr", apmc: 33, farm: 34 },
        { day: "11 Apr", apmc: 34, farm: 34 },
        { day: "12 Apr", apmc: 34, farm: 34 },
        { day: "13 Apr", apmc: 35, farm: 34 },
      ],
      reason: "FAQ Sharbati is steady. No premium without a mill moisture slip under 12%.",
    },
    describe: {
      title: "Malwa Sharbati — destoned, 12.4% protein",
      body: "HI 1544 from black cotton soil, Depalpur. Cleaned at the cooperative mill, 11% moisture. Lot tagged at the bag. For chapati flour, not for seed.",
      tags: ["FAQ", "mill-ready", "MP"],
    },
    demand: {
      crop: "Wheat",
      city: "Ahmedabad flour desks",
      series: [
        { week: "W12", demand: 40, supply: 38 },
        { week: "W13", demand: 42, supply: 41 },
        { week: "W14", demand: 39, supply: 44 },
        { week: "W15", demand: 37, supply: 46 },
        { week: "W16", demand: 36, supply: 45 },
      ],
      peak: "Week 13",
      note: "Post-harvest flush is on. Hold only if the mill pays for protein; else move FAQ this week.",
    },
    disease: {
      name: "Loose smut (sample grain)",
      confidence: 41,
      risk: "low",
      crop: "Wheat",
      signs: "No blackened ears in this still. Grain looks clean FAQ.",
      action: "No spray on stored grain. Keep the lot dry and destoned.",
    },
    harvest: {
      crop: "Malwa Sharbati",
      window: "Done · 22 Mar 2026",
      readiness: 100,
      series: [
        { day: "16 Mar", ready: 70 },
        { day: "18 Mar", ready: 82 },
        { day: "20 Mar", ready: 91 },
        { day: "22 Mar", ready: 100 },
        { day: "24 Mar", ready: 100 },
      ],
      note: "This lot is already off the combine. The sample run is for the next rabi calendar only.",
    },
  },
  spinach: {
    detect: {
      crop: "Spinach",
      variety: "All Green",
      confidence: 90,
      also: [
        { label: "Fenugreek leaf", p: 6 },
        { label: "Amaranth", p: 4 },
      ],
      note: "Dark leaf, dew still on. Matches Ode canal-bed palak cut before sunrise.",
    },
    grade: {
      grade: "A",
      score: 87,
      checks: [
        { label: "Leaf colour", value: 92 },
        { label: "Yellow edge", value: 80 },
        { label: "Grit after wash", value: 86 },
        { label: "Wilt", value: 90 },
      ],
      hold: "A few yellow petioles — pull them. Chill to 6°C before the van.",
    },
    price: {
      crop: "Palak",
      mandi: "Ahmedabad leaf yard",
      low: 20,
      mid: 24,
      high: 30,
      recommend: 26,
      unit: "bundle",
      series: [
        { day: "7 Apr", apmc: 18, farm: 20 },
        { day: "8 Apr", apmc: 20, farm: 22 },
        { day: "9 Apr", apmc: 22, farm: 24 },
        { day: "10 Apr", apmc: 24, farm: 24 },
        { day: "11 Apr", apmc: 26, farm: 25 },
        { day: "12 Apr", apmc: 24, farm: 26 },
        { day: "13 Apr", apmc: 26, farm: 26 },
      ],
      reason: "Same-morning washed bundles hold ₹2 over the leaf yard. Heat will wilt unsold stock by noon.",
    },
    describe: {
      title: "Canal-bed palak — cut before sunrise",
      body: "All Green spinach from the Ode canal strip, triple-washed and chilled to 6°C. Best within 36 hours. Passport on the bundle tie.",
      tags: ["leafy", "same-day", "organic"],
    },
    demand: {
      crop: "Palak",
      city: "Ahmedabad households",
      series: [
        { week: "W12", demand: 5, supply: 6 },
        { week: "W13", demand: 6, supply: 5 },
        { week: "W14", demand: 7, supply: 5 },
        { week: "W15", demand: 6, supply: 6 },
        { week: "W16", demand: 5, supply: 7 },
      ],
      peak: "Week 14",
      note: "Household thali demand is firm. Do not cut more than the 9 am van can take.",
    },
    disease: {
      name: "Leaf miner / heat wilt",
      confidence: 62,
      risk: "low",
      crop: "Spinach",
      signs: "A few tunnels on older leaves. No white rust in this still.",
      action: "Cull mined leaves. Harvest before 8 am. Do not spray a ready-to-cut bed.",
    },
    harvest: {
      crop: "Ode palak",
      window: "Daily · 5:20–6:00 am",
      readiness: 95,
      series: [
        { day: "10 Apr", ready: 88 },
        { day: "11 Apr", ready: 92 },
        { day: "12 Apr", ready: 94 },
        { day: "13 Apr", ready: 95 },
        { day: "14 Apr", ready: 93 },
        { day: "15 Apr", ready: 80 },
        { day: "16 Apr", ready: 70 },
      ],
      note: "Cut at dawn. After Thursday rain the bed may be too wet — skip a day if grit rises.",
    },
  },
  chili: {
    detect: {
      crop: "Chili",
      variety: "Sannam S4",
      confidence: 88,
      also: [
        { label: "Byadgi", p: 8 },
        { label: "Kashmiri", p: 4 },
      ],
      note: "Sun-dried stem-on pods, high colour. Matches Guntur ridge lots.",
    },
    grade: {
      grade: "ASTA 90",
      score: 86,
      checks: [
        { label: "Colour (ASTA look)", value: 90 },
        { label: "Broken pods", value: 82 },
        { label: "Moisture ~8%", value: 88 },
        { label: "Stem-on share", value: 85 },
      ],
      hold: "A handful of pale pods — pick out for the mill mix. Exporter crate stays ASTA 90.",
    },
    price: {
      crop: "Guntur Sannam",
      mandi: "Guntur / export desk",
      low: 190,
      mid: 210,
      high: 230,
      recommend: 214,
      unit: "kg",
      series: [
        { day: "7 Apr", apmc: 198, farm: 200 },
        { day: "8 Apr", apmc: 202, farm: 205 },
        { day: "9 Apr", apmc: 206, farm: 208 },
        { day: "10 Apr", apmc: 210, farm: 210 },
        { day: "11 Apr", apmc: 212, farm: 212 },
        { day: "12 Apr", apmc: 214, farm: 214 },
        { day: "13 Apr", apmc: 216, farm: 214 },
      ],
      reason: "Stem-on, ASTA-look lots hold above the yard mix. Wait for the CFS call before cutting price.",
    },
    describe: {
      title: "Guntur Sannam — sun-dried, stem-on, ASTA 90 look",
      body: "Sannam S4 from Ridge 7, dried on bamboo. Moisture 8.4%. Residue sheet on the passport. Packed for the Krishnapatnam desk, not the powder mill.",
      tags: ["hot", "ASTA 90", "export"],
    },
    demand: {
      crop: "Sannam chili",
      city: "Export CFS + masala mills",
      series: [
        { week: "W12", demand: 30, supply: 28 },
        { week: "W13", demand: 34, supply: 30 },
        { week: "W14", demand: 32, supply: 31 },
        { week: "W15", demand: 28, supply: 33 },
        { week: "W16", demand: 26, supply: 34 },
      ],
      peak: "Week 13",
      note: "Exporter call is this fortnight. After W15 the mill will take broken pods cheaper.",
    },
    disease: {
      name: "Die-back / fruit rot (sample dry lot)",
      confidence: 55,
      risk: "low",
      crop: "Chili",
      signs: "Dry lot — no fresh fruit rot in this still. Colour is even.",
      action: "Keep bags off the floor. Do not remoisten. Cull pale pods before the CFS weigh.",
    },
    harvest: {
      crop: "Guntur Sannam",
      window: "Done · 4 Mar 2026",
      readiness: 100,
      series: [
        { day: "20 Feb", ready: 60 },
        { day: "26 Feb", ready: 78 },
        { day: "4 Mar", ready: 100 },
        { day: "10 Mar", ready: 100 },
      ],
      note: "This ridge is already sun-dried. The sample run is for the next sowing calendar.",
    },
  },
};

export const detectDemo = cropSamples.tomato.detect;
export const gradeDemo = cropSamples.tomato.grade;
export const priceDemo = cropSamples.tomato.price;
export const describeDemo = cropSamples.tomato.describe;
export const demandDemo = cropSamples.tomato.demand;
export const diseaseDemo = cropSamples.tomato.disease;
export const harvestPredictDemo = cropSamples.tomato.harvest;

export function sampleFor(key: CropKey) {
  return cropSamples[key] ?? cropSamples.tomato;
}

export const remindersDemo = [
  {
    id: "rm-1",
    crop: "Okra",
    field: "Ode Block 2",
    when: "14 Apr, 5:40 am",
    task: "Morning pick — 8–10 cm pods only.",
    due: "tomorrow",
  },
  {
    id: "rm-2",
    crop: "Kesar mango",
    field: "Gir orchard",
    when: "16 Apr, 6:00 am",
    task: "First colour-break lift. Pre-cool to 13°C.",
    due: "in 3 days",
  },
  {
    id: "rm-3",
    crop: "Tomato",
    field: "Nashik Polyhouse B",
    when: "15 Apr, 6:30 am",
    task: "Breaker-red pass before the Wednesday shower.",
    due: "in 2 days",
  },
];
