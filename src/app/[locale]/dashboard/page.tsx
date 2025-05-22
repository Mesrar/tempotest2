import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  ClipboardCheck,
  UserCheck,
  Briefcase,
  Clock,
} from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";

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

  // Fetch recent job postings
  const { data: recentJobs } = await supabase
    .from("job_postings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch candidate counts for active jobs
  const { data: activeJobs } = await supabase
    .from("job_postings")
    .select("id, title")
    .eq("status", "active")
    .limit(5);

  const jobIds = activeJobs?.map((job) => job.id) || [];

  // Get candidate counts for each job
  const candidateCounts = [];

  // Fetch counts for each job individually
  for (const jobId of jobIds) {
    const { count } = await supabase
      .from("job_candidates")
      .select("*", { count: "exact" })
      .eq("job_id", jobId);

    if (count !== null) {
      candidateCounts.push({ job_id: jobId, count });
    }
  }

  // Create a map of job_id to candidate count
  const candidateCountMap = (candidateCounts || []).reduce(
    (acc, item) => {
      acc[item.job_id] = item.count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to your LogiStaff dashboard. Manage your temporary
                staffing needs here.
              </span>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  Active Jobs
                </h3>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">
                {activeJobs?.length || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Currently active job postings
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  Matched Candidates
                </h3>
                <div className="bg-green-100 p-2 rounded-full">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">
                {Object.values(candidateCountMap).reduce(
                  (sum, count) => sum + count,
                  0,
                )}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total candidates matched to your jobs
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  Avg. Response Time
                </h3>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">24h</p>
              <p className="text-sm text-gray-500 mt-1">
                Average candidate response time
              </p>
            </div>
          </div>

          {/* Recent Jobs Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">Recent Job Postings</h2>
              <Link
                href={`/${locale}/dashboard/jobs`}
                className="text-sm text-blue-600 hover:underline"
              >
                View All Jobs
              </Link>
            </div>

            {recentJobs && recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/${locale}/dashboard/jobs/${job.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.positions_count} positions</span>
                          </div>
                        </div>
                        <Badge
                          className={`${job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100"} capitalize`}
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No job postings yet</p>
              </div>
            )}
          </section>

          {/* Quick Actions Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <h2 className="font-semibold text-xl mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href={`/${locale}/dashboard/jobs/post`}
                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-100 flex items-center gap-3 transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Post a New Job</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a new temporary staffing position
                  </p>
                </div>
              </Link>
              <Link
                href={`/${locale}/dashboard/jobs`}
                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-100 flex items-center gap-3 transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Jobs & Candidates</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse matched candidates for your jobs
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
