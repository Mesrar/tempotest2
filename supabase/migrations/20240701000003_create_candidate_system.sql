-- Insert sample companies
INSERT INTO public.companies (id, name, description, logo_url, location, contact_email, contact_phone) VALUES 
('11111111-1111-1111-1111-111111111111', 'LogiTrans Maroc', 'Entreprise de logistique et transport au Maroc', 'https://example.com/logitrans-logo.png', 'Casablanca, Maroc', 'contact@logitrans.ma', '+212 522 123 456'),
('22222222-2222-2222-2222-222222222222', 'MedLogistics', 'Spécialiste en logistique médicale', 'https://example.com/medlogistics-logo.png', 'Rabat, Maroc', 'info@medlogistics.ma', '+212 537 234 567'),
('33333333-3333-3333-3333-333333333333', 'Tanger Med Logistics', 'Services logistiques portuaires', 'https://example.com/tangermed-logo.png', 'Tanger, Maroc', 'services@tangermed.ma', '+212 539 345 678'),
('44444444-4444-4444-4444-444444444444', 'AtlasFreight', 'Transport et fret international', 'https://example.com/atlasfreight-logo.png', 'Agadir, Maroc', 'contact@atlasfreight.ma', '+212 528 456 789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample skills
INSERT INTO public.skills (name, category) VALUES 
('Cariste', 'Manutention'),
('CACES 3', 'Certifications'),
('CACES 5', 'Certifications'),
('Manutention', 'Logistique'),
('Gestion de stock', 'Logistique'),
('Préparation de commandes', 'Logistique'),
('Inventaire', 'Logistique'),
('Chargement/Déchargement', 'Manutention'),
('Conditionnement', 'Logistique'),
('Transport', 'Logistique'),
('Permis B', 'Certifications'),
('Permis C', 'Certifications'),
('Formation SST', 'Sécurité'),
('Port du harnais', 'Sécurité'),
('Utilisation transpalette', 'Manutention'),
('Gestion entrepôt', 'Management'),
('Logistique pharmaceutique', 'Spécialisé'),
('Logistique alimentaire', 'Spécialisé'),
('Supply Chain', 'Management'),
('WMS (Warehouse Management System)', 'Informatique')
ON CONFLICT (name) DO NOTHING;

-- Insert sample job offers
INSERT INTO public.job_offers (id, company_id, title, description, location, skills_required, hourly_rate, start_date, end_date, status) VALUES 
(
    '10000000-1000-1000-1000-100000000001', 
    '11111111-1111-1111-1111-111111111111', 
    'Cariste - Mission Temporaire',
    'Nous recherchons un cariste expérimenté pour une mission temporaire dans notre entrepôt. Vous serez en charge de la manutention, du stockage et de la préparation de commandes.',
    'Zone Industrielle, Casablanca',
    ARRAY['Cariste', 'CACES 3', 'Manutention', 'Inventaire'],
    65,
    now() + interval '2 days',
    now() + interval '16 days',
    'active'
),
(
    '10000000-1000-1000-1000-100000000002',
    '22222222-2222-2222-2222-222222222222',
    'Agent Logistique',
    'Poste d''agent logistique pour la gestion des stocks et préparation de commandes dans le secteur médical.',
    'Rabat, Maroc',
    ARRAY['Logistique', 'Préparation de commandes', 'Gestion de stock'],
    55,
    now() + interval '5 days',
    now() + interval '35 days',
    'active'
),
(
    '10000000-1000-1000-1000-100000000003',
    '33333333-3333-3333-3333-333333333333',
    'Manutentionnaire Port',
    'Manutentionnaire pour opérations portuaires - chargement et déchargement de containers.',
    'Port de Tanger Med, Tanger',
    ARRAY['Manutention', 'Chargement/Déchargement', 'Port du harnais'],
    50,
    now() - interval '10 days',
    now() + interval '20 days',
    'active'
),
(
    '10000000-1000-1000-1000-100000000004',
    '44444444-4444-4444-4444-444444444444',
    'Responsable Entrepôt',
    'Poste de responsable d''entrepôt avec équipe à gérer. Expérience en management requise.',
    'Agadir, Maroc',
    ARRAY['Gestion entrepôt', 'Management', 'Supply Chain', 'WMS (Warehouse Management System)'],
    85,
    now() + interval '7 days',
    now() + interval '90 days',
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for candidates documents (this should be done via Supabase dashboard or CLI in real setup)
-- For development, we'll assume the bucket exists

-- Create function to automatically create candidate profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Only create profile for users with specific roles
  IF NEW.raw_user_meta_data->>'role' IN ('candidate', 'worker', 'staff') THEN
    INSERT INTO public.candidate_profiles (user_id, full_name, email)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate job match percentage
CREATE OR REPLACE FUNCTION public.calculate_match_percentage(
  candidate_skills text[],
  job_skills text[]
)
RETURNS numeric AS $$
DECLARE
  matching_skills integer := 0;
  total_job_skills integer := array_length(job_skills, 1);
  match_percentage numeric;
BEGIN
  -- If no required skills, return 100%
  IF total_job_skills = 0 OR total_job_skills IS NULL THEN
    RETURN 100;
  END IF;
  
  -- Count matching skills
  SELECT COUNT(*)
  INTO matching_skills
  FROM unnest(candidate_skills) AS candidate_skill
  WHERE candidate_skill = ANY(job_skills);
  
  -- Calculate percentage
  match_percentage := (matching_skills::numeric / total_job_skills::numeric) * 100;
  
  RETURN LEAST(match_percentage, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to auto-match candidates with jobs
CREATE OR REPLACE FUNCTION public.auto_match_candidates()
RETURNS void AS $$
DECLARE
  job_record record;
  candidate_record record;
  match_percentage numeric;
BEGIN
  -- Loop through active jobs
  FOR job_record IN 
    SELECT * FROM public.job_offers WHERE status = 'active'
  LOOP
    -- Loop through available candidates
    FOR candidate_record IN 
      SELECT * FROM public.candidate_profiles WHERE is_available = true
    LOOP
      -- Check if match already exists
      IF NOT EXISTS (
        SELECT 1 FROM public.job_matches 
        WHERE job_id = job_record.id AND candidate_id = candidate_record.id
      ) THEN
        -- Calculate match percentage
        match_percentage := public.calculate_match_percentage(
          candidate_record.skills, 
          job_record.skills_required
        );
        
        -- Create match if percentage is above threshold (50%)
        IF match_percentage >= 50 THEN
          INSERT INTO public.job_matches (job_id, candidate_id, match_percentage)
          VALUES (job_record.id, candidate_record.id, match_percentage);
          
          -- Create notification for candidate
          INSERT INTO public.notifications (user_id, title, message, type, job_id)
          VALUES (
            candidate_record.user_id,
            'Nouvelle offre d''emploi',
            'Une nouvelle offre d''emploi correspond à votre profil: ' || job_record.title,
            'job_match',
            job_record.id
          );
        END IF;
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to update job matches when candidate profile changes
CREATE OR REPLACE FUNCTION public.update_candidate_matches()
RETURNS trigger AS $$
BEGIN
  -- Recalculate matches for this candidate
  UPDATE public.job_matches 
  SET match_percentage = public.calculate_match_percentage(NEW.skills, jo.skills_required)
  FROM public.job_offers jo
  WHERE job_matches.job_id = jo.id 
    AND job_matches.candidate_id = NEW.id
    AND job_matches.status = 'pending';
    
  -- Run auto-matching for new opportunities
  PERFORM public.auto_match_candidates();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for candidate profile updates
CREATE TRIGGER update_matches_on_profile_change
  AFTER UPDATE OF skills, is_available ON public.candidate_profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_candidate_matches();

-- Create function to notify candidates of new jobs
CREATE OR REPLACE FUNCTION public.notify_new_job()
RETURNS trigger AS $$
BEGIN
  -- Run auto-matching when new job is created
  PERFORM public.auto_match_candidates();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new job offers
CREATE TRIGGER match_candidates_on_new_job
  AFTER INSERT ON public.job_offers
  FOR EACH ROW 
  EXECUTE FUNCTION public.notify_new_job();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;