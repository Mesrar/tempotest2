"use client";

import Link from "next/link";
import { useT } from "@/lib/translations";
import { useTranslation } from "@/lib/i18n";
import { RtlAware, RtlIcon } from "./rtl-aware";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  UserCheck,
  Clock,
  FileText,
  BarChart,
} from "lucide-react";

interface TranslatedHomepageProps {
  locale: string;
  plans: any[];
}

export default function TranslatedHomepage({ locale, plans }: TranslatedHomepageProps) {
  const { t } = useT();

  // Helper pour les chemins avec locale
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };
  
  const isRtl = locale === "ar";
  
  return (
    <>
      {/* Features Section */}
      <RtlAware className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {t("home.featuresSection")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("home.featuresSectionDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ClipboardCheck className="w-6 h-6" />,
                title: t("home.jobManagement"),
                description: t("home.jobManagementDesc"),
              },
              {
                icon: <UserCheck className="w-6 h-6" />,
                title: t("home.candidateProfiles"),
                description: t("home.candidateProfilesDesc"),
              },
              {
                icon: <BarChart className="w-6 h-6" />,
                title: t("home.aiMatching"),
                description: t("home.aiMatchingDesc"),
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: t("home.contractGeneration"),
                description: t("home.contractGenerationDesc"),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </RtlAware>

      {/* How It Works Section */}
      <RtlAware className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("home.howItWorks")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("home.howItWorksDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.step1")}</h3>
              <p className="text-gray-600">{t("home.step1Desc")}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.step2")}</h3>
              <p className="text-gray-600">{t("home.step2Desc")}</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.step3")}</h3>
              <p className="text-gray-600">{t("home.step3Desc")}</p>
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
              <div className="text-blue-100">Average Staffing Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Verified Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">{t("home.testimonials")}</div>
            </div>
          </div>
        </div>
      </RtlAware>

      {/* Pricing Section */}
      <RtlAware className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {t("home.pricingPlans")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("home.monthlyBilling")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">${item.price}</span>
                    <span className="text-gray-500 ml-1">{t("home.perMonth")}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {item.features?.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={localePath("/pricing")}
                    className="block text-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t("home.getStartedNow")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RtlAware>

      {/* CTA Section */}
      <RtlAware className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t("forEmployers.readyToTransform")}
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("forEmployers.joinLeadingCompanies")}
          </p>
          <Link
            href={localePath("/post-job")}
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("forEmployers.postFirstJob")}
            <RtlIcon>
              <ArrowUpRight className={`${isRtl ? "mr-2" : "ml-2"} w-4 h-4`} />
            </RtlIcon>
          </Link>
        </div>
      </RtlAware>
    </>
  );
}
