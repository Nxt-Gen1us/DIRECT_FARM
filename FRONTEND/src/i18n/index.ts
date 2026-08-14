import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/index";
import hi from "./locales/hi/index";
import gu from "./locales/gu/index";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
    },
    fallbackLng: "en",
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
