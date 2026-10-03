import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useShop } from "../../app/providers/ShopProvider";
import { vegBoxes, boxById } from "../../data/boxes";
import { productById } from "../../data/products";
import { farmerById } from "../../data/farmers";
import { formatDate, formatUnit, inr } from "../../lib/format";
import type { BoxCadence } from "../../lib/types";
import { Badge, Button } from "../../components/ui";
import { Card } from "../../components/ui/Card";

export function BoxPage() {
  const { t } = useTranslation();
  const { subscriptions, startBox, pauseBox, resumeBox, stopBox } = useShop();
  const [cadence, setCadence] = useState<Record<string, BoxCadence>>({});
  const [note, setNote] = useState("");

  return (
    <div className="container-app py-8 sm:py-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">{t("shop.kicker")}</p>
      <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{t("shop.boxTitle")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">{t("shop.boxLede")}</p>
      {note && <p className="mt-4 rounded-2xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">{note}</p>}

      {subscriptions.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-2xl text-ink">{t("shop.yourBoxes")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {subscriptions.map((s) => {
              const box = boxById(s.boxId);
              if (!box) return null;
              return (
                <Card key={s.id} className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-2xl text-ink">{box.name}</p>
                      <p className="text-xs text-muted">
                        {t(`shop.cadence.${s.cadence}`)} · {t("shop.next")} {formatDate(s.nextAt)}
                      </p>
                    </div>
                    <Badge tone={s.status === "active" ? "nature" : "muted"}>
                      {t(`shop.boxStatus.${s.status}`)}
                    </Badge>
                  </div>
                  <p className="mt-2 font-display text-xl text-primary">{inr(box.price)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.status === "active" ? (
                      <Button size="sm" variant="ghost" onClick={() => pauseBox(s.id)}>
                        {t("shop.pause")}
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => resumeBox(s.id)}>
                        {t("shop.resume")}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => stopBox(s.id)}>
                      {t("shop.stop")}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {vegBoxes.map((box) => {
          const cad = cadence[box.id] ?? box.cadence;
          return (
            <Card key={box.id} className="flex flex-col overflow-hidden">
              <img src={box.image} alt="" className="h-40 w-full object-cover" />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-secondary">{t(`shop.size.${box.size}`)}</p>
                <h2 className="mt-1 font-display text-2xl text-ink">{box.name}</h2>
                <p className="mt-1 text-sm text-ink-soft">{box.blurb}</p>
                <p className="mt-3 font-display text-3xl text-primary">{inr(box.price)}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {box.items.map((line) => {
                    const p = productById(line.productId);
                    if (!p) return null;
                    return (
                      <li key={line.productId} className="flex justify-between text-ink-soft">
                        <span>{p.name}</span>
                        <span>
                          {line.qty} {formatUnit(p.unit)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-[11px] text-muted">
                  {box.farms.map((id) => farmerById(id)?.farmName).filter(Boolean).join(" · ")}
                </p>
                <div className="mt-4 flex gap-1.5">
                  {(["weekly", "fortnight"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCadence((s) => ({ ...s, [box.id]: c }))}
                      className={`rounded-full px-3 py-1 text-xs ${
                        cad === c ? "bg-primary text-accent" : "border border-line bg-canvas text-ink-soft"
                      }`}
                    >
                      {t(`shop.cadence.${c}`)}
                    </button>
                  ))}
                </div>
                <Button
                  className="mt-4"
                  onClick={() => {
                    startBox(box.id, cad);
                    setNote(t("shop.boxStarted"));
                  }}
                >
                  {t("shop.subscribe")}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-muted">{t("shop.boxNote")}</p>
      <Link to="/market" className="mt-3 inline-block text-sm font-medium text-primary">
        {t("flow.shop")} →
      </Link>
    </div>
  );
}
