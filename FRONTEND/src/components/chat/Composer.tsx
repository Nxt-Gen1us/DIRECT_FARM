import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, Mic, Paperclip, Send, Square, X } from "lucide-react";
import type { ChatAttachment, MessageKind } from "../../lib/types";
import { formatBytes, formatDuration } from "../../lib/format";
import { Button } from "../ui";
import { Waveform } from "./Waveform";

type Pending =
  | { kind: "image" | "file"; file: File; preview: string; attachment: ChatAttachment }
  | { kind: "voice"; blob: Blob; preview: string; durationSec: number; waveform: number[] };

export function Composer({
  disabled,
  waiting,
  onSend,
  onTyping,
}: {
  disabled?: boolean;
  waiting?: boolean;
  onSend: (input: {
    kind: MessageKind;
    text?: string;
    attachment?: ChatAttachment;
    durationSec?: number;
    waveform?: number[];
  }) => void;
  onTyping?: (on: boolean) => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<Pending | null>(null);
  const [recording, setRecording] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (pending && "preview" in pending) URL.revokeObjectURL(pending.preview);
      if (timer.current) window.clearInterval(timer.current);
      recRef.current?.stop();
    };
  }, [pending]);

  const pickFile = (e: ChangeEvent<HTMLInputElement>, kind: "image" | "file") => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPending({
      kind,
      file,
      preview,
      attachment: {
        id: `local-${file.name}-${file.size}`,
        name: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
        url: preview,
        local: true,
      },
    });
  };

  const startRec = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    chunks.current = [];
    rec.ondataavailable = (ev) => {
      if (ev.data.size) chunks.current.push(ev.data);
    };
    rec.onstop = () => {
      stream.getTracks().forEach((tr) => tr.stop());
      const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
      const preview = URL.createObjectURL(blob);
      const waveform = Array.from({ length: 18 }, (_, i) => 8 + ((i * 7 + recSec * 3) % 22));
      setPending({ kind: "voice", blob, preview, durationSec: recSec, waveform });
      setRecording(false);
    };
    rec.start();
    recRef.current = rec;
    setRecSec(0);
    setRecording(true);
    timer.current = window.setInterval(() => setRecSec((s) => s + 1), 1000);
  };

  const stopRec = () => {
    if (timer.current) window.clearInterval(timer.current);
    recRef.current?.stop();
    recRef.current = null;
  };

  const clearPending = () => {
    if (pending) URL.revokeObjectURL(pending.preview);
    setPending(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (waiting) return;
    if (pending?.kind === "voice") {
      onSend({
        kind: "voice",
        durationSec: pending.durationSec,
        waveform: pending.waveform,
        attachment: {
          id: `voice-${Date.now()}`,
          name: "field-note.webm",
          mime: "audio/webm",
          size: pending.blob.size,
          url: pending.preview,
          local: true,
        },
      });
      setPending(null);
      return;
    }
    if (pending && (pending.kind === "image" || pending.kind === "file")) {
      onSend({ kind: pending.kind, text: draft, attachment: pending.attachment });
      setDraft("");
      setPending(null);
      onTyping?.(false);
      return;
    }
    if (!draft.trim()) return;
    onSend({ kind: "text", text: draft });
    setDraft("");
    onTyping?.(false);
  };

  return (
    <form onSubmit={submit} className="border-t border-line bg-card p-3">
      {pending && (
        <div className="mb-2 flex items-center gap-3 rounded-2xl border border-line bg-cream px-3 py-2">
          {pending.kind === "image" && (
            <img src={pending.preview} alt="" className="h-12 w-12 rounded-lg object-cover" />
          )}
          {pending.kind === "file" && (
            <span className="text-xs text-ink-soft">
              {pending.attachment.name}
              <span className="ml-2 text-muted">{formatBytes(pending.attachment.size)}</span>
            </span>
          )}
          {pending.kind === "voice" && (
            <span className="flex items-center gap-2 text-xs text-ink-soft">
              <Waveform bars={pending.waveform} />
              {formatDuration(pending.durationSec)}
            </span>
          )}
          <button type="button" onClick={clearPending} className="ml-auto text-muted" aria-label={t("radio.discard")}>
            <X size={14} />
          </button>
        </div>
      )}
      {recording && (
        <div className="mb-2 flex items-center gap-2 rounded-2xl bg-primary-soft px-3 py-2 text-xs text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {t("radio.recording")} · {formatDuration(recSec)}
        </div>
      )}
      <div className="flex items-end gap-2">
        <input ref={imageRef} type="file" accept="image/*" hidden onChange={(e) => pickFile(e, "image")} />
        <input ref={fileRef} type="file" hidden onChange={(e) => pickFile(e, "file")} />
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-cream-deep"
          onClick={() => imageRef.current?.click()}
          aria-label={t("radio.attachImage")}
          disabled={disabled}
        >
          <ImagePlus size={18} />
        </button>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-cream-deep"
          onClick={() => fileRef.current?.click()}
          aria-label={t("radio.attachFile")}
          disabled={disabled}
        >
          <Paperclip size={18} />
        </button>
        <textarea
          value={draft}
          rows={1}
          disabled={disabled || recording}
          onChange={(e) => {
            setDraft(e.target.value);
            onTyping?.(e.target.value.trim().length > 0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e);
            }
          }}
          placeholder={waiting ? t("radio.waiting") : t("radio.placeholder")}
          className="max-h-28 min-h-10 flex-1 resize-none rounded-2xl border border-line bg-canvas px-4 py-2.5 text-sm outline-none placeholder:text-muted"
        />
        {recording ? (
          <button
            type="button"
            onClick={stopRec}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-accent"
            aria-label={t("radio.stopRec")}
          >
            <Square size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void startRec()}
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-cream-deep"
            aria-label={t("radio.record")}
            disabled={disabled}
          >
            <Mic size={18} />
          </button>
        )}
        <Button type="submit" className="h-10 px-4" disabled={disabled || waiting || (!draft.trim() && !pending)}>
          <Send size={14} />
        </Button>
      </div>
      {waiting && <p className="mt-2 text-[11px] text-muted">{t("radio.offlineHint")}</p>}
    </form>
  );
}
