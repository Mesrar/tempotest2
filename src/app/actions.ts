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
    return encodedRedirect("error", `/${locale}/sign-up`, error.message);
  }

  if (user) {
    try {

      const { error: updateError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          user_id: user.id,
          name: fullName,
          email: email,
          token_identifier: user.id,
          created_at: new Date().toISOString()
        });

      if (updateError) {
        // Error handling without console.error
        return encodedRedirect(
          "error",
          `/${locale}/sign-up`,
          "Error updating user. Please try again.",
        );
      }
    } catch (err) {
      // Error handling without console.error
      return encodedRedirect(
        "error",
        `/${locale}/sign-up`,
        "Error updating user. Please try again.",
      );
    }
  }

  return encodedRedirect(
    "success",
    `/${locale}/sign-up`,
    "Thanks for signing up! Please check your email for a verification link.",
  );
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
