import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Droplets, Leaf, MapPin, Sprout } from "lucide-react";
import { passportById, passports } from "../data/passports";
import { farmerById } from "../data/farmers";
import { products } from "../data/products";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { JourneyTimeline } from "../components/passport/JourneyTimeline";
import { PassportQr } from "../components/passport/PassportQr";
import { formatDate, km } from "../lib/format";
import { freshnessOf } from "../lib/passport";

export function PassportIndexPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const open = (e: FormEvent) => {
    e.preventDefault();
    const key = q.trim().toLowerCase();
    const hit = passports.find(
      (p) =>
        p.id.toLowerCase() === key ||
        p.qr.toLowerCase() === key ||
        p.lotCode.toLowerCase() === key,
    );
    if (hit) navigate(`/passport/${hit.id}`);
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src="/images/irrigation.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-primary-deep/70 to-primary/25" />
        <div className="container-app relative py-14 md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            {t("nav.passport")}
          </p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl text-canvas md:text-5xl">
            {t("passport.title")}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-accent/85">{t("passport.subtitle")}</p>
          <form onSubmit={open} className="mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("passport.scan")}
              className="flex-1 rounded-full border border-white/20 bg-canvas/95 px-4 py-3 text-sm text-ink outline-none"
            />
            <Button type="submit" variant="cream">
              {t("passport.open")}
            </Button>
          </form>
        </div>
      </section>
      <div className="container-app py-10 md:py-14">
        <h2 className="font-display text-3xl">{t("passport.browse")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {passports.map((p) => (
            <Link key={p.id} to={`/passport/${p.id}`}>
              <Card className="overflow-hidden transition hover:-translate-y-0.5">
                <div className="relative h-40">
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-accent/95 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink">
                    {t(`passport.stages.${p.currentStage}`)}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-display text-xl">
                    {p.crop} · {p.variety}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{p.lotCode}</p>
                  <p className="mt-2 text-sm text-ink-soft">
                    {p.farmName} · {p.village}, {p.district}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PassportDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const p = passportById(id ?? "");
  if (!p) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-ink-soft">{t("passport.missing")}</p>
        <Link to="/passport" className="mt-4 inline-block">
          <Button>{t("passport.browse")}</Button>
        </Link>
      </div>
    );
  }
  const farmer = farmerById(p.farmerId);
  const lot = products.find((x) => x.passportId === p.id);
  const fresh = freshnessOf(p);

  const facts = [
    [t("passport.farmer"), farmer?.name ?? "—"],
    [t("passport.farm"), p.farmName],
    [t("passport.location"), `${p.village}, ${p.district}, ${p.state}`],
    [t("passport.crop"), `${p.crop} · ${p.variety}`],
    [t("passport.sown"), formatDate(p.sownOn)],
    [t("passport.harvested"), formatDate(p.harvestedOn)],
    [t("passport.irrigation"), p.irrigation],
    [t("passport.fertilizer"), p.fertilizer],
    [t("passport.freshness"), t(`market.freshness.${fresh}`)],
    [t("passport.distance"), km(p.distanceKm)],
    [t("passport.carbonSaved"), `${p.carbonSavedKg} kg CO₂e`],
    [t("passport.field"), p.field],
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-primary-deep/72 to-primary/20" />
        <div className="container-app relative grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-end md:py-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              {t("passport.title")}
            </p>
            <h1 className="mt-2 font-display text-4xl text-canvas md:text-5xl">
              {p.crop} · {p.variety}
            </h1>
            <p className="mt-2 font-mono text-sm text-accent/80">{p.lotCode}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.certifications.map((c) => (
                <Badge key={c} tone="accent">
                  <Leaf size={10} /> {c}
                </Badge>
              ))}
              <Badge tone="nature">{t(`passport.stages.${p.currentStage}`)}</Badge>
            </div>
            {farmer && (
              <Link
                to={`/farmers/${farmer.id}`}
                className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-canvas/10 px-3 py-2 text-canvas backdrop-blur-sm"
              >
                <img src={farmer.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <span>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    {farmer.name} <BadgeCheck size={14} className="text-accent" />
                  </span>
                  <span className="block text-xs text-accent/80">
                    {p.farmName} · {p.village}, {p.district}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="container-app py-10 md:py-14">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: t("passport.carbonSaved"),
              value: `${p.carbonSavedKg} kg`,
              hint: t("passport.carbon"),
              tone: "nature",
            },
            {
              label: t("passport.distance"),
              value: km(p.distanceKm),
              hint: t("passport.location"),
              tone: "secondary",
            },
            {
              label: t("passport.freshness"),
              value: t(`market.freshness.${fresh}`),
              hint: formatDate(p.harvestedOn),
              tone: "primary",
            },
            {
              label: t("passport.water"),
              value: `${p.waterLitres} L`,
              hint: t("passport.irrigation"),
              tone: "accent",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-[1.25rem] border border-line/70 bg-card p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted">{s.label}</p>
              <p className="mt-2 font-display text-3xl text-primary">{s.value}</p>
              <p className="mt-1 text-xs text-ink-soft">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[1.4rem] border border-line/70 bg-card p-6 md:p-8">
          <JourneyTimeline passport={p} />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={String(k)} className="rounded-2xl border border-line/70 bg-canvas p-4">
                  <dt className="text-[10px] uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="mt-1 font-medium leading-snug text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-8 font-display text-2xl">{t("passport.inputs")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {p.inputs.map((i) => (
                <li
                  key={i.name}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 bg-canvas px-4 py-3"
                >
                  <span>
                    {i.name}
                    <span className="ml-2 text-xs text-muted">{i.date === "daily" ? i.date : formatDate(i.date)}</span>
                  </span>
                  {i.organic && <Badge tone="nature">{t("common.organic")}</Badge>}
                </li>
              ))}
            </ul>

            {farmer && (
              <Link
                to={`/farmers/${farmer.id}`}
                className="mt-8 flex flex-wrap items-center gap-4 rounded-[1.25rem] border border-line bg-card p-4"
              >
                <img src={farmer.cover} alt="" className="h-20 w-28 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-xs text-nature">
                    <Sprout size={12} /> {t("passport.farm")}
                  </p>
                  <p className="font-display text-2xl">{farmer.farmName}</p>
                  <p className="flex items-center gap-1 text-sm text-ink-soft">
                    <MapPin size={12} /> {farmer.village}, {farmer.district}, {farmer.state}
                  </p>
                </div>
                <Droplets className="text-secondary" />
              </Link>
            )}

            {lot && (
              <Link to={`/market/${lot.id}`} className="mt-4 inline-block">
                <Button variant="ghost">{lot.name}</Button>
              </Link>
            )}
          </div>
          <PassportQr passport={p} />
        </div>
      </div>
    </div>
  );
}
