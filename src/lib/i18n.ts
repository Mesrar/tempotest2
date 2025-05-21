import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export type Locale = "en" | "ar" | "fr";
export const locales: Locale[] = ["en", "ar", "fr"];

export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const getLocaleFromPathname = useCallback(() => {
    if (!pathname) return "en";
    const segments = pathname.split("/");
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      return segments[1] as Locale;
    }
    return "en";
  }, [pathname]);

  const [locale, setLocale] = useState<Locale>(getLocaleFromPathname());

  // Update locale when pathname changes
  useEffect(() => {
    setLocale(getLocaleFromPathname());
  }, [pathname, getLocaleFromPathname]);

  // Change locale
  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return;

      // Get the path without the locale prefix
      let newPath = pathname || "/";
      const segments = newPath.split("/");

      if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
        // Replace the locale segment
        segments[1] = newLocale;
        newPath = segments.join("/");
      } else {
        // Add locale to path
        newPath = `/${newLocale}${newPath.startsWith("/") ? newPath : `/${newPath}`}`;
      }

      // Navigate to the new path
      router.push(newPath);
      setLocale(newLocale);

      // Store the locale preference
      localStorage.setItem("preferredLocale", newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = getLocaleDirection(newLocale);
    },
    [locale, pathname, router],
  );

  return {
    locale,
    changeLocale,
    locales,
    dir: getLocaleDirection(locale),
  };
}

export function useClientTranslation() {
  const [mounted, setMounted] = useState(false);
  const translation = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    ...translation,
    isClient: mounted,
  };
}
