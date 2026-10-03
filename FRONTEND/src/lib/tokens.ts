/**
 * DIRECT FARM design tokens.
 * Shared visual language: Playfair Display + Poppins, field green and harvest gold.
 */
export const colors = {
  primary: "#15803D",
  primaryDark: "#166534",
  primaryDeep: "#052E16",
  primarySoft: "#DCFCE7",
  primaryMid: "#22C55E",
  secondary: "#A16207",
  secondaryDark: "#854D0E",
  secondarySoft: "#FEF3C7",
  accent: "#FACC15",
  accentDark: "#EAB308",
  accentSoft: "#FEF9C3",
  nature: "#486C2F",
  natureDark: "#355022",
  natureSoft: "#EEF4E6",
  natureMid: "#6A8F48",
  cream: "#F5F8F2",
  creamDeep: "#E8F1E5",
  canvas: "#FFFFFF",
  canvasSoft: "#F0F6EF",
  ink: "#14231A",
  inkSoft: "#405449",
  muted: "#718179",
  line: "#DCE8DF",
  card: "#FFFFFF",
  danger: "#B42318",
  info: "#2F5D8C",
} as const;

export const fonts = {
  display: '"Playfair Display", Georgia, "Times New Roman", serif',
  body: '"Poppins", "Segoe UI", system-ui, sans-serif',
} as const;

export const typeScale = {
  display: { size: "clamp(2.5rem, 5vw, 4rem)", weight: 700, line: 1.1 },
  h1: { size: "clamp(2rem, 3.4vw, 2.75rem)", weight: 700, line: 1.15 },
  h2: { size: "clamp(1.6rem, 2.4vw, 2.125rem)", weight: 600, line: 1.2 },
  h3: { size: "1.375rem", weight: 600, line: 1.3 },
  h4: { size: "1.125rem", weight: 600, line: 1.35 },
  body: { size: "1rem", weight: 400, line: 1.65 },
  small: { size: "0.875rem", weight: 400, line: 1.55 },
  caption: { size: "0.75rem", weight: 500, line: 1.4 },
  overline: { size: "0.6875rem", weight: 500, line: 1.4, tracking: "0.18em" },
} as const;

export const space = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const radii = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.5rem",
  pill: "999px",
} as const;

export const shadows = {
  soft: "0 10px 30px -12px rgb(20 35 26 / 0.16)",
  lift: "0 18px 40px -16px rgb(21 128 61 / 0.24)",
  harvest: "0 10px 24px -12px rgb(161 98 7 / 0.35)",
} as const;

export const breakpoints = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const colorSwatches = [
  { name: "Primary", token: "primary", hex: colors.primary, role: "Field green" },
  { name: "Secondary", token: "secondary", hex: colors.secondary, role: "Harvest amber" },
  { name: "Accent", token: "accent", hex: colors.accent, role: "Harvest gold" },
  { name: "Nature", token: "nature", hex: colors.nature, role: "Field green" },
  { name: "Cream", token: "cream", hex: colors.cream, role: "Canvas" },
  { name: "Ink", token: "ink", hex: colors.ink, role: "Body text" },
] as const;
