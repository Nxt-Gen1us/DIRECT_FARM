import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, CloudSun, MessageCircle, Package, QrCode, Radio } from "lucide-react";
import type { DeskNotice, NoticeKind } from "../../lib/types";
import { formatWhen } from "../../lib/format";
import { cn } from "../../lib/cn";
import { Button } from "../ui";

const icons: Record<NoticeKind, typeof Bell> = {
  chat: MessageCircle,
  crate: Package,
  weather: CloudSun,
  passport: QrCode,
  system: Radio,
};

export function NotificationPanel({
  notices,
  onRead,
  onReadAll,
  compact,
}: {
  notices: DeskNotice[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex flex-col", compact ? "max-h-[28rem]" : "")}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-secondary">{t("radio.noticesKicker")}</p>
          <h2 className="font-display text-xl text-ink">{t("radio.notices")}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onReadAll}>
          {t("radio.markAll")}
        </Button>
      </div>
      <ul className={cn("overflow-y-auto", compact ? "max-h-80" : "flex-1")}>
        {notices.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted">{t("radio.noNotices")}</li>
        )}
        {notices.map((n) => {
          const Icon = icons[n.kind];
          const inner = (
            <span className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                  n.read ? "bg-cream-deep text-muted" : "bg-primary-soft text-primary",
                )}
              >
                <Icon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={cn("truncate text-sm", n.read ? "text-ink-soft" : "font-medium text-ink")}>
                    {n.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted">{formatWhen(n.at)}</span>
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">{n.body}</span>
              </span>
              {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-secondary" />}
            </span>
          );
          return (
            <li key={n.id} className={cn("border-b border-line/70", !n.read && "bg-accent/30")}>
              {n.href ? (
                <Link to={n.href} onClick={() => onRead(n.id)} className="block px-4 py-3 hover:bg-cream">
                  {inner}
                </Link>
              ) : (
                <button type="button" onClick={() => onRead(n.id)} className="block w-full px-4 py-3 text-left hover:bg-cream">
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
