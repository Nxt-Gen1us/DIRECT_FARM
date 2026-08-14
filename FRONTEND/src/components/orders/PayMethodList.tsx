import { useTranslation } from "react-i18next";
import { Banknote, CreditCard } from "lucide-react";
import type { PayChannel } from "../../lib/types";
import { razorpayReady } from "../../lib/orderFlow";
import { cn } from "../../lib/cn";

export function PayMethodList({
  value,
  onChange,
}: {
  value: PayChannel;
  onChange: (c: PayChannel) => void;
}) {
  const { t } = useTranslation();
  const live = razorpayReady();
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onChange("razorpay")}
        className={cn(
          "flex w-full items-start gap-3 rounded-2xl border p-4 text-left",
          value === "razorpay" ? "border-primary bg-primary-soft" : "border-line bg-canvas",
        )}
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
          <CreditCard size={18} />
        </span>
        <span>
          <span className="block text-sm font-medium">{t("flow.razorpay")}</span>
          <span className="mt-0.5 block text-xs text-ink-soft">{t("flow.razorpayHint")}</span>
          <span className="mt-1 block text-[11px] text-muted">
            {live ? t("flow.razorpayReady") : t("flow.razorpayWait")}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange("cod")}
        className={cn(
          "flex w-full items-start gap-3 rounded-2xl border p-4 text-left",
          value === "cod" ? "border-primary bg-primary-soft" : "border-line bg-canvas",
        )}
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-nature-soft text-nature">
          <Banknote size={18} />
        </span>
        <span>
          <span className="block text-sm font-medium">{t("flow.cod")}</span>
          <span className="mt-0.5 block text-xs text-ink-soft">{t("flow.codHint")}</span>
        </span>
      </button>
    </div>
  );
}
