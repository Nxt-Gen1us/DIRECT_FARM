import { useTranslation } from "react-i18next";
import { ExternalLink, Landmark } from "lucide-react";
import type { GovScheme } from "../../lib/types";
import { Badge } from "../ui";
import { Card } from "../ui/Card";

export function SchemeCard({ scheme }: { scheme: GovScheme }) {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
          <Landmark size={18} />
        </span>
        <Badge tone={scheme.level === "central" ? "nature" : "secondary"}>
          {t(`intel.level.${scheme.level}`)}
        </Badge>
      </div>
      <h3 className="mt-3 font-display text-2xl text-ink">{scheme.name}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{scheme.short}</p>
      <dl className="mt-4 space-y-2 text-xs">
        <div>
          <dt className="text-muted">{t("intel.benefit")}</dt>
          <dd className="font-medium text-ink">{scheme.benefit}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("intel.who")}</dt>
          <dd className="text-ink-soft">{scheme.who}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("intel.ministry")}</dt>
          <dd className="text-ink-soft">{scheme.ministry}</dd>
        </div>
        {scheme.deadline && (
          <div>
            <dt className="text-muted">{t("intel.deadline")}</dt>
            <dd className="font-medium text-primary">{scheme.deadline}</dd>
          </div>
        )}
      </dl>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {scheme.tags.map((tag) => (
          <Badge key={tag} tone="muted">
            {tag}
          </Badge>
        ))}
      </div>
      <a
        href={scheme.href}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        {t("intel.apply")} <ExternalLink size={13} />
      </a>
    </Card>
  );
}
