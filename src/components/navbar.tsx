import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { TruckIcon } from "lucide-react";
import UserProfile from "./user-profile";
import LanguageSwitcher from "./language-switcher";
import { Locale } from "@/lib/i18n";
import TranslatedNavbar from "./translated-navbar";

export default async function Navbar({ locale = "en" }: { locale?: Locale }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <TranslatedNavbar user={user} initialLocale={locale} />
  );
}
