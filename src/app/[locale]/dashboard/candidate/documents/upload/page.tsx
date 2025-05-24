import { getDictionary } from "@/lib/dictionary";
import { DocumentUploadPageClient } from "@/components/candidate-dashboard/DocumentUploadPageClient";
import { Locale } from "@/lib/i18n";

export default async function TranslatedDocumentUploader({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <DocumentUploadPageClient locale={locale} dict={dict} />;
}
