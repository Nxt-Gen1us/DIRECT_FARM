import { useTranslation } from "react-i18next";
import { passwordRules } from "../../lib/validation";
import { cn } from "../../lib/cn";

export function PasswordMeter({ value }: { value: string }) {
  const { t } = useTranslation();
  const rules = passwordRules(value);
  const score = Object.values(rules).filter(Boolean).length;
  const items = [
    { ok: rules.length, key: "register.ruleLength" },
    { ok: rules.upper, key: "register.ruleUpper" },
    { ok: rules.lower, key: "register.ruleLower" },
    { ok: rules.number, key: "register.ruleNumber" },
    { ok: rules.special, key: "register.ruleSpecial" },
  ];

  return (
    <div>
      <div className="mb-2 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full",
              i < score ? (score < 3 ? "bg-secondary" : score < 5 ? "bg-accent-dark" : "bg-nature") : "bg-line",
            )}
          />
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.key} className={item.ok ? "text-nature" : "text-muted"}>
            {item.ok ? "●" : "○"} {t(item.key)}
          </li>
        ))}
      </ul>
    </div>
  );
}
