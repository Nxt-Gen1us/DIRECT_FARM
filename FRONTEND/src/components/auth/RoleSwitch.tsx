import { useTranslation } from "react-i18next";
import { Landmark, ShoppingBasket, Sprout } from "lucide-react";
import type { Role } from "../../lib/types";
import { cn } from "../../lib/cn";

const items: { id: Role; icon: typeof Sprout }[] = [
  { id: "customer", icon: ShoppingBasket },
  { id: "farmer", icon: Sprout },
  { id: "admin", icon: Landmark },
];

const activeStyles: Record<Role, string> = {
  customer: "bg-green-700 text-white shadow-sm",
  farmer: "bg-yellow-300 text-green-950 shadow-sm",
  admin: "bg-green-950 text-white shadow-sm",
};

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
      className="grid grid-cols-3 gap-1.5 rounded-lg border border-green-100 bg-green-50/70 p-1.5"
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
              "inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs font-semibold transition sm:min-h-10 sm:flex-row sm:gap-1.5 sm:text-sm",
              active ? activeStyles[item.id] : "text-green-900 hover:bg-white",
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
