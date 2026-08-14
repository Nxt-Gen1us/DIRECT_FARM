import { useTranslation } from "react-i18next";
import { BadgeCheck, QrCode } from "lucide-react";
import type { CropPassport } from "../../lib/types";

export function PassportQr({ passport }: { passport: CropPassport }) {
  const { t } = useTranslation();
  return (
    <aside className="rounded-[1.4rem] border border-dashed border-line bg-canvas p-6 text-center shadow-[0_16px_40px_-24px_rgb(36_22_16_/_0.2)]">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
        {t("passport.qrTitle")}
      </p>
      <div className="mx-auto mt-4 grid h-44 w-44 place-items-center rounded-[1.25rem] border border-line bg-cream">
        <QrCode size={120} strokeWidth={1.4} className="text-primary" />
      </div>
      <p className="mt-4 font-mono text-sm tracking-wide text-ink">{passport.qr}</p>
      <p className="mt-2 flex items-center justify-center gap-1 text-xs text-nature">
        <BadgeCheck size={14} /> {t("passport.verify")}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted">{t("passport.qrHint")}</p>
    </aside>
  );
}
