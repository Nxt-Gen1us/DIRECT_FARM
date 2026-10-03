import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line/70 bg-card shadow-[0_10px_30px_-16px_rgb(20_35_26_/_0.12)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  kicker,
  title,
  action,
}: {
  kicker?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker && (
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-secondary">
            {kicker}
          </p>
        )}
        <h2 className="font-display text-3xl text-ink md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
