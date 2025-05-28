/** @type {import('next').NextConfig} */

const nextConfig = {
  // Next.js App Router uses middleware for i18n instead of the i18n config
  // Remove the i18n config to avoid conflicts
  trailingSlash: false,
  experimental: {
    serverActions: {
      // Cette option permet de désactiver la vérification stricte des en-têtes pour les Server Actions
      allowedOrigins: [
        // Domaine GitHub Codespaces
        "upgraded-dollop-559pqr9jjw37pv9-3000.app.github.dev", 
        // Domaine local
        "localhost:3000",
      ],
      bodySizeLimit: "2mb",
    },
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  // Si les swcPlugins sont nécessaires, assurons-nous de les ajouter sans écraser la config experimental
  nextConfig.experimental = {
    ...nextConfig.experimental,
    // NextJS 13.4.8 up to 14.1.3:
    // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
    // NextJS 14.1.3 to 14.2.11:
    // swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],
    // NextJS 15+ (Not yet supported, coming soon)
    // Temporairement désactivé pour Next.js 15+ en attendant une mise à jour du plugin
  };
}

module.exports = nextConfig;
