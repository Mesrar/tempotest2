import { createClient } from "../../../../../../../supabase/server";
import { redirect, notFound } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Locale } from "@/lib/i18n";
import JobEditForm from "@/components/job-edit-form";
import { getDictionary } from "@/lib/dictionary";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  // Fetch job details
  const { data: job, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    return notFound();
  }

  // Check if the job belongs to the current user
  if (job.company_id !== user.id) {
    return redirect(`/${locale}/dashboard/jobs`);
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar locale={locale} dict={dict} />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Edit Job Posting</h1>
          <JobEditForm locale={locale} job={job} />
        </div>
      </main>
    </SubscriptionCheck>
  );
}
