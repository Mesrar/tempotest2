"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  Briefcase, 
  UserCheck, 
  Plus,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  FileText,
  Calendar,
  TrendingUp
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StaffingManagement from "@/components/staffing-management";

interface Job {
  id: string;
  title: string;
  location: string;
  status: 'active' | 'pending' | 'filled' | 'closed';
  applications: number;
  created_at: string;
  hourly_rate?: number;
  required_skills?: string[];
}

interface CompanyDashboardProps {
  activeJobsCount: number;
  applicantsCount: number;
  jobs: Job[];
  locale: string;
  userRole?: string;
  userId?: string;
}

export default function UnifiedCompanyDashboard({ 
  activeJobsCount, 
  applicantsCount, 
  jobs,
  locale,
  userRole,
  userId
}: CompanyDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const localePath = (path: string) => `/${locale}${path}`;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case "filled":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pourvu</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Fermé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-muted/40 pb-10">
      {/* Header */}
      <div className="bg-background py-6 shadow-sm border-b mb-6">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tableau de Bord Entreprise</h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos offres d'emploi et votre équipe logistique
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href={localePath("/dashboard/company/jobs/new")}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Publier une offre
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
            <TabsTrigger value="staff">Gestion équipe</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Offres actives</p>
                      <p className="text-2xl font-bold text-blue-600">{activeJobsCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">+2 cette semaine</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Candidatures</p>
                      <p className="text-2xl font-bold text-green-600">{applicantsCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Nouveaux candidats</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Équipe active</p>
                      <p className="text-2xl font-bold text-purple-600">23</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Employés en mission</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Performance</p>
                      <p className="text-2xl font-bold text-orange-600">92%</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Taux de satisfaction</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    href={localePath("/dashboard/company/jobs/new")}
                    className="flex gap-3 items-center p-4 bg-white rounded-lg border hover:shadow-sm hover:border-blue-300 transition-all"
                  >
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Publier une nouvelle offre</h3>
                      <p className="text-sm text-muted-foreground">
                        Créer une offre d'emploi pour recruter
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={localePath("/dashboard/company/candidates")}
                    className="flex gap-3 items-center p-4 bg-white rounded-lg border hover:shadow-sm hover:border-green-300 transition-all"
                  >
                    <div className="bg-green-100 p-2 rounded-full">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Parcourir les candidats</h3>
                      <p className="text-sm text-muted-foreground">
                        Voir les profils disponibles
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={localePath("/dashboard/company/staff")}
                    className="flex gap-3 items-center p-4 bg-white rounded-lg border hover:shadow-sm hover:border-purple-300 transition-all"
                  >
                    <div className="bg-purple-100 p-2 rounded-full">
                      <UserPlus className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Gérer l'équipe</h3>
                      <p className="text-sm text-muted-foreground">
                        Administration des employés
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Jobs Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Offres récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{job.title}</h4>
                          <p className="text-xs text-gray-600">{job.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(job.status)}
                          <span className="text-xs text-gray-500">{job.applications} candidatures</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab("jobs")}>
                    Voir toutes les offres
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            {/* Jobs Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestion des offres d'emploi</CardTitle>
                  <Link href={localePath("/dashboard/company/jobs/new")}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle offre
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher par titre ou localisation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="filled">Pourvu</SelectItem>
                      <SelectItem value="closed">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{job.title}</h3>
                            {getStatusBadge(job.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{job.location}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{job.applications} candidatures</span>
                            {job.hourly_rate && <span>{job.hourly_rate} MAD/h</span>}
                            <span>Créé le {new Date(job.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={localePath(`/dashboard/company/jobs/${job.id}`)}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Voir
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Management Tab */}
          <TabsContent value="staff" className="space-y-6">
            <StaffingManagement locale={locale} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Statistiques des recrutements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taux de réponse</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Temps moyen de recrutement</span>
                      <span className="font-semibold">5 jours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Candidats qualifiés</span>
                      <span className="font-semibold">64%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance équipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Missions complétées</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Note moyenne</span>
                      <span className="font-semibold">4.7/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rétention équipe</span>
                      <span className="font-semibold">89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}