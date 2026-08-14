import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sprout } from "lucide-react";
import { appRoutes } from "../../app/router/routes";
import { Button, Card, Container } from "../../components/ui";

export function ComingSoonPage({ module }: { module: string }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const route = appRoutes.find((r) => r.module === module && !r.path.includes(":"));

  return (
    <Container className="py-20">
      <Card className="mx-auto max-w-xl p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-accent">
          <Sprout />
        </span>
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-secondary">
          {t("common.coming")} · {module}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink">{route?.name ?? module}</h1>
        <p className="mt-3 font-mono text-xs text-muted">{pathname}</p>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t("foundation.reserved")}</p>
        <Link to="/system" className="mt-6 inline-block">
          <Button>{t("nav.system")}</Button>
        </Link>
      </Card>
    </Container>
  );
}
