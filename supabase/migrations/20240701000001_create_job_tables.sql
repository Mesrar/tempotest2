-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES auth.users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  positions_count INTEGER NOT NULL,
  required_skills TEXT[] NOT NULL,
  required_certifications TEXT[],
  equipment_proficiency TEXT[],
  experience_years INTEGER,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_candidates table for tracking candidate matches
CREATE TABLE IF NOT EXISTS job_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_postings(id) NOT NULL,
  candidate_id UUID REFERENCES auth.users(id) NOT NULL,
  match_score DECIMAL(5, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'matched',
  shortlisted BOOLEAN DEFAULT FALSE,
  offer_sent_at TIMESTAMP WITH TIME ZONE,
  offer_response VARCHAR(50),
  offer_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- Create job_payments table
CREATE TABLE IF NOT EXISTS job_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_postings(id) NOT NULL,
  company_id UUID REFERENCES auth.users(id) NOT NULL,
  candidate_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for job_postings
CREATE POLICY "Companies can view their own job postings"
ON job_postings FOR SELECT
USING (company_id = auth.uid());

CREATE POLICY "Companies can insert their own job postings"
ON job_postings FOR INSERT
WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can update their own job postings"
ON job_postings FOR UPDATE
USING (company_id = auth.uid());

-- Create policies for job_candidates
CREATE POLICY "Companies can view candidates for their jobs"
ON job_candidates FOR SELECT
USING (EXISTS (
  SELECT 1 FROM job_postings
  WHERE job_postings.id = job_candidates.job_id
  AND job_postings.company_id = auth.uid()
));

CREATE POLICY "Companies can update candidate status for their jobs"
ON job_candidates FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM job_postings
  WHERE job_postings.id = job_candidates.job_id
  AND job_postings.company_id = auth.uid()
));

-- Create policies for job_payments
CREATE POLICY "Companies can view their own payments"
ON job_payments FOR SELECT
USING (company_id = auth.uid());

CREATE POLICY "Companies can insert their own payments"
ON job_payments FOR INSERT
WITH CHECK (company_id = auth.uid());

-- Enable realtime for these tables
alter publication supabase_realtime add table job_postings;
alter publication supabase_realtime add table job_candidates;
alter publication supabase_realtime add table job_payments;