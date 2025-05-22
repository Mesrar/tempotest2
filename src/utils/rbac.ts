"use server";

import { createClient } from "../../supabase/server";
import { redirect } from "next/navigation";

export type UserRole = 'staff' | 'company';

/**
 * Vérifie si l'utilisateur connecté a le rôle spécifié
 * @param allowedRoles Les rôles autorisés pour accéder à la ressource
 * @param redirectTo Chemin de redirection si l'autorisation est refusée (sans locale)
 * @param locale La locale actuelle pour la redirection
 */
export async function checkUserRole(
  allowedRoles: UserRole[], 
  redirectTo: string = '/dashboard',
  locale: string = 'fr'
): Promise<{ role: UserRole | null, allowed: boolean }> {
  const supabase = await createClient();
  
  // Récupérer la session utilisateur
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // L'utilisateur n'est pas connecté
    redirect(`/${locale}/sign-in`);
  }
  
  // Récupérer le rôle de l'utilisateur depuis les métadonnées
  const userRole = session.user?.user_metadata?.role as UserRole || null;
  
  // Vérifier si le rôle de l'utilisateur est dans la liste des rôles autorisés
  const isAllowed = allowedRoles.includes(userRole);
  
  if (!isAllowed) {
    // Redirection si l'utilisateur n'a pas le rôle requis
    redirect(`/${locale}${redirectTo}`);
  }
  
  return { role: userRole, allowed: isAllowed };
}

/**
 * Hook serveur pour protéger les routes uniquement accessibles au personnel
 */
export async function requireStaffRole(locale: string = 'fr') {
  return checkUserRole(['staff'], '/dashboard', locale);
}

/**
 * Hook serveur pour protéger les routes uniquement accessibles aux entreprises/clients
 */
export async function requireCompanyRole(locale: string = 'fr') {
  return checkUserRole(['company'], '/dashboard', locale);
}
