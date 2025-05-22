"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useT } from "@/lib/translations";
import {
  CheckCircle2,
  Clock,
  Award,
  FileText,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { RtlAware, RtlIcon } from "./rtl-aware";

export default function TranslatedForWorkers() {
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
                {t("forWorkers.heroTitle")}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("forWorkers.heroSubtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href={localePath("/join-staff")}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {t("common.joinStaff")}
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
              {t("forWorkers.benefitsTitle")}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forWorkers.flexibleWork")}</h3>
                <p className="text-gray-600">
                  {t("forWorkers.flexibleWorkDesc")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forWorkers.competitivePay")}</h3>
                <p className="text-gray-600">
                  {t("forWorkers.competitivePayDesc")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forWorkers.legalProtection")}</h3>
                <p className="text-gray-600">
                  {t("forWorkers.legalProtectionDesc")}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("forWorkers.skillDevelopment")}</h3>
                <p className="text-gray-600">
                  {t("forWorkers.skillDevelopmentDesc")}
                </p>
              </div>
            </div>
          </div>
        </RtlAware>

        {/* How It Works Section */}
        <RtlAware className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {t("forWorkers.howItWorksTitle")}
            </h2>

            <div className="max-w-5xl mx-auto">
              <div className="relative border-l-4 border-blue-600 ml-4 md:ml-6 pl-8 pb-12">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex md:justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10 absolute -left-4">
                      1
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold mb-2">
                      {t("forWorkers.createProfile")}
                    </h3>
                    <p className="text-gray-600">
                      {t("forWorkers.createProfileDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative border-l-4 border-blue-600 ml-4 md:ml-6 pl-8 pb-12">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex md:justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10 absolute -left-4">
                      2
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold mb-2">
                      {t("forWorkers.getVerified")}
                    </h3>
                    <p className="text-gray-600">
                      {t("forWorkers.getVerifiedDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative border-l-4 border-blue-600 ml-4 md:ml-6 pl-8 pb-12">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex md:justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10 absolute -left-4">
                      3
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold mb-2">
                      {t("forWorkers.receiveMatches")}
                    </h3>
                    <p className="text-gray-600">
                      {t("forWorkers.receiveMatchesDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative border-l-4 border-blue-600 ml-4 md:ml-6 pl-8 pb-12">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex md:justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10 absolute -left-4">
                      4
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold mb-2">
                      {t("forWorkers.acceptOffers")}
                    </h3>
                    <p className="text-gray-600">
                      {t("forWorkers.acceptOffersDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative ml-4 md:ml-6 pl-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex md:justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10 absolute -left-4">
                      5
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-semibold mb-2">
                      {t("forWorkers.buildReputation")}
                    </h3>
                    <p className="text-gray-600">
                      {t("forWorkers.buildReputationDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RtlAware>

        {/* Testimonials Section */}
        <RtlAware className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {t("forWorkers.testimonials")}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold">Mohammed L.</h4>
                    <p className="text-sm text-gray-500">Logistics Assistant</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I've found multiple short-term positions that fit perfectly around my studies. The platform makes the job search process easy and transparent."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    F
                  </div>
                  <div>
                    <h4 className="font-semibold">Fatima R.</h4>
                    <p className="text-sm text-gray-500">Warehouse Supervisor</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The verification process helped me stand out, and I've received consistent work opportunities."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    Y
                  </div>
                  <div>
                    <h4 className="font-semibold">Youssef A.</h4>
                    <p className="text-sm text-gray-500">Forklift Operator</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The contracts are always clear and payment is reliable. I appreciate how the platform protects workers' rights."
                </p>
              </div>
            </div>
          </div>
        </RtlAware>

        {/* CTA Section */}
        <RtlAware className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              {t("forWorkers.readyToFind")}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t("forWorkers.joinLogistics")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={localePath("/join-staff")}>
                <Button size="lg" variant="secondary">
                  {t("forWorkers.createYourProfile")}
                </Button>
              </Link>
              <Link href={localePath("/sign-in")}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                >
                  {t("common.signIn")}
                </Button>
              </Link>
            </div>
          </div>
        </RtlAware>
      </main>
    </div>
  );
}
