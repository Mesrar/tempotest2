"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { CandidateProfileForm, CandidateFormData } from "./CandidateProfileForm";
import { JobMatches } from "./JobMatches";
import { SmartNotifications } from "./SmartNotifications";
import { AnimationWrapper, StaggerContainer, FadeInCard, SlideIn } from "./AnimationWrapper";
import { useCurrentStaff } from "@/hooks/useCurrentStaff";
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
  Loader2,
  CheckIcon
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Récupérer les données du candidat depuis Supabase
  const { user, profile, experiences, documents: supabaseDocuments, jobMatches: supabaseJobMatches, loading, error } = useCurrentStaff();
  
  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Dashboard error:", error);
    // Continuer avec les données par défaut au lieu de bloquer complètement
  }

  if (!user && !loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Connexion requise</h2>
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour accéder à votre dashboard.
            </p>
            <Button onClick={() => window.location.href = '/fr/sign-in'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Configuration des mises à jour en temps réel
  const refreshData = () => {
    // Cette fonction sera appelée automatiquement par le hook useCurrentStaff
    console.log("Data refreshed automatically");
  };
  
  // Convertir les données Supabase au format attendu par les composants
  const candidate = profile ? {
    id: profile.id,
    name: profile.full_name,
    avatarUrl: profile.avatar_url || "",
    isAvailable: profile.is_available,
    rating: profile.rating || undefined,
    skills: profile.skills || [],
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    bio: profile.bio || undefined,
    hourlyRate: undefined, // À ajouter au schéma si nécessaire
    certifications: [], // À ajouter au schéma si nécessaire
    experience: experiences.map(exp => ({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      startDate: new Date(exp.start_date),
      endDate: exp.end_date ? new Date(exp.end_date) : undefined,
      description: exp.description || "",
      isCurrent: exp.is_current
    })),
    availabilityStart: profile.availability_start ? new Date(profile.availability_start) : undefined,
    availabilityEnd: profile.availability_end ? new Date(profile.availability_end) : undefined
  } : candidateData || {
    id: "1",
    name: "Utilisateur Invité",
    avatarUrl: "",
    isAvailable: false,
    skills: [],
    email: "",
    phone: "",
    location: "",
    experience: []
  };

  // Job matches from Supabase
  const mockJobMatches = supabaseJobMatches.length > 0 
    ? supabaseJobMatches.map(match => ({
        id: match.id,
        title: match.job.title,
        company: {
          id: match.job.id,
          name: match.job.company_name,
          logoUrl: undefined // À ajouter au schéma si nécessaire
        },
        location: match.job.location,
        startDate: new Date(match.job.start_date),
        endDate: match.job.end_date ? new Date(match.job.end_date) : undefined,
        salary: match.job.hourly_rate,
        skills: [], // À ajouter au schéma des jobs si nécessaire
        matchPercentage: 85, // Calculer selon votre logique
        status: match.status as 'pending' | 'accepted' | 'rejected' | 'completed'
      }))
    : (jobMatches.length > 0 ? jobMatches : []);

  // Documents from Supabase
  const mockDocuments = supabaseDocuments.length > 0 
    ? supabaseDocuments.map(doc => ({
        id: doc.id,
        name: doc.name,
        url: doc.public_url || doc.file_path,
        type: doc.file_type,
        uploadedAt: new Date(doc.upload_date)
      }))
    : (documents.length > 0 ? documents : []);

  const handleEditProfileSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true);
    try {
      if (profile?.id) {
        // Utiliser la vraie implémentation avec les données Supabase
        const { success, error } = await updateCandidateProfile(profile.id, data);
        
        if (!success) throw error;
        
        toast({
          title: "Profil mis à jour",
          description: "Votre profil a été mis à jour avec succès.",
        });
      } else {
        // Fallback si pas de profil
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
      // Redirect to documents page after upload
      router.push("/fr/dashboard/candidate/documents");
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
      const { success, error } = await acceptJobMatch(jobId);
      if (!success) throw error;
      
      // Les données seront automatiquement rafraîchies par le hook useCurrentStaff
      toast({
        title: "Offre acceptée",
        description: "Vous avez accepté cette offre d'emploi.",
      });
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
      const { success, error } = await rejectJobMatch(jobId);
      if (!success) throw error;
      
      // Les données seront automatiquement rafraîchies par le hook useCurrentStaff
      toast({
        title: "Offre refusée",
        description: "Vous avez refusé cette offre d'emploi.",
      });
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
      if (profile?.id) {
        const { success, error } = await updateAvailability(
          profile.id, 
          data.isAvailable, 
          data.startDate, 
          data.endDate
        );
        if (!success) throw error;
        
        toast({
          title: "Disponibilité mise à jour",
          description: "Votre disponibilité a été mise à jour avec succès.",
        });
      } else {
        throw new Error("Profil non trouvé");
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

  // Calculer la complétude du profil
  const calculateProfileCompleteness = (): number => {
    let completeness = 0;
    if (candidate.name) completeness += 15;
    if (candidate.email) completeness += 10;
    if (candidate.phone) completeness += 10;
    if (candidate.location) completeness += 10;
    if (candidate.bio) completeness += 15;
    if ((candidate as any).hourlyRate) completeness += 10;
    if (candidate.skills && candidate.skills.length > 0) completeness += 15;
    if ((candidate as any).certifications && (candidate as any).certifications.length > 0) completeness += 10;
    if (candidate.experience && candidate.experience.length > 0) completeness += 15;
    return Math.min(completeness, 100);
  };

  const profileCompleteness = calculateProfileCompleteness();

  // Count pending job matches and notifications
  const pendingJobsCount = mockJobMatches.filter(job => job.status === 'pending').length;
  const notificationsCount = pendingJobsCount;

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
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Header avec actions rapides */}
      <AnimationWrapper direction="up" duration={0.6}>
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bonjour, {candidate.name.split(' ')[0]} 👋</h1>
                <div className="text-gray-600 flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${candidate.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {candidate.isAvailable ? 'Disponible pour missions' : 'Indisponible'}
                  {notificationsCount > 0 && (
                    <Badge variant="destructive" className="ml-2">{notificationsCount} nouvelle(s)</Badge>
                  )}
                </div>
              </div>
            </div>
            
              {/* Actions rapides & Navigation mobile */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Navigation mobile - menu burger simple */}
                <div className="md:hidden">
                  <Button variant="outline" size="sm" onClick={goToEditProfile}>
                    <UserIcon className="h-4 w-4 mr-1" />
                    Profil
                  </Button>
                  {pendingJobsCount > 0 && (
                    <Button size="sm" onClick={goToAllJobs} className="ml-2">
                      <BriefcaseIcon className="h-4 w-4 mr-1" />
                      {pendingJobsCount}
                    </Button>
                  )}
                </div>
                
                {/* Actions essentielles uniquement - masquées sur mobile */}
                <div className="hidden md:flex gap-2">
                  {pendingJobsCount > 0 && (
                    <Button 
                      onClick={goToAllJobs}
                      className="flex items-center gap-2"
                    >
                      <BriefcaseIcon className="h-4 w-4" />
                      {pendingJobsCount} offre(s) en attente
                    </Button>
                  )}
                  <Link href="/fr/dashboard/candidate/availability">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Disponibilité
                    </Button>
                  </Link>
                </div>
              </div>
          </div>
        </div>
      </AnimationWrapper>
      
      {/* Vue d'ensemble avec métriques clés */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FadeInCard delay={0}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offres en attente</p>
                  <p className="text-2xl font-bold text-primary">{pendingJobsCount}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {pendingJobsCount > 0 ? 'Nécessitent votre attention' : 'Tout est à jour'}
              </p>
            </CardContent>
          </Card>
        </FadeInCard>

        <FadeInCard delay={0.1}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Missions acceptées</p>
                  <p className="text-2xl font-bold text-green-600">{mockJobMatches.filter(job => job.status === 'accepted').length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Missions confirmées</p>
            </CardContent>
          </Card>
        </FadeInCard>

        <FadeInCard delay={0.2}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-yellow-600">{candidate.rating || 'N/A'}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {candidate.rating ? 'Excellent travail !' : 'Pas encore évalué'}
              </p>
            </CardContent>
          </Card>
        </FadeInCard>

        <FadeInCard delay={0.3}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Statut</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {candidate.isAvailable ? 'Disponible' : 'Indisponible'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {candidate.isAvailable ? 'Prêt pour missions' : 'Non disponible'}
              </p>
            </CardContent>
          </Card>
        </FadeInCard>
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actions rapides supprimées - redondantes avec header et sidebar */}

          {/* Métriques simplifiées - informations redondantes supprimées */}

          {/* Offres d'emploi prioritaires avec design amélioré */}
          <SlideIn direction="left" delay={0.5}>
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-primary" />
                    Offres Prioritaires
                    {pendingJobsCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {pendingJobsCount} urgent{pendingJobsCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={goToAllJobs}
                    className="text-primary hover:text-primary/80"
                  >
                    Voir tout ({mockJobMatches.length})
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockJobMatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BriefcaseIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucune offre disponible</p>
                    <p className="text-sm">Nous vous notifierons dès qu'une offre correspond à votre profil</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToEditProfile}
                      className="mt-3"
                    >
                      Améliorer mon profil
                    </Button>
                  </div>
                ) : (
                  <>
                    <JobMatches 
                      matches={mockJobMatches.slice(0, 3) as any} 
                      onAcceptJob={handleAcceptJob}
                      onRejectJob={handleRejectJob}
                    />
                    {mockJobMatches.length > 3 && (
                      <div className="text-center pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={goToAllJobs}
                          className="w-full"
                        >
                          Voir toutes les offres
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </SlideIn>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">
          <SlideIn direction="right" delay={0.3}>
            {/* Profil candidat compact */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.location}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taux horaire</span>
                    <span className="font-semibold">{(candidate as any).hourlyRate || 'Non spécifié'} MAD/h</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Statut</span>
                    <Badge variant={candidate.isAvailable ? "default" : "secondary"}>
                      {candidate.isAvailable ? "Disponible" : "Indisponible"}
                    </Badge>
                  </div>

                  {candidate.rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Note</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{candidate.rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-600 mb-2">Compétences principales</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills?.slice(0, 3).map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                    {candidate.skills && candidate.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{candidate.skills.length - 3}</Badge>
                    )}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={goToEditProfile}
                >
                  Modifier
                </Button>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Gestion disponibilité supprimée - redondante avec header et métriques */}

          <SlideIn direction="right" delay={0.5}>
            {/* Notifications intelligentes */}
            <SmartNotifications
              pendingJobsCount={pendingJobsCount}
              profileCompleteness={profileCompleteness}
              documentsCount={mockDocuments.length}
              onViewJobs={goToAllJobs}
              onEditProfile={goToEditProfile}
              onUploadDocuments={goToUploadDocuments}
            />
          </SlideIn>
        </div>
      </div>

      {/* Section onglets supprimée - ces détails sont maintenant sur des pages dédiées */}
      {/* Navigation vers pages spécialisées via sidebar et header */}
    </div>
  );
}
