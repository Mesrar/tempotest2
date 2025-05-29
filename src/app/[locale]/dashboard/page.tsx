import { redirect } from "next/navigation";
import { createClient } from "@/../supabase/server";
import { Locale } from "@/lib/i18n";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  // Redirect to appropriate dashboard based on user role
  const userRole = user.user_metadata?.role;
  
  switch (userRole) {
    case 'staff':
    case 'candidate':
    case 'worker':
      return redirect(`/${locale}/dashboard/candidate`);
    case 'company':
      return redirect(`/${locale}/dashboard/company`);
    case 'admin':
      return redirect(`/${locale}/dashboard/admin`);
    default:
      // Default to company dashboard for unknown roles
      return redirect(`/${locale}/dashboard/company`);
  }
}
