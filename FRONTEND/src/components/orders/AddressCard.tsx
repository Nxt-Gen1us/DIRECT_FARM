import { useTranslation } from "react-i18next";
import type { Address } from "../../lib/types";
import { cn } from "../../lib/cn";

export function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { t } = useTranslation();
  const addressLabelKeys: Record<string, string> = {
    Home: "flow.addressHome",
    Kitchen: "flow.addressKitchen",
    New: "flow.newAddress",
    Delivery: "flow.delivery",
  };
  const labelKey = address.label ? addressLabelKeys[address.label] : undefined;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-[1.15rem] border p-4 text-left",
        selected ? "border-primary bg-primary-soft" : "border-line bg-canvas",
      )}
    >
      <p className="text-[11px] uppercase tracking-wider text-muted">
        {labelKey ? t(labelKey) : address.label || t("flow.address")}
      </p>
      <p className="mt-1 font-medium text-ink">{address.name}</p>
      <p className="text-sm text-ink-soft">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ""}
      </p>
      <p className="text-sm text-ink-soft">
        {address.city}, {address.state} {address.pincode}
      </p>
      <p className="mt-1 text-xs text-muted">{address.phone}</p>
    </button>
  );
}
