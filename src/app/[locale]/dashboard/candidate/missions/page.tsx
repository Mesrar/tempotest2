import { getDictionary } from "@/lib/dictionary";
import { MissionsPageClient } from "@/components/candidate-dashboard/MissionsPageClient";
import { Locale } from "@/lib/i18n";

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <MissionsPageClient locale={locale} dict={dict} />;
}
