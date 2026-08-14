import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (p: number) => void;
}) {
  const { t } = useTranslation();
  if (pages <= 1) return null;
  const windowed = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label={t("market.pages")}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="inline-flex h-10 items-center gap-1 rounded-full border border-line bg-canvas px-3 text-sm disabled:opacity-40"
      >
        <ChevronLeft size={14} /> {t("market.prev")}
      </button>
      {windowed.map((p, i) => (
        <span key={p} className="contents">
          {i > 0 && windowed[i - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
          <button
            type="button"
            onClick={() => onPage(p)}
            className={`h-10 min-w-10 rounded-full px-3 text-sm ${
              p === page ? "bg-primary text-accent" : "border border-line bg-canvas"
            }`}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className="inline-flex h-10 items-center gap-1 rounded-full border border-line bg-canvas px-3 text-sm disabled:opacity-40"
      >
        {t("market.next")} <ChevronRight size={14} />
      </button>
    </nav>
  );
}
