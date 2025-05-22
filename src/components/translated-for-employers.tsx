"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useT } from "@/lib/translations";
import {
  CheckCircle2,
  ClipboardCheck,
  UserCheck,
  BarChart,
  FileText,
  TruckIcon,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { RtlAware, RtlIcon } from "./rtl-aware";

export default function TranslatedForEmployers() {
  const { t } = useT();
  const { locale } = useTranslation();

  // Helper pour les chemins avec locale
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };

  const isRtl = locale === "ar";
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main>
        {/* Hero Section */}
        <RtlAware className="relative py-20 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t("forEmployers.heroTitle")}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("forEmployers.heroSubtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={localePath("/post-job")}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {t("common.postJob")}
                  </Button>
                </Link>
                <Link href={localePath("/sign-in")}>
                  <Button size="lg" variant="outline">
                    {t("common.signIn")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </RtlAware>

        {/* Benefits Section */}
        <RtlAware className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {t("forEmployers.benefitsTitle")}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forEmployers.fastMatching")}</h3>
                <p className="text-gray-600">
                  {t("forEmployers.fastMatchingDesc")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forEmployers.qualityControl")}</h3>
                <p className="text-gray-600">
                  {t("forEmployers.qualityControlDesc")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forEmployers.legalCompliance")}</h3>
                <p className="text-gray-600">
                  {t("forEmployers.legalComplianceDesc")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <BarChart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forEmployers.costEfficient")}</h3>
                <p className="text-gray-600">
                  {t("forEmployers.costEfficientDesc")}
                </p>
              </div>
            </div>
          </div>
        </RtlAware>

        {/* How It Works Section */}
        <RtlAware className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                {t("forEmployers.howItWorksTitle")}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t("home.howItWorksDesc")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-sm relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forEmployers.postJob")}</h3>
                <p className="text-gray-600">
                  {t("forEmployers.postJobDesc")}
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("forEmployers.aiMatches")}
                </h3>
                <p className="text-gray-600">
                  {t("forEmployers.aiMatchesDesc")}
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forEmployers.hireAndOnboard")}</h3>
                <p className="text-gray-600">
                  {t("forEmployers.hireAndOnboardDesc")}
                </p>
              </div>
            </div>
          </div>
        </RtlAware>
        
        {/* Stats Section */}
        <RtlAware className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">24h</div>
                <div className="text-blue-100">{t("home.step3Desc")}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">{t("dashboard.applicants")}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-blue-100">{t("home.testimonials")}</div>
              </div>
            </div>
          </div>
        </RtlAware>

        {/* CTA Section */}
        <RtlAware className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              {t("forEmployers.readyToTransform")}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t("forEmployers.joinLeadingCompanies")}
            </p>
            <Link href={localePath("/post-job")} className="inline-flex items-center px-6 py-3 text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors">
              {t("forEmployers.postFirstJob")}
              <RtlIcon>
                <ArrowUpRight className={`${isRtl ? "mr-2" : "ml-2"} w-4 h-4`} />
              </RtlIcon>
            </Link>
          </div>
        </RtlAware>
      </main>
    </div>
  );
}
