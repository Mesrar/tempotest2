import TranslatedHero from "./translated-hero";
import { Locale } from "@/lib/i18n";

interface HeroProps {
  locale: Locale;
}

export default function Hero({ locale }: HeroProps) {
  // Use the client component for translations that will change with language selection
  return <TranslatedHero locale={locale} />;
}
