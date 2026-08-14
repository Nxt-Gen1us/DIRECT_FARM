import type { ReactNode } from "react";
import { Sprout } from "lucide-react";
import { Card } from "./Card";

export function EmptyState({
  kicker,
  title,
  body,
  action,
}: {
  kicker?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="mt-8 px-6 py-12 text-center md:px-10">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Sprout size={22} />
      </span>
      {kicker && (
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-secondary">{kicker}</p>
      )}
      <h2 className="mt-2 font-display text-2xl text-ink md:text-3xl">{title}</h2>
      {body && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </Card>
  );
}
