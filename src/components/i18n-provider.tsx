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

  // Vérifier les préférences de la locale depuis localStorage lors du premier rendu
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem("preferredLocale") as Locale;
      if (savedLocale && locales.includes(savedLocale)) {
        if (savedLocale !== locale) {
          setLocale(savedLocale);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Update document direction when locale changes
    const newDir = getLocaleDirection(locale);
    document.documentElement.dir = newDir;
    document.documentElement.lang = locale;
    setDir(newDir);

    // Ajout d'une classe CSS spécifique au RTL pour le body
    if (newDir === "rtl") {
      document.body.classList.add("rtl");
      document.documentElement.classList.add("rtl-active");
    } else {
      document.body.classList.remove("rtl");
      document.documentElement.classList.remove("rtl-active");
    }

    // Gestion des styles spécifiques au mode RTL dans les éléments d'UI
    const rtlStyleEl = document.getElementById('rtl-dynamic-styles');
    if (newDir === "rtl") {
      // Appliquer des styles dynamiques RTL si nécessaire
      if (!rtlStyleEl) {
        const styleEl = document.createElement('style');
        styleEl.id = 'rtl-dynamic-styles';
        styleEl.textContent = `
          .flex { flex-direction: row-reverse; }
          .space-x-2 > * + * { margin-right: 0.5rem; margin-left: 0; }
          .space-x-4 > * + * { margin-right: 1rem; margin-left: 0; }
        `;
        document.head.appendChild(styleEl);
      }
    } else if (rtlStyleEl) {
      // Supprimer les styles RTL dynamiques si on n'est plus en RTL
      rtlStyleEl.remove();
    }

    // Store the locale preference
    if (typeof window !== 'undefined') {
      localStorage.setItem("preferredLocale", locale);
    }
  }, [locale]);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem("preferredLocale") as Locale;
      if (savedLocale && locales.includes(savedLocale)) {
        setLocale(savedLocale);
      }
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, dir }}>
      {children}
    </I18nContext.Provider>
  );
}
