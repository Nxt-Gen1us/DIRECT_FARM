import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Radio } from "lucide-react";
import { useChat } from "../../app/providers/ChatProvider";
import type { ChatThread } from "../../lib/types";
import { formatWhen } from "../../lib/format";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";
import { PresenceDot } from "./PresenceDot";
import { TypingDots } from "./TypingDots";

export function ChatRoom({ thread }: { thread: ChatThread }) {
  const { t } = useTranslation();
  const { compose, signalTyping, joinThread, markThreadRead, typingIn, live, radioReady } = useChat();
  const scroller = useRef<HTMLDivElement>(null);
  const typing = Boolean(typingIn[thread.id]);

  useEffect(() => {
    markThreadRead(thread.id);
    joinThread(thread.id);
  }, [thread.id, markThreadRead, joinThread]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [thread.messages.length, typing]);

  const presenceLabel =
    thread.presence === "online"
      ? t("radio.online")
      : thread.presence === "away"
        ? t("radio.away")
        : thread.presence === "offline"
          ? t("radio.offline")
          : t("radio.presenceUnknown");

  return (
    <section className="flex h-full min-h-0 flex-col bg-canvas">
      <header className="flex items-center gap-3 border-b border-line bg-card px-3 py-3 md:px-5">
        <Link to="/chat" className="grid h-9 w-9 place-items-center rounded-full text-ink md:hidden" aria-label={t("common.back")}>
          <ChevronLeft size={18} />
        </Link>
        <Link to={`/farmers/${thread.farmerId}`} className="relative shrink-0">
          <img src={thread.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
          <PresenceDot state={thread.presence} className="absolute bottom-0 right-0" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-ink">{thread.farmerName}</p>
          <p className="truncate text-[11px] text-muted">
            {thread.farmName}
            {thread.village ? ` · ${thread.village}` : ""}
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-ink-soft">
            <PresenceDot state={thread.presence} className="ring-0" />
            {presenceLabel}
            {thread.presence !== "online" && thread.lastSeen && (
              <span className="text-muted">· {formatWhen(thread.lastSeen)}</span>
            )}
          </p>
        </div>
        <span
          className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider sm:inline-flex ${
            live ? "bg-nature-soft text-nature-dark" : "bg-cream-deep text-muted"
          }`}
        >
          <Radio size={11} />
          {live ? t("radio.live") : radioReady ? t("radio.connecting") : t("radio.dark")}
        </span>
      </header>

      <div ref={scroller} className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,rgb(241_229_161_/_0.18),transparent_42%)] px-4 py-5 md:px-8">
        {thread.crop && (
          <p className="mx-auto max-w-sm rounded-full bg-nature-soft px-3 py-1 text-center text-[11px] text-nature-dark">
            {t("radio.about")} {thread.crop}
          </p>
        )}
        {thread.messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {typing && <TypingDots name={thread.farmerName} />}
      </div>

      <Composer
        waiting={radioReady && !live}
        onTyping={(on) => signalTyping(thread.id, on)}
        onSend={(input) =>
          compose({
            threadId: thread.id,
            kind: input.kind ?? "text",
            text: input.text,
            attachment: input.attachment,
            durationSec: input.durationSec,
            waveform: input.waveform,
          })
        }
      />
    </section>
  );
}
