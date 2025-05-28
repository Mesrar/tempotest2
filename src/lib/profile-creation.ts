import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Résultat de la création d'un profil candidat
 */
export interface ProfileCreationResult {
  success: boolean;
  profileId?: string;
  error?: any;
  method?: 'existing' | 'service' | 'direct';
}

/**
 * Vérifie si un profil candidat existe déjà pour cet utilisateur
 */
export async function checkExistingProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{ exists: boolean; profileId?: string }> {
  console.log('🔍 Vérification profil existant pour:', userId);
  
  const { data: existingProfile } = await supabase
    .from('candidate_profiles')
    .select('id, user_id')
    .eq('user_id', userId)
    .single();

  if (existingProfile) {
    console.log('✅ Profil candidat existe déjà:', existingProfile.id);
    return { exists: true, profileId: existingProfile.id };
  }
  
  return { exists: false };
}

/**
 * Crée un profil candidat via la fonction de service RLS
 */
export async function createProfileViaService(
  supabase: SupabaseClient,
  userId: string,
  fullName: string,
  email: string
): Promise<ProfileCreationResult> {
  console.log('🔄 Tentative création via fonction de service pour:', userId);
  
  const { data: profileId, error: serviceError } = await supabase
    .rpc('create_candidate_profile_service', {
      p_user_id: userId,
      p_full_name: fullName || email,
      p_email: email
    });

  if (!serviceError) {
    console.log('✅ Profil candidat créé via fonction de service:', profileId);
    return { success: true, profileId, method: 'service' };
  }

  console.error('❌ Erreur fonction de service:', serviceError);
  return { success: false, error: serviceError };
}

/**
 * Crée ou met à jour l'entrée dans la table users
 */
export async function ensureUserEntry(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  fullName: string
): Promise<{ success: boolean; error?: any }> {
  console.log('🔄 Création/vérification entrée users pour:', userId);
  
  try {
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        user_id: userId,
        email: email,
        name: fullName || email,
        full_name: fullName || email,
        token_identifier: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (userError) {
      console.error('❌ Erreur création users:', userError);
      return { success: false, error: userError };
    }
    
    console.log('✅ Entrée users créée/mise à jour:', newUser);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors de la création users:', error);
    return { success: false, error };
  }
}

/**
 * Crée un profil candidat directement via insertion dans la table
 */
export async function createProfileDirect(
  supabase: SupabaseClient,
  userId: string,
  fullName: string,
  email: string
): Promise<ProfileCreationResult> {
  console.log('🔄 Création directe du profil candidat pour:', userId);
  
  try {
    const { data: profile, error: directError } = await supabase
      .from('candidate_profiles')
      .upsert({
        user_id: userId,
        full_name: fullName || email,
        email: email,
        is_available: true,
        skills: [],
        rating: 0
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (directError) {
      if (directError.code === '23505') {
        console.log('✅ Profil candidat existe déjà (contrainte unique)');
        return { success: true, method: 'direct' };
      }
      console.error('❌ Erreur création directe:', directError);
      return { success: false, error: directError };
    }

    console.log('✅ Profil candidat créé (méthode directe):', profile?.id);
    return { success: true, profileId: profile?.id, method: 'direct' };
  } catch (error) {
    console.error('❌ Erreur création directe:', error);
    return { success: false, error };
  }
}

/**
 * Gère les erreurs spécifiques de la fonction de service
 */
export async function handleServiceError(
  supabase: SupabaseClient,
  serviceError: any,
  userId: string,
  fullName: string,
  email: string
): Promise<ProfileCreationResult> {
  console.log('🔧 Gestion erreur fonction de service:', serviceError.code);
  
  // Erreur de contrainte FK - créer l'entrée users manquante
  if (serviceError.code === '23503') {
    console.log('⚠️ Erreur FK détectée - création de l\'entrée users manquante');
    
    const userResult = await ensureUserEntry(supabase, userId, email, fullName);
    if (!userResult.success) {
      return { success: false, error: userResult.error };
    }

    // Retry la fonction de service
    return await createProfileViaService(supabase, userId, fullName, email);
  }
  
  // Token identifier manquant
  if (serviceError.code === '23502' && serviceError.message.includes('token_identifier')) {
    console.log('⚠️ Tentative de correction token_identifier');
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ token_identifier: userId })
      .eq('id', userId);
    
    if (!updateError) {
      // Retry la fonction de service
      return await createProfileViaService(supabase, userId, fullName, email);
    }
    
    return { success: false, error: updateError };
  }
  
  // Fonction n'existe pas - continuer vers fallback
  if (serviceError.code === '42883') {
    console.log('⚠️ Fonction de service n\'existe pas encore');
    return { success: false, error: serviceError };
  }
  
  // Autres erreurs
  return { success: false, error: serviceError };
}

/**
 * Crée un profil candidat avec toutes les stratégies de fallback
 */
export async function createCandidateProfile(
  supabase: SupabaseClient,
  userId: string,
  fullName: string,
  email: string
): Promise<ProfileCreationResult> {
  console.log('🚀 Début création profil candidat pour:', userId);
  
  try {
    // 1. Vérifier si le profil existe déjà
    const existingCheck = await checkExistingProfile(supabase, userId);
    if (existingCheck.exists) {
      return { 
        success: true, 
        profileId: existingCheck.profileId, 
        method: 'existing' 
      };
    }
    
    // 2. Essayer la fonction de service RLS
    const serviceResult = await createProfileViaService(supabase, userId, fullName, email);
    if (serviceResult.success) {
      return serviceResult;
    }
    
    // 3. Gérer les erreurs spécifiques de la fonction de service
    const errorHandleResult = await handleServiceError(
      supabase, 
      serviceResult.error, 
      userId, 
      fullName, 
      email
    );
    if (errorHandleResult.success) {
      return errorHandleResult;
    }
    
    // 4. Fallback: méthode directe avec gestion FK
    console.log('⚠️ Fallback: création directe du profil avec gestion FK');
    
    // Vérifier/créer l'entrée users d'abord
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (!existingUser) {
      const userResult = await ensureUserEntry(supabase, userId, email, fullName);
      if (!userResult.success) {
        return { success: false, error: userResult.error };
      }
    }
    
    // Créer le profil candidat directement
    return await createProfileDirect(supabase, userId, fullName, email);
    
  } catch (error) {
    console.error('❌ Erreur complète création profil:', error);
    return { success: false, error };
  }
}

/**
 * Fonction principale pour créer un profil candidat avec gestion complète des erreurs
 */
export async function handleCandidateProfileCreation(
  supabase: SupabaseClient,
  userId: string,
  fullName: string,
  email: string,
  userRole: string
): Promise<{
  profileCreated: boolean;
  error?: any;
  requiresDbSetup?: boolean;
}> {
  // Vérifier si on doit créer un profil candidat
  if (!(userRole === 'candidate' || userRole === 'worker' || userRole === 'staff')) {
    return { profileCreated: true }; // Pas besoin de profil candidat
  }
  
  const result = await createCandidateProfile(supabase, userId, fullName, email);
  
  if (result.success) {
    console.log(`✅ Profil candidat créé avec succès (méthode: ${result.method})`);
    return { profileCreated: true };
  }
  
  // Analyser le type d'erreur pour déterminer si c'est un problème de configuration DB
  const isDbConfigError = 
    result.error?.code === '42883' || // Fonction n'existe pas
    result.error?.code === '23503' || // Contrainte FK
    result.error?.message?.includes('function') ||
    result.error?.message?.includes('RLS');
  
  return {
    profileCreated: false,
    error: result.error,
    requiresDbSetup: isDbConfigError
  };
}
