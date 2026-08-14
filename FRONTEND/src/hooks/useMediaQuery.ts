import { useEffect, useState } from "react";
import { breakpoints, type Breakpoint } from "../lib/tokens";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useBreakpoint(name: Breakpoint) {
  return useMediaQuery(`(min-width: ${breakpoints[name]}px)`);
}

export function useViewport() {
  const sm = useBreakpoint("sm");
  const md = useBreakpoint("md");
  const lg = useBreakpoint("lg");
  const xl = useBreakpoint("xl");
  return {
    sm,
    md,
    lg,
    xl,
    device: !sm ? "mobile" : !lg ? "tablet" : "desktop",
  };
}
