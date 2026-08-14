export type TimelineKind = "harvest" | "cert" | "infra" | "story";

export type FarmTimelineItem = {
  id: string;
  date: string;
  kind: TimelineKind;
  title: string;
  body: string;
};

export type FarmVideo = {
  id: string;
  title: string;
  kind: "field" | "drone" | "harvest";
  src: string;
  poster: string;
};

export type FarmProfileExtra = {
  farmerId: string;
  headline: string;
  story: string[];
  crops: string[];
  experienceYears: number;
  organic: boolean;
  members: string;
  gallery: { src: string; caption: string }[];
  videos: FarmVideo[];
  timeline: FarmTimelineItem[];
};

export const farmProfiles: FarmProfileExtra[] = [
  {
    farmerId: "f-ramesh",
    headline: "Third-generation steward of the Ode canal fields.",
    story: [
      "The Patel family has farmed the alluvial strip beside the Mahi canal since my grandfather bought the first four acres in 1967. I took the plough in 1998, after a season at the Anand Agricultural University short course on drip.",
      "We keep twelve and a half acres in vegetables and a small Gir dairy. Vermicompost from our own shed, night drip in summer, and every crate now carries a digital crop passport. Ahmedabad kitchens know the lot before the van arrives.",
      "I still walk Block 3 at first light. If the okra is fibrous, it does not leave the farm. That is the only rule that has never changed.",
    ],
    crops: ["Okra", "Palak", "Tomato", "Onion", "Cauliflower", "Peas", "Kesar mango", "A2 ghee"],
    experienceYears: 28,
    organic: true,
    members: "Ramesh, Meena, and two seasonal crews",
    gallery: [
      { src: "/images/harvest.jpg", caption: "Morning pick on Block 2" },
      { src: "/images/irrigation.jpg", caption: "Night drip on the onion beds" },
      { src: "/images/okra.jpg", caption: "Parbhani Kranti, 8–10 cm" },
      { src: "/images/spinach.jpg", caption: "Palak cut before sunrise" },
      { src: "/images/onions.jpg", caption: "Mahuva reds curing in the shed" },
      { src: "/images/mangoes.jpg", caption: "Gir Kesar at colour break" },
      { src: "/images/dairy.jpg", caption: "Bilona ghee from twelve Gir cows" },
      { src: "/images/tomatoes.jpg", caption: "Open-field salad tomatoes" },
    ],
    videos: [
      {
        id: "v-drone",
        title: "Drone over the canal strip",
        kind: "drone",
        src: "/videos/drone-farm.mp4",
        poster: "/images/irrigation.jpg",
      },
      {
        id: "v-field",
        title: "Wheat-light on the headland",
        kind: "field",
        src: "/videos/hero-field.mp4",
        poster: "/images/hero-farm.jpg",
      },
      {
        id: "v-harvest",
        title: "Hands in the morning lot",
        kind: "harvest",
        src: "/videos/farm-harvest.mp4",
        poster: "/images/harvest.jpg",
      },
    ],
    timeline: [
      {
        id: "t1",
        date: "2026-04-13",
        kind: "harvest",
        title: "42 kg bhindi before seven",
        body: "Block 2 picked 5:40–7:10 am. Crates chilled; Ahmedabad van booked for 9.",
      },
      {
        id: "t2",
        date: "2026-04-07",
        kind: "harvest",
        title: "Kesar lot signed in",
        body: "Two dozen GI mangoes and a tin of A2 ghee delivered to Satellite. Kitchen note: granular, nutty.",
      },
      {
        id: "t3",
        date: "2026-03-28",
        kind: "harvest",
        title: "Onion lift on the canal side",
        body: "ALR bulbs cured, graded 50–70 mm. Passport AND-ONI-2026-W13 sealed.",
      },
      {
        id: "t4",
        date: "2025-11-02",
        kind: "infra",
        title: "Second drip reel on Block 3",
        body: "Night slot 9 pm–2 am. Last summer’s water book fell 18%.",
      },
      {
        id: "t5",
        date: "2024-06-18",
        kind: "cert",
        title: "India Organic renewed",
        body: "Jaivik Bharat and FSSAI stay current. Residue sheet attached to every passport.",
      },
      {
        id: "t6",
        date: "2014-07-01",
        kind: "story",
        title: "Eighty Kesar grafts in Gir",
        body: "A cousin’s orchard in Talala. We list the fruit under the same farm name each April.",
      },
      {
        id: "t7",
        date: "1998-06-01",
        kind: "story",
        title: "First season on my own books",
        body: "Four acres from my father, a second-hand pump, and a promise not to sell watery tomatoes.",
      },
    ],
  },
  {
    farmerId: "f-kavita",
    headline: "Women-led polyhouses on the Nashik ridge.",
    story: [
      "I started with one bay in 2007 after the grape crash. Today eight acres under plastic, sixteen women on the payroll, and every tomato crate traced to a truss.",
      "We pick breaker-red so the fruit lasts the Ahmedabad haul. The passport is not marketing. It is how the brigade stopped guessing.",
    ],
    crops: ["Greenhouse tomato", "Baby okra", "Palak"],
    experienceYears: 19,
    organic: true,
    members: "Kavita and a 16-woman crew",
    gallery: [
      { src: "/images/tomatoes.jpg", caption: "Polyhouse B at first light" },
      { src: "/images/okra.jpg", caption: "Baby okra for hotel kitchens" },
      { src: "/images/spinach.jpg", caption: "Shade palak" },
      { src: "/images/irrigation.jpg", caption: "Fertigation manifold" },
    ],
    videos: [
      {
        id: "v-drone",
        title: "Ridge from the air",
        kind: "drone",
        src: "/videos/drone-farm.mp4",
        poster: "/images/irrigation.jpg",
      },
      {
        id: "v-lot",
        title: "Fruit on the vine",
        kind: "harvest",
        src: "/videos/product-lot.mp4",
        poster: "/images/tomatoes.jpg",
      },
    ],
    timeline: [
      {
        id: "k1",
        date: "2026-04-12",
        kind: "harvest",
        title: "Crate left Nashik at 2 pm",
        body: "NS-4266 breaker-red, QR on the lid. Due Ahmedabad noon.",
      },
      {
        id: "k2",
        date: "2025-12-18",
        kind: "harvest",
        title: "New trays of NS-4266",
        body: "Nursery lot NS4266-25B. Transplanted to Polyhouse B in January.",
      },
      {
        id: "k3",
        date: "2023-08-01",
        kind: "cert",
        title: "GlobalG.A.P. first audit",
        body: "The cluster passed on the second visit. We kept the checklist on the shed wall.",
      },
    ],
  },
  {
    farmerId: "f-harpreet",
    headline: "Pusa 1121 with alternate wetting and drying.",
    story: [
      "Twenty-two acres on the Bhikhiwind side. Father sowed IR-8; I switched to 1121 in 2009 and never looked back.",
      "AWD cut our pumping hours. Grain moisture and lot identity are written at the thresher, not in the mandi.",
    ],
    crops: ["Pusa 1121 basmati", "Durum wheat"],
    experienceYears: 35,
    organic: false,
    members: "Harpreet, two brothers, harvest crews",
    gallery: [
      { src: "/images/rice.jpg", caption: "Aged 1121 in cloth" },
      { src: "/images/wheat.jpg", caption: "Doaba durum" },
      { src: "/images/grains.jpg", caption: "Khasra 44 after threshing" },
      { src: "/images/hero-farm.jpg", caption: "Headland at dusk" },
    ],
    videos: [
      {
        id: "v-field",
        title: "Standing crop",
        kind: "field",
        src: "/videos/hero-field.mp4",
        poster: "/images/wheat.jpg",
      },
      {
        id: "v-drone",
        title: "Fields from above",
        kind: "drone",
        src: "/videos/drone-farm.mp4",
        poster: "/images/grains.jpg",
      },
    ],
    timeline: [
      {
        id: "h1",
        date: "2026-04-12",
        kind: "harvest",
        title: "Rice packed in cloth",
        body: "Five-kilo bags, no plastic. Aged five months.",
      },
      {
        id: "h2",
        date: "2025-11-02",
        kind: "harvest",
        title: "1121 off the thresher",
        body: "Moisture 18% then dried to 12%. Lot PUN-BAS-2025-KHA-07.",
      },
    ],
  },
  {
    farmerId: "f-lakshmi",
    headline: "Erode fingers, 4.1% curcumin, no synthetic soil cake.",
    story: [
      "The garden is six acres of turmeric and Nendran. We boil and polish on the farm. Rotterdam opens the QR before the sack.",
    ],
    crops: ["Erode turmeric", "Nendran banana", "Byadgi mix"],
    experienceYears: 23,
    organic: true,
    members: "Lakshmi and the garden crew",
    gallery: [
      { src: "/images/turmeric.jpg", caption: "Polished fingers" },
      { src: "/images/bananas.jpg", caption: "Nendran at 75% maturity" },
      { src: "/images/chili.jpg", caption: "Byadgi mix on mats" },
      { src: "/images/spices.jpg", caption: "Spice loft" },
    ],
    videos: [
      {
        id: "v-drone",
        title: "Garden from the air",
        kind: "drone",
        src: "/videos/drone-farm.mp4",
        poster: "/images/turmeric.jpg",
      },
    ],
    timeline: [
      {
        id: "l1",
        date: "2026-02-18",
        kind: "harvest",
        title: "Turmeric lift",
        body: "Boiled, polished, 9.6% moisture. Passport ERD-TUR-2026-W08 sealed.",
      },
      {
        id: "l2",
        date: "2024-01-12",
        kind: "cert",
        title: "India Organic + Spices Board",
        body: "Residue nil. Curcumin 4.1% on the farm lab slip.",
      },
    ],
  },
];

export const profileByFarmerId = (id: string) => farmProfiles.find((p) => p.farmerId === id);

export function profileOrFallback(id: string): FarmProfileExtra {
  return (
    profileByFarmerId(id) ?? {
      farmerId: id,
      headline: "A verified farm on the FarmConnect ledger.",
      story: [
        "This farm publishes soil, seed and residue with every lot. Walk the gallery, watch the field, and follow the harvest notes.",
      ],
      crops: ["Seasonal harvest"],
      experienceYears: 20,
      organic: false,
      members: "Family farm",
      gallery: [
        { src: "/images/harvest.jpg", caption: "Field" },
        { src: "/images/irrigation.jpg", caption: "Water" },
        { src: "/images/hero-farm.jpg", caption: "Horizon" },
      ],
      videos: [
        {
          id: "v-drone",
          title: "Drone over the holding",
          kind: "drone",
          src: "/videos/drone-farm.mp4",
          poster: "/images/irrigation.jpg",
        },
      ],
      timeline: [
        {
          id: "x1",
          date: "2026-04-01",
          kind: "story",
          title: "On the ledger",
          body: "Lots sealed. Kitchen notes welcome.",
        },
      ],
    }
  );
}
