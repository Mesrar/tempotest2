"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { TruckIcon } from "lucide-react";
import UserProfile from "./user-profile";
import LanguageSwitcher from "./language-switcher";
import { Locale } from "@/lib/i18n";
import { useT } from "@/lib/translations";
import { User } from "@supabase/supabase-js";

export default function TranslatedNavbar({ 
  user, 
  initialLocale = "en" 
}: { 
  user: User | null;
  initialLocale?: Locale;
}) {
  const { t, locale } = useT();

  // Helper function to prepend locale to URL
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };

  return (
    <nav dir={locale === "ar" ? "rtl" : "ltr"} className="w-full border-b border-gray-200 bg-white py-2">
      <div className={`container mx-auto px-4 flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} justify-between items-center`}>
        <Link
          href={localePath("/")}
          prefetch
          className="text-xl font-bold flex items-center"
        >
          <TruckIcon className={`h-6 w-6 text-blue-600 ${locale === "ar" ? "ml-2" : "mr-2"}`} />
          <span>LogiStaff</span>
        </Link>

        <div className={`hidden md:flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} gap-6`}>
          <Link
            href={localePath("/#features")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {t("common.features")}
          </Link>
          <Link
            href={localePath("/#pricing")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {t("common.pricing")}
          </Link>
          <Link
            href={localePath("/for-employers")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {t("common.forEmployers")}
          </Link>
          <Link
            href={localePath("/for-workers")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {t("common.forWorkers")}
          </Link>
        </div>

        <div className={`flex ${locale === "ar" ? "flex-row-reverse" : "flex-row"} gap-4 items-center`}>
          <LanguageSwitcher />

          {user ? (
            <>
              <Link
                href={localePath("/dashboard")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button dir={locale === "ar" ? "rtl" : "ltr"}>{t("common.dashboard")}</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href={localePath("/sign-in")}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {t("common.signIn")}
              </Link>
              <Link
                href={localePath("/sign-up")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                {t("common.signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
