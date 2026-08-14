import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PremiumShell } from "../../components/premium/PremiumShell";
import { QueueNote } from "../../components/premium/QueueNote";
import { Badge, Button } from "../../components/ui";
import { Card } from "../../components/ui/Card";
import { experts } from "../../data/premium";
import { enqueue } from "../../lib/premium/api";
import { inr } from "../../lib/format";

export function ExpertsPage() {
  const { t } = useTranslation();
  const [note, setNote] = useState("");
  return (
    <PremiumShell title={t("plus.expertsTitle")} lede={t("plus.expertsLede")}>
      {note && <QueueNote text={note} />}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {experts.map((ex) => (
          <Card key={ex.id} className="flex flex-col p-5">
            <div className="flex items-center gap-3">
              <img src={ex.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover" />
              <div>
                <p className="font-medium">{ex.name}</p>
                <p className="text-xs text-muted">{ex.title}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">{ex.focus}</p>
            <p className="mt-2 text-xs text-muted">{ex.belt}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {ex.languages.map((l) => (
                <Badge key={l} tone="muted">
                  {l}
                </Badge>
              ))}
            </div>
            <p className="mt-3 font-display text-2xl text-primary">
              {inr(ex.rate)}
              <span className="text-sm text-muted"> / {t("plus.session")}</span>
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {t("plus.nextSlot")}: {ex.slots[0]}
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                enqueue("consult", ex.id, ex.name);
                setNote(t("plus.consultHeld", { name: ex.name }));
              }}
            >
              {t("plus.bookSlot")}
            </Button>
          </Card>
        ))}
      </div>
    </PremiumShell>
  );
}
