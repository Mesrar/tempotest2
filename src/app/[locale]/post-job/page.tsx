import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";
import { InfoIcon } from "lucide-react";
import { Locale } from "@/lib/i18n";
import TranslatedPostJob from "@/components/translated-post-job";

export default async function PostJob({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <TranslatedPostJob locale={locale} userId={user.id} />
    </SubscriptionCheck>
  );
}
