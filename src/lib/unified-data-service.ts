"use client";

import { createBrowserClient } from "@supabase/ssr";
import { toast } from "@/components/ui/use-toast";

// Unified types
export type UserRole = 'company' | 'staff' | 'candidate' | 'worker' | 'admin';

export interface CandidateFormData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  skills: string[];
  certifications: string[];
  experience: ExperienceEntry[];
  availabilityStart?: Date;
  availabilityEnd?: Date;
  hourlyRate: string;
  isAvailable: boolean;
  bio: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  isCurrent: boolean;
}

// Singleton Supabase client
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  return supabaseInstance;
};

// Unified data service
export class UnifiedDataService {
  private supabase = getSupabaseClient();

  // Profile management
  async updateProfile(userId: string, profileData: {
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
    try {
      const { data: existingProfile, error: selectError } = await this.supabase
        .from('candidate_profiles')
        .select('id, user_id')
        .eq('user_id', userId)
        .single();

      if (selectError) throw selectError;
      if (!existingProfile) throw new Error("Profile not found for user");

      const { data, error } = await this.supabase
        .from('candidate_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Votre profil a été mis à jour avec succès.",
      });

      return { success: true, error: null, data };
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  }

  // Experience management
  async addExperience(userId: string, experienceData: {
    title: string;
    company: string;
    start_date: string;
    end_date?: string;
    description: string;
    is_current: boolean;
  }) {
    try {
      const { data: profile, error: profileError } = await this.supabase
        .from('candidate_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Profile not found for user");

      const { data, error } = await this.supabase
        .from('candidate_experiences')
        .insert({
          candidate_id: profile.id,
          ...experienceData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Expérience ajoutée",
        description: "Votre expérience professionnelle a été ajoutée avec succès.",
      });

      return { success: true, data, error: null };
    } catch (error) {
      console.error("Error adding experience:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'expérience.",
        variant: "destructive",
      });
      return { success: false, data: null, error };
    }
  }

  async updateExperience(experienceId: string, experienceData: {
    title: string;
    company: string;
    start_date: string;
    end_date?: string;
    description: string;
    is_current: boolean;
  }) {
    try {
      const { data, error } = await this.supabase
        .from('candidate_experiences')
        .update({
          ...experienceData,
          updated_at: new Date().toISOString()
        })
        .eq('id', experienceId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Expérience mise à jour",
        description: "Votre expérience a été mise à jour avec succès.",
      });

      return { success: true, data, error: null };
    } catch (error) {
      console.error("Error updating experience:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'expérience.",
        variant: "destructive",
      });
      return { success: false, data: null, error };
    }
  }

  async deleteExperience(experienceId: string) {
    try {
      const { error } = await this.supabase
        .from('candidate_experiences')
        .delete()
        .eq('id', experienceId);

      if (error) throw error;

      toast({
        title: "Expérience supprimée",
        description: "L'expérience a été supprimée avec succès.",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'expérience.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  }

  // Job matching
  async acceptJobMatch(matchId: string) {
    try {
      const { error } = await this.supabase
        .from('job_matches')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: "Offre acceptée",
        description: "Vous avez accepté cette offre d'emploi.",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error accepting job:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter cette offre.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  }

  async rejectJobMatch(matchId: string, reason?: string) {
    try {
      const { error } = await this.supabase
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
        description: "Impossible de refuser cette offre.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  }

  // Availability management
  async updateAvailability(
    candidateId: string,
    isAvailable: boolean,
    startDate?: Date | null,
    endDate?: Date | null
  ) {
    try {
      const { error } = await this.supabase
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
        title: "Disponibilité mise à jour",
        description: isAvailable
          ? "Vous êtes maintenant disponible pour des missions."
          : "Vous êtes maintenant indiqué comme non disponible.",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre disponibilité.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  }

  // Document management
  async uploadDocument(candidateId: string, file: File, documentName: string) {
    try {
      const fileName = `${candidateId}/${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('candidates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicData } = this.supabase.storage
        .from('candidates')
        .getPublicUrl(fileName);

      const { data: docData, error: docError } = await this.supabase
        .from('candidate_documents')
        .insert({
          candidate_id: candidateId,
          name: documentName,
          file_type: file.type,
          file_path: fileName,
          file_size: file.size,
          public_url: publicData.publicUrl,
          status: 'active',
          upload_date: new Date().toISOString()
        })
        .select()
        .single();

      if (docError) throw docError;

      toast({
        title: "Document téléchargé",
        description: `${documentName} a été téléchargé avec succès.`,
      });

      return {
        success: true,
        filePath: fileName,
        publicUrl: publicData.publicUrl,
        documentData: docData,
        error: null
      };
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
      return { success: false, filePath: null, publicUrl: null, error };
    }
  }

  async deleteDocument(documentId: string, filePath: string) {
    try {
      const { error: storageError } = await this.supabase.storage
        .from('candidates')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await this.supabase
        .from('candidate_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  }

  // Data mapping utilities
  mapSupabaseDataToComponentProps({ user, profile, experiences, documents, jobMatches }: any) {
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
        url: doc.public_url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/candidates/${doc.file_path}`,
        type: doc.file_type,
        uploadedAt: new Date(doc.upload_date)
      })) || [],
      jobMatches: jobMatches?.map((match: any) => ({
        id: match.id,
        title: match.job.title,
        company: {
          id: match.job.company?.id || match.job.company_id,
          name: match.job.company?.name || "Entreprise non spécifiée",
          logoUrl: match.job.company?.logo_url || undefined
        },
        location: match.job.location,
        startDate: new Date(match.job.start_date),
        endDate: match.job.end_date ? new Date(match.job.end_date) : undefined,
        salary: match.job.hourly_rate,
        skills: match.job.skills_required || [],
        matchPercentage: match.match_percentage || 85,
        status: match.status
      })) || []
    };
  }
}

// Export singleton instance
export const dataService = new UnifiedDataService();

// Legacy exports for backward compatibility
export const {
  updateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  acceptJobMatch,
  rejectJobMatch,
  updateAvailability,
  uploadDocument,
  deleteDocument
} = dataService;