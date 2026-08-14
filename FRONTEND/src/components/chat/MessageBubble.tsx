import { Check, CheckCheck, Clock3, FileText, Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "../../lib/types";
import { formatBytes, formatDuration, formatTime } from "../../lib/format";
import { cn } from "../../lib/cn";
import { Waveform } from "./Waveform";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const { t } = useTranslation();
  const mine = message.from === "me";
  const kind = message.kind ?? "text";

  return (
    <div className={cn("flex max-w-[86%] flex-col gap-1", mine ? "ml-auto items-end" : "items-start")}>
      <div
        className={cn(
          "overflow-hidden rounded-[1.15rem] px-3.5 py-2 text-sm shadow-[0_8px_20px_-16px_rgb(36_22_16_/_0.35)]",
          mine
            ? "rounded-br-md bg-primary text-accent"
            : "rounded-bl-md bg-cream-deep text-ink",
        )}
      >
        {kind === "image" && message.attachment?.url && (
          <img
            src={message.attachment.url}
            alt={message.attachment.name}
            className="mb-2 max-h-56 w-full rounded-xl object-cover"
          />
        )}
        {kind === "file" && message.attachment && (
          <div className={cn("mb-1.5 flex items-center gap-2 rounded-xl px-2 py-2", mine ? "bg-white/10" : "bg-canvas")}>
            <span className={cn("grid h-9 w-9 place-items-center rounded-lg", mine ? "bg-accent/20" : "bg-primary-soft text-primary")}>
              <FileText size={16} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium">{message.attachment.name}</span>
              <span className={cn("block text-[10px]", mine ? "text-accent/70" : "text-muted")}>
                {formatBytes(message.attachment.size)} · {message.attachment.mime.split("/")[1] || "file"}
              </span>
            </span>
          </div>
        )}
        {kind === "voice" && <VoiceNote message={message} mine={mine} />}
        {message.text && <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>}
        {kind === "voice" && !message.attachment?.url && !message.text && (
          <p className={cn("text-[11px]", mine ? "text-accent/70" : "text-muted")}>{t("radio.voiceHeld")}</p>
        )}
      </div>
      <p className={cn("flex items-center gap-1 px-1 text-[10px] text-muted")}>
        <span>{formatTime(message.at)}</span>
        {mine && <StatusTicks status={message.status} />}
      </p>
    </div>
  );
}

function StatusTicks({ status }: { status?: ChatMessage["status"] }) {
  if (status === "queued") return <Clock3 size={11} />;
  if (status === "read") return <CheckCheck size={12} className="text-nature" />;
  if (status === "delivered" || status === "sent") return <Check size={12} />;
  return null;
}

function VoiceNote({ message, mine }: { message: ChatMessage; mine: boolean }) {
  const { t } = useTranslation();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const src = message.attachment?.url;
  const bars = message.waveform ?? [10, 18, 12, 24, 16, 8, 20, 14];

  const toggle = () => {
    if (!src || !audio.current) return;
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      void audio.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="mb-1 flex min-w-[180px] items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={!src}
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-full",
          mine ? "bg-accent text-primary" : "bg-primary text-accent",
          !src && "opacity-50",
        )}
        aria-label={playing ? t("common.pause") : t("common.play")}
      >
        {playing ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
      </button>
      <Waveform bars={bars} active={mine} progress={src ? progress || 1 : 1} />
      <span className={cn("text-[11px]", mine ? "text-accent/80" : "text-muted")}>
        {formatDuration(message.durationSec ?? 0)}
      </span>
      {src && (
        <audio
          ref={audio}
          src={src}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
          onTimeUpdate={(e) => {
            const el = e.currentTarget;
            if (el.duration) setProgress(el.currentTime / el.duration);
          }}
        />
      )}
    </div>
  );
}
