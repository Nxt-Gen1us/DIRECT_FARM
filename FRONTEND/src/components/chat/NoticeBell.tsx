import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { useChat } from "../../app/providers/ChatProvider";
import { NotificationPanel } from "./NotificationPanel";

export function NoticeBell() {
  const { t } = useTranslation();
  const { notices, unreadNotices, markNoticeRead, markAllNotices } = useChat();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-10 w-10 place-items-center rounded-full bg-accent text-ink transition hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-label={t("common.notices")}
      >
        <Bell size={18} />
        {unreadNotices > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-accent">
            {unreadNotices}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[22rem] overflow-hidden rounded-[1.25rem] border border-line bg-card shadow-[0_18px_40px_-16px_rgb(36_22_16_/_0.35)]">
          <NotificationPanel notices={notices} onRead={markNoticeRead} onReadAll={markAllNotices} compact />
          <Link
            to="/notices"
            onClick={() => setOpen(false)}
            className="block border-t border-line py-2.5 text-center text-xs font-medium text-primary"
          >
            {t("common.openNotices")}
          </Link>
        </div>
      )}
    </div>
  );
}
