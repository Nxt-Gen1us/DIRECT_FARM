import fs from "node:fs";
import path from "node:path";

const localeRoot = path.resolve("src/i18n/locales");
const englishRoot = path.join(localeRoot, "en");
const englishFiles = fs
  .readdirSync(englishRoot)
  .filter((file) => file.endsWith(".ts") && file !== "index.ts");

function loadObject(filePath, prepare = (source) => source) {
  let source = prepare(fs.readFileSync(filePath, "utf8"));
  source = source
    .replace(/^\s*const\s+\w+\s*=\s*/, "")
    .replace(/;\s*export\s+default\s+\w+\s*;?\s*$/g, "")
    .replace(/;\s*$/, "")
    .trim();
  return Function(`return (${source})`)();
}

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

const english = Object.assign(
  {},
  ...englishFiles.map((file) => loadObject(path.join(englishRoot, file))),
);
const legacyGujarati = loadObject(
  path.join(localeRoot, "gu.ts"),
  (source) => source
    .replace(/^import guPages.*\n/, "")
    .replace(/^import guGenerated.*\n/, "")
    .replace(/\nfunction mergeLocale[\s\S]*$/m, ""),
);
const pageGujarati = loadObject(path.join(localeRoot, "guPages.ts"));
const existingGujarati = mergeDeep(legacyGujarati, pageGujarati);
const missing = [];

function flatten(value, prefix = "") {
  for (const [key, child] of Object.entries(value)) {
    const current = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      flatten(child, current);
    } else if (
      typeof child === "string" &&
      typeof current.split(".").reduce((cursor, part) => cursor?.[part], existingGujarati) !== "string"
    ) {
      missing.push({ key: current, value: child });
    }
  }
}

flatten(english);

function setPath(target, keyPath, value) {
  const parts = keyPath.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) cursor = cursor[part] ??= {};
  cursor[parts.at(-1)] = value;
}

function protectPlaceholders(value) {
  const placeholders = [];
  const protectedValue = value.replace(/\{\{[^{}]+\}\}/g, (token) => {
    const marker = `XQZPH${placeholders.length}QZX`;
    placeholders.push([marker, token]);
    return marker;
  });
  return {
    value: protectedValue,
    restore(translated) {
      return placeholders.reduce((result, [marker, token]) => result.replaceAll(marker, token), translated);
    },
  };
}

async function translate(value) {
  const protectedText = protectPlaceholders(value);
  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: "gu",
    dt: "t",
    q: protectedText.value,
  });

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`, {
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`Translation endpoint returned ${response.status}`);
      const result = await response.json();
      const translated = result[0].map((segment) => segment[0]).join("");
      return protectedText.restore(translated);
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 400 * 2 ** attempt));
    }
  }
}

const translatedValues = new Array(missing.length);
const cache = new Map();
let next = 0;

async function worker() {
  while (next < missing.length) {
    const index = next++;
    const phrase = missing[index].value;
    if (!cache.has(phrase)) cache.set(phrase, translate(phrase));
    translatedValues[index] = await cache.get(phrase);
    if ((index + 1) % 100 === 0) console.log(`Translated ${index + 1}/${missing.length}`);
  }
}

await Promise.all(Array.from({ length: 8 }, worker));

const generated = {};
missing.forEach(({ key }, index) => setPath(generated, key, translatedValues[index]));
const destination = path.join(localeRoot, "guGenerated.ts");
const contents = `const guGenerated = ${JSON.stringify(generated, null, 2)};\n\nexport default guGenerated;\n`;
fs.writeFileSync(destination, contents, "utf8");
console.log(`Wrote ${missing.length} Gujarati translations to ${destination}`);