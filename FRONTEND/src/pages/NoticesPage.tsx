import { useTranslation } from "react-i18next";
import { BellRing } from "lucide-react";
import { useChat } from "../app/providers/ChatProvider";
import { NotificationPanel } from "../components/chat/NotificationPanel";
import { Card } from "../components/ui/Card";

export function NoticesPage() {
  const { t } = useTranslation();
  const { notices, markNoticeRead, markAllNotices, unreadNotices } = useChat();

  return (
    <div className="container-app max-w-3xl py-8 sm:py-10">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
          <BellRing size={20} />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">{t("radio.noticesKicker")}</p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{t("radio.notices")}</h1>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        {unreadNotices ? t("radio.unreadCount", { count: unreadNotices }) : t("radio.allCaught")}
      </p>

      <Card className="mt-6 overflow-hidden">
        <NotificationPanel notices={notices} onRead={markNoticeRead} onReadAll={markAllNotices} />
      </Card>
    </div>
  );
}
