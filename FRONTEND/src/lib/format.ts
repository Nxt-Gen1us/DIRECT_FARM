const uiLocale = () => {
  const language = typeof document === "undefined" ? "gu" : document.documentElement.lang;
  return language.startsWith("gu") ? "gu-IN" : language.startsWith("hi") ? "hi-IN" : "en-IN";
};

const unitLabels: Record<string, { en: string; hi: string; gu: string }> = {
  kg: { en: "kg", hi: "किलोग्राम", gu: "કિલોગ્રામ" },
  kilogram: { en: "kilogram", hi: "किलोग्राम", gu: "કિલોગ્રામ" },
  tonne: { en: "tonne", hi: "टन", gu: "ટન" },
  ton: { en: "ton", hi: "टन", gu: "ટન" },
  quintal: { en: "quintal", hi: "क्विंटल", gu: "ક્વિન્ટલ" },
  piece: { en: "piece", hi: "नग", gu: "નંગ" },
  dozen: { en: "dozen", hi: "दर्जन", gu: "ડઝન" },
  bundle: { en: "bundle", hi: "गुच्छा", gu: "ગુચ્છ" },
  unit: { en: "unit", hi: "इकाई", gu: "એકમ" },
  crate: { en: "crate", hi: "टोकरी", gu: "ટોપલી" },
  litre: { en: "litre", hi: "लीटर", gu: "લિટર" },
  liter: { en: "liter", hi: "लीटर", gu: "લિટર" },
};

export const formatUnit = (unit: string) => {
  const language = uiLocale().slice(0, 2) as "en" | "hi" | "gu";
  return unitLabels[unit.trim().toLowerCase()]?.[language] ?? unit;
};

export const inr = (n: number) =>
  new Intl.NumberFormat(uiLocale(), {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 0,
  }).format(n);

export const compactInr = (n: number) =>
  new Intl.NumberFormat(uiLocale(), {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(uiLocale(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(uiLocale(), { hour: "numeric", minute: "2-digit" });
};

export const formatWhen = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) return formatTime(iso);
  const yday = new Date(now);
  yday.setDate(now.getDate() - 1);
  if (
    d.getDate() === yday.getDate() &&
    d.getMonth() === yday.getMonth() &&
    d.getFullYear() === yday.getFullYear()
  ) {
    return `${new Intl.RelativeTimeFormat(uiLocale(), { numeric: "auto" }).format(-1, "day")} · ${formatTime(iso)}`;
  }
  return `${formatDate(iso)} · ${formatTime(iso)}`;
};

export const formatBytes = (n: number) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDuration = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

export const km = (n: number) =>
  n >= 1000
    ? `${new Intl.NumberFormat(uiLocale(), { maximumFractionDigits: 1 }).format(n / 1000)}k ${uiLocale() === "gu-IN" ? "કિમી" : "km"}`
    : `${new Intl.NumberFormat(uiLocale()).format(Math.round(n))} ${uiLocale() === "gu-IN" ? "કિમી" : "km"}`;

const monthIndex: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const weekdayIndex: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

export const formatChartLabel = (value: string | number) => {
  const label = String(value);
  if (label in monthIndex) {
    return new Intl.DateTimeFormat(uiLocale(), { month: "short" }).format(
      new Date(Date.UTC(2025, monthIndex[label], 1)),
    );
  }
  if (label in weekdayIndex) {
    return new Intl.DateTimeFormat(uiLocale(), { weekday: "short" }).format(
      new Date(Date.UTC(2025, 0, 5 + weekdayIndex[label])),
    );
  }
  const datedMonth = /^(\d{1,2}) ([A-Za-z]{3})$/.exec(label);
  if (datedMonth && datedMonth[2] in monthIndex) {
    return new Intl.DateTimeFormat(uiLocale(), { day: "numeric", month: "short" }).format(
      new Date(Date.UTC(2025, monthIndex[datedMonth[2]], Number(datedMonth[1]))),
    );
  }
  return label;
};
