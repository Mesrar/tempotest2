import { redirect } from "next/navigation";
import { createClient } from "@/../supabase/server";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/lib/i18n";
import UnifiedCompanyDashboard from "@/components/unified-company-dashboard";
import { getDashboardData } from "@/app/actions";

export default async function CompanyDashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  // Get unified dashboard data
  const userRole = user.user_metadata?.role || 'company';
  const dashboardData = await getDashboardData(userRole, user.id);

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Accès refusé</h2>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à ce tableau de bord.
          </p>
        </div>
      </div>
    );
  }

  // Type guard to ensure we have company dashboard data
  const isCompanyData = (data: any): data is { jobs: any[]; activeJobsCount: number; applicantsCount: number } => {
    return 'jobs' in data && 'activeJobsCount' in data && 'applicantsCount' in data;
  };

  if (!isCompanyData(dashboardData)) {
    return redirect(`/${locale}/dashboard/candidate`);
  }

  return (
    <UnifiedCompanyDashboard
      activeJobsCount={dashboardData.activeJobsCount || 0}
      applicantsCount={dashboardData.applicantsCount || 0}
      jobs={dashboardData.jobs || []}
      locale={locale}
      userRole={userRole}
      userId={user.id}
    />
  );
}