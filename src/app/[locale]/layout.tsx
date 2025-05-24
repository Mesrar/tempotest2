import { Locale } from "@/lib/i18n";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "LogiStaff - Temporary Logistics Staffing",
  description: "AI-Powered Temporary Logistics Staffing Platform for Morocco",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <>{children}</>;
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }, { locale: "fr" }];
}
