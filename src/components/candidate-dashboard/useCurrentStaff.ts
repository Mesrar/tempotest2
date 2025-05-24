"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { CandidateProfile, CandidateExperience, CandidateDocument, JobMatch } from "@/lib/supabase-client";

// Type pour l'utilisateur courant
interface CurrentUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
}

// Type de retour du hook
export interface UseCurrentStaffResult {
  user: CurrentUser | null;
  profile: CandidateProfile | null;
  experiences: CandidateExperience[];
  documents: CandidateDocument[];
  jobMatches: JobMatch[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook personnalisé pour récupérer les données du personnel logistique
 */
export function useCurrentStaff(): UseCurrentStaffResult {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [experiences, setExperiences] = useState<CandidateExperience[]>([]);
  const [documents, setDocuments] = useState<CandidateDocument[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    async function fetchUserData() {
      try {
        setLoading(true);

        // 1. Récupérer l'utilisateur courant
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (!userData.user) {
          setLoading(false);
          return;
        }

        setUser(userData.user as CurrentUser);

        // 2. Récupérer le profil candidat
        const { data: profileData, error: profileError } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('user_id', userData.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 = pas de ligne trouvée, ce n'est pas une vraie erreur dans ce contexte
          throw profileError;
        }

        if (!profileData) {
          // Si aucun profil n'existe, on termine le chargement mais on continue
          // pour permettre à l'utilisateur de créer son profil
          setLoading(false);
          return;
        }

        setProfile(profileData as CandidateProfile);

        // 3. Récupérer les expériences
        const { data: experiencesData, error: experiencesError } = await supabase
          .from('candidate_experiences')
          .select('*')
          .eq('candidate_id', profileData.id)
          .order('start_date', { ascending: false });

        if (experiencesError) throw experiencesError;
        setExperiences(experiencesData as CandidateExperience[]);

        // 4. Récupérer les documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('candidate_documents')
          .select('*')
          .eq('candidate_id', profileData.id)
          .order('upload_date', { ascending: false });

        if (documentsError) throw documentsError;
        setDocuments(documentsData as CandidateDocument[]);

        // 5. Récupérer les offres d'emploi correspondantes
        const { data: matchesData, error: matchesError } = await supabase
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
          .eq('candidate_id', profileData.id)
          .order('created_at', { ascending: false });

        if (matchesError) throw matchesError;
        setJobMatches(matchesData as JobMatch[]);

      } catch (err) {
        console.error("Error fetching staff data:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return { user, profile, experiences, documents, jobMatches, loading, error };
}

/**
 * Transforme les données Supabase en format attendu par les composants d'interface
 */
export function mapSupabaseDataToComponentProps(data: UseCurrentStaffResult) {
  if (!data.profile) return null;

  // Mapper le profil candidat au format attendu par CandidateProfileCard
  const candidate = {
    id: data.profile.id,
    name: data.profile.full_name,
    avatarUrl: data.profile.avatar_url || undefined,
    isAvailable: data.profile.is_available,
    rating: data.profile.rating,
    skills: data.profile.skills || [],
    email: data.profile.email,
    phone: data.profile.phone,
    location: data.profile.location,
    bio: data.profile.bio || undefined,
    hourlyRate: data.profile.hourly_rate?.toString() || "0",
    availabilityStart: data.profile.availability_start ? new Date(data.profile.availability_start) : undefined,
    availabilityEnd: data.profile.availability_end ? new Date(data.profile.availability_end) : undefined,
    // Extraire les certifications des documents
    certifications: data.documents
      .filter(doc => doc.name.toLowerCase().includes('certification') || doc.name.toLowerCase().includes('certificat'))
      .map(doc => doc.name.replace(/\.(pdf|png|jpg|jpeg)$/i, '')),
    // Convertir les expériences
    experience: data.experiences.map(exp => ({
      id: exp.id,
      title: exp.title,
      company: exp.company,
      startDate: new Date(exp.start_date),
      endDate: exp.end_date ? new Date(exp.end_date) : undefined,
      description: exp.description,
      isCurrent: exp.is_current
    }))
  };

  // Mapper les documents
  const documents = data.documents.map(doc => ({
    id: doc.id,
    name: doc.name,
    url: doc.public_url || 
      // Fallback en construisant l'URL à partir du chemin du fichier si public_url n'existe pas
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/candidates/${doc.file_path}`,
    type: doc.file_type,
    uploadedAt: new Date(doc.upload_date)
  }));

  // Mapper les offres d'emploi correspondantes
  const jobMatches = data.jobMatches.map(match => ({
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
  }));

  return {
    candidate,
    documents,
    jobMatches
  };
}
