"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useT } from "@/lib/translations";
import { useTranslation } from "@/lib/i18n";
import { RtlAware, RtlIcon } from "./rtl-aware";
import { CheckCircle2 } from "lucide-react";
import { Locale } from "@/lib/i18n";

export default function TranslatedPricing({ 
  plans, 
  user, 
  locale 
}: { 
  plans: any[];
  user: any;
  locale: Locale;
}) {
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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">{t("home.pricingPlans")}</h1>
        <p className="text-xl text-muted-foreground">
          {/* @ts-ignore */}
          {"Choose the plan that's right for your business"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
              {user ? (
                <form action={`/api/create-checkout?plan=${item.id}`} method="POST">
                  <Button type="submit" className="block text-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    {/* @ts-ignore */}
                    {t("pricing.selectPlan") || "Select Plan"}
                  </Button>
                </form>
              ) : (
                <Link
                  href={localePath("/sign-up")}
                  className="block text-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t("common.signUp")}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
