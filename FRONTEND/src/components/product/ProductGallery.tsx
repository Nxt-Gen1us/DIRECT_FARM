import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image as ImageIcon, RotateCcw, Video } from "lucide-react";
import type { Product } from "../../lib/types";
import { galleryFor, videoFor } from "../../lib/productDetail";
import { cn } from "../../lib/cn";

type Mode = "photo" | "spin" | "video";

export function ProductGallery({ product }: { product: Product }) {
  const { t } = useTranslation();
  const photos = galleryFor(product);
  const [mode, setMode] = useState<Mode>("photo");
  const [index, setIndex] = useState(0);
  const [angle, setAngle] = useState(0);
  const drag = useRef<{ x: number; a: number } | null>(null);
  const video = videoFor(product);

  const onPointer = (clientX: number, down: boolean, end = false) => {
    if (down) drag.current = { x: clientX, a: angle };
    else if (end) drag.current = null;
    else if (drag.current) {
      setAngle(drag.current.a + (clientX - drag.current.x) * 0.6);
    }
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-[1.5rem] border border-line/70 bg-ink shadow-[0_20px_50px_-28px_rgb(36_22_16_/_0.45)]">
        {mode === "photo" && (
          <img
            src={photos[index]}
            alt={product.name}
            className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
          />
        )}
        {mode === "spin" && (
          <div
            className="relative flex h-[320px] cursor-ew-resize items-center justify-center overflow-hidden sm:h-[420px] lg:h-[520px]"
            style={{
              background:
                "radial-gradient(circle at 50% 60%, rgba(241,229,161,0.18), transparent 55%), #241610",
            }}
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              onPointer(e.clientX, true);
            }}
            onPointerMove={(e) => onPointer(e.clientX, false)}
            onPointerUp={() => onPointer(0, false, true)}
          >
            <div className="absolute inset-x-10 bottom-16 h-8 rounded-[100%] bg-accent/15 blur-md" />
            <img
              src={product.image}
              alt=""
              className="h-[70%] w-[70%] rounded-[1.25rem] object-cover shadow-[0_30px_50px_-20px_rgb(0_0_0_/_0.6)]"
              style={{ transform: `perspective(900px) rotateY(${angle}deg)` }}
              draggable={false}
            />
            <p className="absolute bottom-4 left-0 right-0 px-6 text-center text-[11px] text-accent/80">
              {t("detail.spinHint")}
            </p>
          </div>
        )}
        {mode === "video" && (
          <div className="relative">
            <video
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              controls
              playsInline
              poster={product.image}
            >
              <source src={video} type="video/mp4" />
            </video>
            <p className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-[11px] text-accent">
              {t("detail.videoHint")}
            </p>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {(
            [
              ["photo", ImageIcon, t("detail.gallery")],
              ["spin", RotateCcw, t("detail.spin")],
              ["video", Video, t("detail.video")],
            ] as const
          ).map(([id, Icon, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur",
                mode === id ? "bg-accent text-ink" : "bg-ink/55 text-accent",
              )}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              setMode("photo");
              setIndex(i);
            }}
            className={cn(
              "h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2",
              mode === "photo" && index === i ? "border-primary" : "border-transparent",
            )}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
