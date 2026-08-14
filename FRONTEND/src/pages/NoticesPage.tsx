import { useTranslation } from "react-i18next";
import { useChat } from "../app/providers/ChatProvider";
import { NotificationPanel } from "../components/chat/NotificationPanel";
import { Card } from "../components/ui/Card";

export function NoticesPage() {
  const { t } = useTranslation();
  const { notices, markNoticeRead, markAllNotices, unreadNotices } = useChat();

  return (
    <div className="container-app max-w-3xl py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-secondary">{t("radio.noticesKicker")}</p>
      <h1 className="mt-1 font-display text-4xl text-ink">{t("radio.notices")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {unreadNotices ? t("radio.unreadCount", { count: unreadNotices }) : t("radio.allCaught")}
      </p>
      <Card className="mt-6 overflow-hidden">
        <NotificationPanel notices={notices} onRead={markNoticeRead} onReadAll={markAllNotices} />
      </Card>
    </div>
  );
}
