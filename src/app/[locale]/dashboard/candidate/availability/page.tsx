import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";

export default async function TranslatedAvailabilityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Disponibilités</h1>
      <p>Availability page for locale: {locale}</p>
    </div>
  );
}
