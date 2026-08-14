import { QrCode } from "lucide-react";

/** Visual lot QR — a seeded matrix from the passport code, plus the readable ID. */
export function LotQr({
  code,
  size = 160,
  className = "",
}: {
  code: string;
  size?: number;
  className?: string;
}) {
  const cells = 21;
  const bits: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    const n = code.charCodeAt(i % code.length) + i * 7;
    bits.push(n % 3 !== 0);
  }
  const finder = (r: number, c: number) => {
    const inBox = (rr: number, cc: number) =>
      r >= rr && r < rr + 7 && c >= cc && c < cc + 7;
    const ring = (rr: number, cc: number) => {
      const dr = r - rr;
      const dc = c - cc;
      return (
        dr === 0 ||
        dr === 6 ||
        dc === 0 ||
        dc === 6 ||
        (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)
      );
    };
    if (inBox(0, 0)) return ring(0, 0);
    if (inBox(0, cells - 7)) return ring(0, cells - 7);
    if (inBox(cells - 7, 0)) return ring(cells - 7, 0);
    return bits[r * cells + c];
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div
        className="grid rounded-2xl border border-line bg-canvas p-2"
        style={{
          width: size,
          height: size,
          gridTemplateColumns: `repeat(${cells}, 1fr)`,
          gridTemplateRows: `repeat(${cells}, 1fr)`,
        }}
        aria-hidden
      >
        {Array.from({ length: cells * cells }).map((_, i) => {
          const on = finder(Math.floor(i / cells), i % cells);
          return <span key={i} className={on ? "bg-primary" : "bg-canvas"} />;
        })}
      </div>
      <p className="mt-2 flex items-center gap-1 font-mono text-[10px] tracking-wide text-ink">
        <QrCode size={11} /> {code}
      </p>
    </div>
  );
}
