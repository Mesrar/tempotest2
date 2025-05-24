import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { Locale } from "@/lib/i18n";
import TranslatedSuccess from "@/components/translated-success";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <>
      <Navbar locale={locale} />
      <TranslatedSuccess locale={locale} />
    </>
  );
}
