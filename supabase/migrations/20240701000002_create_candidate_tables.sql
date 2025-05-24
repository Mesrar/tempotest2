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

-- Create job matches table
CREATE TABLE IF NOT EXISTS public.job_matches (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id uuid REFERENCES public.job_offers(id) ON DELETE CASCADE,
    candidate_id uuid REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    match_percentage numeric DEFAULT 0 CHECK (match_percentage >= 0 AND match_percentage <= 100),
    rejection_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(job_id, candidate_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'system' CHECK (type IN ('job_match', 'offer', 'system', 'reminder')),
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    link text,
    job_id uuid REFERENCES public.job_offers(id) ON DELETE SET NULL
);

-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    category text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policies for candidate_profiles
CREATE POLICY "Users can view their own profile" ON public.candidate_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.candidate_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.candidate_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for candidate_experiences
CREATE POLICY "Users can view their own experiences" ON public.candidate_experiences
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.candidate_profiles 
            WHERE id = candidate_experiences.candidate_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own experiences" ON public.candidate_experiences
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.candidate_profiles 
            WHERE id = candidate_experiences.candidate_id 
            AND user_id = auth.uid()
        )
    );

-- Create policies for candidate_certifications
CREATE POLICY "Users can view their own certifications" ON public.candidate_certifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.candidate_profiles 
            WHERE id = candidate_certifications.candidate_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own certifications" ON public.candidate_certifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.candidate_profiles 
            WHERE id = candidate_certifications.candidate_id 
            AND user_id = auth.uid()
        )
    );

-- Create policies for candidate_documents
CREATE POLICY "Users can view their own documents" ON public.candidate_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.candidate_profiles 
            WHERE id = candidate_documents.candidate_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own documents" ON public.candidate_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.candidate_profiles 
            WHERE id = candidate_documents.candidate_id 
            AND user_id = auth.uid()
        )
    );

-- Create policies for companies (public read, admin write)
CREATE POLICY "Anyone can view companies" ON public.companies
    FOR SELECT USING (true);

-- Create policies for job_offers (public read)
CREATE POLICY "Anyone can view active job offers" ON public.job_offers
    FOR SELECT USING (status = 'active');

-- Create policies for job_matches
CREATE POLICY "Users can view their own job matches" ON public.job_matches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.candidate_profiles 
            WHERE id = job_matches.candidate_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own job matches" ON public.job_matches
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.candidate_profiles 
            WHERE id = job_matches.candidate_id 
            AND user_id = auth.uid()
        )
    );

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for skills (public read)
CREATE POLICY "Anyone can view skills" ON public.skills
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON public.candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_experiences_candidate_id ON public.candidate_experiences(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_certifications_candidate_id ON public.candidate_certifications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_documents_candidate_id ON public.candidate_documents(candidate_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON public.job_offers(status);
CREATE INDEX IF NOT EXISTS idx_job_offers_company_id ON public.job_offers(company_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_candidate_id ON public.job_matches(candidate_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_job_id ON public.job_matches(job_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_candidate_profiles_updated_at 
    BEFORE UPDATE ON public.candidate_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON public.companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_offers_updated_at 
    BEFORE UPDATE ON public.job_offers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_matches_updated_at 
    BEFORE UPDATE ON public.job_matches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();