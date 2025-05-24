# Intégration des Données de Supabase pour le Tableau de Bord Candidat

Ce document présente les différentes fonctionnalités mises en place pour intégrer complètement les données Supabase dans le tableau de bord des candidats.

## Hooks Personnalisés

### 1. useCurrentStaff

Ce hook récupère toutes les données du personnel logistique connecté:
- Profil utilisateur
- Expériences professionnelles
- Documents uploadés
- Offres d'emploi correspondantes

```typescript
const { user, profile, experiences, documents, jobMatches, loading, error } = useCurrentStaff();
```

### 2. useRealtimeUpdates

Ce hook gère les mises à jour en temps réel des données liées au candidat:
- Nouvelles offres d'emploi
- Nouvelles notifications
- Système de rafraîchissement des données

```typescript
const { newJobMatches, newNotifications, refreshData } = useRealtimeUpdates({
  userId: user?.id || null,
  candidateId: profile?.id || null
});
```

### 3. useSkills

Ce hook récupère et gère les compétences disponibles:
- Liste complète des compétences
- Catégories de compétences
- Système de suggestion basé sur la recherche

```typescript
const { skills, categories, suggestSkills, getSkillsByCategory } = useSkills();
```

## Services de Manipulation de Données

### Gestion du Profil

```typescript
// Mise à jour du profil candidat
updateCandidateProfile(candidateId: string, data: CandidateFormData)

// Mise à jour de la disponibilité
updateAvailability(candidateId: string, isAvailable: boolean, startDate?: Date, endDate?: Date)
```

### Gestion des Offres d'emploi

```typescript
// Accepter une offre
acceptJobMatch(matchId: string)

// Refuser une offre
rejectJobMatch(matchId: string, reason?: string)
```

### Gestion des Documents

```typescript
// Télécharger un document
uploadDocument(candidateId: string, file: File, documentName: string)

// Supprimer un document
deleteDocument(documentId: string, filePath: string)
```

### Gestion des Notifications

```typescript
// Marquer une notification comme lue
markNotificationAsRead(notificationId: string)

// Marquer toutes les notifications comme lues
markAllNotificationsAsRead(userId: string)
```

## Améliorations Apportées

1. **Intégration complète avec Supabase Storage**
   - Gestion des URL publiques pour les documents
   - Téléchargement/suppression de fichiers avec traçabilité

2. **Support des mises à jour en temps réel**
   - Notifications instantanées pour nouvelles offres
   - Actualisation automatique des données importantes

3. **Gestion intelligente des états de chargement**
   - Affichage de loaders pendant les opérations
   - Gestion des états d'erreur avec messages explicites

4. **Manipulation optimisée des données**
   - Conversion automatique entre formats API et formats UI
   - Support de la pagination pour les grandes listes de données

5. **UX Améliorée**
   - Notifications toast pour les actions importantes
   - Feedbacks utilisateur pour toutes les opérations

## Prochaines Étapes

1. Ajouter un système de filtrage avancé pour les offres d'emploi
2. Mettre en place un système de chat entre candidats et recruteurs
3. Développer des statistiques avancées sur les performances et l'activité
4. Intégrer un calendrier pour la gestion des missions
