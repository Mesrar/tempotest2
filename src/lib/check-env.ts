// Liste des variables d'environnement requises
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

// Vérifier les variables d'environnement au démarrage
export function checkEnvironment() {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error("Configuration des variables d'environnement incomplète.");
    console.error("Variables manquantes:", missingVars.join(", "));
    console.error("Veuillez consulter le fichier .env.example pour les variables requises.");
    
    // En développement, afficher un avertissement plus explicite
    if (process.env.NODE_ENV === "development") {
      console.error("\n---------------------------------------------------");
      console.error("🚨 Variables d'environnement manquantes détectées 🚨");
      console.error("Assurez-vous d'avoir créé un fichier .env à partir de .env.example");
      console.error("---------------------------------------------------\n");
    }
    return false;
  } else {
    console.log("✅ Configuration des variables d'environnement validée");
    return true;
  }
}

// Exécuter la vérification si ce script est importé directement
if (process.env.NODE_ENV === "development") {
  checkEnvironment();
}
