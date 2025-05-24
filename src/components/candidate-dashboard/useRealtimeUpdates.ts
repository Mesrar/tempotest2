"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "@/components/ui/use-toast";
import { JobMatch, CandidateDocument, Notification } from "@/lib/supabase-client";

interface UseRealtimeUpdatesProps {
  userId: string | null;
  candidateId: string | null;
}

interface UseRealtimeUpdatesResult {
  newJobMatches: JobMatch[];
  newDocuments: CandidateDocument[];
  newNotifications: Notification[];
  refreshData: () => void;
}

/**
 * Hook personnalisé pour gérer les mises à jour en temps réel des données
 * liées au candidat (offres d'emploi, documents, notifications)
 */
export function useRealtimeUpdates({ 
  userId, 
  candidateId 
}: UseRealtimeUpdatesProps): UseRealtimeUpdatesResult {
  const [newJobMatches, setNewJobMatches] = useState<JobMatch[]>([]);
  const [newDocuments, setNewDocuments] = useState<CandidateDocument[]>([]);
  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);
  
  // Fonction pour rafraîchir manuellement les données
  const refreshData = async () => {
    if (!userId || !candidateId) return;
    
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    // Récupérer les nouvelles offres d'emploi
    const { data: jobMatches, error: jobMatchError } = await supabase
      .from('job_matches')
      .select(`
        *,
        job:job_id (
          *,
          company:company_id (
            id,
            name,
            logo_url
          )
        )
      `)
      .eq('candidate_id', candidateId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
      
    if (jobMatchError) {
      console.error("Error fetching job matches:", jobMatchError);
    } else {
      setNewJobMatches(jobMatches as JobMatch[]);
    }
    
    // Récupérer les nouvelles notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });
      
    if (notificationsError) {
      console.error("Error fetching notifications:", notificationsError);
    } else {
      setNewNotifications(notifications as Notification[]);
    }
  };
  
  useEffect(() => {
    if (!userId || !candidateId) return;
    
    // Initialiser le client Supabase
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    // Écouter les nouvelles offres d'emploi
    const jobsChannel = supabase
      .channel('job_matches_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'job_matches', filter: `candidate_id=eq.${candidateId}` },
        async (payload) => {
          console.log('Nouvelle offre d\'emploi reçue:', payload);
          
          // Récupérer les détails complets de l'offre
          const { data, error } = await supabase
            .from('job_matches')
            .select(`
              *,
              job:job_id (
                *,
                company:company_id (
                  id,
                  name,
                  logo_url
                )
              )
            `)
            .eq('id', payload.new.id)
            .single();
            
          if (error) {
            console.error("Error fetching new job match details:", error);
            return;
          }
          
          setNewJobMatches(prev => [data as JobMatch, ...prev]);
          
          // Afficher une notification
          toast({
            title: "Nouvelle offre d'emploi",
            description: `Vous avez une nouvelle offre d'emploi: ${data.job.title} chez ${data.job.company.name}`,
          });
        }
      );
    
    // Écouter les nouvelles notifications
    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log('Nouvelle notification reçue:', payload);
          setNewNotifications(prev => [payload.new as Notification, ...prev]);
          
          // Afficher une toast pour la notification
          toast({
            title: payload.new.title,
            description: payload.new.message,
          });
        }
      );
      
    // Activer les canaux
    jobsChannel.subscribe();
    notificationsChannel.subscribe();
    
    // Récupérer les données initiales
    refreshData();
    
    // Nettoyage à la désinscription
    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [userId, candidateId]);
  
  return { 
    newJobMatches, 
    newDocuments, 
    newNotifications, 
    refreshData 
  };
}
