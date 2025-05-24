import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TranslatedHomepage from "@/components/translated-homepage";
import { createClient } from "../../../supabase/server";
import { Locale } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar locale={locale} />
      <Hero locale={locale} />
      <TranslatedHomepage locale={locale} plans={plans || []} />
      <Footer />
    </div>
  );
}
