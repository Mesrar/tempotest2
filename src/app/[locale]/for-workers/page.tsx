import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TranslatedForWorkers from "@/components/translated-for-workers";
import { createClient } from "../../../../supabase/server";
import { Locale } from "@/lib/i18n";

export default async function ForWorkers({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar locale={locale} />
      <TranslatedForWorkers />
      <Footer />
    </div>
  );
}
