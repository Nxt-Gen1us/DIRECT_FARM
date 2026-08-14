import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

export type StepDef = { id: string; labelKey: string };

export function StepBar({
  steps,
  current,
}: {
  steps: StepDef[];
  current: number;
}) {
  const { t } = useTranslation();
  return (
    <ol className="mb-6 flex items-start gap-1">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.id} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              {i > 0 && (
                <span className={cn("h-px flex-1", i <= current ? "bg-primary" : "bg-line")} />
              )}
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-medium",
                  done && "bg-nature text-accent",
                  active && "bg-primary text-accent",
                  !done && !active && "bg-cream-deep text-muted",
                )}
              >
                {i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className={cn("h-px flex-1", i < current ? "bg-primary" : "bg-line")} />
              )}
            </div>
            <span className={cn("mt-2 text-[10px] uppercase tracking-wider", active ? "text-primary" : "text-muted")}>
              {t(step.labelKey)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
