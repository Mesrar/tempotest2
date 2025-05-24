// filepath: /workspaces/tempotest2/src/app/[locale]/dashboard/candidate/jobs/page.tsx
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";
import { JobsPageClient } from "./JobsPageClient";

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  return <JobsPageClient dict={dict} locale={locale} />;
}
