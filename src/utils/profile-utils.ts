"use server";

import { createClient } from "../../supabase/server";

/**
 * Assure qu'un profil candidat existe pour l'utilisateur donné
 * Crée automatiquement le profil s'il n'existe pas
 */
export async function ensureCandidateProfile(userId: string, userData: {
  full_name?: string;
  email?: string;
  role?: string;
}) {
  const supabase = await createClient();
  
  try {
    // Vérifier si le profil existe déjà
    const { data: existingProfile, error: checkError } = await supabase
      .from('candidate_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // Erreur autre que "pas trouvé"
      throw checkError;
    }
    
    if (existingProfile) {
      console.log('✅ Profil candidat existe déjà:', existingProfile.id);
      return { success: true, data: existingProfile, error: null };
    }
    
    // Créer le profil s'il n'existe pas et si l'utilisateur a le bon rôle
    if (!userData.role || !['candidate', 'worker', 'staff'].includes(userData.role)) {
      return { success: false, data: null, error: 'User role does not require candidate profile' };
    }
    
    console.log('🔄 Création automatique du profil candidat pour:', userId);
    
    const { data: newProfile, error: createError } = await supabase
      .from('candidate_profiles')
      .insert({
        user_id: userId,
        full_name: userData.full_name || '',
        email: userData.email || '',
        is_available: true,
        skills: [],
        rating: 0
      })
      .select()
      .single();
    
    if (createError) {
      if (createError.code === '23505') {
        // Profil créé entre temps par une autre requête
        const { data: retryProfile } = await supabase
          .from('candidate_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();
        
        return { success: true, data: retryProfile, error: null };
      }
      throw createError;
    }
    
    console.log('✅ Profil candidat créé automatiquement:', newProfile.id);
    return { success: true, data: newProfile, error: null };
    
  } catch (error) {
    console.error("Erreur lors de la création automatique du profil:", error);
    return { success: false, data: null, error };
  }
}

/**
 * Vérifie et crée le profil candidat pour un utilisateur nouvellement connecté
 */
export async function checkAndCreateProfileOnSignIn(user: any) {
  if (!user) return null;
  
  const userRole = user.user_metadata?.role;
  
  // Ne créer un profil que pour les rôles appropriés
  if (!userRole || !['candidate', 'worker', 'staff'].includes(userRole)) {
    return null;
  }
  
  return await ensureCandidateProfile(user.id, {
    full_name: user.user_metadata?.full_name || '',
    email: user.email || '',
    role: userRole
  });
}
