"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useT } from "@/lib/translations";
import { useTranslation } from "@/lib/i18n";
import { RtlAware, RtlIcon } from "./rtl-aware";
import { CheckCircle2, Upload, FileText, Clock, Award } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface TranslatedJoinStaffProps {
  locale: Locale;
}

export default function TranslatedJoinStaff({ locale }: TranslatedJoinStaffProps) {
  const { t } = useT();
  const isRtl = locale === "ar";

  // Helper pour les chemins avec locale
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t("forWorkers.createYourProfile")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("forWorkers.joinLogistics")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-start">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold mb-3">{t("forWorkers.flexibleWork")}</h2>
              <p className="text-gray-600 mb-4">
                {t("forWorkers.flexibleWorkDesc")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-start">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold mb-3">{t("forWorkers.legalProtection")}</h2>
              <p className="text-gray-600 mb-4">
                {t("forWorkers.legalProtectionDesc")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-start">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold mb-3">{t("forWorkers.competitivePay")}</h2>
              <p className="text-gray-600 mb-4">
                {t("forWorkers.competitivePayDesc")}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">{t("forWorkers.createProfile")}</h2>
            <div className="mb-8 bg-gray-50 p-4 rounded-md border text-gray-600 text-sm">
              <p>
                {/* @ts-ignore */}
                {"You must create an account to apply for staff positions."}
              </p>
            </div>

            <Link href={localePath("/sign-up")} className="block mb-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                {t("common.signUp")}
              </Button>
            </Link>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  {/* @ts-ignore */}
                  {"OR CONTINUE WITH"}
                </span>
              </div>
            </div>

            <Link href={localePath("/sign-in")} className="block">
              <Button variant="outline" className="w-full">
                {t("common.signIn")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
