import { useTranslation } from "react-i18next";
import type { Language } from "../lib/types";

export const languages: Language[] = ["en", "hi", "gu"];

export function useLanguage() {
  const { i18n } = useTranslation();
  const language = (i18n.resolvedLanguage ?? "en") as Language;

  const setLanguage = (next: Language) => {
    void i18n.changeLanguage(next);
  };

  return { language, setLanguage, languages };
}
