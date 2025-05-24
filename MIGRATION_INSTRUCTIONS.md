🚀 INSTRUCTIONS POUR RÉSOUDRE L'ERREUR 406
==========================================

L'erreur 406 sur /dashboard/candidate est causée par l'absence de la table 'candidate_profiles' dans votre base de données Supabase.

📋 ÉTAPES À SUIVRE :

1. Ouvrez votre dashboard Supabase : https://supabase.com/dashboard
2. Allez dans votre projet : https://supabase.com/dashboard/project/pynsxbsjoqbtlsneqtru  
3. Cliquez sur "SQL Editor" dans la sidebar de gauche
4. Créez un nouveau snippet et copiez-collez le SQL ci-dessous :

====== SQL À EXÉCUTER DANS SUPABASE ======

-- Création de la table candidate_profiles (OBLIGATOIRE pour résoudre l'erreur 406)
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

-- Tables auxiliaires pour les candidats
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

-- Tables pour les entreprises et offres
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

CREATE TABLE IF NOT EXISTS public.skills (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    category text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Activation de la Row Level Security (RLS)
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour candidate_profiles
CREATE POLICY "Users can view their own profile" ON public.candidate_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.candidate_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.candidate_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour les autres tables (lecture publique)
CREATE POLICY "Anyone can view companies" ON public.companies
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view active job offers" ON public.job_offers
    FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can view skills" ON public.skills
    FOR SELECT USING (true);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON public.candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_experiences_candidate_id ON public.candidate_experiences(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_certifications_candidate_id ON public.candidate_certifications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_candidate_id ON public.candidate_documents(candidate_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON public.job_offers(status);
CREATE INDEX IF NOT EXISTS idx_job_offers_company_id ON public.job_offers(company_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_candidate_profiles_updated_at 
    BEFORE UPDATE ON public.candidate_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON public.companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_offers_updated_at 
    BEFORE UPDATE ON public.job_offers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

===========================================

📋 APRÈS AVOIR EXÉCUTÉ LE SQL CI-DESSUS :

5. Créez le bucket de stockage pour les documents :
   - Allez dans "Storage" dans votre dashboard Supabase
   - Cliquez sur "New bucket"
   - Nom : "candidates"
   - Public : true

6. Testez votre application :
   - L'application tourne déjà sur : http://localhost:3001
   - Naviguez vers : http://localhost:3001/fr/dashboard/candidate
   - L'erreur 406 devrait être résolue !

✅ Une fois terminé, votre système de candidats sera pleinement fonctionnel.

🔗 Liens utiles :
- Dashboard Supabase : https://supabase.com/dashboard/project/pynsxbsjoqbtlsneqtru
- SQL Editor : https://supabase.com/dashboard/project/pynsxbsjoqbtlsneqtru/sql
- Storage : https://supabase.com/dashboard/project/pynsxbsjoqbtlsneqtru/storage
