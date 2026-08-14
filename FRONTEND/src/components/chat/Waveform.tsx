import { cn } from "../../lib/cn";

export function Waveform({
  bars,
  active,
  progress = 1,
}: {
  bars: number[];
  active?: boolean;
  progress?: number;
}) {
  const max = Math.max(...bars, 1);
  return (
    <span className="flex h-7 items-end gap-0.5" aria-hidden>
      {bars.map((h, i) => {
        const lit = i / bars.length <= progress;
        return (
          <span
            key={i}
            className={cn(
              "w-0.5 rounded-full",
              lit ? (active ? "bg-accent" : "bg-nature") : "bg-current/25",
            )}
            style={{ height: `${Math.max(18, (h / max) * 100)}%` }}
          />
        );
      })}
    </span>
  );
}
