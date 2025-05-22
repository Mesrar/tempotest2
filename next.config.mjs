// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Cette option permet de désactiver la vérification stricte des en-têtes pour les Server Actions
      allowedOrigins: [
        // Domaine GitHub Codespaces
        "fictional-fishstick-46r97vr4g7fqqp6-3000.app.github.dev", 
        // Domaine local
        "localhost:3000",
      ],
      bodySizeLimit: "2mb",
    },
  },
  // Autres configurations existantes
};

export default nextConfig;
