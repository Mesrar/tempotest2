"use client";

import { createBrowserClient } from "@supabase/ssr";
import { CandidateFormData } from "./CandidateProfileForm";
import { toast } from "@/components/ui/use-toast";

// Instance singleton du client Supabase pour éviter les multiples instances
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

// Fonction pour initialiser le client Supabase (singleton)
const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        global: {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      }
    );
  }
  return supabaseInstance;
};
export function mapSupabaseDataToComponentProps({ user, profile, experiences, documents, jobMatches }: any) {
  if (!profile) return null;

  return {
    candidate: {
      id: profile.id,
      name: profile.full_name,
      avatarUrl: profile.avatar_url,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      isAvailable: profile.is_available,
      rating: profile.rating,
      skills: profile.skills || [],
      availability: {
        startDate: profile.availability_start ? new Date(profile.availability_start) : null,
        endDate: profile.availability_end ? new Date(profile.availability_end) : null
      },
      experience: experiences?.map((exp: any) => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        startDate: exp.start_date ? new Date(exp.start_date) : new Date(),
        endDate: exp.end_date ? new Date(exp.end_date) : null,
        description: exp.description || '',
        isCurrent: exp.is_current
      })) || []
    },
    documents: documents?.map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      url: doc.url,
      filePath: doc.file_path,
      status: doc.status,
      createdAt: new Date(doc.created_at),
      expiresAt: doc.expires_at ? new Date(doc.expires_at) : null
    })) || [],
    jobMatches: jobMatches?.map((match: any) => ({
      id: match.id,
      jobId: match.job_id,
      status: match.status,
      job: {
        id: match.job.id,
        title: match.job.title,
        company: match.job.company_name,
        location: match.job.location,
        hourlyRate: match.job.hourly_rate,
        startDate: new Date(match.job.start_date),
        endDate: new Date(match.job.end_date)
      }
    })) || []
  };
}

/**
 * Fonction pour mettre à jour le profil d'un candidat
 */
export async function updateCandidateProfile(candidateId: string, data: CandidateFormData) {
  const supabase = getSupabaseClient();
  
  try {
    // Mettre à jour le profil de base
    const { error: profileError } = await supabase
      .from('candidate_profiles')
      .update({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email,
        location: data.location,
        bio: data.bio,
        hourly_rate: parseInt(data.hourlyRate),
        skills: data.skills,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateId);

    if (profileError) throw profileError;

    // Si des expériences ont été fournies, les traiter
    if (data.experience && data.experience.length > 0) {
      // Nous allons d'abord supprimer toutes les expériences existantes pour simplifier
      // Dans une implémentation réelle, on pourrait comparer et faire des mises à jour ciblées
      await supabase
        .from('candidate_experiences')
        .delete()
        .eq('candidate_id', candidateId);

      // Puis insérer les nouvelles expériences
      const experiencesToInsert = data.experience.map(exp => ({
        candidate_id: candidateId,
        title: exp.title,
        company: exp.company,
        location: (exp as any).location || '',
        start_date: exp.startDate.toISOString(),
        end_date: exp.isCurrent ? null : (exp.endDate ? exp.endDate.toISOString() : null),
        is_current: exp.isCurrent,
        description: exp.description,
        created_at: new Date().toISOString()
      }));

      const { error: expError } = await supabase
        .from('candidate_experiences')
        .insert(experiencesToInsert);

      if (expError) throw expError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error };
  }
}

/**
 * Fonction pour mettre à jour la disponibilité d'un candidat
 */
export async function updateAvailability(
  candidateId: string, 
  isAvailable: boolean, 
  startDate?: Date | null, 
  endDate?: Date | null
) {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase
      .from('candidate_profiles')
      .update({
        is_available: isAvailable,
        availability_start: startDate ? startDate.toISOString() : null,
        availability_end: endDate ? endDate.toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateId);

    if (error) throw error;
    
    toast({
      title: "Statut de disponibilité mis à jour",
      description: isAvailable
        ? "Vous êtes maintenant disponible pour des missions."
        : "Vous êtes maintenant indiqué comme non disponible.",
    });
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating availability:", error);
    toast({
      title: "Erreur",
      description: "Impossible de mettre à jour votre disponibilité. Veuillez réessayer.",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

/**
 * Fonction pour accepter une offre d'emploi
 */
export async function acceptJobMatch(matchId: string) {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase
      .from('job_matches')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId);

    if (error) throw error;
    
    toast({
      title: "Offre acceptée",
      description: "Vous avez accepté cette offre d'emploi. L'employeur sera notifié.",
    });
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error accepting job:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'accepter cette offre. Veuillez réessayer.",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

/**
 * Fonction pour refuser une offre d'emploi
 */
export async function rejectJobMatch(matchId: string, reason?: string) {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase
      .from('job_matches')
      .update({
        status: 'rejected',
        rejection_reason: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', matchId);

    if (error) throw error;
    
    toast({
      title: "Offre refusée",
      description: "Vous avez refusé cette offre d'emploi.",
    });
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error rejecting job:", error);
    toast({
      title: "Erreur",
      description: "Impossible de refuser cette offre. Veuillez réessayer.",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

/**
 * Fonction pour télécharger un document
 */
export async function uploadDocument(candidateId: string, file: File, documentName: string) {
  const supabase = getSupabaseClient();

  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = `documents/${candidateId}/${fileName}`;
    
    // Télécharger le fichier
    const { error: uploadError, data } = await supabase.storage
      .from('candidates')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Créer une URL publique pour le fichier
    const { data: publicUrlData } = supabase.storage
      .from('candidates')
      .getPublicUrl(filePath);
      
    const publicUrl = publicUrlData.publicUrl;
    
    // Enregistrer les métadonnées du document
    const { error: dbError } = await supabase
      .from('candidate_documents')
      .insert({
        candidate_id: candidateId,
        name: documentName || file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        status: 'pending',
        upload_date: new Date().toISOString(),
        public_url: publicUrl
      });

    if (dbError) throw dbError;
    
    toast({
      title: "Document téléchargé",
      description: "Votre document a été téléchargé avec succès.",
    });
    
    return { success: true, filePath, publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading document:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger ce document. Veuillez réessayer.",
      variant: "destructive",
    });
    return { success: false, filePath: null, publicUrl: null, error };
  }
}

/**
 * Fonction pour supprimer un document
 */
export async function deleteDocument(documentId: string, filePath: string) {
  const supabase = getSupabaseClient();

  try {
    // D'abord supprimer le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('candidates')
      .remove([filePath]);
      
    if (storageError) throw storageError;
    
    // Puis supprimer les métadonnées de la base de données
    const { error: dbError } = await supabase
      .from('candidate_documents')
      .delete()
      .eq('id', documentId);

    if (dbError) throw dbError;
    
    toast({
      title: "Document supprimé",
      description: "Votre document a été supprimé avec succès.",
    });
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting document:", error);
    toast({
      title: "Erreur",
      description: "Impossible de supprimer ce document. Veuillez réessayer.",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

/**
 * Fonction pour marquer une notification comme lue
 */
export async function markNotificationAsRead(notificationId: string) {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error };
  }
}

/**
 * Fonction pour marquer toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(userId: string) {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    
    toast({
      title: "Notifications",
      description: "Toutes les notifications ont été marquées comme lues.",
    });
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    toast({
      title: "Erreur",
      description: "Impossible de marquer les notifications comme lues.",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

/**
 * Fonction pour ajouter une expérience
 */
export async function addExperience(userId: string, experienceData: {
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description: string;
  is_current: boolean;
}) {
  const supabase = getSupabaseClient();
  
  try {
    console.log("🔄 Adding experience for userId:", userId);
    console.log("📝 Experience data:", experienceData);
    
    // First, get the candidate profile ID from the user ID
    const { data: profile, error: profileError } = await supabase
      .from('candidate_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (profileError) {
      console.error("❌ Error finding profile for experience:", profileError);
      throw profileError;
    }
    
    if (!profile) {
      console.error("❌ No profile found for user experience:", userId);
      throw new Error("Profile not found for user");
    }
    
    console.log("✅ Found profile for experience:", profile);
    
    const { data, error } = await supabase
      .from('candidate_experiences')
      .insert({
        candidate_id: profile.id,
        title: experienceData.title,
        company: experienceData.company,
        start_date: experienceData.start_date,
        end_date: experienceData.end_date,
        description: experienceData.description,
        is_current: experienceData.is_current,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Experience insert error:", error);
      throw error;
    }
    
    console.log("✅ Experience added successfully:", data);
    
    toast({
      title: "Expérience ajoutée",
      description: "Votre expérience professionnelle a été ajoutée avec succès.",
    });
    
    return { success: true, data, error: null };
  } catch (error) {
    console.error("❌ Error adding experience:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'ajouter l'expérience. Veuillez réessayer.",
      variant: "destructive",
    });
    return { success: false, data: null, error };
  }
}

/**
 * Fonction pour mettre à jour une expérience
 */
export async function updateExperience(experienceId: string, experienceData: {
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description: string;
  is_current: boolean;
}) {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('candidate_experiences')
      .update({
        title: experienceData.title,
        company: experienceData.company,
        start_date: experienceData.start_date,
        end_date: experienceData.end_date,
        description: experienceData.description,
        is_current: experienceData.is_current,
        updated_at: new Date().toISOString()
      })
      .eq('id', experienceId)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Expérience mise à jour",
      description: "Les informations de l'expérience ont été mises à jour.",
    });
    
    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error updating experience:", error);
    toast({
      title: "Erreur",
      description: "Impossible de mettre à jour l'expérience. Veuillez réessayer.",
      variant: "destructive",
    });
    return { success: false, data: null, error };
  }
}

/**
 * Fonction pour supprimer une expérience
 */
export async function deleteExperience(experienceId: string) {
  const supabase = getSupabaseClient();
  
  try {
    const { error } = await supabase
      .from('candidate_experiences')
      .delete()
      .eq('id', experienceId);

    if (error) throw error;
    
    toast({
      title: "Expérience supprimée",
      description: "L'expérience a été supprimée de votre profil.",
    });
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting experience:", error);
    toast({
      title: "Erreur",
      description: "Impossible de supprimer l'expérience. Veuillez réessayer.",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

/**
 * Fonction pour mettre à jour le profil de base
 */
export async function updateProfile(userId: string, profileData: {
  full_name: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  hourly_rate: number | null;
  is_available: boolean;
  availability_start?: string;
  availability_end?: string;
}) {
  const supabase = getSupabaseClient();
  
  try {
    console.log("🔄 Updating profile for userId:", userId);
    console.log("📝 Profile data:", profileData);
    
    // First check if the profile exists
    const { data: existingProfile, error: selectError } = await supabase
      .from('candidate_profiles')
      .select('id, user_id')
      .eq('user_id', userId)
      .single();
    
    if (selectError) {
      console.error("❌ Error finding profile:", selectError);
      throw selectError;
    }
    
    if (!existingProfile) {
      console.error("❌ No profile found for user:", userId);
      throw new Error("Profile not found for user");
    }
    
    console.log("✅ Found existing profile:", existingProfile);
    
    const { data, error } = await supabase
      .from('candidate_profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error("❌ Update error:", error);
      throw error;
    }
    
    console.log("✅ Profile updated successfully:", data);
    return { success: true, error: null, data };
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return { success: false, error };
  }
}

// Export all functions as a service object
export const staffDataService = {
  updateCandidateProfile,
  updateAvailability,
  acceptJobMatch,
  rejectJobMatch,
  uploadDocument,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addExperience,
  updateExperience,
  deleteExperience,
  updateProfile,
  mapSupabaseDataToComponentProps
};
