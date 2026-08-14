import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";

export function ModuleCard({
  to,
  icon: Icon,
  title,
  body,
  stat,
}: {
  to: string;
  icon: LucideIcon;
  title: string;
  body: string;
  stat?: string;
}) {
  return (
    <Link to={to} className="group block">
      <Card className="h-full p-5 transition group-hover:-translate-y-0.5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
          <Icon size={18} />
        </span>
        {stat && <p className="mt-4 font-display text-2xl text-primary">{stat}</p>}
        <h3 className="mt-2 font-display text-2xl text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
      </Card>
    </Link>
  );
}
