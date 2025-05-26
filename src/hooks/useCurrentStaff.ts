"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/context/supabase-provider";
import { User } from "@supabase/supabase-js";

export interface StaffProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  bio: string | null;
  avatar_url: string | null;
  is_available: boolean;
  availability_start: string | null;
  availability_end: string | null;
  hourly_rate: number | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
  skills: string[];
}

export interface ExperienceEntry {
  id: string;
  candidate_id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  is_current: boolean;
}

export interface DocumentEntry {
  id: string;
  candidate_id: string;
  name: string;
  file_type: string;
  file_path: string;
  file_size: number;
  status: string;
  upload_date: string;
  notes: string | null;
  public_url: string | null;
}

export interface JobMatch {
  id: string;
  job_id: string;
  candidate_id: string;
  status: string;
  job: {
    id: string;
    title: string;
    company_name: string;
    location: string;
    hourly_rate: number;
    start_date: string;
    end_date: string;
  };
}

export interface UseCurrentStaffResult {
  user: User | null;
  profile: StaffProfile | null;
  experiences: ExperienceEntry[];
  documents: DocumentEntry[];
  jobMatches: JobMatch[];
  loading: boolean;
  error: Error | null;
}

export function useCurrentStaff(): UseCurrentStaffResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = useSupabase();

  useEffect(() => {
    async function loadStaffData() {
      try {
        setLoading(true);
        setError(null);
        
        // Vérifier l'état d'authentification d'abord
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session?.user) {
          // Pas d'utilisateur connecté, c'est normal
          setUser(null);
          setProfile(null);
          setExperiences([]);
          setDocuments([]);
          setJobMatches([]);
          return;
        }
        
        const user = session.user;
        setUser(user);
        
        // Charger le profil du staff
        const { data: profileDataArray, error: profileError } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
        
        if (profileError) throw profileError;
        
        const profileData = profileDataArray && profileDataArray.length > 0 ? profileDataArray[0] : null;
        let currentProfile = profileData;
        
        if (profileData) {
          setProfile(profileData);
        } else {
          // Créer automatiquement le profil si l'utilisateur a le bon rôle
          const userRole = user.user_metadata?.role;
          if (userRole === 'staff' || userRole === 'candidate' || userRole === 'worker') {
            try {
              console.log('🔄 Création automatique du profil candidat pour:', user.id);
              
              const { data: newProfile, error: createError } = await supabase
                .from('candidate_profiles')
                .insert({
                  user_id: user.id,
                  full_name: user.user_metadata?.full_name || '',
                  email: user.email || '',
                  is_available: true,
                  skills: [],
                  rating: 0
                })
                .select()
                .single();
              
              if (createError) {
                if (createError.code === '23505') {
                  // Profil créé entre temps, essayer de le récupérer à nouveau
                  const { data: retryProfileArray } = await supabase
                    .from('candidate_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .limit(1);
                  
                  if (retryProfileArray && retryProfileArray.length > 0) {
                    currentProfile = retryProfileArray[0];
                    setProfile(currentProfile);
                  }
                } else {
                  console.error("Erreur création automatique du profil:", createError);
                }
              } else {
                console.log('✅ Profil candidat créé automatiquement:', newProfile.id);
                currentProfile = newProfile;
                setProfile(newProfile);
              }
            } catch (createErr) {
              console.error("Erreur lors de la création automatique du profil:", createErr);
              // Continuer sans profil
            }
          }
        }
        
        // Charger les données liées au profil seulement si un profil existe
        if (currentProfile) {
          // Charger les expériences
          const { data: experiencesData, error: experiencesError } = await supabase
            .from('candidate_experiences')
            .select('*')
            .eq('candidate_id', currentProfile.id)
            .order('start_date', { ascending: false });
          
          if (experiencesError) throw experiencesError;
          setExperiences(experiencesData || []);
          
          // Charger les documents
          const { data: documentsData, error: documentsError } = await supabase
            .from('candidate_documents')
            .select('*')
            .eq('candidate_id', currentProfile.id);
          
          if (documentsError) throw documentsError;
          setDocuments(documentsData || []);
          
          // Charger les correspondances d'emploi
          const { data: matchesData, error: matchesError } = await supabase
            .from('job_matches')
            .select(`
              id, 
              job_id, 
              candidate_id, 
              status, 
              job:job_offers (
                id, 
                title, 
                company_id,
                location, 
                hourly_rate,
                start_date, 
                end_date
              )
            `)
            .eq('candidate_id', currentProfile.id);
          
          if (matchesError) throw matchesError;
          setJobMatches((matchesData || []) as unknown as JobMatch[]);
        }
      } catch (err: any) {
        console.error('Error loading staff data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    // Charger les données initiales
    loadStaffData();
    
    // Écouter les changements d'authentification
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Recharger les données quand l'utilisateur se connecte
          loadStaffData();
        } else if (event === 'SIGNED_OUT') {
          // Nettoyer les données quand l'utilisateur se déconnecte
          setUser(null);
          setProfile(null);
          setExperiences([]);
          setDocuments([]);
          setJobMatches([]);
          setError(null);
          setLoading(false);
        }
      }
    );
    
    // Cleanup function
    return () => {
      authSubscription.unsubscribe();
    };
    
    // S'abonner aux changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadStaffData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, profile, experiences, documents, jobMatches, loading, error };
}
