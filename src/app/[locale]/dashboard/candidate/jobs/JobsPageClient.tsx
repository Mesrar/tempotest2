"use client";

import { useState } from "react";
import { JobMatches } from "@/components/candidate-dashboard/JobMatches";
import { JobFilters } from "@/components/candidate-dashboard/JobFilters";
import { Locale } from "@/lib/i18n";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpenIcon, SearchIcon, SlidersIcon, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface JobsPageClientProps {
  dict: any;
  locale: Locale;
}

export function JobsPageClient({ dict, locale }: JobsPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("matchScore");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock job matches for demo purposes
  const mockJobMatches = [
    {
      id: "job1",
      title: "Cariste - Mission Temporaire",
      company: {
        id: "comp1",
        name: "LogiTrans Maroc"
      },
      location: "Zone Industrielle, Casablanca",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 2 weeks after start
      salary: 65,
      skills: ["Cariste", "CACES 3", "Manutention", "Inventaire"],
      matchPercentage: 95,
      status: 'pending' as const
    },
    {
      id: "job2",
      title: "Agent Logistique",
      company: {
        id: "comp2",
        name: "MedLogistics"
      },
      location: "Tanger Free Zone, Tanger",
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      salary: 58,
      skills: ["Préparation de commandes", "Gestion de stock", "ERP", "Scanner"],
      matchPercentage: 88,
      status: 'pending' as const
    },
    {
      id: "job3",
      title: "Préparateur de Commandes",
      company: {
        id: "comp3",
        name: "AtlasSupply"
      },
      location: "Salé, Rabat-Salé",
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      salary: 52,
      skills: ["Préparation de commandes", "Scanner", "Conditionnement"],
      matchPercentage: 82,
      status: 'accepted' as const
    },
    {
      id: "job4",
      title: "Opérateur de Production",
      company: {
        id: "comp4",
        name: "IndustriePro"
      },
      location: "Berrechid, Casablanca",
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // started 5 days ago
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      salary: 48,
      skills: ["Assemblage", "Contrôle qualité", "Travail en équipe"],
      matchPercentage: 75,
      status: 'completed' as const
    },
    {
      id: "job5",
      title: "Agent de Quai",
      company: {
        id: "comp1",
        name: "LogiTrans Maroc"
      },
      location: "Zone Portuaire, Casablanca",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
      salary: 60,
      skills: ["Logistique portuaire", "Manutention", "Chargement", "Déchargement"],
      matchPercentage: 70,
      status: 'pending' as const
    },
    {
      id: "job6",
      title: "Magasinier",
      company: {
        id: "comp5",
        name: "RabatLog"
      },
      location: "Rabat, Maroc",
      startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      salary: 55,
      skills: ["Gestion de stock", "Inventaire", "Rangement"],
      matchPercentage: 65,
      status: 'rejected' as const
    }
  ];

  // Filter and sort jobs
  let filteredJobs = [...mockJobMatches];
  
  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(term) || 
      job.company.name.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term) ||
      job.skills.some(skill => skill.toLowerCase().includes(term))
    );
  }
  
  // Apply status filter
  if (statusFilter.length > 0) {
    filteredJobs = filteredJobs.filter(job => statusFilter.includes(job.status));
  }
  
  // Apply sorting
  if (sortBy === "match") {
    filteredJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
  } else if (sortBy === "date") {
    filteredJobs.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  } else if (sortBy === "salary") {
    filteredJobs.sort((a, b) => b.salary - a.salary);
  }

  const handleAcceptJob = async (jobId: string) => {
    try {
      // In a real app, you would make an API call to accept the job
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast({
        title: "Offre acceptée",
        description: "Vous avez accepté cette offre d'emploi avec succès.",
      });
    } catch (error) {
      console.error("Error accepting job:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'acceptation de l'offre.",
        variant: "destructive",
      });
    }
  };

  const handleRejectJob = async (jobId: string) => {
    try {
      // In a real app, you would make an API call to reject the job
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast({
        title: "Offre déclinée",
        description: "Vous avez décliné cette offre d'emploi.",
      });
    } catch (error) {
      console.error("Error rejecting job:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du refus de l'offre.",
        variant: "destructive",
      });
    }
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Count jobs by status
  const pendingCount = mockJobMatches.filter(job => job.status === 'pending').length;
  const acceptedCount = mockJobMatches.filter(job => job.status === 'accepted').length;
  const rejectedCount = mockJobMatches.filter(job => job.status === 'rejected').length;
  const completedCount = mockJobMatches.filter(job => job.status === 'completed').length;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offres d'emploi</h1>
          <p className="text-muted-foreground">
            Trouvez des missions temporaires qui correspondent à votre profil
          </p>
        </div>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div className="text-right">
              <p className="text-sm font-medium">{filteredJobs.length} offres trouvées</p>
              <p className="text-xs text-muted-foreground">
                {pendingCount} en attente • {acceptedCount} acceptées
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={statusFilter.length === 0 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setStatusFilter([])}
          >
            Toutes ({mockJobMatches.length})
          </Badge>
          <Badge 
            variant={statusFilter.includes('pending') ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleStatusFilter('pending')}
          >
            En attente ({pendingCount})
          </Badge>
          <Badge 
            variant={statusFilter.includes('accepted') ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleStatusFilter('accepted')}
          >
            Acceptées ({acceptedCount})
          </Badge>
          <Badge 
            variant={statusFilter.includes('rejected') ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleStatusFilter('rejected')}
          >
            Refusées ({rejectedCount})
          </Badge>
          <Badge 
            variant={statusFilter.includes('completed') ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleStatusFilter('completed')}
          >
            Terminées ({completedCount})
          </Badge>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par titre, entreprise ou compétence..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="match">Meilleure correspondance</SelectItem>
                <SelectItem value="date">Date de début</SelectItem>
                <SelectItem value="salary">Salaire</SelectItem>
              </SelectContent>
            </Select>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtrer les offres</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="pending" 
                          checked={statusFilter.includes('pending')}
                          onCheckedChange={() => toggleStatusFilter('pending')}
                        />
                        <Label htmlFor="pending">En attente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="accepted" 
                          checked={statusFilter.includes('accepted')}
                          onCheckedChange={() => toggleStatusFilter('accepted')}
                        />
                        <Label htmlFor="accepted">Acceptées</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="rejected" 
                          checked={statusFilter.includes('rejected')}
                          onCheckedChange={() => toggleStatusFilter('rejected')}
                        />
                        <Label htmlFor="rejected">Refusées</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="completed" 
                          checked={statusFilter.includes('completed')}
                          onCheckedChange={() => toggleStatusFilter('completed')}
                        />
                        <Label htmlFor="completed">Terminées</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Emplacement</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les emplacements" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les emplacements</SelectItem>
                        <SelectItem value="casa">Casablanca</SelectItem>
                        <SelectItem value="rabat">Rabat</SelectItem>
                        <SelectItem value="tanger">Tanger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Taux horaire minimum (MAD)</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="number" placeholder="ex. 50" />
                      <span>MAD/h</span>
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <Button className="w-full">Appliquer les filtres</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {filteredJobs.length === 0 ? (
          <Card className="border-dashed border-2 border-muted">
            <CardContent className="py-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <BookOpenIcon className="h-12 w-12 text-muted-foreground/60" />
                <div>
                  <p className="text-lg font-medium">Aucune offre d'emploi trouvée</p>
                  <p className="text-sm text-muted-foreground">
                    Essayez de modifier vos filtres ou cherchez avec d'autres termes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <JobMatches 
            matches={filteredJobs}
            onAcceptJob={handleAcceptJob}
            onRejectJob={handleRejectJob}
          />
        )}
      </div>
    </main>
  );
}
