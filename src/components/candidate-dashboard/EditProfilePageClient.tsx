"use client";

import { useState, useEffect } from "react";
import { Locale } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useCurrentStaff } from "@/hooks/useCurrentStaff";
import { 
  updateProfile,
  addExperience, 
  updateExperience 
} from "@/components/candidate-dashboard/staffDataService";
import { Loader2, ArrowLeft, Save, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditForm } from "@/components/candidate-dashboard/ProfileEditForm";

interface EditProfilePageClientProps {
  locale: Locale;
  dict: any;
}

export function EditProfilePageClient({ locale, dict }: EditProfilePageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Utiliser le hook Supabase réel
  const { user, profile, experiences, loading, error } = useCurrentStaff();
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
      // Update profile with Supabase
      await updateProfile(user.id, {
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

      // Update experiences if provided
      if (data.experiences && data.experiences.length > 0) {
        for (const exp of data.experiences) {
          if (exp.id) {
            // Update existing experience
            await updateExperience(exp.id, {
              title: exp.title,
              company: exp.company,
              start_date: exp.startDate,
              end_date: exp.endDate,
              description: exp.description,
              is_current: exp.isCurrent
            });
          } else {
            // Create new experience
            await addExperience(user.id, {
              title: exp.title,
              company: exp.company,
              start_date: exp.startDate,
              end_date: exp.endDate,
              description: exp.description,
              is_current: exp.isCurrent
            });
          }
        }
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
        />
      </div>
    </main>
  );
}
