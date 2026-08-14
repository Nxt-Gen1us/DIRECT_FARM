import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import type { ChatThread } from "../../lib/types";
import { formatWhen } from "../../lib/format";
import { cn } from "../../lib/cn";
import { PresenceDot } from "./PresenceDot";

export function ThreadList({
  threads,
  activeId,
  query,
  onQuery,
  typingIn,
}: {
  threads: ChatThread[];
  activeId?: string;
  query: string;
  onQuery: (q: string) => void;
  typingIn: Record<string, boolean>;
}) {
  const { t } = useTranslation();
  const q = query.trim().toLowerCase();
  const filtered = q
    ? threads.filter(
        (th) =>
          th.farmerName.toLowerCase().includes(q) ||
          th.farmName?.toLowerCase().includes(q) ||
          th.crop?.toLowerCase().includes(q) ||
          th.district?.toLowerCase().includes(q),
      )
    : threads;

  return (
    <aside className="flex h-full min-h-0 flex-col border-line bg-card md:border-r">
      <div className="border-b border-line p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-secondary">{t("radio.kicker")}</p>
        <h1 className="font-display text-2xl text-ink">{t("radio.title")}</h1>
        <label className="mt-3 flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-2 text-sm">
          <Search size={14} className="text-muted" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t("radio.search")}
            className="w-full bg-transparent outline-none placeholder:text-muted"
          />
        </label>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted">{t("radio.emptyList")}</li>
        )}
        {filtered.map((th) => {
          const typing = Boolean(typingIn[th.id]);
          return (
            <li key={th.id}>
              <NavLink
                to={`/chat/${th.id}`}
                className={({ isActive }) =>
                  cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                    isActive || th.id === activeId ? "bg-accent/55" : "hover:bg-cream",
                  )
                }
              >
                <span className="relative shrink-0">
                  <img src={th.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <PresenceDot state={th.presence} className="absolute bottom-0 right-0" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium text-ink">{th.farmerName}</span>
                    <span className="shrink-0 text-[10px] text-muted">{formatWhen(th.lastAt)}</span>
                  </span>
                  <span className="block truncate text-[11px] text-muted">
                    {th.farmName}
                    {th.district ? ` · ${th.district}` : ""}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-xs",
                      typing ? "italic text-nature" : th.unread ? "font-medium text-ink" : "text-ink-soft",
                    )}
                  >
                    {typing ? t("radio.typing") : th.lastMessage || t("radio.newThread")}
                  </span>
                </span>
                {th.unread > 0 && (
                  <span className="mt-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] text-accent">
                    {th.unread}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
