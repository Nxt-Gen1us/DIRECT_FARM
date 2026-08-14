import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "nature" | "ghost" | "cream";
type Size = "sm" | "md" | "lg";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-accent hover:bg-primary-dark shadow-[0_10px_24px_-12px_rgb(139_38_38_/_0.55)]",
  secondary:
    "bg-secondary text-white hover:bg-secondary-dark shadow-[0_10px_24px_-12px_rgb(239_105_5_/_0.5)]",
  nature: "bg-nature text-accent hover:bg-nature-dark",
  ghost: "bg-transparent text-primary border border-primary/20 hover:bg-primary-soft",
  cream: "bg-accent text-ink hover:bg-accent-dark",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
