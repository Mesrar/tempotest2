"use client";

import { useState } from "react";
import { MissionHistory } from "@/components/candidate-dashboard/MissionHistory";
import { toast } from "@/hooks/use-toast";
import { Locale } from "@/lib/i18n";

interface MissionsPageClientProps {
  locale: Locale;
  dict: any;
}

export function MissionsPageClient({ locale, dict }: MissionsPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock missions for demo purposes
  const mockMissions = [
    {
      id: "mission1",
      title: "Cariste - Mission Temporaire",
      company: {
        name: "LogiTrans Maroc",
        logoUrl: ""
      },
      location: "Casablanca",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-02-15"),
      status: "completed" as const,
      rating: 4.5,
      paymentAmount: 12000,
      paymentStatus: "paid" as const,
      description: "Mission de cariste dans un entrepôt logistique. Gestion des stocks et préparation de commandes.",
      skills: ["Cariste", "Logistique", "Manutention"]
    },
    {
      id: "mission2", 
      title: "Préparateur de Commandes",
      company: {
        name: "EuroLogistics",
        logoUrl: ""
      },
      location: "Rabat",
      startDate: new Date("2024-02-20"),
      endDate: new Date("2024-03-20"),
      status: "active" as const,
      rating: undefined,
      paymentAmount: 10500,
      paymentStatus: "pending" as const,
      description: "Préparation et emballage de commandes pour e-commerce.",
      skills: ["Préparation", "Emballage", "Organisation"]
    },
    {
      id: "mission3",
      title: "Agent de Quai",
      company: {
        name: "MarocFreight",
        logoUrl: ""
      },
      location: "Tanger",
      startDate: new Date("2024-04-01"),
      endDate: undefined,
      status: "pending" as const,
      rating: undefined,
      paymentAmount: 8500,
      paymentStatus: "pending" as const,
      description: "Réception et expédition de marchandises. Contrôle qualité et documentation.",
      skills: ["Réception", "Expédition", "Contrôle qualité"]
    }
  ];

  const handleRateMission = async (missionId: string, rating: number, comment?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make the actual API call to rate the mission
      console.log("Rating mission:", { missionId, rating, comment });
      
      toast({
        title: "Évaluation envoyée",
        description: "Votre évaluation a été envoyée avec succès.",
      });
    } catch (error) {
      console.error("Error rating mission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre évaluation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 pb-10">
      <div className="bg-background py-4 shadow-sm border-b mb-6">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold">{dict.missions?.title || "Historique des missions"}</h1>
          <p className="text-muted-foreground">
            {dict.missions?.description || "Consultez toutes vos missions passées et en cours"}
          </p>
        </div>
      </div>
      
      <div className="container max-w-5xl mx-auto px-4">
        <MissionHistory 
          missions={mockMissions as any}
          onSubmitReview={(missionId, rating, comment) => 
            handleRateMission(missionId, rating, comment)
          }
        />
      </div>
    </main>
  );
}
