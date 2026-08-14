import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PremiumShell } from "../../components/premium/PremiumShell";
import { QueueNote } from "../../components/premium/QueueNote";
import { Button } from "../../components/ui";
import { Card } from "../../components/ui/Card";
import { storeBays } from "../../data/premium";
import { enqueue } from "../../lib/premium/api";
import { formatDate, inr } from "../../lib/format";
import type { StoreKind } from "../../lib/premium/types";

export function StorePage({ kind }: { kind: StoreKind }) {
  const { t } = useTranslation();
  const [note, setNote] = useState("");
  const list = storeBays.filter((b) => b.kind === kind);
  const title = kind === "cold" ? t("plus.coldTitle") : t("plus.whTitle");
  const lede = kind === "cold" ? t("plus.coldLede") : t("plus.whLede");

  return (
    <PremiumShell title={title} lede={lede}>
      {note && <QueueNote text={note} />}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {list.map((b) => {
          const pct = Math.round((b.freeT / b.capacityT) * 100);
          return (
            <Card key={b.id} className="p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted">{b.place}</p>
              <h3 className="mt-1 font-display text-2xl">{b.name}</h3>
              {b.temp && <p className="text-sm text-nature">{b.temp}</p>}
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{t("plus.freeSpace")}</span>
                  <span>
                    {b.freeT} / {b.capacityT} t
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-cream-deep">
                  <div className="h-full rounded-full bg-nature" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <p className="mt-3 text-sm">
                {inr(b.rate)} / t · {t("plus.next")} {formatDate(b.nextSlot)}
              </p>
              <Button
                className="mt-4"
                size="sm"
                disabled={b.freeT <= 0}
                onClick={() => {
                  enqueue("store", b.id, b.name);
                  setNote(t("plus.storeHeld", { name: b.name }));
                }}
              >
                {t("plus.holdBay")}
              </Button>
            </Card>
          );
        })}
      </div>
    </PremiumShell>
  );
}
