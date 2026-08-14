import { breakpoints } from "../lib/tokens";

export { breakpoints };

export const media = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  "2xl": `(min-width: ${breakpoints["2xl"]}px)`,
} as const;

export const layout = {
  maxWidth: "80rem",
  gutterMobile: "1rem",
  gutterTablet: "1.5rem",
  gutterDesktop: "1.5rem",
  headerHeight: "4.25rem",
} as const;
