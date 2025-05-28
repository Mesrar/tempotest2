-- Migration pour corriger les erreurs RLS et les conflits de permissions
-- Résout l'erreur 42501 "permission denied for table users"

-- Supprimer les triggers en conflit
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer une fonction unifiée pour gérer les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user_unified()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer dans la table users (système de paiements)
  INSERT INTO public.users (
    id,
    user_id,
    email,
    name,
    full_name,
    avatar_url,
    token_identifier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.created_at,
    NEW.updated_at
  );

  -- Créer un profil candidat si le rôle l'exige
  IF NEW.raw_user_meta_data->>'role' IN ('candidate', 'worker', 'staff') THEN
    INSERT INTO public.candidate_profiles (user_id, full_name, email, is_available, skills, rating)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
      NEW.email,
      true,
      '{}',
      0
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ajouter des politiques RLS plus permissives pour les opérations automatiques
-- Politique pour permettre l'insertion automatique lors de l'inscription
CREATE POLICY "Allow automatic profile creation" ON public.candidate_profiles
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre l'insertion dans la table users lors de l'inscription
CREATE POLICY "Allow automatic user creation" ON public.users
    FOR INSERT WITH CHECK (true);

-- Créer le nouveau trigger unifié
CREATE TRIGGER on_auth_user_created_unified
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_unified();

-- Mettre à jour les permissions pour les fonctions automatiques
GRANT ALL ON public.candidate_profiles TO authenticated;
GRANT ALL ON public.users TO authenticated;

-- Assurer que les fonctions de création automatique fonctionnent
-- Créer une fonction pour créer un profil candidat en tant que service
CREATE OR REPLACE FUNCTION public.create_candidate_profile_service(
  p_user_id uuid,
  p_full_name text,
  p_email text
)
RETURNS uuid AS $$
DECLARE
  profile_id uuid;
BEGIN
  INSERT INTO public.candidate_profiles (user_id, full_name, email, is_available, skills, rating)
  VALUES (p_user_id, p_full_name, p_email, true, '{}', 0)
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Donner les permissions à cette fonction de service
GRANT EXECUTE ON FUNCTION public.create_candidate_profile_service TO authenticated, anon;

-- Créer une vue pour faciliter les requêtes
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  u.id as user_id,
  u.email,
  u.full_name,
  cp.id as candidate_profile_id,
  cp.full_name as candidate_name,
  cp.phone,
  cp.location,
  cp.bio,
  cp.skills,
  cp.is_available,
  cp.hourly_rate,
  cp.rating,
  cp.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.candidate_profiles cp ON u.id = cp.user_id;

-- Assurer que cette vue est accessible
GRANT SELECT ON public.user_profiles TO authenticated;

-- Créer une politique pour que les utilisateurs puissent voir leur propre vue
CREATE POLICY "Users can view their own profile view" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id_unique ON public.candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON public.users(user_id);

-- Mettre à jour la fonction de trigger pour éviter les conflits
ALTER TABLE public.candidate_profiles ADD CONSTRAINT unique_user_id UNIQUE (user_id);
