"use client";

import { useState } from "react";
import { CandidateProfileForm } from "@/components/candidate-dashboard/CandidateProfileForm";
import { Locale } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface EditProfilePageClientProps {
  locale: Locale;
  dict: any;
}

export function EditProfilePageClient({ locale, dict }: EditProfilePageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, you would fetch the candidate data from the database
  const mockCandidateData = {
    fullName: "Mohammed Alaoui",
    email: "mohammed.alaoui@exemple.com",
    phone: "+212 612345678",
    location: "Casablanca, Maroc",
    bio: "Professionnel de la logistique avec 5 ans d'expérience dans la manutention et la gestion d'entrepôt.",
    skills: ["Manutention", "Logistique", "Cariste", "CACES 3"],
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
    hourlyRate: "60",
    isAvailable: true,
    availabilityStart: new Date(),
    availabilityEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Mock API call - in a real app, you would send data to the server
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Show success message
      toast({
        title: "Profil mis à jour",
        description: "Vos informations de profil ont été mises à jour avec succès.",
      });
      
      // Redirect back to the dashboard
      router.push(`/${locale}/dashboard/candidate`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de votre profil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 pb-10">
      <div className="bg-background py-4 shadow-sm border-b mb-6">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold">{dict.dashboard.editProfile}</h1>
          <p className="text-muted-foreground">
            Mettez à jour vos informations pour améliorer la correspondance avec les offres d'emploi
          </p>
        </div>
      </div>
      
      <div className="container max-w-3xl mx-auto px-4">
        <CandidateProfileForm 
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/${locale}/dashboard/candidate`)}
          initialData={mockCandidateData}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
}
