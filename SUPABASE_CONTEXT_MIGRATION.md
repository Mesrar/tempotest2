# Guide de Migration: Résolution des Erreurs de Promesses Non Mises en Cache

## Problème Résolu

L'erreur "A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework." qui apparaissait dans Next.js 15 avec React 19.

## Solution Implémentée

### 1. Contexte Supabase Centralisé

**Fichier:** `/src/context/supabase-provider.tsx`

```tsx
"use client";

import { createContext, useContext, useMemo } from "react";
import { createClient } from "../../supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

type SupabaseContextType = {
  supabase: SupabaseClient;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Créer une seule instance de client mise en cache
  const supabase = useMemo(() => createClient(), []);

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context.supabase;
}
```

### 2. Integration dans le Layout Principal

**Fichier:** `/src/app/layout.tsx`

```tsx
import { SupabaseProvider } from "@/context/supabase-provider";

export default function RootLayout({ children, params }) {
  return (
    <html>
      <body>
        <I18nProvider initialLocale={locale}>
          <SupabaseProvider>
            {children}
            <TempoInit />
          </SupabaseProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
```

### 3. Hooks Optimisés pour les Requêtes

**Fichier:** `/src/hooks/use-supabase-query.ts`

- `useCandidates(jobId)` - Pour récupérer les candidats
- `useToggleShortlist()` - Pour modifier le statut shortlist
- `useSupabaseQuery<T>()` - Hook générique pour les requêtes
- `useSupabaseMutation<T, P>()` - Hook générique pour les mutations

### 4. Hook d'Authentification

**Fichier:** `/src/hooks/use-auth.ts`

- `useAuth()` - Gestion de l'état d'authentification
- `useAuthActions()` - Actions d'authentification (signIn, signOut, signUp)

## Composants Mis à Jour

### Avant (❌ Problématique)

```tsx
"use client";
import { createClient } from "../../supabase/client";

export default function Component() {
  const supabase = createClient(); // ❌ Crée une nouvelle promesse à chaque render
  // ...
}
```

### Après (✅ Solution)

```tsx
"use client";
import { useSupabase } from "@/context/supabase-provider";

export default function Component() {
  const supabase = useSupabase(); // ✅ Utilise l'instance mise en cache
  // ...
}
```

## Composants Modifiés

- ✅ `/src/components/candidates-list.tsx`
- ✅ `/src/components/user-profile.tsx`
- ✅ `/src/components/dashboard-navbar.tsx`
- ✅ `/src/components/job-post-form.tsx`
- ✅ `/src/components/job-edit-form.tsx`

## Avantages de Cette Solution

1. **Élimination des Suspensions Non Mises en Cache**: Une seule instance de client Supabase réutilisée
2. **Meilleures Performances**: Évite la création répétée de clients
3. **Meilleure Gestion des États**: Hooks dédiés pour l'authentification et les requêtes
4. **Type Safety**: Typage TypeScript complet
5. **Réutilisabilité**: Hooks génériques pour les patterns communs

## Comment Utiliser

### Pour l'Authentification

```tsx
import { useAuth, useAuthActions } from "@/hooks/use-auth";

function MyComponent() {
  const { user, loading } = useAuth();
  const { signOut } = useAuthActions();
  
  if (loading) return <div>Chargement...</div>;
  
  return (
    <div>
      {user ? (
        <button onClick={signOut}>Se déconnecter</button>
      ) : (
        <div>Non connecté</div>
      )}
    </div>
  );
}
```

### Pour les Requêtes de Données

```tsx
import { useCandidates } from "@/hooks/use-supabase-query";

function CandidatesList({ jobId }) {
  const { data: candidates, isLoading, error } = useCandidates(jobId);
  
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  
  return (
    <div>
      {candidates?.map(candidate => (
        <div key={candidate.id}>{candidate.user.name}</div>
      ))}
    </div>
  );
}
```

## Prochaines Étapes

1. ✅ **Contexte Supabase implémenté**
2. ✅ **Hooks optimisés créés**
3. ✅ **Composants principaux mis à jour**
4. 🔄 **Tests fonctionnels en cours**
5. ⏳ **Migration des tables de base de données** (prochaine étape)
6. ⏳ **Configuration du stockage Supabase** (prochaine étape)

## Notes Techniques

- Compatible avec Next.js 15.1.8 et React 19.1.0
- Utilise `@supabase/ssr` pour la gestion côté serveur
- Les Server Components continuent d'utiliser `/supabase/server.ts`
- Les Client Components utilisent maintenant le contexte unifié
