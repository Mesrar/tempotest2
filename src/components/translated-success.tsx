"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useT } from "@/lib/translations";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TranslatedSuccess({ locale }: { locale: string }) {
  const { t } = useT();

  // Helper pour les chemins avec locale
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">{t("payments.successful")}</CardTitle>
          <CardDescription>
            {t("payments.successMessage")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-muted-foreground">
            {t("payments.emailConfirmation")}
          </p>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href={localePath("/dashboard")}>{t("common.dashboard")}</Link>
            </Button>
            <Button asChild>
              <Link href={localePath("/")}>{t("common.returnHome")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
