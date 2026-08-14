import type { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";
import { ProgressRing } from "./ProgressRing";

export function PillarCard({
  icon: Icon,
  kicker,
  value,
  unit,
  delta,
  progress,
  goal,
}: {
  icon: LucideIcon;
  kicker: string;
  value: string;
  unit?: string;
  delta: string;
  progress: number;
  goal: string;
}) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-nature-soft text-nature">
          <Icon size={18} />
        </span>
        <div className="relative">
          <ProgressRing value={progress} />
          <span className="absolute inset-0 grid place-items-center text-[11px] font-medium text-nature">
            {progress}%
          </span>
        </div>
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-wider text-muted">{kicker}</p>
      <p className="mt-1 font-display text-3xl leading-none text-ink">
        {value}
        {unit && <span className="ml-1 text-base text-muted">{unit}</span>}
      </p>
      <p className="mt-2 text-xs text-nature-dark">{delta}</p>
      <p className="mt-1 text-[11px] text-muted">{goal}</p>
    </Card>
  );
}
