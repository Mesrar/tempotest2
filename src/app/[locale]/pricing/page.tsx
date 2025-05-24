import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../../../supabase/server";
import { Locale } from "@/lib/i18n";
import Footer from "@/components/footer";
import TranslatedPricing from "@/components/translated-pricing";

export default async function Pricing({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: plans, error } = await supabase.functions.invoke('supabase-functions-get-plans');
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <Navbar locale={locale} />
            <TranslatedPricing plans={plans || []} user={user} locale={locale} />
            <Footer />
        </div>
    );
}
