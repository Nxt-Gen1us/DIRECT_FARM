import { cn } from "../../lib/cn";

export function ProgressRing({
  value,
  size = 88,
  stroke = 8,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <svg width={size} height={size} className={cn("shrink-0 -rotate-90", className)} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3ead0" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#486c2f"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
      />
    </svg>
  );
}
