import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layers, MonitorSmartphone, Palette, Type } from "lucide-react";
import { images } from "../../assets";
import { appRoutes, type AppRoute } from "../../app/router/routes";
import { useViewport } from "../../hooks/useMediaQuery";
import { useLanguage } from "../../hooks/useLanguage";
import { useApp } from "../../app/providers/AppProviders";
import { colorSwatches, breakpoints } from "../../lib/tokens";
import { Badge, Button, Card, Container, Field, Input, SectionHead, Select } from "../../components/ui";

const folders = [
  "src/app/providers · src/app/router",
  "src/components/ui · src/components/layout",
  "src/config · src/hooks · src/lib",
  "src/styles · src/assets",
  "src/i18n/locales/{en,hi,gu}",
  "src/pages/foundation · src/pages/placeholders",
  "public/images · public/favicon.svg",
];

const routeModuleLabels: Record<AppRoute["module"], string> = {
  home: "routes.home",
  system: "routes.designSystem",
  marketplace: "routes.marketplace",
  orders: "routes.orders",
  payments: "routes.payments",
  chat: "routes.fieldRadio",
  passport: "routes.cropPassport",
  weather: "routes.fieldIntel",
  farmer: "routes.farmerDesk",
  admin: "routes.adminDesk",
  account: "routes.account",
  auth: "routes.signIn",
};

export function DesignSystemPage() {
  const { t } = useTranslation();
  const { device } = useViewport();
  const { language, setLanguage, languages } = useLanguage();
  const { role, setRole } = useApp();

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={images.hero.farm} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-primary-deep/70 to-primary/25" />
        <Container className="relative py-20 md:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
            {t("foundation.kicker")}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.1] text-canvas sm:text-5xl lg:text-6xl">
            {t("foundation.title")}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-accent/90 md:text-base">
            {t("foundation.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge tone="accent">{t("foundation.viewport")}: {device}</Badge>
            <Badge tone="nature">{t(`roles.${role}`)}</Badge>
            <Badge tone="primary">{t(`lang.${language}`)}</Badge>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <SectionHead kicker={t("foundation.tokens")} title={t("foundation.tokens")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {colorSwatches.map((swatch) => (
            <Card key={swatch.token} className="overflow-hidden">
              <div className="h-20" style={{ background: swatch.hex }} />
              <div className="p-3">
                <p className="text-sm font-medium">{swatch.name}</p>
                <p className="font-mono text-[11px] text-muted">{swatch.hex}</p>
                <p className="mt-1 text-[11px] text-ink-soft">{swatch.role}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-secondary">
              <Type size={14} /> {t("foundation.type")}
            </p>
            <p className="font-display text-4xl text-primary">{t("foundation.displaySample")}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t("foundation.bodySample")}</p>
            <div className="mt-6 space-y-1 text-ink">
              <p className="font-display text-3xl">Playfair Display · 48</p>
              <p className="font-display text-2xl">Playfair Display · 32</p>
              <p className="text-base">Poppins Regular · body</p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Poppins · overline</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-secondary">
              <Palette size={14} /> {t("foundation.components")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button>{t("common.primary")}</Button>
              <Button variant="secondary">{t("common.harvest")}</Button>
              <Button variant="nature">{t("common.nature")}</Button>
              <Button variant="ghost">{t("common.ghost")}</Button>
              <Button variant="cream">{t("common.wheat")}</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="primary">{t("common.verified")}</Badge>
              <Badge tone="nature">{t("common.organic")}</Badge>
              <Badge tone="secondary">{t("common.heatWatch")}</Badge>
              <Badge>{t("foundation.sampleLot")}</Badge>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field label={t("common.searchHarvest")}>
                <Input placeholder={t("market.search")} />
              </Field>
              <Field label={t("roles.switch")}>
                <Select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
                  <option value="customer">{t("roles.customer")}</option>
                  <option value="farmer">{t("roles.farmer")}</option>
                  <option value="admin">{t("roles.admin")}</option>
                </Select>
              </Field>
            </div>
          </Card>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-secondary">
              <MonitorSmartphone size={14} /> {t("foundation.breakpoints")}
            </p>
            <ul className="space-y-2 text-sm">
              {Object.entries(breakpoints).map(([name, px]) => (
                <li key={name} className="flex justify-between rounded-xl bg-cream px-3 py-2">
                  <span className="font-medium">{name}</span>
                  <span className="font-mono text-muted">{px}px</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              {t("foundation.mobile")} · {t("foundation.tablet")} · {t("foundation.desktop")}
            </p>
          </Card>

          <Card className="p-6">
            <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-secondary">
              <Layers size={14} /> {t("foundation.folder")}
            </p>
            <ul className="space-y-2 font-mono text-xs text-ink-soft">
              {folders.map((row) => (
                <li key={row} className="rounded-xl bg-cream px-3 py-2">
                  {row}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <SectionHead kicker={t("foundation.i18n")} title={t("foundation.i18n")} />
        <div className="mb-10 flex flex-wrap gap-2">
          {languages.map((lng) => (
            <Button
              key={lng}
              variant={language === lng ? "primary" : "ghost"}
              onClick={() => setLanguage(lng)}
            >
              {t(`lang.${lng}`)}
            </Button>
          ))}
        </div>

        <SectionHead title={t("foundation.routes")} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {appRoutes.map((route) => (
            <Link key={route.path} to={route.path.replace(":id", "sample")}>
              <Card className="p-4 transition hover:-translate-y-0.5">
                <p className="font-mono text-xs text-muted">{route.path}</p>
                <p className="mt-1 font-display text-xl">{t(routeModuleLabels[route.module])}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-secondary">{t("common.open")}</p>
              </Card>
            </Link>
          ))}
        </div>

        <SectionHead title={t("foundation.assets")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(images.crops).map(([key, src]) => (
            <div key={key} className="overflow-hidden rounded-2xl">
              <img src={src} alt={key} className="h-28 w-full object-cover" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
