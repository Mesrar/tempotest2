import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Locale } from "@/lib/i18n";
import JobPostForm from "@/components/job-post-form";

export default async function PostJobPage({
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
      <main className="w-full">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
          <JobPostForm locale={locale} userId={user.id} />
        </div>
      </main>
    </SubscriptionCheck>
  );
}
