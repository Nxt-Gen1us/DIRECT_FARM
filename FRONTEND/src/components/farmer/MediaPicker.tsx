import { useTranslation } from "react-i18next";
import { ImagePlus, Video } from "lucide-react";
import { LIBRARY_IMAGES, LIBRARY_VIDEOS } from "../../lib/inventory";
import { cn } from "../../lib/cn";

export function ImagePicker({
  value,
  extras,
  onChange,
}: {
  value: string;
  extras: string[];
  onChange: (image: string, extras: string[]) => void;
}) {
  const { t } = useTranslation();
  const all = [...new Set([value, ...extras, ...LIBRARY_IMAGES])];

  const toggleExtra = (src: string) => {
    if (src === value) return;
    onChange(
      value,
      extras.includes(src) ? extras.filter((s) => s !== src) : [...extras, src],
    );
  };

  const onFile = (files: FileList | null) => {
    if (!files?.length) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    onChange(urls[0], [...extras, ...urls.slice(1), value].filter(Boolean));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {t("manage.images")}
        </span>
        <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary">
          <ImagePlus size={12} /> {t("manage.upload")}
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              onFile(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {all.map((src) => {
          const cover = src === value;
          const extra = extras.includes(src);
          return (
            <button
              key={src}
              type="button"
              onClick={() => (cover ? toggleExtra(src) : onChange(src, extras.filter((s) => s !== src)))}
              onDoubleClick={() => toggleExtra(src)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border-2",
                cover ? "border-primary" : extra ? "border-secondary" : "border-transparent",
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              {cover && (
                <span className="absolute bottom-1 left-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] text-accent">
                  {t("manage.cover")}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-1 text-[11px] text-muted">{t("manage.imageHint")}</p>
    </div>
  );
}

export function VideoPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (src: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {t("manage.video")}
        </span>
        <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary">
          <Video size={12} /> {t("manage.upload")}
          <input
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(URL.createObjectURL(file));
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {LIBRARY_VIDEOS.map((v) => (
          <button
            key={v.src}
            type="button"
            onClick={() => onChange(v.src)}
            className={cn(
              "overflow-hidden rounded-2xl border-2 text-left",
              value === v.src ? "border-primary" : "border-transparent",
            )}
          >
            <img src={v.poster} alt="" className="h-16 w-full object-cover" />
            <span className="block px-2 py-1 text-[11px] text-ink-soft">{v.label}</span>
          </button>
        ))}
      </div>
      {value.startsWith("blob:") && (
        <p className="mt-2 text-[11px] text-nature">{t("manage.customVideo")}</p>
      )}
    </div>
  );
}
