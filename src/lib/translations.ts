"use client";

import { useCallback, useMemo } from "react";
import { useTranslation } from "./i18n";
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';
import arTranslations from '@/locales/ar.json';

type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

export type TranslationKey = NestedKeyOf<typeof enTranslations>;

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

export function useT() {
  const { locale } = useTranslation();

  const t = useCallback(
    (key: TranslationKey) => {
      const keys = key.split(".");
      let result: any = translations[locale] || translations.en;

      for (const k of keys) {
        if (result[k] === undefined) {
          // Fallback to English if the key doesn't exist in the current locale
          result = translations.en;
          for (const fallbackKey of keys) {
            if (result === undefined || result[fallbackKey] === undefined) {
              return key; // Return the key itself as a last resort
            }
            result = result[fallbackKey];
          }
          return result;
        }
        result = result[k];
      }

      return result;
    },
    [locale]
  );

  return { t, locale };
}
