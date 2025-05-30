"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useT } from "@/lib/translations";
import { Locale } from "@/lib/i18n";

interface TranslatedSignInProps {
  locale: Locale;
  signInAction: any;
}

export default function TranslatedSignIn({ locale, signInAction }: TranslatedSignInProps) {
  const { t } = useT();

  // Helper pour les chemins avec locale
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <form action={signInAction} className="flex flex-col space-y-6">
          <input type="hidden" name="locale" value={locale} />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">{t("common.signIn")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link
                className="text-primary font-medium hover:underline transition-all"
                href={localePath("/sign-up")}
              >
                {t("common.signUp")}
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t("auth.email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("auth.password")}
                </Label>
                <Link
                  className="text-xs text-primary font-medium hover:underline transition-all"
                  href={localePath("/forgot-password")}
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
                required
              />
            </div>
          </div>

          <SubmitButton className="w-full">{t("common.signIn")}</SubmitButton>
        </form>
      </div>
    </div>
  );
}
