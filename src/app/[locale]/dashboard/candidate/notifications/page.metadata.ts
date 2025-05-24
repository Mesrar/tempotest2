import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(locale);
  
  return {
    title: "Paramètres de notification | Logistique Temporaire",
    description: "Gérez vos préférences de notification pour les missions temporaires de logistique et restez informé des opportunités qui correspondent à votre profil.",
  };
}
