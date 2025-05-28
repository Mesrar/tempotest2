"use server";

import { encodedRedirect, getLocaleFromFormData } from "../utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import { handleCandidateProfileCreation } from "../lib/profile-creation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  const userRole = formData.get("user_role")?.toString() || 'company';
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
        role: userRole,
      }
    },
  });

  if (error) {
    // Gestion des erreurs spécifiques d'inscription
    let errorMessage = error.message;
    
    if (error.message.includes('User already registered') || 
        error.message.includes('already been registered') ||
        error.message.includes('Email address already registered') ||
        error.message.includes('signup_disabled')) {
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

  // Vérification critique: si l'utilisateur retourné existe depuis longtemps, c'est un compte existant
  if (user && !user.email_confirmed_at) {
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const timeDiff = now.getTime() - createdAt.getTime();
    
    // Si l'utilisateur a été créé il y a plus de 2 secondes, c'est probablement un compte existant
    if (timeDiff > 2000) { // 2 secondes
      const errorMessage = locale === 'fr' ? 
        'Cet email est déjà utilisé mais non confirmé. Vérifiez votre boîte email pour confirmer votre compte ou contactez le support.' :
        locale === 'ar' ?
        'هذا البريد الإلكتروني مستخدم بالفعل ولكن غير مؤكد. تحقق من صندوق البريد الإلكتروني لتأكيد حسابك أو اتصل بالدعم.' :
        'This email is already registered but not confirmed. Check your email to confirm your account or contact support.';
      
      return encodedRedirect("error", `/${locale}/sign-up`, errorMessage);
    }
  }

  // Si l'utilisateur existe et est déjà confirmé, c'est définitivement un compte existant
  if (user && user.email_confirmed_at) {
    const errorMessage = locale === 'fr' ? 
      'Cet email est déjà utilisé et confirmé. Essayez de vous connecter.' :
      locale === 'ar' ?
      'هذا البريد الإلكتروني مستخدم بالفعل ومؤكد. حاول تسجيل الدخول.' :
      'This email is already registered and confirmed. Try signing in.';
    
    return encodedRedirect("error", `/${locale}/sign-up`, errorMessage);
  }

  // Créer le profil candidat si nécessaire
  const profileResult = await handleCandidateProfileCreation(
    supabase,
    user.id,
    fullName,
    email,
    userRole
  );

  if (!profileResult.profileCreated) {
    console.error('🚨 Profil candidat non créé');
    
    let errorMessage: string;
    
    if (profileResult.requiresDbSetup) {
      errorMessage = locale === 'fr' ? 
        'Erreur lors de la création de votre profil candidat. La base de données n\'est pas encore configurée. Veuillez exécuter le script SQL fix-rls-final.sql dans Supabase ou contacter l\'administrateur.' :
        locale === 'ar' ?
        'خطأ في إنشاء ملف المرشح الخاص بك. قاعدة البيانات غير مهيأة بعد. يرجى تشغيل سكريبت SQL fix-rls-final.sql في Supabase أو الاتصال بالمدير.' :
        'Error creating your candidate profile. Database is not yet configured. Please run the SQL script fix-rls-final.sql in Supabase or contact the administrator.';
    } else {
      errorMessage = locale === 'fr' ? 
        'Erreur lors de la création de votre profil. Veuillez réessayer ou contacter le support.' :
        locale === 'ar' ?
        'خطأ في إنشاء ملفك الشخصي. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.' :
        'Error creating your profile. Please try again or contact support.';
    }
    
    return encodedRedirect("error", `/${locale}/sign-up`, errorMessage);
  }

  // Si l'utilisateur est déjà confirmé et a un profil, rediriger vers le dashboard
  if (user.email_confirmed_at) {
    return redirect(`/${locale}/dashboard/candidate`);
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

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl || `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://tempo-tempo.vercel.app'}/${locale}/auth/callback?redirect_to=/${locale}/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      `/${locale}/forgot-password`,
      "Could not reset password",
    );
  }

  return encodedRedirect(
    "success",
    `/${locale}/forgot-password`,
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const locale = getLocaleFromFormData(formData);

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      `/${locale}/dashboard/reset-password`,
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
    console.error('Error checking subscription:', error);
    return null;
  }

  return subscription;
};
