# TempoTest2 - Plateforme de Staffing Temporaire pour la Logistique

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Licence](https://img.shields.io/badge/licence-MIT-green)
![Statut](https://img.shields.io/badge/statut-en%20développement-yellow)

## Aperçu

TempoTest2 est une plateforme alimentée par l'IA conçue pour simplifier le recrutement de personnel temporaire pour les entreprises logistiques au Maroc. Elle connecte les entreprises avec des travailleurs qualifiés à la demande, en gérant l'ensemble du processus depuis la publication de l'offre d'emploi jusqu'à la signature du contrat, tout en assurant la conformité avec la législation du travail marocaine.

Notre solution résout les défis critiques liés au recrutement temporaire dans le secteur logistique en offrant un système intelligent d'appariement entre candidats et emplois, automatisant la génération de contrats et réduisant considérablement le temps d'embauche à moins de 24 heures.

## Installation

### Prérequis

- Node.js (v18+)
- npm ou yarn
- Compte Supabase
- Compte Stripe pour les paiements (optionnel)

### Configuration

1. Clonez le dépôt :

```bash
git clone https://github.com/votre-organisation/tempotest2.git
cd tempotest2
```

2. Installez les dépendances :

```bash
npm install
```

3. Configurez les variables d'environnement :

Créez un fichier `.env.local` avec les variables suivantes :

```
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique-supabase
STRIPE_SECRET_KEY=votre-cle-secrete-stripe
```

4. Démarrez le serveur de développement :

```bash
npm run dev
```

## Utilisation

### Publication d'une offre d'emploi

```typescript
// Exemple de code pour publier une offre d'emploi
async function postJob(jobData) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select();
  
  return { data, error };
}
```

Le système va automatiquement traiter la nouvelle offre et commencer à rechercher des candidats correspondants.

### Recherche de candidats

Le système d'IA analysera les profils disponibles et proposera une liste classée de candidats potentiels basée sur leurs compétences et expériences.

Exemple de sortie :

```json
{
  "candidates": [
    {
      "id": "123",
      "name": "Mohammed Alami",
      "match_score": 0.92,
      "skills": ["logistique", "manutention", "permis cariste"]
    }
  ]
}
```

## Configuration et personnalisation

### Variables d'environnement

La plateforme utilise les variables d'environnement suivantes pour la configuration :

- `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `STRIPE_SECRET_KEY` - Clé secrète pour les paiements Stripe
- `NEXT_PUBLIC_TEMPO` - Active les outils de développement Tempo

### Fichier de configuration Tempo

Le fichier `tempo.config.json` permet de personnaliser l'apparence de l'interface utilisateur, notamment la typographie. Exemple :

```json
{
  "typography": [
    {
      "name": "Header 1",
      "tag": "h1",
      "classes": ["text-4xl", "font-extrabold", "tracking-tight", "lg:text-5xl"]
    }
  ]
}
```

## Référence API

### Authentification

```typescript
// Inscription d'un nouvel utilisateur
const { data, error } = await supabase.auth.signUp({
  email: 'utilisateur@exemple.com',
  password: 'mot-de-passe-securise',
  options: {
    data: {
      full_name: 'Nom Complet',
    }
  }
});

// Connexion
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'utilisateur@exemple.com',
  password: 'mot-de-passe-securise'
});
```

### API Stripe pour les plans d'abonnement

```typescript
// Récupérer les plans disponibles
const { data: plans } = await supabase.functions.invoke(
  "get-plans"
);

// Créer une session de paiement
const { data } = await supabase.functions.invoke(
  "create-checkout",
  {
    body: {
      price_id: "price_1234567890",
      user_id: "user-uuid",
      return_url: "https://votresite.com/success"
    }
  }
);
```

## Tests

Pour exécuter la suite de tests :

```bash
npm test
```

Les tests utilisent principalement React Testing Library pour les tests de composants et des tests d'intégration pour les API.

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Ajouter une fonctionnalité incroyable'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

Veuillez vous assurer que votre code respecte les normes de style du projet et que tous les tests passent.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Contact et remerciements

- **Équipe de développement** - contact@tempotest.com
- Construit avec [Next.js](https://nextjs.org/), [Supabase](https://supabase.io/), et [Stripe](https://stripe.com/)
- Design UI avec [Shadcn UI](https://ui.shadcn.com/) et [Tailwind CSS](https://tailwindcss.com/)
- Outils de développement [Tempo](https://tempo.build/)

Merci à tous les contributeurs et partenaires qui ont rendu ce projet possible.