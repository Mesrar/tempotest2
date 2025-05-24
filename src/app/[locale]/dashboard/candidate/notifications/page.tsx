"use client";

import { useEffect, useState } from "react";
import { NotificationSettings } from "@/components/candidate-dashboard/NotificationSettings";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/lib/supabase-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

// Les préférences que nous récupérerions depuis la base de données
interface StoredNotificationPreferences {
  id: string;
  candidate_id: string;
  job_matches: boolean;
  mission_reminders: boolean;
  status_updates: boolean;
  document_verifications: boolean;
  emergency_alerts: boolean;
  marketing: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export default function NotificationsPage() {
  const { session, loading } = useAuth();
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [loadingPreferences, setLoadingPreferences] = useState(true);

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      if (!session?.user) return;

      try {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setCandidateId(data.id);
          // Une fois que nous avons l'ID du candidat, chargeons ses préférences
          await fetchNotificationPreferences(data.id);
        }
      } catch (err) {
        console.error("Error fetching candidate profile:", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setLoadingPreferences(false);
      }
    };

    const fetchNotificationPreferences = async (candId: string) => {
      try {
        // Dans une implémentation réelle, cette requête irait à Supabase
        // Pour l'instant, utilisez des données simulées
        // const { data, error } = await supabase
        //   .from('notification_preferences')
        //   .select('*')
        //   .eq('candidate_id', candId)
        //   .single();
        
        // if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

        // Mock data for demonstration
        const mockData = {
          jobMatches: true,
          missionReminders: true,
          statusUpdates: true,
          documentVerifications: true,
          emergencyAlerts: true,
          marketing: false,
          email: true,
          sms: true,
          push: false
        };
        
        setPreferences(mockData);
      } catch (err) {
        console.error("Error fetching notification preferences:", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos préférences. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    };

    if (session) {
      fetchCandidateProfile();
    }
  }, [session]);

  const handleSavePreferences = async (updatedPreferences: any) => {
    if (!candidateId) return;

    try {
      // Dans une implémentation réelle, nous enverrions ces données à Supabase
      console.log("Saving preferences:", updatedPreferences);
      
      // const { data, error } = await supabase
      //   .from('notification_preferences')
      //   .upsert({
      //     candidate_id: candidateId,
      //     job_matches: updatedPreferences.jobMatches,
      //     mission_reminders: updatedPreferences.missionReminders,
      //     status_updates: updatedPreferences.statusUpdates,
      //     document_verifications: updatedPreferences.documentVerifications,
      //     emergency_alerts: updatedPreferences.emergencyAlerts,
      //     marketing: updatedPreferences.marketing,
      //     email_enabled: updatedPreferences.email,
      //     sms_enabled: updatedPreferences.sms,
      //     push_enabled: updatedPreferences.push,
      //     updated_at: new Date().toISOString()
      //   })
      //   .select()
      //   .single();
      
      // if (error) throw error;

      // Simulation réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de notification ont été enregistrées avec succès.",
      });
    } catch (err) {
      console.error("Error saving notification preferences:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (loading || loadingPreferences) {
    return (
      <div className="min-h-screen bg-muted/40 pb-10">
        <div className="bg-background py-4 shadow-sm border-b mb-6">
          <div className="container max-w-5xl mx-auto px-4">
            <h1 className="text-2xl font-bold">Paramètres de Notification</h1>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
        
        <div className="container max-w-5xl mx-auto px-4">
          {/* Skeleton loader */}
          <div className="w-full h-[500px] rounded-lg bg-muted animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 pb-10">
      <div className="bg-background py-4 shadow-sm border-b mb-6">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center mb-1">
            <Button variant="ghost" size="sm" asChild className="mr-2 -ml-2">
              <Link href="/fr/dashboard/candidate">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Retour
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold">Paramètres de Notification</h1>
          <p className="text-muted-foreground">Gérez vos préférences de notification</p>
        </div>
      </div>
      
      <div className="container max-w-2xl mx-auto px-4">
        {candidateId && preferences ? (
          <NotificationSettings 
            candidateId={candidateId} 
            initialPreferences={preferences}
            onSave={handleSavePreferences}
          />
        ) : (
          <div className="bg-muted p-8 rounded-lg text-center">
            <p className="mb-2 text-lg">Profil non trouvé</p>
            <p className="text-muted-foreground mb-4">
              Nous n'avons pas pu trouver votre profil de candidat. Veuillez compléter votre profil d'abord.
            </p>
            <Button asChild>
              <Link href="/fr/dashboard/candidate/profile/edit">Compléter mon profil</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
