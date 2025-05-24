'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const migrationsSql = {
  'create_candidate_tables': `
-- Create candidate profiles table
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    location text,
    avatar_url text,
    bio text,
    skills text[] DEFAULT '{}',
    is_available boolean DEFAULT true,
    hourly_rate numeric,
    availability_start timestamptz,
    availability_end timestamptz,
    rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create candidate experiences table
CREATE TABLE IF NOT EXISTS public.candidate_experiences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    company text NOT NULL,
    location text,
    start_date date NOT NULL,
    end_date date,
    is_current boolean DEFAULT false,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Create candidate certifications table
CREATE TABLE IF NOT EXISTS public.candidate_certifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    issuer text NOT NULL,
    issue_date date NOT NULL,
    expiry_date date,
    credential_id text,
    created_at timestamptz DEFAULT now()
);

-- Create candidate documents table
CREATE TABLE IF NOT EXISTS public.candidate_documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id uuid REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    upload_date timestamptz DEFAULT now(),
    notes text,
    public_url text
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for candidate_profiles
CREATE POLICY "Users can view their own profile" ON public.candidate_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.candidate_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.candidate_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON public.candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_experiences_candidate_id ON public.candidate_experiences(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_certifications_candidate_id ON public.candidate_certifications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_candidate_id ON public.candidate_documents(candidate_id);
  `,
  
  'create_companies_and_jobs': `
-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    logo_url text,
    location text,
    contact_email text,
    contact_phone text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create job offers table
CREATE TABLE IF NOT EXISTS public.job_offers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    skills_required text[] DEFAULT '{}',
    hourly_rate numeric NOT NULL,
    start_date timestamptz NOT NULL,
    end_date timestamptz,
    status text DEFAULT 'active' CHECK (status IN ('active', 'filled', 'closed')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    category text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policies for companies (public read)
CREATE POLICY "Anyone can view companies" ON public.companies
    FOR SELECT USING (true);

-- Create policies for job_offers (public read)
CREATE POLICY "Anyone can view active job offers" ON public.job_offers
    FOR SELECT USING (status = 'active');

-- Create policies for skills (public read)
CREATE POLICY "Anyone can view skills" ON public.skills
    FOR SELECT USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON public.job_offers(status);
CREATE INDEX IF NOT EXISTS idx_job_offers_company_id ON public.job_offers(company_id);
  `
};

export default function AdminMigrations() {
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runMigration = async (name: string, sql: string) => {
    try {
      setResults(prev => [...prev, { name, status: 'running', message: 'Exécution en cours...' }]);
      
      // Pour créer les tables, nous devons utiliser l'API REST de Supabase
      const response = await fetch('/api/admin/run-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });

      const result = await response.json();
      
      if (result.success) {
        setResults(prev => prev.map(r => 
          r.name === name 
            ? { ...r, status: 'success', message: 'Migration appliquée avec succès' }
            : r
        ));
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (error) {
      setResults(prev => prev.map(r => 
        r.name === name 
          ? { ...r, status: 'error', message: (error as Error).message }
          : r
      ));
    }
  };

  const runAllMigrations = async () => {
    setIsRunning(true);
    setResults([]);
    
    for (const [name, sql] of Object.entries(migrationsSql)) {
      await runMigration(name, sql);
    }
    
    setIsRunning(false);
  };

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('_migrations').select('*').limit(1);
      if (error) {
        alert('Erreur de connexion: ' + error.message);
      } else {
        alert('Connexion Supabase OK !');
      }
    } catch (error) {
      alert('Erreur: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Administration - Migrations Base de Données</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tester la connexion
            </button>
            
            <button
              onClick={runAllMigrations}
              disabled={isRunning}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isRunning ? 'Migration en cours...' : 'Exécuter les migrations'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Résultats des migrations</h2>
          
          {results.length === 0 ? (
            <p className="text-gray-500">Aucune migration exécutée</p>
          ) : (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border-l-4 ${
                    result.status === 'success' 
                      ? 'border-green-500 bg-green-50' 
                      : result.status === 'error'
                      ? 'border-red-500 bg-red-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-gray-600">{result.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
