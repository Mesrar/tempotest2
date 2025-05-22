"use client";

import { useTranslation } from "@/lib/i18n";
import { useT } from "@/lib/translations";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useTranslation();
  const { t } = useT();

  // Déterminer si la langue actuelle est RTL
  const isRtl = locale === "ar";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"} className={`[&>*]:${isRtl ? 'rtl' : 'ltr'}`}>
        <DropdownMenuItem
          onClick={() => changeLocale("en")}
          className={locale === "en" ? "bg-gray-100" : ""}
        >
          {t("language.english")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLocale("ar")}
          className={locale === "ar" ? "bg-gray-100" : ""}
        >
          {t("language.arabic")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLocale("fr")}
          className={locale === "fr" ? "bg-gray-100" : ""}
        >
          {t("language.french")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
