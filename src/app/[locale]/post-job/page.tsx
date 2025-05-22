import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";
import { InfoIcon } from "lucide-react";
import { Locale } from "@/lib/i18n";
import JobPostForm from "@/components/job-post-form";

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
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Post a Job</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Create a new temporary staffing position for your logistics
                operations
              </span>
            </div>
          </header>

          {/* Job Form Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <JobPostForm locale={locale} userId={user.id} />
          </section>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
