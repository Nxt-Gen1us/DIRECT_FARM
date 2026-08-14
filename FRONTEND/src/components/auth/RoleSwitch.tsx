import { useTranslation } from "react-i18next";
import { Landmark, ShoppingBasket, Sprout } from "lucide-react";
import type { Role } from "../../lib/types";
import { cn } from "../../lib/cn";

const items: { id: Role; icon: typeof Sprout }[] = [
  { id: "customer", icon: ShoppingBasket },
  { id: "farmer", icon: Sprout },
  { id: "admin", icon: Landmark },
];

export function RoleSwitch({
  value,
  onChange,
}: {
  value: Role;
  onChange: (role: Role) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      role="tablist"
      aria-label={t("auth.as")}
      className="grid grid-cols-3 gap-1 rounded-full border border-line bg-cream p-1"
    >
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-2 text-xs font-medium transition sm:text-sm",
              active ? "bg-primary text-accent shadow-sm" : "text-ink-soft hover:bg-canvas",
            )}
          >
            <item.icon size={14} />
            {t(`roles.${item.id}`)}
          </button>
        );
      })}
    </div>
  );
}
