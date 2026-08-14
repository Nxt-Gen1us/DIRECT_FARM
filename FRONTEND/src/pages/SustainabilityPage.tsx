import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeCheck,
  HandHeart,
  Leaf,
  Recycle,
  Route,
  ShoppingBasket,
  Trees,
} from "lucide-react";
import { farmers } from "../data/farmers";
import {
  carbonMonths,
  distanceStories,
  donations,
  farmFootprints,
  kitchenBadges,
  localShare,
  pctOf,
  seasonGoals,
  seasonNow,
  wasteMonths,
} from "../data/sustain";
import { formatDate } from "../lib/format";
import { Badge, Button } from "../components/ui";
import { Card } from "../components/ui/Card";
import { LocalBadgeCard, LocalBadgeMark } from "../components/sustain/LocalBadge";
import { PillarCard } from "../components/sustain/PillarCard";
import { StoryStrip } from "../components/sustain/StoryStrip";

const tooltip = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

export function SustainabilityPage() {
  const { t } = useTranslation();
  const ranked = [...farmers].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src="/images/harvest.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-nature-dark/75 to-primary-deep/35" />
        <div className="container-app relative py-14 md:py-20">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-accent">
            <Trees size={14} /> {t("earth.kicker")}
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl text-canvas md:text-5xl">{t("earth.title")}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-accent/90">{t("earth.lede")}</p>
          <p className="mt-6 max-w-lg text-sm italic text-accent/80">{t("earth.epigraph")}</p>
        </div>
      </section>

      <div className="container-app py-10 md:py-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <PillarCard
            icon={Leaf}
            kicker={t("earth.carbon")}
            value={String(seasonNow.carbonT)}
            unit="t"
            delta={t("earth.carbonDelta")}
            progress={pctOf(seasonNow.carbonT, seasonGoals.carbonT)}
            goal={t("earth.goalOf", { n: `${seasonGoals.carbonT} t` })}
          />
          <PillarCard
            icon={Recycle}
            kicker={t("earth.waste")}
            value="9.2"
            unit="t"
            delta={t("earth.wasteDelta")}
            progress={pctOf(seasonNow.wasteKg, seasonGoals.wasteKg)}
            goal={t("earth.goalOf", { n: "12 t" })}
          />
          <PillarCard
            icon={ShoppingBasket}
            kicker={t("earth.local")}
            value={`${seasonNow.localPct}%`}
            delta={t("earth.localDelta")}
            progress={seasonNow.localPct}
            goal={t("earth.goalOf", { n: `${seasonGoals.localPct}%` })}
          />
          <PillarCard
            icon={Route}
            kicker={t("earth.distance")}
            value="1.43"
            unit="lakh km"
            delta={t("earth.distanceDelta")}
            progress={pctOf(seasonNow.kmCut, seasonGoals.kmCut)}
            goal={t("earth.goalOf", { n: "1.8 lakh km" })}
          />
          <PillarCard
            icon={HandHeart}
            kicker={t("earth.donate")}
            value="3.1"
            unit="t"
            delta={t("earth.donateDelta")}
            progress={pctOf(seasonNow.donateKg, seasonGoals.donateKg)}
            goal={t("earth.goalOf", { n: "4.2 t" })}
          />
          <PillarCard
            icon={BadgeCheck}
            kicker={t("earth.badges")}
            value={String(seasonNow.badgeKitchens)}
            unit={t("earth.kitchens")}
            delta={t("earth.badgeDelta")}
            progress={pctOf(seasonNow.badgeKitchens, seasonGoals.badgeKitchens)}
            goal={t("earth.goalOf", { n: String(seasonGoals.badgeKitchens) })}
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="font-display text-2xl">{t("earth.carbonChart")}</h2>
            <p className="mt-1 text-xs text-muted">{t("earth.carbonChartLede")}</p>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={carbonMonths}>
                  <defs>
                    <linearGradient id="savedFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#486c2f" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#486c2f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltip} />
                  <Area type="monotone" dataKey="saved" name={t("earth.saved")} stroke="#486c2f" fill="url(#savedFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="cold" name={t("earth.coldChain")} stroke="#8b2626" fill="none" strokeDasharray="5 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-display text-2xl">{t("earth.wasteChart")}</h2>
            <p className="mt-1 text-xs text-muted">{t("earth.wasteChartLede")}</p>
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteMonths}>
                  <CartesianGrid stroke="#E6D8B4" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltip} />
                  <Bar dataKey="rescued" name={t("earth.rescued")} fill="#486c2f" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="landfill" name={t("earth.landfill")} fill="#c9a227" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <h2 className="mt-14 font-display text-3xl">{t("earth.localTitle")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">{t("earth.localLede")}</p>
        <div className="mt-5 space-y-3">
          {localShare.map((row) => (
            <Card key={row.belt} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-[10rem] flex-1">
                <p className="font-medium text-ink">{row.belt}</p>
                <p className="text-xs text-muted">
                  {row.crates} {t("earth.crates")}
                </p>
              </div>
              <div className="h-2 min-w-[140px] flex-1 overflow-hidden rounded-full bg-cream-deep">
                <div className="h-full rounded-full bg-nature" style={{ width: `${row.pct}%` }} />
              </div>
              <p className="font-display text-2xl text-nature">{row.pct}%</p>
            </Card>
          ))}
        </div>

        <h2 className="mt-14 font-display text-3xl">{t("earth.roadTitle")}</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">{t("earth.roadLede")}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {distanceStories.map((d) => (
            <Card key={d.id} className="overflow-hidden">
              <img src={d.image} alt="" className="h-36 w-full object-cover" />
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-wider text-muted">
                  {d.from} → {d.to}
                </p>
                <h3 className="mt-1 font-display text-xl">{d.crop}</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-nature-soft p-2">
                    <p className="text-[10px] uppercase text-muted">{t("earth.farmGate")}</p>
                    <p className="font-display text-2xl text-nature">{d.farmKm}</p>
                    <p className="text-[10px] text-muted">km</p>
                  </div>
                  <div className="rounded-xl bg-primary-soft p-2">
                    <p className="text-[10px] uppercase text-muted">{t("earth.oldMandi")}</p>
                    <p className="font-display text-2xl text-primary">{d.mandiKm}</p>
                    <p className="text-[10px] text-muted">km</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink-soft">{d.note}</p>
                <p className="mt-2 text-xs font-medium text-nature">
                  −{d.mandiKm - d.farmKm} km {t("earth.cut")}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl">{t("earth.donateTitle")}</h2>
            <p className="mt-1 text-sm text-ink-soft">{t("earth.donateLede")}</p>
            <div className="mt-5 space-y-3">
              {donations.map((d) => (
                <Card key={d.id} className="flex gap-3 p-3">
                  <img src={d.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted">
                      {formatDate(d.at)} · {d.kg} kg
                    </p>
                    <p className="font-medium text-ink">
                      {d.crop} → {d.to}
                    </p>
                    <p className="text-xs text-ink-soft">{d.note}</p>
                    <Link to={`/farmers/${d.farmerId}`} className="mt-1 inline-block text-xs text-primary">
                      {d.farm} →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl">{t("earth.badgeTitle")}</h2>
                <p className="mt-1 text-sm text-ink-soft">{t("earth.badgeLede")}</p>
              </div>
              <LocalBadgeMark tier="canopy" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              {(["seed", "grove", "canopy"] as const).map((tier) => (
                <span key={tier} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1">
                  <LocalBadgeMark tier={tier} size="sm" />
                  {t(`earth.tier.${tier}`)} · {t(`earth.tierNeed.${tier}`)}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {kitchenBadges.map((k) => (
                <LocalBadgeCard key={k.id} kitchen={k} />
              ))}
            </div>
          </div>
        </div>

        <h2 className="mt-14 font-display text-3xl">{t("earth.stories")}</h2>
        <p className="mt-1 mb-6 max-w-2xl text-sm text-ink-soft">{t("earth.storiesLede")}</p>
        <StoryStrip />

        <h2 className="mt-14 font-display text-3xl">{t("earth.farms")}</h2>
        <p className="mt-1 mb-5 text-sm text-ink-soft">{t("earth.farmsLede")}</p>
        <div className="space-y-3">
          {ranked.map((f) => {
            const foot = farmFootprints.find((x) => x.farmerId === f.id);
            return (
              <Card key={f.id} className="flex flex-wrap items-center gap-4 p-4">
                <img src={f.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to={`/farmers/${f.id}`} className="font-medium hover:text-primary">
                    {f.farmName}
                  </Link>
                  <p className="text-xs text-muted">
                    {f.village}, {f.district} · {f.specialty}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                    <div className="h-full rounded-full bg-nature" style={{ width: `${f.sustainabilityScore}%` }} />
                  </div>
                  {foot && (
                    <p className="mt-1 text-[11px] text-ink-soft">
                      {foot.carbonSavedT} t CO₂ · {foot.donatedKg} kg {t("earth.given")} · {foot.localPct}% {t("earth.localShare")}
                    </p>
                  )}
                </div>
                <p className="font-display text-3xl text-nature">{f.sustainabilityScore}</p>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 overflow-hidden md:grid md:grid-cols-2">
          <img src="/images/irrigation.jpg" alt="" className="h-56 w-full object-cover md:h-full" />
          <div className="p-6 md:p-8">
            <Badge tone="nature">{t("earth.closeKicker")}</Badge>
            <h2 className="mt-3 font-display text-3xl">{t("earth.closeTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("earth.closeBody")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/market">
                <Button>{t("earth.shopLocal")}</Button>
              </Link>
              <Link to="/passport">
                <Button variant="ghost">{t("nav.passport")}</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
