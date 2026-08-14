import { useTranslation } from "react-i18next";
import { Leaf } from "lucide-react";
import type { BadgeTier, KitchenBadge } from "../../data/sustain";
import { cn } from "../../lib/cn";

const ring: Record<BadgeTier, string> = {
  seed: "from-accent to-secondary",
  grove: "from-nature-mid to-nature",
  canopy: "from-primary to-nature",
};

export function LocalBadgeMark({ tier, size = "md" }: { tier: BadgeTier; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full bg-gradient-to-br text-accent shadow-[0_8px_18px_-10px_rgb(72_108_47_/_0.55)]",
        ring[tier],
        size === "sm" ? "h-8 w-8" : "h-12 w-12",
      )}
    >
      <Leaf size={size === "sm" ? 14 : 18} />
    </span>
  );
}

export function LocalBadgeCard({ kitchen }: { kitchen: KitchenBadge }) {
  const { t } = useTranslation();
  return (
    <article className="flex items-center gap-3 rounded-[1.15rem] border border-line bg-card p-4">
      <img src={kitchen.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{kitchen.name}</p>
        <p className="text-xs text-muted">{kitchen.place}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-deep">
          <div className="h-full rounded-full bg-nature" style={{ width: `${kitchen.localPct}%` }} />
        </div>
        <p className="mt-1 text-[11px] text-ink-soft">
          {kitchen.localPct}% {t("earth.localShare")} · {kitchen.crates} {t("earth.crates")}
        </p>
      </div>
      <div className="text-center">
        <LocalBadgeMark tier={kitchen.tier} />
        <p className="mt-1 text-[10px] uppercase tracking-wider text-nature">{t(`earth.tier.${kitchen.tier}`)}</p>
      </div>
    </article>
  );
}
