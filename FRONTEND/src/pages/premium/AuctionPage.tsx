import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Gavel } from "lucide-react";
import { PremiumShell } from "../../components/premium/PremiumShell";
import { QueueNote } from "../../components/premium/QueueNote";
import { Badge, Button } from "../../components/ui";
import { Card } from "../../components/ui/Card";
import { auctions } from "../../data/premium";
import { enqueue } from "../../lib/premium/api";
import { inr } from "../../lib/format";
import type { AuctionStatus } from "../../lib/premium/types";

export function AuctionPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<AuctionStatus | "all">("all");
  const [note, setNote] = useState("");
  const list = filter === "all" ? auctions : auctions.filter((a) => a.status === filter);

  return (
    <PremiumShell title={t("plus.auctionTitle")} lede={t("plus.auctionLede")}>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {(["all", "live", "upcoming", "closed"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              filter === s ? "bg-primary text-accent" : "border border-line bg-canvas"
            }`}
          >
            {s === "all" ? t("plus.all") : t(`plus.astatus.${s}`)}
          </button>
        ))}
      </div>
      {note && <QueueNote text={note} />}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {list.map((a) => (
          <Card key={a.id} className="overflow-hidden">
            <img src={a.image} alt="" className="h-40 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-wider text-muted">{a.id}</p>
                <Badge tone={a.status === "live" ? "primary" : a.status === "upcoming" ? "secondary" : "muted"}>
                  {t(`plus.astatus.${a.status}`)}
                </Badge>
              </div>
              <h3 className="mt-1 font-display text-2xl">{a.crop}</h3>
              <p className="text-xs text-ink-soft">{a.variety}</p>
              <Link to={`/farmers/${a.farmerId}`} className="mt-1 inline-block text-xs text-primary">
                {a.farm}
              </Link>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-cream p-2">
                  <p className="text-[10px] uppercase text-muted">{t("plus.floor")}</p>
                  <p className="font-display text-lg">{inr(a.floor)}</p>
                </div>
                <div className="rounded-xl bg-primary-soft p-2">
                  <p className="text-[10px] uppercase text-muted">{t("plus.lastBid")}</p>
                  <p className="font-display text-lg text-primary">{inr(a.lastBid)}</p>
                </div>
                <div className="rounded-xl bg-cream p-2">
                  <p className="text-[10px] uppercase text-muted">{t("plus.bids")}</p>
                  <p className="font-display text-lg">{a.bids}</p>
                </div>
              </div>
              {a.status === "live" && (
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    enqueue("bid", a.id, `Bid desk · ${a.crop}`);
                    setNote(t("plus.bidHeld", { id: a.id }));
                  }}
                >
                  <Gavel size={14} /> {t("plus.placeBid")}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </PremiumShell>
  );
}
