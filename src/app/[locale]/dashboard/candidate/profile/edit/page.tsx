import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";
import { EditProfilePageClient } from "@/components/candidate-dashboard/EditProfilePageClient";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <EditProfilePageClient locale={locale} dict={dict} />;
}
