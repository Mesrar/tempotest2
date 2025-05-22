import { createClient } from "../../../../../../supabase/server";
import { redirect, notFound } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Locale } from "@/lib/i18n";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Clock,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Award,
  Wrench,
  Clock3,
  UserCheck,
  Edit,
  Trash2,
} from "lucide-react";
import CandidatesList from "@/components/candidates-list";

export default async function JobDetailsPage({
  params: { locale, id },
}: {
  params: { locale: Locale; id: string };
}) {
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Link
                  href={`/${locale}/dashboard/jobs`}
                  className="hover:text-blue-600"
                >
                  Jobs
                </Link>
                <span>/</span>
                <span>Details</span>
              </div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
            </div>
            <div className="flex gap-2">
              <Link href={`/${locale}/dashboard/jobs/${id}/edit`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Job Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>
                        {job.job_type
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Start: {formatDate(job.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.duration_days} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.hourly_rate} MAD/hour</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{job.positions_count} positions</span>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(job.status)} capitalize`}>
                  {job.status}
                </Badge>
              </div>
            </div>

            {/* Job Content */}
            <Tabs defaultValue="details" className="w-full">
              <div className="border-b px-6">
                <TabsList className="-mb-px">
                  <TabsTrigger value="details">Job Details</TabsTrigger>
                  <TabsTrigger value="candidates">Candidates</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="details" className="p-6">
                <div className="space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Description
                    </h2>
                    <div className="text-gray-700 whitespace-pre-line">
                      {job.description}
                    </div>
                  </div>

                  {/* Skills and Requirements */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Required Skills */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        Required Skills
                      </h3>
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

                    {/* Required Certifications */}
                    {job.required_certifications &&
                      job.required_certifications.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <Award className="h-5 w-5 text-blue-600" />
                            Required Certifications
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {job.required_certifications.map(
                              (cert: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-green-50"
                                >
                                  {cert}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Additional Requirements */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Equipment Proficiency */}
                    {job.equipment_proficiency &&
                      job.equipment_proficiency.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-blue-600" />
                            Equipment Proficiency
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {job.equipment_proficiency.map(
                              (equip: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-purple-50"
                                >
                                  {equip}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* Experience */}
                    {job.experience_years !== null && (
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                          <Clock3 className="h-5 w-5 text-blue-600" />
                          Experience Required
                        </h3>
                        <p className="text-gray-700">
                          {job.experience_years}{" "}
                          {job.experience_years === 1 ? "year" : "years"}{" "}
                          minimum
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="candidates" className="p-6">
                <CandidatesList jobId={id} locale={locale} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
