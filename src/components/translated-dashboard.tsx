"use client";

import Link from "next/link";
import { useT } from "@/lib/translations";
import { useTranslation } from "@/lib/i18n";
import { RtlAware, RtlIcon } from "./rtl-aware";
import {
  InfoIcon,
  UserCircle,
  ClipboardCheck,
  UserCheck,
  Briefcase,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
  skills: string[];
}

export default function TranslatedDashboard({ 
  activeJobsCount, 
  applicantsCount, 
  jobs 
}: { 
  activeJobsCount: number;
  applicantsCount: number;
  jobs: Job[];
}) {
  const { t } = useT();
  const { locale } = useTranslation();

  // Helper pour les chemins avec locale
  const localePath = (path: string) => {
    if (path.startsWith("/")) {
      return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
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
    <main className="w-full">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header Section */}
        <RtlAware className="bg-card rounded-xl p-6 border shadow-sm">
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">LogiStaff</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                {t("dashboard.welcome")}
              </span>
            </div>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  {t("dashboard.activeJobs")}
                </h3>
                <div className="bg-green-100 p-2 rounded-full">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{activeJobsCount}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("home.jobManagement")}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  {t("dashboard.applicants")}
                </h3>
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{applicantsCount}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("home.candidateProfiles")}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                  {t("dashboard.avgResponseTime")}
                </h3>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">24h</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("dashboard.averageCandidateResponse")}
              </p>
            </div>
          </div>
        </RtlAware>

        {/* Recent Jobs Section */}
        <RtlAware className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl">{t("dashboard.recentJobPostings")}</h2>
            <Link
              href={localePath("/dashboard/jobs")}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
            >
              {t("dashboard.viewAllJobs")}
              <RtlIcon>
                <ArrowUpRight className="w-4 h-4" />
              </RtlIcon>
            </Link>
          </div>

          {jobs && jobs.length > 0 ? (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/${locale}/dashboard/jobs/${job.id}`}
                  className="block bg-white border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-medium">{job.title}</h3>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={getStatusClass(job.status)}
                        >
                          {job.status}
                        </Badge>
                      </div>

                      <div className="flex gap-1 mt-3 flex-wrap">
                        {job.skills &&
                          job.skills.map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-blue-50"
                            >
                              {skill}
                            </Badge>
                          ))}
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
                {t("dashboard.noJobsYet")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("forEmployers.postJobDesc")}
              </p>
              <Link href={`/${locale}/dashboard/jobs/post`}>
                <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                  {t("common.postJob")}
                </div>
              </Link>
            </div>
          )}
        </RtlAware>

        {/* Quick Actions */}
        <RtlAware className="bg-card rounded-xl p-6 border shadow-sm">
          <h2 className="font-semibold text-xl mb-5">{t("dashboard.quickActions")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href={localePath("/dashboard/jobs/post")}
              className="flex gap-3 items-center p-4 bg-white rounded-lg border hover:shadow-sm hover:border-blue-300 transition-all"
            >
              <div className="bg-green-100 p-2 rounded-full">
                <ClipboardCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">{t("dashboard.postNewJob")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("forEmployers.postJobDesc")}
                </p>
              </div>
            </Link>

            <Link
              href={localePath("/dashboard/candidates")}
              className="flex gap-3 items-center p-4 bg-white rounded-lg border hover:shadow-sm hover:border-blue-300 transition-all"
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">{t("dashboard.manageJobsCandidates")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.browseCandidates")}
                </p>
              </div>
            </Link>
          </div>
        </RtlAware>
      </div>
    </main>
  );
}
