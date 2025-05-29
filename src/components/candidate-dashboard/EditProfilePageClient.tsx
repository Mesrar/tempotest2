"use client";

import { useState, useEffect } from "react";
import { Locale } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useCurrentStaff } from "@/hooks/useCurrentStaff";
import { dataService } from "@/lib/unified-data-service";
import { uploadDocument, deleteDocument } from "@/lib/supabase/documents";
import { Loader2, ArrowLeft, Save, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditForm } from "@/components/candidate-dashboard/ProfileEditForm";
import { DocumentUpload } from "@/components/candidate-dashboard/DocumentUpload";
import { mapSupabaseDataToComponentProps } from "@/components/candidate-dashboard/mappers";

interface EditProfilePageClientProps {
  locale: Locale;
  dict: any;
}

export function EditProfilePageClient({ locale, dict }: EditProfilePageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Utiliser le hook Supabase réel
  const { user, profile, experiences, documents: supabaseDocuments, loading, error } = useCurrentStaff();
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/sign-in`);
    }
  }, [user, loading, router, locale]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50/40">
        <div className="bg-white py-6 shadow-sm border-b">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Chargement de votre profil...</span>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50/40">
        <div className="bg-white py-6 shadow-sm border-b">
          <div className="container max-w-5xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900">Éditer le profil</h1>
          </div>
        </div>
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-700">Erreur lors du chargement du profil: {error.message}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const handleSubmit = async (data: any) => {
    if (!user?.id) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour mettre à jour votre profil.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("🔄 Starting profile update for user:", user.id);
      console.log("📝 Form data received:", data);
      
      // Update profile with Supabase
      const profileResult = await dataService.updateProfile(user.id, {
        full_name: data.fullName,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
        skills: data.skills,
        hourly_rate: parseFloat(data.hourlyRate) || null,
        is_available: data.isAvailable,
        availability_start: data.availabilityStart?.toISOString(),
        availability_end: data.availabilityEnd?.toISOString(),
      });
      
      if (!profileResult.success) {
        throw new Error(`Profile update failed: ${JSON.stringify(profileResult.error)}`);
      }

      // Update experiences if provided
      if (data.experiences && data.experiences.length > 0) {
        console.log("🔄 Processing experiences:", data.experiences);
        
        for (const exp of data.experiences) {
          const startDate = typeof exp.startDate === 'string' ? exp.startDate : exp.startDate.toISOString().split('T')[0];
          const endDate = exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : exp.endDate.toISOString().split('T')[0]) : undefined;
          
          console.log(`📝 Processing experience: ${exp.title} at ${exp.company}`);
          
          if (exp.id) {
            // Update existing experience
            console.log("🔄 Updating existing experience:", exp.id);
            const expResult = await dataService.updateExperience(exp.id, {
              title: exp.title,
              company: exp.company,
              start_date: startDate,
              end_date: endDate,
              description: exp.description,
              is_current: exp.isCurrent
            });
            console.log("✅ Experience update result:", expResult);
            if (!expResult.success) {
              throw new Error(`Experience update failed: ${JSON.stringify(expResult.error)}`);
            }
          } else {
            // Create new experience
            console.log("🔄 Creating new experience");
            const expResult = await dataService.addExperience(user.id, {
              title: exp.title,
              company: exp.company,
              start_date: startDate,
              end_date: endDate,
              description: exp.description,
              is_current: exp.isCurrent
            });
            console.log("✅ Experience creation result:", expResult);
            if (!expResult.success) {
              throw new Error(`Experience creation failed: ${JSON.stringify(expResult.error)}`);
            }
          }
        }
      } else {
        console.log("ℹ️ No experiences to process");
      }

      // Force refresh by incrementing the refresh key
      setRefreshKey(prev => prev + 1);
      
      // Show success message
      toast({
        title: "✅ Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
        className: "border-green-200 bg-green-50 text-green-800",
      });
      
      // Redirect back to the dashboard
      router.push(`/${locale}/dashboard/candidate`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "❌ Erreur de sauvegarde",
        description: "Une erreur s'est produite lors de la mise à jour. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/dashboard/candidate`);
  };

  // Fonctions de gestion des documents
  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    console.log("🚀 Début handleUpload:", {
      filesCount: files.length,
      hasProfile: !!profile,
      hasUser: !!user,
      profileId: profile?.id,
      userId: user?.id,
      userEmail: user?.email
    });
    
    try {
      if (!profile) {
        throw new Error("Profil non trouvé");
      }
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      const uploadPromises = files.map(file => 
        uploadDocument(file, profile.id, user.id)
      );
      
      await Promise.all(uploadPromises);
      
      toast({
        title: "Documents téléchargés",
        description: `${files.length} document(s) ont été téléchargés avec succès.`,
      });
      
      // Actualiser les données pour afficher les nouveaux documents
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du téléchargement de vos documents.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      // Récupérer le chemin du fichier avant suppression
      const documentToDelete = supabaseDocuments?.find(doc => doc.id === id);
      
      if (!documentToDelete) {
        throw new Error("Document non trouvé");
      }
      
      const { success, error } = await deleteDocument({
        id,
        filePath: documentToDelete.file_path
      });
      
      if (!success) {
        throw error;
      }
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      });
      
      // Actualiser les données pour refléter la suppression
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du document.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/40">
      {/* Header with breadcrumb and action buttons */}
      <div className="bg-white py-6 shadow-sm border-b">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au dashboard
              </Button>
              <div className="w-px h-6 bg-gray-300" />
              <div className="flex items-center gap-3">
                <UserCircle className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Éditer le profil</h1>
                  <p className="text-sm text-gray-600">
                    Mettez à jour vos informations pour améliorer vos opportunités
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  // Trigger form submission from parent
                  const form = document.getElementById('profile-form') as HTMLFormElement;
                  if (form) form.requestSubmit();
                }}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form content */}
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <ProfileEditForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={{
            fullName: profile?.full_name || '',
            email: profile?.email || user?.email || '',
            phone: profile?.phone || '',
            location: profile?.location || '',
            bio: profile?.bio || '',
            skills: profile?.skills || [],
            experiences: (experiences || []).map(exp => ({
              id: exp.id,
              title: exp.title,
              company: exp.company,
              startDate: exp.start_date,
              endDate: exp.end_date || undefined,
              description: exp.description || '',
              isCurrent: exp.is_current
            })),
            hourlyRate: profile?.hourly_rate?.toString() || '',
            isAvailable: profile?.is_available ?? true,
            availabilityStart: profile?.availability_start ? new Date(profile.availability_start) : new Date(),
            availabilityEnd: profile?.availability_end ? new Date(profile.availability_end) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          }}
          isSubmitting={isSubmitting}
          documents={supabaseDocuments ? mapSupabaseDataToComponentProps({ 
            user, 
            profile, 
            experiences, 
            documents: supabaseDocuments, 
            jobMatches: []
          })?.documents || [] : []}
          onUploadDocuments={handleUpload}
          onDeleteDocument={handleDeleteDocument}
          isUploading={isUploading}
        />
      </div>
    </main>
  );
}
