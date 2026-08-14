import { useTranslation } from "react-i18next";
import { ShoppingBasket, Sprout } from "lucide-react";
import type { RegisterPath } from "../../lib/register";
import { cn } from "../../lib/cn";

export function PathSelect({
  value,
  onChange,
}: {
  value: RegisterPath;
  onChange: (path: RegisterPath) => void;
}) {
  const { t } = useTranslation();
  const cards: { id: RegisterPath; icon: typeof Sprout; title: string; body: string }[] = [
    {
      id: "customer",
      icon: ShoppingBasket,
      title: t("register.pathCustomer"),
      body: t("register.pathCustomerBody"),
    },
    {
      id: "farmer",
      icon: Sprout,
      title: t("register.pathFarmer"),
      body: t("register.pathFarmerBody"),
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => {
        const active = value === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onChange(card.id)}
            className={cn(
              "rounded-[1.25rem] border p-4 text-left transition",
              active
                ? "border-primary bg-primary-soft shadow-[0_10px_24px_-16px_rgb(139_38_38_/_0.4)]"
                : "border-line bg-canvas hover:border-secondary/40",
            )}
          >
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-2xl",
                active ? "bg-primary text-accent" : "bg-accent text-ink",
              )}
            >
              <card.icon size={18} />
            </span>
            <p className="mt-3 font-display text-xl text-ink">{card.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{card.body}</p>
          </button>
        );
      })}
    </div>
  );
}
