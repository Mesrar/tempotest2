"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/lib/supabase-auth";

// Définir les types pour le contexte d'authentification
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string | null;
  userProfile: any | null;
  signOut: () => Promise<void>;
}

// Créer le contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  userId: null,
  userRole: null,
  userProfile: null,
  signOut: async () => {},
});

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuthContext = () => useContext(AuthContext);

// Définir les props du fournisseur de contexte
interface AuthProviderProps {
  children: ReactNode;
}

// Liste des chemins accessibles sans authentification
const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/for-workers",
  "/for-employers",
  "/pricing",
];

// Vérifier si un chemin est public
const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.some((publicPath) =>
    path.match(new RegExp(`^/[a-z]{2}${publicPath}(/|$)`))
  );
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { session, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Récupérer le profil utilisateur et le rôle
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer d'abord le rôle depuis les métadonnées de la session
        const role = session.user.role || 
                     session.user.user_metadata?.role || 
                     'user';
        
        setUserRole(role);

        // En fonction du rôle, récupérer le profil approprié
        if (role === 'candidate' || role === 'worker') {
          const { data, error } = await supabase
            .from('candidate_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching candidate profile:', error);
          }
          
          setUserProfile(data || null);
        } else if (role === 'employer') {
          const { data, error } = await supabase
            .from('employer_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching employer profile:', error);
          }
          
          setUserProfile(data || null);
        }
        
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [session, authLoading]);

  // Rediriger en fonction de l'état d'authentification
  useEffect(() => {
    if (authLoading || isLoading) return;

    const isAuth = !!session?.user;
    
    // Ne pas rediriger sur les chemins publics
    if (pathname && isPublicPath(pathname)) {
      return;
    }

    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une page protégée
    if (!isAuth && pathname && !isPublicPath(pathname)) {
      // Extraire le code de langue du chemin
      const langCode = pathname.split('/')[1];
      router.push(`/${langCode}/sign-in?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [session, authLoading, isLoading, pathname, router]);

  // Fonction de déconnexion
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    isLoading: authLoading || isLoading,
    isAuthenticated: !!session?.user,
    userId: session?.user?.id || null,
    userRole,
    userProfile,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
