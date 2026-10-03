import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Radio } from "lucide-react";
import { useChat } from "../app/providers/ChatProvider";
import { ChatRoom } from "../components/chat/ChatRoom";
import { ThreadList } from "../components/chat/ThreadList";
import { apiConfigured } from "../lib/api";
import { fetchFarmer } from "../lib/api/farmers";

export function ChatPage() {
  const { threadId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { threads, typingIn, live, radioReady, openFarmerThread } = useChat();
  const [query, setQuery] = useState("");
  const farmerQ = params.get("farmer");

  useEffect(() => {
    if (!farmerQ) return;
    if (!apiConfigured()) {
      navigate(`/chat/${openFarmerThread(farmerQ)}`, { replace: true });
      return;
    }
    void fetchFarmer(farmerQ)
      .then((farmer) => {
        const id = openFarmerThread(farmer.id, farmer.userId, farmer);
        navigate(`/chat/${id}`, { replace: true });
      })
      .catch(() => {
        // Preserve the existing demo thread when an old/shared link is unavailable.
        navigate(`/chat/${openFarmerThread(farmerQ)}`, { replace: true });
      });
  }, [farmerQ, openFarmerThread, navigate]);

  const active = threadId ? threads.find((th) => th.id === threadId) : undefined;

  return (
    <div className="container-app py-4 md:py-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary sm:text-xs">DIRECT FARM</p>
          <p className="mt-1 text-xs text-ink-soft">{t("radio.subtitle")}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${
            live ? "bg-nature-soft text-nature-dark" : "bg-cream-deep text-muted"
          }`}
        >
          <Radio size={11} />
          {live ? t("radio.live") : radioReady ? t("radio.connecting") : t("radio.dark")}
        </span>
      </div>

      <div className="grid h-[calc(100dvh-10.5rem)] overflow-hidden rounded-[1.35rem] border border-line bg-card shadow-[0_16px_40px_-20px_rgb(36_22_16_/_0.28)] md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr]">
        <div className={active ? "hidden md:flex md:min-h-0" : "flex min-h-0"}>
          <div className="min-h-0 w-full">
            <ThreadList
              threads={threads}
              activeId={active?.id}
              query={query}
              onQuery={setQuery}
              typingIn={typingIn}
            />
          </div>
        </div>
        <div className={active ? "flex min-h-0 flex-col" : "hidden min-h-0 md:flex"}>
          {active ? (
            <ChatRoom thread={active} />
          ) : (
            <div className="grid flex-1 place-items-center px-8 text-center">
              <div>
                <p className="font-display text-3xl text-ink">{t("radio.pick")}</p>
                <p className="mt-2 text-sm text-ink-soft">{t("radio.pickBody")}</p>
                <Link to="/farmers" className="mt-4 inline-block text-sm font-medium text-primary">
                  {t("radio.findFarm")} →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
