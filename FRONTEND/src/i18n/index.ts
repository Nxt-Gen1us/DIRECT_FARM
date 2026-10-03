import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/index";
import hi from "./locales/hi";
import gu from "./locales/gu";
import { landingRedesign } from "./landingRedesign";
import { authRedesign } from "./authRedesign";
import { workspaceGujarati } from "./workspaceGujarati";
import { adminCrudTranslations } from "./adminCrud";
import { adminDataTranslations } from "./adminData";
import { marketRedesign } from "./marketRedesign";

function repairLocaleEncoding<T>(value: T): T {
  if (typeof value === "string" && /(?:à.|â.|Ã.|ð.)/.test(value)) {
    try {
      return decodeURIComponent(escape(value)) as T;
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.map((item) => repairLocaleEncoding(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, repairLocaleEncoding(child)])) as T;
  }
  return value;
}

const repairedHindi = repairLocaleEncoding(hi);
const repairedGujarati = repairLocaleEncoding(gu);
const repairedAuthGujarati = repairLocaleEncoding(authRedesign.gu);
const repairedAuthHindi = repairLocaleEncoding(authRedesign.hi);
const repairedLandingGujarati = repairLocaleEncoding(landingRedesign.gu);
const repairedLandingHindi = repairLocaleEncoding(landingRedesign.hi);
const repairedWorkspaceGujarati = repairLocaleEncoding(workspaceGujarati);

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { ...en, adminUi: adminCrudTranslations.en.adminUi, adminData: adminDataTranslations.en, marketplaceUi: marketRedesign.en.marketplaceUi, landing: landingRedesign.en } },
      hi: {
        translation: {
          ...repairedHindi,
          roles: repairedAuthHindi.roles,
          langShort: repairedAuthHindi.langShort,
          foundation: { ...(repairedHindi as { foundation?: Record<string, unknown> }).foundation, ...repairedAuthHindi.foundation },
          auth: repairedAuthHindi.auth,
          register: repairedAuthHindi.register,
          landing: repairedLandingHindi,
          adminUi: adminCrudTranslations.hi.adminUi,
          adminData: adminDataTranslations.hi,
          marketplaceUi: marketRedesign.hi.marketplaceUi,
        },
      },
      gu: {
        translation: {
          ...repairedGujarati,
          nav: { ...gu.nav, ...repairedWorkspaceGujarati.nav },
          common: { ...gu.common, ...repairedWorkspaceGujarati.common },
          farmerNav: repairedWorkspaceGujarati.farmerNav,
          farmerHeader: repairedWorkspaceGujarati.farmerHeader,
          desk: { ...gu.desk, ...repairedWorkspaceGujarati.desk },
          admin: { ...gu.admin, ...repairedWorkspaceGujarati.admin },
          roles: repairedAuthGujarati.roles,
          langShort: repairedAuthGujarati.langShort,
          foundation: { ...repairedGujarati.foundation, ...repairedAuthGujarati.foundation },
          auth: repairedAuthGujarati.auth,
          register: repairedAuthGujarati.register,
          landing: repairedLandingGujarati,
          adminUi: adminCrudTranslations.gu.adminUi,
          adminData: adminDataTranslations.gu,
          marketplaceUi: marketRedesign.gu.marketplaceUi,
        },
      },
    },
    lng: "gu",
    fallbackLng: "gu",
    supportedLngs: ["en", "hi", "gu"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })
  .then(() => {
    applyDocumentLang(i18n.resolvedLanguage ?? "en");
  });

i18n.on("languageChanged", (lng) => {
  applyDocumentLang(lng);
});

function applyDocumentLang(lng: string) {
  const lang = lng.startsWith("hi") ? "hi" : lng.startsWith("gu") ? "gu" : "en";
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  const title = i18n.t("docTitle");
  if (title && title !== "docTitle") document.title = title;
}

export default i18n;
