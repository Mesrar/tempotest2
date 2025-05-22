"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useT } from "@/lib/translations";
import { Locale } from "@/lib/i18n";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface TranslatedSignUpProps {
  locale: Locale;
  signUpAction: any;
}

export default function TranslatedSignUp({ locale, signUpAction }: TranslatedSignUpProps) {
  const { t } = useT();
  const [selectedRole, setSelectedRole] = useState("company"); // Default à 'company'

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
        <form action={signUpAction} className="flex flex-col space-y-6">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="user_role" value={selectedRole} />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">{t("common.signUp")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("auth.haveAccount")}{" "}
              <Link
                className="text-primary font-medium hover:underline transition-all"
                href={localePath("/sign-in")}
              >
                {t("common.signIn")}
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">
                {t("auth.fullName")}
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder={t("auth.fullNamePlaceholder")}
                required
              />
            </div>
            
            {/* Sélection du rôle */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("auth.roleLabel")}
              </Label>
              <RadioGroup 
                defaultValue="company" 
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-secondary/20">
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company" className="flex-1 cursor-pointer">{t("auth.roleCompany")}</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-secondary/20">
                  <RadioGroupItem value="staff" id="staff" />
                  <Label htmlFor="staff" className="flex-1 cursor-pointer">{t("auth.roleStaff")}</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-1">
                {t("auth.roleHelperText")}
              </p>
            </div>
            
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
              <Label htmlFor="password" className="text-sm font-medium">
                {t("auth.password")}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                required
              />
            </div>
          </div>

          <SubmitButton className="w-full">{t("common.signUp")}</SubmitButton>
          <p className="text-center text-xs text-gray-500">
            {t("auth.termsAgreement")}{" "}
            <Link
              href={localePath("/terms")}
              className="text-primary hover:underline"
            >
              {t("auth.terms")}
            </Link>{" "}
            {t("auth.and")}{" "}
            <Link
              href={localePath("/privacy")}
              className="text-primary hover:underline"
            >
              {t("auth.privacy")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
