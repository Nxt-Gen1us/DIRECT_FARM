import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PremiumShell } from "../../components/premium/PremiumShell";
import { QueueNote } from "../../components/premium/QueueNote";
import { Badge, Button } from "../../components/ui";
import { Card } from "../../components/ui/Card";
import { machines } from "../../data/premium";
import { enqueue } from "../../lib/premium/api";
import { inr } from "../../lib/format";

export function EquipmentPage() {
  const { t } = useTranslation();
  const [note, setNote] = useState("");
  return (
    <PremiumShell title={t("plus.equipTitle")} lede={t("plus.equipLede")}>
      {note && <QueueNote text={note} />}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {machines.map((m) => (
          <Card key={m.id} className="overflow-hidden">
            <img src={m.image} alt="" className="h-36 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted">{t(`plus.mkind.${m.kind}`)}</p>
                  <h3 className="font-display text-xl">{m.name}</h3>
                </div>
                <Badge tone={m.available ? "nature" : "muted"}>
                  {m.available ? t("plus.free") : t("plus.busy")}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                {m.owner} · {m.place}
              </p>
              <p className="mt-2 font-display text-2xl text-primary">
                {inr(m.rate)}
                <span className="text-sm text-muted"> / {t(`plus.per.${m.unit}`)}</span>
              </p>
              <Button
                className="mt-4"
                size="sm"
                disabled={!m.available}
                onClick={() => {
                  enqueue("rent", m.id, m.name);
                  setNote(t("plus.rentHeld", { name: m.name }));
                }}
              >
                {t("plus.requestRent")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PremiumShell>
  );
}
