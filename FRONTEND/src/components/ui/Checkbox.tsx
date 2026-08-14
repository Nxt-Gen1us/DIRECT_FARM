import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Checkbox({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft", className)}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-line accent-primary"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
