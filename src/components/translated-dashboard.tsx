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
  Users,
  TrendingUp,
  Building2,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import StaffingManagement from "./staffing-management";

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
  skills: string[] | null; // Peut être null lorsqu'adapté depuis required_skills
  required_skills?: string[] | null; // Champ original de la base de données
}

export default function TranslatedDashboard({ 
  activeJobsCount, 
  applicantsCount, 
  jobs,
  locale,
  userRole,
  userId
}: { 
  activeJobsCount: number;
  applicantsCount: number;
  jobs: Job[];
  locale: string;
  userRole?: string;
  userId?: string;
}) {
  const { t } = useT();

  // Fonction utilitaire pour obtenir les compétences d'un job en gérant différentes structures possibles
  const getJobSkills = (job: Job): string[] => {
    if (job.skills && Array.isArray(job.skills)) {
      return job.skills;
    }
    if (job.required_skills && Array.isArray(job.required_skills)) {
      return job.required_skills;
    }
    return [];
  };

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

  // Afficher un tableau de bord spécifique pour le personnel
  if (userRole === 'staff') {
    return (
      <main className="min-h-screen bg-muted/40 pb-10">
        <div className="bg-background py-4 shadow-sm border-b mb-6">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">LogiStaff Dashboard</h1>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Staff</Badge>
            </div>
            <p className="text-muted-foreground">Bienvenue sur votre tableau de bord Staff LogiStaff</p>
          </div>
        </div>
        
        <div className="container max-w-5xl mx-auto px-4">
          {/* Header Section avec design similaire au candidate dashboard */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Bonjour, Staff 👋</h1>
                  <div className="text-gray-600 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    Disponible pour missions
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Link href={localePath("/dashboard/jobs/available")}>
                  <Button className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Voir les missions
                  </Button>
                </Link>
                <Link href={localePath("/dashboard/profile")}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Mon profil
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Overview dans une grille similaire au candidate dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Missions Disponibles</p>
                    <p className="text-2xl font-bold text-green-600">{activeJobsCount}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Offres correspondant à votre profil
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Missions Complétées</p>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Missions terminées avec succès
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Évaluation</p>
                    <p className="text-2xl font-bold text-yellow-600">N/A</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Note moyenne basée sur vos missions
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Candidatures</p>
                    <p className="text-2xl font-bold text-purple-600">{applicantsCount}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Candidatures soumises
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides dans le style du candidate dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href={localePath("/dashboard/jobs/available")}
                  className="flex gap-3 items-center p-4 bg-white rounded-lg border hover:shadow-sm hover:border-blue-300 transition-all"
                >
                  <div className="bg-green-100 p-2 rounded-full">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Trouver des Missions</h3>
                    <p className="text-sm text-muted-foreground">
                      Parcourir les offres d'emploi disponibles
                    </p>
                  </div>
                </Link>

                <Link
                  href={localePath("/dashboard/profile")}
                  className="flex gap-3 items-center p-4 bg-white rounded-lg border hover:shadow-sm hover:border-blue-300 transition-all"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <UserCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Mettre à jour mon Profil</h3>
                    <p className="text-sm text-muted-foreground">
                      Ajouter des compétences et expériences
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Missions Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucune mission récente</p>
                  <p className="text-sm">Vos missions apparaîtront ici</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }
  
  // Tableau de bord pour les entreprises - layout aligné avec le candidate dashboard
  return (
    <main className="min-h-screen bg-muted/40 pb-10">
      <div className="bg-background py-4 shadow-sm border-b mb-6">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Company Dashboard</h1>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">Entreprise</Badge>
          </div>
          <p className="text-muted-foreground">{t("dashboard.welcome")}</p>
        </div>
      </div>
      
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header Section similaire au candidate dashboard */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bonjour, Entreprise 👋</h1>
                <div className="text-gray-600 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Compte actif
                  {activeJobsCount > 0 && (
                    <Badge variant="default" className="ml-2">{activeJobsCount} offres actives</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Link href={localePath("/dashboard/jobs/post")}>
                <Button className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Publier une offre
                </Button>
              </Link>
              <Link href={localePath("/dashboard/candidates")}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Voir les candidats
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview dans une grille comme le candidate dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("dashboard.activeJobs")}</p>
                  <p className="text-2xl font-bold text-green-600">{activeJobsCount}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t("home.jobManagement")}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("dashboard.applicants")}</p>
                  <p className="text-2xl font-bold text-blue-600">{applicantsCount}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t("home.candidateProfiles")}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t("dashboard.avgResponseTime")}</p>
                  <p className="text-2xl font-bold text-purple-600">24h</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t("dashboard.averageCandidateResponse")}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
                  <p className="text-2xl font-bold text-orange-600">95%</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Offres pourvues avec succès
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Staffing Management Component - NEW */}
        <div className="mb-6">
          <StaffingManagement locale={locale} />
        </div>

        {/* Layout en grille comme le candidate dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Jobs Section avec design amélioré */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {t("dashboard.recentJobPostings")}
                  </CardTitle>
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
              </CardHeader>
              <CardContent className="space-y-4">
                {jobs && jobs.length > 0 ? (
                  jobs.map((job) => (
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
                            {getJobSkills(job).map((skill, idx) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">{t("dashboard.noJobsYet")}</p>
                    <p className="text-sm mb-4">{t("forEmployers.postJobDesc")}</p>
                    <Link href={`/${locale}/dashboard/jobs/post`}>
                      <Button>
                        {t("common.postJob")}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5" />
                  {t("dashboard.quickActions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>

            {/* Company Profile compact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Profil Entreprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                  <div>
                    <h3 className="font-semibold">Votre Entreprise</h3>
                    <p className="text-sm text-gray-600">Secteur Logistique</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Offres actives</span>
                    <span className="font-semibold">{activeJobsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Candidatures reçues</span>
                    <span className="font-semibold">{applicantsCount}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Gérer le profil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
