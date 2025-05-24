"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
  rating: number | null;
  created_at: string;
  updated_at: string;
  skills: string[];
}

export interface ExperienceEntry {
  id: string;
  staff_id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  is_current: boolean;
}

export interface DocumentEntry {
  id: string;
  staff_id: string;
  name: string;
  type: string;
  url: string;
  file_path: string;
  status: string;
  created_at: string;
  expires_at: string | null;
}

export interface JobMatch {
  id: string;
  job_id: string;
  staff_id: string;
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

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadStaffData() {
      try {
        setLoading(true);
        
        // Obtenir l'utilisateur courant
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) return;
        
        setUser(user);
        
        // Charger le profil du staff
        const { data: profileData, error: profileError } = await supabase
          .from('staff_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        
        if (profileData) {
          setProfile(profileData);
          
          // Charger les expériences
          const { data: experiencesData, error: experiencesError } = await supabase
            .from('staff_experience')
            .select('*')
            .eq('staff_id', profileData.id)
            .order('start_date', { ascending: false });
          
          if (experiencesError) throw experiencesError;
          setExperiences(experiencesData || []);
          
          // Charger les documents
          const { data: documentsData, error: documentsError } = await supabase
            .from('staff_documents')
            .select('*')
            .eq('staff_id', profileData.id);
          
          if (documentsError) throw documentsError;
          setDocuments(documentsData || []);
          
          // Charger les correspondances d'emploi
          const { data: matchesData, error: matchesError } = await supabase
            .from('job_matches')
            .select(`
              id, 
              job_id, 
              staff_id, 
              status, 
              job:job_postings (
                id, 
                title, 
                company_name,
                location, 
                hourly_rate,
                start_date, 
                end_date
              )
            `)
            .eq('staff_id', profileData.id);
          
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

    loadStaffData();
    
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
