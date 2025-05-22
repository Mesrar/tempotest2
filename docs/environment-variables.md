# Gestion des Variables d'Environnement

Ce document explique comment gérer les variables d'environnement de manière sécurisée dans ce projet.

## Configuration Initiale

1. Copiez le fichier `.env.example` vers un fichier `.env` :
   ```bash
   cp .env.example .env
   ```

2. Modifiez le fichier `.env` avec vos valeurs réelles :
   ```bash
   nano .env
   # ou utilisez votre éditeur préféré
   ```

## Types de Variables d'Environnement

### Variables Publiques (accessibles côté client)
Ces variables sont exposées au navigateur et doivent commencer par `NEXT_PUBLIC_`.
Elles sont directement injectées dans votre bundle JavaScript côté client.

Exemples :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Variables Privées (côté serveur uniquement)
Ces variables ne sont accessibles que côté serveur et ne sont jamais envoyées au client.

Exemples :
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_SECRET`
- `STRIPE_SECRET_KEY`

## Utilisation des Variables d'Environnement

### Côté Serveur
Utilisez l'utilitaire `getEnvVar` pour accéder aux variables d'environnement côté serveur :

```typescript
import { getEnvVar } from "@/lib/env";

// Dans un composant serveur ou une route API
const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");
```

### Côté Client
Utilisez l'utilitaire `getClientEnvVar` pour accéder aux variables publiques côté client :

```typescript
"use client";
import { getClientEnvVar } from "@/lib/client-env";

// Dans un composant client
const supabaseUrl = getClientEnvVar("NEXT_PUBLIC_SUPABASE_URL");
```

## Validation des Variables d'Environnement

Le projet valide automatiquement les variables d'environnement requises au démarrage et affiche des erreurs explicites si certaines sont manquantes. Ces vérifications sont effectuées dans :
- `src/lib/check-env.ts`

## Environnements Multiples

Pour gérer différentes configurations selon l'environnement, créez des fichiers spécifiques :

- `.env.development` - Variables pour l'environnement de développement
- `.env.production` - Variables pour l'environnement de production
- `.env.test` - Variables pour les tests

## Sécurité

- Ne jamais commiter les fichiers `.env` dans Git
- Utiliser des secrets sécurisés dans les environnements CI/CD
- Pour la production, configurer les variables d'environnement directement sur la plateforme de déploiement (Vercel, Netlify, etc.)

## Dépannage

Si vous rencontrez des erreurs liées aux variables d'environnement :

1. Vérifiez que votre fichier `.env` est correctement configuré
2. Redémarrez le serveur de développement après toute modification
3. Pour les variables côté client, assurez-vous qu'elles commencent par `NEXT_PUBLIC_`
