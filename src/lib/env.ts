/**
 * Utilitaire pour accéder de manière sécurisée aux variables d'environnement
 * Erreur explicite en développement si une variable manque
 */

export type EnvVarName =
  // Variables publiques (côté client)
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "NEXT_PUBLIC_SITE_URL"
  // Variables serveur uniquement
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "ENCRYPTION_SECRET";

/**
 * Obtenir une variable d'environnement avec validation
 */
export function getEnvVar(name: EnvVarName): string {
  const value = process.env[name];
  
  // Validation et message d'erreur en développement
  if (!value) {
    // Vérifier si nous sommes en développement
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `La variable d'environnement ${name} est manquante. ` +
        `Veuillez l'ajouter à votre fichier .env`
      );
    }
    // En production, log uniquement
    console.error(`Variable d'environnement manquante: ${name}`);
  }
  
  return value || "";
}

/**
 * Vérifier que toutes les variables d'environnement requises sont définies
 */
export function validateEnvironment(requiredVars: EnvVarName[]): boolean {
  try {
    for (const varName of requiredVars) {
      getEnvVar(varName);
    }
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Erreur de configuration des variables d'environnement:", error);
    }
    return false;
  }
}
