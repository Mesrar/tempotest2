"use client";

import { createBrowserClient } from "@supabase/ssr";
import { CandidateFormData } from "./CandidateProfileForm";
import { toast } from "@/components/ui/use-toast";

// Fonction pour mapper les données Supabase aux props de composants
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

// Fonction pour initialiser le client Supabase
const getSupabaseClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
};

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
