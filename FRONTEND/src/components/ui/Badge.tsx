import type { ReactNode } from "react";

type Tone = "primary" | "secondary" | "nature" | "accent" | "muted";

const tones: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  secondary: "bg-secondary-soft text-secondary-dark",
  nature: "bg-nature-soft text-nature-dark",
  accent: "bg-accent text-ink",
  muted: "bg-cream-deep text-ink-soft",
};

export function Badge({
  children,
  tone = "accent",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
