import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import TranslatedDashboard from "@/components/translated-dashboard";

export default async function Dashboard({
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

  // Récupérer les jobs récents
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, status, created_at, skills")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // Récupérer le nombre de jobs actifs
  const { count: activeJobsCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  // Récupérer le nombre de candidatures total
  const { count: applicantsCount } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("employer_id", user.id);

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <TranslatedDashboard 
        locale={locale}
        activeJobsCount={activeJobsCount || 0}
        applicantsCount={applicantsCount || 0}
        jobs={jobs || []}
      />
    </SubscriptionCheck>
  );
}
