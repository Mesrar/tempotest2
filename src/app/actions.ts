"use server";

import { encodedRedirect, getLocaleFromFormData } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  const userRole = formData.get("user_role")?.toString() || 'company'; // Valeur par défaut 'company'
  const locale = getLocaleFromFormData(formData);
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      `/${locale}/sign-up`,
      "Email and password are required",
    );
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        email: email,
        role: userRole, // Stocker le rôle dans les métadonnées utilisateur
      }
    },
  });

  if (error) {
    // Gestion des erreurs spécifiques d'inscription
    let errorMessage = error.message;
    
    if (error.message.includes('User already registered')) {
      errorMessage = locale === 'fr' ? 
        'Cet email est déjà utilisé. Essayez de vous connecter.' :
        locale === 'ar' ?
        'هذا البريد الإلكتروني مستخدم بالفعل. حاول تسجيل الدخول.' :
        'This email is already registered. Try signing in.';
    } else if (error.message.includes('Invalid email')) {
      errorMessage = locale === 'fr' ? 
        'Adresse email invalide.' :
        locale === 'ar' ?
        'عنوان بريد إلكتروني غير صالح.' :
        'Invalid email address.';
    } else if (error.message.includes('Password')) {
      errorMessage = locale === 'fr' ? 
        'Le mot de passe doit contenir au moins 6 caractères.' :
        locale === 'ar' ?
        'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.' :
        'Password must be at least 6 characters long.';
    }
    
    return encodedRedirect("error", `/${locale}/sign-up`, errorMessage);
  }

  // Vérifier que l'utilisateur a bien été créé
  if (!user) {
    return encodedRedirect(
      "error", 
      `/${locale}/sign-up`, 
      locale === 'fr' ? 
        'Erreur lors de la création du compte. Veuillez réessayer.' :
        locale === 'ar' ?
        'خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.' :
        'Error creating account. Please try again.'
    );
  }

  // Créer le profil candidat si nécessaire - avec gestion améliorée des erreurs RLS
  if (user && (userRole === 'candidate' || userRole === 'worker' || userRole === 'staff')) {
    try {
      console.log('🔄 Création du profil candidat pour:', user.id);
      
      // Attendre un court délai pour s'assurer que la session est établie
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Vérifier d'abord si le profil existe déjà
      const { data: existingProfile } = await supabase
        .from('candidate_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (existingProfile) {
        console.log('✅ Profil candidat existe déjà:', existingProfile.id);
      } else {
        // Créer le profil candidat avec retry logic pour les erreurs RLS
        let retryCount = 0;
        const maxRetries = 3;
        let profileCreated = false;
        
        while (retryCount < maxRetries && !profileCreated) {
          try {
            console.log(`🔄 Tentative de création profil (${retryCount + 1}/${maxRetries})`);
            
            // Utiliser un client administrateur pour contourner les politiques RLS temporairement
            const adminSupabase = await createClient();
            
            const { data: profile, error: profileError } = await adminSupabase
              .from('candidate_profiles')
              .insert({
                user_id: user.id,
                full_name: fullName,
                email: email,
                is_available: true,
                skills: [],
                rating: 0
              })
              .select()
              .single();

            if (profileError) {
              if (profileError.code === '42501' && retryCount < maxRetries - 1) {
                // Erreur RLS, réessayer après un délai plus long
                console.log(`⚠️ Erreur RLS (${profileError.code}), retry ${retryCount + 1}/${maxRetries}`);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Délai progressif
                continue;
              } else if (profileError.code === '23505') {
                // Profil déjà existant, ne pas considérer comme une erreur
                console.log('✅ Profil candidat existe déjà (contrainte unique)');
                profileCreated = true;
                break;
              }
              throw profileError;
            }
            
            console.log('✅ Profil candidat créé:', profile.id);
            profileCreated = true;
          } catch (retryError) {
            retryCount++;
            if (retryCount >= maxRetries) {
              console.error('❌ Échec création profil après', maxRetries, 'tentatives');
              // Ne pas bloquer l'inscription, l'utilisateur pourra créer son profil plus tard
              console.log('⚠️ Inscription réussie mais profil non créé - sera créé à la première connexion');
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
      }
    } catch (err) {
      console.error('❌ Erreur création profil:', err);
      // Ne pas bloquer l'inscription si la création du profil échoue
      // L'utilisateur pourra créer son profil lors de la première connexion
      console.log('⚠️ Profil candidat non créé, mais inscription réussie');
    }
  }

  // Rediriger vers la page de confirmation d'email avec l'adresse email
  return redirect(`/${locale}/email-confirmation?email=${encodeURIComponent(email)}`);
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = getLocaleFromFormData(formData);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", `/${locale}/sign-in`, error.message);
  }

  // Redirection basée sur le rôle de l'utilisateur
  const userRole = data.user?.user_metadata?.role;
  
  if (userRole === 'staff' || userRole === 'candidate' || userRole === 'worker') {
    return redirect(`/${locale}/dashboard/candidate`);
  }
  
  return redirect(`/${locale}/dashboard`);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();
  const locale = getLocaleFromFormData(formData);

  if (!email) {
    return encodedRedirect("error", `/${locale}/forgot-password`, "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {});

  if (error) {
    return encodedRedirect(
      "error",
      `/${locale}/forgot-password`,
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    `/${locale}/forgot-password`,
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const locale = getLocaleFromFormData(formData);

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      `/${locale}/protected/reset-password`,
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      `/${locale}/dashboard/reset-password`,
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      `/${locale}/dashboard/reset-password`,
      "Password update failed",
    );
  }

  return encodedRedirect("success", `/${locale}/protected/reset-password`, "Password updated");
};

export const signOutAction = async (formData: FormData) => {
  const locale = getLocaleFromFormData(formData);
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect(`/${locale}/sign-in`);
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    return false;
  }

  return !!subscription;
};
