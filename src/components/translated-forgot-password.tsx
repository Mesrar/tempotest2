"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useT } from "@/lib/translations";
import { Locale } from "@/lib/i18n";

interface TranslatedForgotPasswordProps {
  locale: Locale;
  forgotPasswordAction: any;
}

export default function TranslatedForgotPassword({ locale, forgotPasswordAction }: TranslatedForgotPasswordProps) {
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
        <form action={forgotPasswordAction} className="flex flex-col space-y-6">
          <input type="hidden" name="locale" value={locale} />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              {/* @ts-ignore */}
              {t("common.forgotPassword") || "Forgot Password"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {/* @ts-ignore */}
              {"Enter your email and we'll send you a link to reset your password."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {/* @ts-ignore */}
                {t("auth.email") || "Email"}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemple@domaine.com"
                required
                className="border border-input bg-background"
              />
            </div>

            <SubmitButton className="w-full">
              {/* @ts-ignore */}
              {t("common.resetPassword") || "Reset Password"}
            </SubmitButton>
          </div>

          <div className="text-center text-sm">
            <Link href={localePath("/sign-in")} className="text-primary hover:underline">
              {/* @ts-ignore */}
              {"Back to Sign In"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
