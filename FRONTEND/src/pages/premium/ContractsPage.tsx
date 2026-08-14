import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PremiumShell } from "../../components/premium/PremiumShell";
import { QueueNote } from "../../components/premium/QueueNote";
import { Badge, Button } from "../../components/ui";
import { Card } from "../../components/ui/Card";
import { contracts } from "../../data/premium";
import { enqueue } from "../../lib/premium/api";
import { formatDate, inr } from "../../lib/format";

export function ContractsPage() {
  const { t } = useTranslation();
  const [note, setNote] = useState("");
  return (
    <PremiumShell title={t("plus.contractsTitle")} lede={t("plus.contractsLede")}>
      {note && <QueueNote text={note} />}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {contracts.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] uppercase tracking-wider text-muted">{c.id}</p>
              <Badge
                tone={
                  c.status === "signed" || c.status === "live"
                    ? "nature"
                    : c.status === "awaiting"
                      ? "secondary"
                      : "muted"
                }
              >
                {t(`plus.cstatus.${c.status}`)}
              </Badge>
            </div>
            <h3 className="mt-1 font-display text-xl">{c.crop}</h3>
            <p className="text-sm text-ink-soft">
              <Link to={`/farmers/${c.farmerId}`} className="text-primary">
                {c.farm}
              </Link>
              {" · "}
              {c.kitchen}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted">{t("plus.qty")}</dt>
                <dd className="font-medium">{c.qty}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("plus.value")}</dt>
                <dd className="font-medium">{inr(c.value)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">{t("plus.window")}</dt>
                <dd>
                  {formatDate(c.start)} – {formatDate(c.end)}
                </dd>
              </div>
            </dl>
            {(c.status === "draft" || c.status === "awaiting") && (
              <Button
                className="mt-4"
                size="sm"
                onClick={() => {
                  enqueue("sign", c.id, c.crop);
                  setNote(t("plus.signHeld", { id: c.id }));
                }}
              >
                {t("plus.requestSign")}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </PremiumShell>
  );
}
