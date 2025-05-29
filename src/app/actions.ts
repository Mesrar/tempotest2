"use server";

import { encodedRedirect, getLocaleFromFormData } from "../utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import { handleCandidateProfileCreation } from "../lib/profile-creation";

// Unified user role types
export type UserRole = 'company' | 'staff' | 'candidate' | 'worker' | 'admin';

// Unified sign up action
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  const userRole = formData.get("user_role")?.toString() as UserRole || 'company';
  const locale = getLocaleFromFormData(formData);
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect("error", `/${locale}/sign-up`, "Email and password are required");
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
    let errorMessage = getLocalizedError(error.message, locale);
    return encodedRedirect("error", `/${locale}/sign-up`, errorMessage);
  }

  if (!user) {
    return encodedRedirect("error", `/${locale}/sign-up`, 
      getLocalizedMessage('account_creation_error', locale)
    );
  }

  // Handle profile creation based on role
  if (userRole === 'staff' || userRole === 'candidate' || userRole === 'worker') {
    const profileResult = await handleCandidateProfileCreation(
      supabase, user.id, fullName, email, userRole
    );
    
    if (!profileResult.profileCreated) {
      return encodedRedirect("error", `/${locale}/sign-up`, 
        getLocalizedMessage('profile_creation_error', locale)
      );
    }
  }

  // Redirect based on confirmation status
  if (user.email_confirmed_at) {
    return redirect(getDashboardRoute(userRole, locale));
  }

  return redirect(`/${locale}/email-confirmation?email=${encodeURIComponent(email)}`);
};

// Unified sign in action
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
    return encodedRedirect("error", `/${locale}/sign-in`, 
      getLocalizedError(error.message, locale)
    );
  }

  const userRole = data.user?.user_metadata?.role as UserRole;
  return redirect(getDashboardRoute(userRole, locale));
};

// Other existing actions remain the same...
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

// Unified dashboard data actions
export const getDashboardData = async (userRole: UserRole, userId: string) => {
  const supabase = await createClient();
  
  switch (userRole) {
    case 'company':
      return getCompanyDashboardData(supabase, userId);
    case 'staff':
    case 'candidate':
    case 'worker':
      return getCandidateDashboardData(supabase, userId);
    default:
      return null;
  }
};

// Helper functions
function getDashboardRoute(userRole: UserRole, locale: string): string {
  switch (userRole) {
    case 'staff':
    case 'candidate':
    case 'worker':
      return `/${locale}/dashboard/candidate`;
    case 'company':
      return `/${locale}/dashboard/company`;
    case 'admin':
      return `/${locale}/dashboard/admin`;
    default:
      return `/${locale}/dashboard`;
  }
}

function getLocalizedError(errorMessage: string, locale: string): string {
  const errorMappings = {
    'User already registered': {
      fr: 'Cet email est déjà utilisé. Essayez de vous connecter.',
      ar: 'هذا البريد الإلكتروني مستخدم بالفعل. حاول تسجيل الدخول.',
      en: 'This email is already registered. Try signing in.'
    },
    'Invalid email': {
      fr: 'Adresse email invalide.',
      ar: 'عنوان بريد إلكتروني غير صالح.',
      en: 'Invalid email address.'
    }
  };

  for (const [key, translations] of Object.entries(errorMappings)) {
    if (errorMessage.includes(key)) {
      return translations[locale as keyof typeof translations] || translations.en;
    }
  }

  return errorMessage;
}

function getLocalizedMessage(key: string, locale: string): string {
  const messages = {
    account_creation_error: {
      fr: 'Erreur lors de la création du compte. Veuillez réessayer.',
      ar: 'خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.',
      en: 'Error creating account. Please try again.'
    },
    profile_creation_error: {
      fr: 'Erreur lors de la création de votre profil. Veuillez réessayer.',
      ar: 'خطأ في إنشاء ملفك الشخصي. يرجى المحاولة مرة أخرى.',
      en: 'Error creating your profile. Please try again.'
    }
  };

  return messages[key as keyof typeof messages]?.[locale as keyof typeof messages[keyof typeof messages]] || 
         messages[key as keyof typeof messages]?.en || 
         'An error occurred';
}

async function getCompanyDashboardData(supabase: any, userId: string) {
  // Company dashboard specific data fetching
  const [jobsResult, candidatesResult] = await Promise.all([
    supabase.from("job_postings").select("*").eq("company_id", userId),
    supabase.from("job_candidates").select("*", { count: "exact", head: true })
  ]);

  return {
    jobs: jobsResult.data || [],
    activeJobsCount: jobsResult.data?.filter((job: any) => job.status === 'active').length || 0,
    applicantsCount: candidatesResult.count || 0
  };
}

async function getCandidateDashboardData(supabase: any, userId: string) {
  // Candidate dashboard specific data fetching
  const profileResult = await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!profileResult.data) return null;

  const [experiencesResult, documentsResult, jobMatchesResult] = await Promise.all([
    supabase.from('candidate_experiences').select('*').eq('candidate_id', profileResult.data.id),
    supabase.from('candidate_documents').select('*').eq('candidate_id', profileResult.data.id),
    supabase.from('job_matches').select(`
      *, 
      job:job_offers (*, company:companies (*))
    `).eq('candidate_id', profileResult.data.id)
  ]);

  return {
    profile: profileResult.data,
    experiences: experiencesResult.data || [],
    documents: documentsResult.data || [],
    jobMatches: jobMatchesResult.data || []
  };
}

// Subscription check function
export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();
  
  try {
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking subscription:', error);
      return { hasActiveSubscription: false, subscription: null };
    }

    return {
      hasActiveSubscription: !!subscription,
      subscription: subscription || null
    };
  } catch (error) {
    console.error('Error in checkUserSubscription:', error);
    return { hasActiveSubscription: false, subscription: null };
  }
};
