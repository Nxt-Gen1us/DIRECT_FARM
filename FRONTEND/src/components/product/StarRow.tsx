import { Star } from "lucide-react";

export function StarRow({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? "fill-secondary text-secondary" : "text-line"}
        />
      ))}
    </span>
  );
}
