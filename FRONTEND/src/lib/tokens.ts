/**
 * FarmConnect AI design tokens.
 * Source of truth matches the attached design-system board:
 * Playfair Display + Poppins, burgundy / harvest / wheat / nature.
 */
export const colors = {
  primary: "#8B2626",
  primaryDark: "#6A1B1B",
  primaryDeep: "#4E1212",
  primarySoft: "#F6E8E4",
  primaryMid: "#B33A32",
  secondary: "#EF6905",
  secondaryDark: "#C45304",
  secondarySoft: "#FFF0E3",
  accent: "#F1E5A1",
  accentDark: "#D9C56A",
  accentSoft: "#FAF6DC",
  nature: "#486C2F",
  natureDark: "#355022",
  natureSoft: "#EEF4E6",
  natureMid: "#6A8F48",
  cream: "#FBF6EA",
  creamDeep: "#F3EAD0",
  canvas: "#FFFDF7",
  ink: "#241610",
  inkSoft: "#5C4638",
  muted: "#8A7363",
  line: "#E6D8B4",
  card: "#FFFAF0",
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
  sm: "0.5rem",
  md: "0.875rem",
  lg: "1.25rem",
  xl: "1.5rem",
  pill: "999px",
} as const;

export const shadows = {
  soft: "0 10px 30px -12px rgb(36 22 16 / 0.18)",
  lift: "0 18px 40px -16px rgb(139 38 38 / 0.28)",
  harvest: "0 10px 24px -12px rgb(239 105 5 / 0.5)",
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
  { name: "Primary", token: "primary", hex: colors.primary, role: "Brand burgundy" },
  { name: "Secondary", token: "secondary", hex: colors.secondary, role: "Harvest orange" },
  { name: "Accent", token: "accent", hex: colors.accent, role: "Wheat gold" },
  { name: "Nature", token: "nature", hex: colors.nature, role: "Field green" },
  { name: "Cream", token: "cream", hex: colors.cream, role: "Canvas" },
  { name: "Ink", token: "ink", hex: colors.ink, role: "Body text" },
] as const;
