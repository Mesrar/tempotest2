// Server-side dictionary function
import { Locale } from "./i18n";
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';
import arTranslations from '@/locales/ar.json';

type TranslationsType = {
  en: typeof enTranslations;
  fr: typeof frTranslations;
  ar: typeof arTranslations;
};

const translations: TranslationsType = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations,
};

export async function getDictionary(locale: Locale) {
  return translations[locale] || translations.en;
}
