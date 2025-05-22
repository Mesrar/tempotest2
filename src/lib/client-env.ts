"use client";

/**
 * Utilitaire pour accéder aux variables d'environnement publiques côté client
 * Les variables DOIVENT commencer par NEXT_PUBLIC_ pour être accessibles côté client
 */

export type ClientEnvVarName =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "NEXT_PUBLIC_SITE_URL";

/**
 * Obtenir une variable d'environnement publique côté client
 */
export function getClientEnvVar(name: ClientEnvVarName): string {
  // Vérifier si la variable commence bien par NEXT_PUBLIC_
  if (!name.startsWith("NEXT_PUBLIC_")) {
    console.error(`La variable ${name} n'est pas accessible côté client. Utilisez NEXT_PUBLIC_*`);
    return "";
  }

  // Accès à l'environnement côté client via process.env compilé par Next.js
  const value = process.env[name];
  
  if (!value && process.env.NODE_ENV === "development") {
    console.error(`La variable d'environnement ${name} est manquante.`);
  }
  
  return value || "";
}
