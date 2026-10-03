import fs from "node:fs";
import path from "node:path";

const baseDir = path.resolve(process.cwd(), "src/i18n/locales");
const files = ["en.ts", "hi.ts", "gu.ts"];
const requiredPaths = [
  "brand",
  "tagline",
  "nav.home",
  "nav.market",
  "hero.title",
  "hero.cta",
  "market.title",
  "orders.title",
  "weather.title",
  "passport.title",
  "chat.title",
];

const getValue = (obj, pathString) => {
  return pathString.split(".").reduce((cursor, segment) => cursor?.[segment], obj);
};

const loadLocale = (fileName) => {
  const filePath = path.join(baseDir, fileName);
  return loadSource(fs.readFileSync(filePath, "utf8"));
};

const loadSource = (source) => {
  const sanitized = source
    .replace(/^\s*const\s+\w+\s*=\s*/, "")
    .replace(/;\s*export\s+default\s+\w+\s*;?\s*$/, "")
    .replace(/;\s*$/, "")
    .trim();

  return Function(`return (${sanitized});`)();
};

const issues = [];

const englishDir = path.join(baseDir, "en");
const activeEnglish = Object.assign(
  {},
  ...fs.readdirSync(englishDir)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts")
    .map((file) => loadLocale(path.join("en", file))),
);

const guSource = fs.readFileSync(path.join(baseDir, "gu.ts"), "utf8")
  .replace(/^import guPages.*\r?\n/m, "")
  .replace(/^import guGenerated.*\r?\n/m, "")
  .replace(/\nfunction mergeLocale[\s\S]*$/m, "");

function mergeDeep(base, additions) {
  const merged = { ...base };
  for (const [key, value] of Object.entries(additions)) {
    const current = merged[key];
    merged[key] =
      value && typeof value === "object" && !Array.isArray(value) && current && typeof current === "object"
        ? mergeDeep(current, value)
        : value;
  }
  return merged;
}

const activeGujarati = mergeDeep(
  mergeDeep(loadSource(guSource), loadLocale("guPages.ts")),
  loadLocale("guGenerated.ts"),
);
const locales = {
  en: loadLocale("en.ts"),
  hi: loadLocale("hi.ts"),
  gu: activeGujarati,
};

function placeholders(value) {
  return [...value.matchAll(/\{\{([^{}]+)\}\}/g)].map((match) => match[1]).sort().join("|");
}

function checkActiveCoverage(value, prefix = "") {
  for (const [key, child] of Object.entries(value)) {
    const current = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      checkActiveCoverage(child, current);
      continue;
    }
    if (typeof child !== "string") continue;
    const translated = getValue(activeGujarati, current);
    if (typeof translated !== "string" || !translated.trim()) {
      issues.push(`gu missing active key: ${current}`);
    } else if (placeholders(child) !== placeholders(translated)) {
      issues.push(`gu placeholder mismatch: ${current}`);
    }
  }
}

checkActiveCoverage(activeEnglish);

for (const [localeName, locale] of Object.entries(locales)) {
  for (const pathString of requiredPaths) {
    const value = getValue(locale, pathString);
    if (typeof value !== "string" || value.trim().length === 0) {
      issues.push(`${localeName} missing required key: ${pathString}`);
    }
  }
}

if (issues.length) {
  console.error("Translation check failed.\n");
  for (const issue of issues) {
    console.error(issue);
  }
  process.exit(1);
}

console.log("Required locale keys are present and every active English key has Gujarati text with matching placeholders.");
