"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

// Supabase initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth types
export interface AuthSession {
  user: {
    id: string;
    email?: string;
    role?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  access_token: string;
}

// Authentication hooks
export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getSession() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(data.session);

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setSession(session);
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (err) {
        setError(err as Error);
        console.error('Error getting auth session:', err);
      } finally {
        setLoading(false);
      }
    }

    getSession();
  }, []);

  return { session, loading, error };
}

// Auth functions
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
}

export async function signUp(email: string, password: string, userData: any) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/fr/sign-in?verified=true`,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/fr/reset-password`,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { error };
  }
}

export async function updateUserProfile(userData: any) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: userData,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
}

export async function getUserRole() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    if (!session) return { role: null, error: null };
    
    // Assuming role is stored in user metadata
    const role = session.user?.role || session.user.user_metadata?.role;
    
    return { role, error: null };
  } catch (error) {
    console.error('Error getting user role:', error);
    return { role: null, error };
  }
}
