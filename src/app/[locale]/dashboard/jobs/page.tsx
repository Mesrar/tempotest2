import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import Link from "next/link";
import { PlusCircle, Briefcase, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function JobsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  // Fetch job postings for the company
  const { data: jobs, error } = await supabase
    .from("job_postings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "filled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <SubscriptionCheck>
      <DashboardNavbar locale={locale} dict={dict} />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Job Postings</h1>
            <Link href={`/${locale}/dashboard/jobs/post`}>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Post New Job
              </Button>
            </Link>
          </div>

          {jobs && jobs.length > 0 ? (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <Link
                  href={`/${locale}/dashboard/jobs/${job.id}`}
                  key={job.id}
                  className="block hover:shadow-md transition-shadow"
                >
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">
                          {job.title}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.job_type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.duration_days} days</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{job.positions_count} positions</span>
                          </div>
                        </div>
                        <p className="text-gray-600 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColor(job.status)} capitalize`}
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {job.required_skills &&
                          job.required_skills.map(
                            (skill: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-blue-50"
                              >
                                {skill}
                              </Badge>
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-8 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No Job Postings Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't posted any job positions yet. Create your first job
                posting to start finding qualified candidates.
              </p>
              <Link href={`/${locale}/dashboard/jobs/post`}>
                <Button>Post Your First Job</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </SubscriptionCheck>
  );
}
