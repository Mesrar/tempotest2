"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateProfileCard } from "./CandidateProfileCard";
import { CandidateProfileForm, CandidateFormData } from "./CandidateProfileForm";
import { DocumentUpload } from "./DocumentUpload";
import { JobMatches } from "./JobMatches";
import { JobFilters } from "./JobFilters";
import { NotificationCenter } from "./NotificationCenter";
import { CandidateStats } from "./CandidateStats";
import { AvailabilityUpdateForm } from "./AvailabilityUpdateForm";
import { CandidateReviews } from "./CandidateReviews";
import { useCurrentStaff } from "@/hooks/useCurrentStaff";
import { mapSupabaseDataToComponentProps } from "./mappers";
import { updateCandidateProfile, updateAvailability, acceptJobMatch, rejectJobMatch } from "./staffDataService";
import {
  BriefcaseIcon,
  FileTextIcon,
  UserIcon,
  Star,
  Calendar,
  Bell,
  Settings,
  HistoryIcon,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "../ui/badge";
import { toast } from "../ui/use-toast";

// Mock data types - these would come from your API/database
interface Candidate {
  id: string;
  name: string;
  avatarUrl?: string;
  isAvailable: boolean;
  rating?: number;
  skills?: string[];
  email: string;
  phone: string;
  location: string;
  bio?: string;
  hourlyRate?: string;
  certifications?: string[];
  availability?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  experience?: {
    id: string;
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    isCurrent: boolean;
  }[];
  availabilityStart?: Date;
  availabilityEnd?: Date;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

interface JobMatch {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  location: string;
  startDate: Date;
  endDate?: Date;
  salary: number;
  skills: string[];
  matchPercentage: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

interface DashboardProps {
  candidateData?: Candidate;
  documents?: Document[];
  jobMatches?: JobMatch[];
}

export default function CandidateDashboard({
  candidateData,
  documents = [],
  jobMatches = []
}: DashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Récupérer les données du candidat depuis Supabase
  // En environnement de migration, simulons ces valeurs plutôt que d'utiliser le hook
  const user = null;
  const profile = null;
  const experiences: any[] = [];
  const supabaseDocuments: any[] = [];
  const supabaseJobMatches: any[] = [];
  const loading = false;
  const error = null;
  
  // Configuration des mises à jour en temps réel
  // Fonction pour rafraîchir les données (simulée pour l'instant)
  const refreshData = () => {
    console.log("Refreshing data...");
  };
  
  // Simuler des nouvelles correspondances et notifications
  const newJobMatches: any[] = [];
  const newNotifications: any[] = [];
  
  // Déterminer si nous utilisons des données réelles ou simulées
  const useRealData = !!profile;
  
  // Convertir les données Supabase au format attendu par les composants
  const mappedData = useRealData ? mapSupabaseDataToComponentProps({ user, profile, experiences, documents: supabaseDocuments, jobMatches: supabaseJobMatches, loading, error }) : null;
  
  // Mock candidate data for demo purposes
  const candidate = mappedData?.candidate || candidateData || {
    id: "1",
    name: "Mohammed Alaoui",
    avatarUrl: "",
    isAvailable: true,
    rating: 4.5,
    skills: ["Manutention", "Logistique", "Cariste", "CACES 3"],
    email: "mohammed.alaoui@exemple.com",
    phone: "+212 612345678",
    location: "Casablanca, Maroc",
    bio: "Professionnel de la logistique avec 5 ans d'expérience dans la manutention et la gestion d'entrepôt.",
    hourlyRate: "60",
    certifications: ["CACES 3", "CACES 5", "Permis B"],
    experience: [
      {
        id: "exp1",
        title: "Cariste",
        company: "LogiMaroc",
        startDate: new Date(2022, 1, 15),
        endDate: new Date(2023, 3, 30),
        description: "Gestion de l'entrepôt et des opérations de manutention",
        isCurrent: false
      }
    ],
    availabilityStart: new Date(),
    availabilityEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
  };

  // Job matches from Supabase or mock data
  const mockJobMatches = useRealData 
    // Si on a des données réelles, fusionner les offres d'emploi existantes avec les nouvelles
    ? [...(mappedData?.jobMatches || []), ...newJobMatches.map(match => ({
        id: match.id,
        title: match.job.title,
        company: {
          id: match.job.company.id,
          name: match.job.company.name,
          logoUrl: match.job.company.logo_url
        },
        location: match.job.location,
        startDate: new Date(match.job.start_date),
        endDate: match.job.end_date ? new Date(match.job.end_date) : undefined,
        salary: match.job.hourly_rate,
        skills: match.job.skills_required,
        matchPercentage: match.match_percentage,
        status: match.status
      }))]
    // Sinon, utiliser les données simulées
    : (jobMatches.length > 0 ? jobMatches : [
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
        status: 'pending'
      },
      {
        id: "job2",
        title: "Agent Logistique",
        company: {
          id: "comp2",
          name: "MedLogistics"
        },
        location: "Tanger, Maroc",
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        salary: 55,
        skills: ["Logistique", "Préparation de commandes", "Gestion de stock"],
        matchPercentage: 80,
        status: 'pending'
      },
      {
        id: "job3",
        title: "Manutentionnaire",
        company: {
          id: "comp3",
          name: "Tanger Med Logistics"
        },
        location: "Tanger, Maroc",
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        salary: 50,
        skills: ["Manutention", "Chargement", "Déchargement"],
        matchPercentage: 75,
        status: 'accepted'
      }
    ]);

  // Documents from Supabase or mock data
  const mockDocuments = mappedData?.documents || (documents.length > 0 ? documents : [
    {
      id: "doc1",
      name: "Certification CACES 3.pdf",
      url: "#",
      type: "application/pdf",
      uploadedAt: new Date(2023, 5, 15)
    },
    {
      id: "doc2",
      name: "Permis de conduire.png",
      url: "#",
      type: "image/png",
      uploadedAt: new Date(2023, 2, 10)
    }
  ]);

  // Mock reviews and references for demo purposes
  const mockReviews = [
    {
      id: "rev1",
      reviewer: {
        name: "Karim Bennani",
        company: "LogiTrans Maroc",
        position: "Responsable Logistique",
      },
      rating: 5,
      comment: "Mohammed est un excellent travailleur, très ponctuel et attentif aux détails. Il a géré notre équipe de manutentionnaires avec efficacité.",
      date: new Date(2023, 3, 15),
      missionName: "Gestion d'entrepôt - LogiMaroc"
    },
    {
      id: "rev2",
      reviewer: {
        name: "Fatima Zahra",
        company: "MedLogistics",
        position: "Directrice des Opérations",
      },
      rating: 4,
      comment: "Bon travail sur l'inventaire de fin de mois. A respecté les délais et a été précis dans son travail.",
      date: new Date(2023, 1, 22),
      missionName: "Inventaire - MedLogistics"
    }
  ];

  const mockReferences = [
    {
      id: "ref1",
      name: "Hassan Alami",
      company: "TransLog Maroc",
      position: "Directeur Général",
      email: "h.alami@translog.ma",
      phone: "+212 661234567",
      message: "J'ai travaillé avec Mohammed pendant 2 ans. C'est un professionnel dévoué et compétent que je recommande sans hésitation."
    }
  ];

  const handleEditProfileSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true);
    try {
      if (useRealData && profile && 'id' in profile) {
        // Utiliser la vraie implémentation si nous avons un profil réel
        const { success, error } = await updateCandidateProfile((profile as any).id, data);
        
        if (!success) throw error;
        
        toast({
          title: "Profil mis à jour",
          description: "Votre profil a été mis à jour avec succès.",
        });
      } else {
        // Utiliser l'implémentation simulée
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Profile data submitted:", data);
      }
      
      router.push("/fr/dashboard/candidate");
    } catch (error) {
      console.error("Error submitting profile:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      // Mock API call - would be a real API call to Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Files to upload:", files);
      // Update local state or refetch documents
      setActiveTab("profile");
    } catch (error) {
      console.error("Error uploading documents:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    // Mock API call - would be a real API call to Supabase Storage
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("Document deleted:", id);
    // Update local state or refetch documents
  };

  const handleAcceptJob = async (jobId: string) => {
    try {
      if (useRealData) {
        const { success, error } = await acceptJobMatch(jobId);
        if (!success) throw error;
        
        // Rafraîchir les données après acceptation
        refreshData();
      } else {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("Job accepted:", jobId);
      }
    } catch (error) {
      console.error("Error accepting job:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter cette offre. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleRejectJob = async (jobId: string) => {
    try {
      if (useRealData) {
        const { success, error } = await rejectJobMatch(jobId);
        if (!success) throw error;
        
        // Rafraîchir les données après refus
        refreshData();
      } else {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("Job rejected:", jobId);
      }
    } catch (error) {
      console.error("Error rejecting job:", error);
      toast({
        title: "Erreur",
        description: "Impossible de refuser cette offre. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  // Fonction pour mettre à jour la disponibilité
  const handleUpdateAvailability = async (data: { isAvailable: boolean; startDate?: Date | null; endDate?: Date | null }) => {
    try {
      if (useRealData && profile && 'id' in profile) {
        const { success, error } = await updateAvailability(
          (profile as any).id, 
          data.isAvailable, 
          data.startDate, 
          data.endDate
        );
        if (!success) throw error;
      } else {
        // Mise à jour du state local en attendant l'intégration API réelle
        console.log("Availability updated:", data);
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre disponibilité. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Count pending job matches and notifications
  const pendingJobsCount = mockJobMatches.filter(job => job.status === 'pending').length;
  const notificationsCount = useRealData ? newNotifications.length : 0;

  // Navigation functions - use Next.js router to navigate to proper pages instead of state
  const goToEditProfile = () => {
    router.push("/fr/dashboard/candidate/profile/edit");
  };

  const goToUploadDocuments = () => {
    router.push("/fr/dashboard/candidate/documents/upload");
  };

  const goToAllJobs = () => {
    router.push("/fr/dashboard/candidate/jobs");
  };
  
  // Afficher un état de chargement pendant la récupération des données
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement de vos données...</p>
      </div>
    );
  }
  
  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur de chargement</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Une erreur est survenue lors du chargement de vos données. Veuillez réessayer ultérieurement.</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Actualiser la page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tableau de bord</h2>
        <div className="flex items-center gap-2">
          <Link href="/fr/dashboard/candidate/availability">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Disponibilité</span>
            </Button>
          </Link>
          <Link href="/fr/dashboard/candidate/notifications">
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Button>
          </Link>
          <div className="hidden sm:block">
            <NotificationCenter />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card - Left column on larger screens */}
        <div className="md:col-span-1">
          <CandidateProfileCard 
            candidate={candidate}
            onEditProfile={goToEditProfile}
            onUploadDocuments={goToUploadDocuments}
          />
          
          <div className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  Disponibilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AvailabilityUpdateForm 
                  initialAvailable={candidate.isAvailable}
                  initialStartDate={candidate.availability?.startDate || null}
                  initialEndDate={candidate.availability?.endDate || null}
                  onUpdate={handleUpdateAvailability}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dashboard Info - Right column on larger screens */}
        <div className="md:col-span-2 space-y-4">
          {/* Stats */}
          <CandidateStats 
            stats={{
              totalJobMatches: mockJobMatches.length,
              acceptedJobs: mockJobMatches.filter(job => job.status === 'accepted').length,
              completedMissions: mockJobMatches.filter(job => job.status === 'completed').length,
              avgResponseTime: 45, // en minutes
              daysAvailable: candidate.availability?.endDate ? 
                Math.ceil((candidate.availability.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
              averageRating: candidate.rating
            }}
          />

          {/* Job matches preview */}
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-lg flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-primary" />
                Offres Correspondantes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <JobMatches 
                matches={mockJobMatches.slice(0, 2) as any} 
                onAcceptJob={handleAcceptJob}
                onRejectJob={handleRejectJob}
              />
              
              {mockJobMatches.length > 2 && (
                <div className="mt-3 text-center">              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToAllJobs}
              >
                Voir toutes les offres ({mockJobMatches.length})
              </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs section - Full width */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <UserIcon className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <BriefcaseIcon className="h-4 w-4 mr-2" />
            Offres
            {pendingJobsCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {pendingJobsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="h-4 w-4 mr-2" />
            Évaluations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-primary" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nom</p>
                  <p>{candidate.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{candidate.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                  <p>{candidate.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Localisation</p>
                  <p>{candidate.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux horaire</p>
                  <p>{(candidate as any).hourlyRate || "Non spécifié"} MAD/h</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <p>{candidate.isAvailable ? "Disponible" : "Non disponible"}</p>
                </div>
              </div>

              {candidate.bio && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">À propos</p>
                  <p className="text-sm mt-1">{candidate.bio}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Compétences</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills?.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Certifications</p>
                <div className="flex flex-wrap gap-1">
                  {(candidate as any).certifications?.map((cert: string, i: number) => (
                    <Badge key={i} variant="outline">{cert}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {candidate.experience && candidate.experience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-primary" />
                  Expérience Professionnelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {candidate.experience.map((exp: any, index: number) => (
                    <div key={exp.id} className="border-l-2 border-muted pl-4 pb-2 relative">
                      {/* Timeline dot */}
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5" />
                      
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(exp.startDate).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long' 
                        })} - {
                          exp.isCurrent ? 'Présent' : 
                          exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'long' 
                          }) : ''
                        }
                      </p>
                      {exp.description && (
                        <p className="text-sm mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="mt-4">
          <JobMatches 
            matches={mockJobMatches as any}
            onAcceptJob={handleAcceptJob}
            onRejectJob={handleRejectJob}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileTextIcon className="h-5 w-5 mr-2 text-primary" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="default" 
                onClick={goToUploadDocuments}
                className="mb-4"
              >
                Télécharger des Documents
              </Button>

              {mockDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileTextIcon className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Aucun document téléchargé
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Veuillez télécharger vos certificats et permis
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mockDocuments.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center">
                        {doc.type.includes('pdf') ? (
                          <FileTextIcon className="h-5 w-5 text-red-500 mr-3" />
                        ) : (
                          <FileTextIcon className="h-5 w-5 text-blue-500 mr-3" />
                        )}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Ajouté le {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          Voir
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <CandidateReviews 
            reviews={mockReviews}
            references={mockReferences}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
