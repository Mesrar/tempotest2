"use client";

import Link from "next/link";
import { useT } from "@/lib/translations";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { Locale } from "@/lib/i18n";

interface TranslatedHeroProps {
  locale: Locale;
}

export default function TranslatedHero({ locale }: TranslatedHeroProps) {
  const { t } = useT();
  
  // Helper pour les chemins avec locale
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };
  
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Arrière-plan avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {t("common.aiPowered")}
              </span>{" "}
              {t("common.logisticsStaffing")}
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("home.heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={localePath("/post-job")}
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                {t("common.postJob")}
                <ArrowUpRight className={`${locale === "ar" ? "mr-2 rtl-mirror" : "ml-2"} w-5 h-5`} />
              </Link>

              <Link
                href={localePath("/join-staff")}
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                {t("common.joinStaff")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
