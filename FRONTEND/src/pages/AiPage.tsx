import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeAlert,
  Bell,
  CalendarCheck,
  FileText,
  IndianRupee,
  ScanSearch,
  Sparkles,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import type { AiToolId } from "../data/aiDesk";
import { remindersDemo, sampleFor, scoutShots } from "../data/aiDesk";
import { aiInsights } from "../data/weather";
import { Badge, Button, Card } from "../components/ui";
import { DemoBanner } from "../components/ai/DemoBanner";
import { ConfidenceBar } from "../components/ai/ConfidenceBar";
import { ScoutPicker } from "../components/ai/ScoutPicker";
import { inr } from "../lib/format";
import { cn } from "../lib/cn";

const TOOLS: { id: AiToolId; icon: typeof Sparkles }[] = [
  { id: "detect", icon: ScanSearch },
  { id: "grade", icon: BadgeAlert },
  { id: "price", icon: IndianRupee },
  { id: "describe", icon: FileText },
  { id: "demand", icon: TrendingUp },
  { id: "disease", icon: Stethoscope },
  { id: "harvest", icon: CalendarCheck },
  { id: "remind", icon: Bell },
];

const tooltipStyle = {
  background: "#FFFAF0",
  border: "1px solid #E6D8B4",
  borderRadius: 12,
  fontSize: 12,
};

export function AiPage() {
  const { t } = useTranslation();
  const [tool, setTool] = useState<AiToolId>("detect");
  const [scout, setScout] = useState(scoutShots[0].id);
  const [busy, setBusy] = useState(false);
  const [ran, setRan] = useState<Partial<Record<AiToolId, boolean>>>({});
  const [ask, setAsk] = useState("");
  const [asked, setAsked] = useState("");
  const [reply, setReply] = useState("");
  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState<string[]>([]);
  const [upload, setUpload] = useState<string | null>(null);

  const shot = useMemo(
    () => scoutShots.find((s) => s.id === scout) ?? scoutShots[0],
    [scout],
  );
  const sample = sampleFor(shot.key);
  const detectDemo = sample.detect;
  const gradeDemo = sample.grade;
  const priceDemo = sample.price;
  const describeDemo = sample.describe;
  const demandDemo = sample.demand;
  const diseaseDemo = sample.disease;
  const harvestPredictDemo = sample.harvest;
  const previewSrc = upload ?? shot.src;

  const run = () => {
    setBusy(true);
    window.setTimeout(() => {
      setRan((r) => ({ ...r, [tool]: true }));
      setBusy(false);
    }, 720);
  };

  const shown = Boolean(ran[tool]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src="/images/irrigation.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-primary-deep/72 to-nature-dark/45" />
        <div className="container-app relative py-12 md:py-16">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-accent">
            <Sparkles size={14} /> {t("aiDesk.kicker")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-canvas md:text-5xl">{t("aiDesk.title")}</h1>
          <p className="mt-3 max-w-2xl text-sm text-accent/90">{t("aiDesk.subtitle")}</p>
          <div className="mt-6 max-w-2xl">
            <DemoBanner />
          </div>
        </div>
      </section>

      <div className="container-app py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-2">
            {TOOLS.map((item) => {
              const Icon = item.icon;
              const on = tool === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTool(item.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left",
                    on ? "border-primary bg-primary-soft" : "border-line bg-card hover:border-secondary/40",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                      on ? "bg-primary text-accent" : "bg-accent text-ink",
                    )}
                  >
                    <Icon size={16} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">
                      {t(`aiDesk.tools.${item.id}.name`)}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                      {t(`aiDesk.tools.${item.id}.blurb`)}
                    </span>
                  </span>
                </button>
              );
            })}
          </aside>

          <Card className="p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-secondary">{t("aiDesk.demoTag")}</p>
                <h2 className="font-display text-3xl">{t(`aiDesk.tools.${tool}.name`)}</h2>
                <p className="mt-1 text-sm text-ink-soft">{t(`aiDesk.tools.${tool}.blurb`)}</p>
              </div>
              <Button onClick={run} disabled={busy}>
                {busy ? t("aiDesk.running") : shown ? t("aiDesk.rerun") : t("aiDesk.run")}
              </Button>
            </div>

            {(tool === "price" || tool === "describe" || tool === "demand" || tool === "harvest") && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  {t("aiDesk.sampleCrop")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {scoutShots.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setScout(s.id);
                        setRan((r) => ({ ...r, [tool]: false }));
                      }}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs",
                        scout === s.id ? "bg-primary text-accent" : "border border-line bg-canvas",
                      )}
                    >
                      {s.crop}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(tool === "detect" || tool === "grade" || tool === "disease") && (
              <div className="mt-6">
                <ScoutPicker
                  value={scout}
                  onChange={(id) => {
                    setScout(id);
                    setUpload(null);
                    setRan((r) => ({ ...r, [tool]: false }));
                  }}
                />
                <label className="mt-2 inline-flex cursor-pointer text-xs font-medium text-primary">
                  {t("aiDesk.upload")}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setUpload(URL.createObjectURL(file));
                      e.target.value = "";
                    }}
                  />
                </label>
                <img
                  src={previewSrc}
                  alt={shot.crop}
                  className="mt-3 h-48 w-full rounded-[1.15rem] object-cover md:h-64"
                />
                <p className="mt-1 text-[11px] text-muted">
                  {shot.crop} · {shot.field}
                  {upload ? ` · ${t("aiDesk.uploaded")}` : ""}
                </p>
              </div>
            )}

            {shown && (
              <div className="mt-6 space-y-4">
                <DemoBanner compact />
                {tool === "detect" && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{t("aiDesk.detect.found")}</p>
                    <p className="font-display text-3xl text-primary">
                      {detectDemo.crop} · {detectDemo.variety}
                    </p>
                    <p className="mt-2 text-sm text-ink-soft">{detectDemo.note}</p>
                    <div className="mt-4">
                      <ConfidenceBar value={detectDemo.confidence} />
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted">
                      {t("aiDesk.detect.also")}
                    </p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {detectDemo.also.map((a) => (
                        <li key={a.label} className="flex justify-between text-ink-soft">
                          <span>{a.label}</span>
                          <span>{a.p}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool === "grade" && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{t("aiDesk.grade.result")}</p>
                    <p className="font-display text-5xl text-primary">{gradeDemo.grade}</p>
                    <div className="mt-4 space-y-2">
                      {gradeDemo.checks.map((c) => (
                        <div key={c.label}>
                          <div className="flex justify-between text-xs text-muted">
                            <span>{c.label}</span>
                            <span>{c.value}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-cream-deep">
                            <div className="h-full rounded-full bg-nature" style={{ width: `${c.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 rounded-2xl bg-cream px-3 py-2 text-sm text-ink-soft">
                      <span className="font-medium text-ink">{t("aiDesk.grade.hold")}: </span>
                      {gradeDemo.hold}
                    </p>
                    <div className="mt-4">
                      <ConfidenceBar value={gradeDemo.score} />
                    </div>
                  </div>
                )}
                {tool === "price" && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{t("aiDesk.price.recommend")}</p>
                    <p className="font-display text-4xl text-primary">
                      {inr(priceDemo.recommend)}
                      <span className="ml-2 text-base text-muted">/ {priceDemo.unit}</span>
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {t("aiDesk.price.band")}: {inr(priceDemo.low)}–{inr(priceDemo.high)} · {priceDemo.mandi}
                    </p>
                    <p className="mt-3 text-sm text-ink-soft">{priceDemo.reason}</p>
                    <p className="mt-4 text-xs uppercase tracking-wider text-muted">{t("aiDesk.price.chart")}</p>
                    <div className="mt-2 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceDemo.series}>
                          <CartesianGrid stroke="#e6d8b4" strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A7363" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#8A7363" }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line type="monotone" dataKey="apmc" stroke="#8B2626" strokeWidth={2} name="APMC" />
                          <Line type="monotone" dataKey="farm" stroke="#EF6905" strokeWidth={2} name="Farm" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <ConfidenceBar value={83} />
                  </div>
                )}
                {tool === "describe" && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{t("aiDesk.describe.title")}</p>
                    <p className="font-display text-2xl text-ink">{describeDemo.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{describeDemo.body}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {describeDemo.tags.map((tag) => (
                        <Badge key={tag} tone="muted">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-4"
                      onClick={() => {
                        void navigator.clipboard?.writeText(
                          `${describeDemo.title}\n\n${describeDemo.body}`,
                        );
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1600);
                      }}
                    >
                      {copied ? t("aiDesk.copied") : t("aiDesk.copy")}
                    </Button>
                  </div>
                )}
                {tool === "demand" && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{t("aiDesk.demand.peak")}</p>
                    <p className="font-display text-3xl text-primary">{demandDemo.peak}</p>
                    <p className="mt-2 text-sm text-ink-soft">{demandDemo.note}</p>
                    <p className="mt-4 text-xs uppercase tracking-wider text-muted">{t("aiDesk.demand.chart")}</p>
                    <div className="mt-2 h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={demandDemo.series}>
                          <CartesianGrid stroke="#e6d8b4" strokeDasharray="3 3" />
                          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#8A7363" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#8A7363" }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Area type="monotone" dataKey="demand" name={t("common.demand")} stroke="#8B2626" fill="#f6e8e4" />
                          <Area type="monotone" dataKey="supply" name={t("common.supply")} stroke="#486C2F" fill="#eef4e6" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
                {tool === "disease" && (
                  <div>
                    <Badge tone="primary">{diseaseDemo.risk}</Badge>
                    <p className="mt-2 text-xs uppercase tracking-wider text-muted">{t("aiDesk.disease.name")}</p>
                    <p className="font-display text-2xl text-ink">{diseaseDemo.name}</p>
                    <p className="mt-3 text-sm text-ink-soft">
                      <span className="font-medium text-ink">{t("aiDesk.disease.signs")}: </span>
                      {diseaseDemo.signs}
                    </p>
                    <p className="mt-3 rounded-2xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">
                      {t("aiDesk.disease.action")}: {diseaseDemo.action}
                    </p>
                    <div className="mt-4">
                      <ConfidenceBar value={diseaseDemo.confidence} />
                    </div>
                  </div>
                )}
                {tool === "harvest" && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{t("aiDesk.harvest.window")}</p>
                    <p className="font-display text-3xl text-primary">{harvestPredictDemo.window}</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {harvestPredictDemo.crop} · {t("aiDesk.harvest.ready")} {harvestPredictDemo.readiness}%
                    </p>
                    <p className="mt-3 text-sm text-ink-soft">{harvestPredictDemo.note}</p>
                    <div className="mt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={harvestPredictDemo.series}>
                          <CartesianGrid stroke="#e6d8b4" strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8A7363" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#8A7363" }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line type="monotone" dataKey="ready" stroke="#486C2F" strokeWidth={2.2} name="%" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <ConfidenceBar value={88} />
                  </div>
                )}
                {tool === "remind" && (
                  <ul className="space-y-3">
                    {remindersDemo.filter((r) => !muted.includes(r.id)).length === 0 && (
                      <li className="text-sm text-muted">{t("aiDesk.remind.empty")}</li>
                    )}
                    {remindersDemo
                      .filter((r) => !muted.includes(r.id))
                      .map((r) => (
                      <li
                        key={r.id}
                        className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-line bg-cream p-4"
                      >
                        <div>
                          <p className="font-medium text-ink">
                            {r.crop} · {r.field}
                          </p>
                          <p className="mt-1 text-sm text-ink-soft">{r.task}</p>
                          <p className="mt-1 text-xs text-muted">{r.when}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge tone="secondary">
                            {t("aiDesk.remind.due")} · {r.due}
                          </Badge>
                          <button
                            type="button"
                            className="text-xs text-primary"
                            onClick={() => setMuted((m) => [...m, r.id])}
                          >
                            {t("aiDesk.remind.dismiss")}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Card>
        </div>

        <Card className="mt-8 bg-[linear-gradient(135deg,#fffaf0,#f1e5a1_55%,#fff0e3)] p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles size={16} /> {t("aiDesk.ask")}
          </p>
          <form
            className="mt-3 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              if (!ask.trim()) return;
              setAsked(ask.trim());
              setReply(t("aiDesk.reply"));
            }}
          >
            <input
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              placeholder={t("aiDesk.placeholder")}
              className="flex-1 rounded-full border border-line bg-canvas px-4 py-3 text-sm outline-none"
            />
            <Button type="submit">{t("aiDesk.submit")}</Button>
          </form>
          {reply && (
            <div className="mt-4 rounded-2xl bg-canvas/80 p-4 text-sm leading-relaxed">
              <p className="text-xs uppercase tracking-widest text-muted">{asked}</p>
              <p className="mt-2">{reply}</p>
            </div>
          )}
        </Card>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {aiInsights.map((ins) => (
            <Card key={ins.id} className="p-5">
              <div className="flex flex-wrap gap-2">
                <Badge tone={ins.severity === "high" ? "primary" : ins.severity === "medium" ? "secondary" : "nature"}>
                  {ins.crop}
                </Badge>
                <Badge tone="muted">{t("aiDesk.demoTag")}</Badge>
              </div>
              <h3 className="mt-3 font-display text-2xl">{ins.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{ins.summary}</p>
              <div className="mt-4">
                <ConfidenceBar value={ins.confidence} />
              </div>
              <p className="mt-4 rounded-xl bg-nature-soft px-3 py-2 text-sm text-nature-dark">{ins.action}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
