"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

// Types
export interface CandidateProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  avatar_url: string | null;
  bio: string | null;
  skills: string[];
  is_available: boolean;
  hourly_rate: number | null;
  availability_start: string | null;
  availability_end: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateExperience {
  id: string;
  candidate_id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  created_at: string;
}

export interface CandidateCertification {
  id: string;
  candidate_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  created_at: string;
}

export interface CandidateDocument {
  id: string;
  candidate_id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: 'pending' | 'approved' | 'rejected';
  upload_date: string;
  notes: string | null;
  public_url?: string | null;
}

export interface JobOffer {
  id: string;
  company_id: string;
  title: string;
  location: string;
  description: string;
  skills_required: string[];
  hourly_rate: number;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'filled' | 'closed';
  created_at: string;
  company: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

export interface JobMatch {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  match_percentage: number;
  created_at: string;
  job: JobOffer;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'job_match' | 'offer' | 'system' | 'reminder';
  is_read: boolean;
  created_at: string;
  link: string | null;
  job_id: string | null;
}

// Supabase initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Custom hooks for data fetching
export function useCandidateProfile(userId?: string) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchProfile() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching candidate profile:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}

export function useCandidateExperience(candidateId?: string) {
  const [experiences, setExperiences] = useState<CandidateExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!candidateId) return;

    async function fetchExperiences() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('candidate_experiences')
          .select('*')
          .eq('candidate_id', candidateId)
          .order('is_current', { ascending: false })
          .order('start_date', { ascending: false });

        if (error) throw error;
        setExperiences(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching candidate experiences:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, [candidateId]);

  return { experiences, loading, error };
}

export function useCandidateDocuments(candidateId?: string) {
  const [documents, setDocuments] = useState<CandidateDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!candidateId) return;

    async function fetchDocuments() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('candidate_documents')
          .select('*')
          .eq('candidate_id', candidateId)
          .order('upload_date', { ascending: false });

        if (error) throw error;
        setDocuments(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching candidate documents:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [candidateId]);

  return { documents, loading, error };
}

export function useJobMatches(candidateId?: string) {
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!candidateId) return;

    async function fetchJobMatches() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('job_matches')
          .select(`
            *,
            job:job_id (
              *,
              company:company_id (
                id, 
                name,
                logo_url
              )
            )
          `)
          .eq('candidate_id', candidateId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobMatches(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching job matches:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobMatches();
  }, [candidateId]);

  return { jobMatches, loading, error };
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [userId]);

  return { notifications, loading, error };
}

// Functions for data manipulation
export async function updateCandidateProfile(profile: Partial<CandidateProfile>) {
  try {
    const { data, error } = await supabase
      .from('candidate_profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating candidate profile:', error);
    return { data: null, error };
  }
}

export async function updateCandidateAvailability(
  candidateId: string, 
  isAvailable: boolean, 
  startDate?: string | null,
  endDate?: string | null
) {
  try {
    const { data, error } = await supabase
      .from('candidate_profiles')
      .update({
        is_available: isAvailable,
        availability_start: startDate,
        availability_end: endDate,
      })
      .eq('id', candidateId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating candidate availability:', error);
    return { data: null, error };
  }
}

export async function updateJobMatchStatus(matchId: string, status: 'accepted' | 'rejected') {
  try {
    const { data, error } = await supabase
      .from('job_matches')
      .update({ status })
      .eq('id', matchId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating job match status:', error);
    return { data: null, error };
  }
}

export async function uploadCandidateDocument(
  candidateId: string,
  file: File,
  documentName: string
) {
  try {
    // Generate a unique file path
    const filePath = `candidates/${candidateId}/${Date.now()}_${file.name}`;
    
    // Upload file to Supabase storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
    
    if (fileError) throw fileError;
    
    // Create document record in database
    const { data, error } = await supabase
      .from('candidate_documents')
      .insert({
        candidate_id: candidateId,
        name: documentName,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        status: 'pending',
        upload_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { data: null, error };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { data: null, error };
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { data: null, error };
  }
}
