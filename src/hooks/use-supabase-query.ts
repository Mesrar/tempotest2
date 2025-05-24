"use client";

import { useSupabase } from "@/context/supabase-provider";
import { useState, useEffect, useCallback } from "react";

// Types
interface Candidate {
  id: string;
  job_id: string;
  candidate_id: string;
  match_score: number;
  status: string;
  shortlisted: boolean;
  offer_sent_at: string | null;
  offer_response: string | null;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    email: string;
  };
}

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Hook pour récupérer les candidats
export function useCandidates(jobId: string): QueryResult<Candidate[]> {
  const supabase = useSupabase();
  const [data, setData] = useState<Candidate[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCandidates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: candidatesData, error: candidatesError } = await supabase
        .from("job_candidates")
        .select(`
          *,
          user:candidate_id(id, name, avatar_url, email)
        `)
        .eq("job_id", jobId)
        .order("match_score", { ascending: false });

      if (candidatesError) throw candidatesError;
      setData(candidatesData as unknown as Candidate[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, jobId]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCandidates,
  };
}

// Hook pour la mutation de statut shortlist
interface ToggleShortlistParams {
  candidateId: string;
  shortlisted: boolean;
}

export function useToggleShortlist() {
  const supabase = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async ({ candidateId, shortlisted }: ToggleShortlistParams) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("job_candidates")
        .update({ shortlisted })
        .eq("id", candidateId);

      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
  };
}

// Hook générique pour les requêtes Supabase
export function useSupabaseQuery<T>(
  queryFn: (supabase: any) => Promise<{ data: T | null; error: any }>,
  deps: any[] = []
) {
  const supabase = useSupabase();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const executeQuery = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await queryFn(supabase);
      if (result.error) throw result.error;
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, ...deps]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  return {
    data,
    isLoading,
    error,
    refetch: executeQuery,
  };
}

// Hook pour les mutations
export function useSupabaseMutation<T, P>(
  mutationFn: (supabase: any, params: P) => Promise<T>
) {
  const supabase = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (params: P): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutationFn(supabase, params);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error,
  };
}
