"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { Locale, getLocaleDirection, locales } from "@/lib/i18n";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
};

export const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  dir: "ltr",
});

export default function I18nProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [dir, setDir] = useState<"ltr" | "rtl">(
    getLocaleDirection(initialLocale),
  );

  useEffect(() => {
    // Update document direction when locale changes
    const newDir = getLocaleDirection(locale);
    document.documentElement.dir = newDir;
    document.documentElement.lang = locale;
    setDir(newDir);
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, dir }}>
      {children}
    </I18nContext.Provider>
  );
}
