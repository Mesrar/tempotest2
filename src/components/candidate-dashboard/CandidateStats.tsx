"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BriefcaseIcon, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Star, 
  TrendingUp 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateStatsProps {
  stats: {
    totalJobMatches: number;
    acceptedJobs: number;
    completedMissions: number;
    avgResponseTime: number; // in minutes
    daysAvailable: number;
    averageRating?: number;
  };
  className?: string;
}

export function CandidateStats({ stats, className }: CandidateStatsProps) {
  const formatResponseTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
    }
  };

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", className)}>
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Offres reçues</CardTitle>
          <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{stats.totalJobMatches}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.acceptedJobs} acceptées • {stats.totalJobMatches - stats.acceptedJobs} en attente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Missions complétées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{stats.completedMissions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.acceptedJobs - stats.completedMissions} mission(s) en cours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{formatResponseTime(stats.avgResponseTime)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Moyenne de temps pour répondre aux offres
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Jours disponibles</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">{stats.daysAvailable}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Jours prévus dans les prochains 30 jours
          </p>
        </CardContent>
      </Card>

      {stats.averageRating !== undefined && (
        <Card>
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Évaluation</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4 fill-current",
                      star <= Math.round(stats.averageRating || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Basé sur les missions complétées
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Profil</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="mt-1">
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-2 rounded-full"
                style={{ width: `${calculateProfileCompletion(stats)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Complété à {calculateProfileCompletion(stats)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Fonction d'aide pour calculer le pourcentage de complétion du profil
function calculateProfileCompletion(stats: CandidateStatsProps["stats"]): number {
  // Implémentation simplifiée - dans un cas réel, nous voudrions vérifier les informations du profil complet
  // Ici, nous utilisons simplement une valeur calculée basée sur les statistiques disponibles
  let score = 70; // Base score assuming basic profile is complete

  // Add points for completed missions (more experience = more complete profile)
  if (stats.completedMissions > 0) {
    score += Math.min(10, stats.completedMissions * 2); // Max 10 points
  }

  // Add points for having a good rating
  if (stats.averageRating && stats.averageRating > 4) {
    score += 10;
  } else if (stats.averageRating && stats.averageRating > 3) {
    score += 5;
  }

  // Add points for fast response time
  if (stats.avgResponseTime < 60) {
    score += 10;
  } else if (stats.avgResponseTime < 120) {
    score += 5;
  }

  return Math.min(100, score); // Cap at 100%
}
