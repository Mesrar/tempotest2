"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Calendar,
  Target,
  Award,
  Activity
} from "lucide-react";
import { AnimationWrapper, StaggerContainer, FadeInCard } from "./AnimationWrapper";

interface PerformanceMetricsProps {
  stats: {
    totalJobMatches: number;
    acceptedJobs: number;
    completedMissions: number;
    avgResponseTime: number; // en minutes
    daysAvailable: number;
    averageRating?: number;
    responseRate?: number; // pourcentage de réponses
    onTimeRate?: number; // pourcentage de ponctualité
    completionRate?: number; // pourcentage de missions terminées
  };
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  const responseRate = stats.responseRate || 85;
  const onTimeRate = stats.onTimeRate || 92;
  const completionRate = stats.completionRate || 88;

  const metrics = [
    {
      title: "Taux de Réponse",
      value: `${responseRate}%`,
      progress: responseRate,
      icon: Activity,
      color: responseRate >= 80 ? "text-green-600" : responseRate >= 60 ? "text-yellow-600" : "text-red-600",
      bgColor: responseRate >= 80 ? "bg-green-100" : responseRate >= 60 ? "bg-yellow-100" : "bg-red-100",
      description: "Rapidité de réponse aux offres"
    },
    {
      title: "Ponctualité",
      value: `${onTimeRate}%`,
      progress: onTimeRate,
      icon: Clock,
      color: onTimeRate >= 90 ? "text-green-600" : onTimeRate >= 75 ? "text-yellow-600" : "text-red-600",
      bgColor: onTimeRate >= 90 ? "bg-green-100" : onTimeRate >= 75 ? "bg-yellow-100" : "bg-red-100",
      description: "Arrivée à l'heure aux missions"
    },
    {
      title: "Missions Terminées",
      value: `${completionRate}%`,
      progress: completionRate,
      icon: CheckCircle,
      color: completionRate >= 85 ? "text-green-600" : completionRate >= 70 ? "text-yellow-600" : "text-red-600",
      bgColor: completionRate >= 85 ? "bg-green-100" : completionRate >= 70 ? "bg-yellow-100" : "bg-red-100",
      description: "Missions menées à terme"
    },
    {
      title: "Note Moyenne",
      value: stats.averageRating ? `${stats.averageRating}/5` : "N/A",
      progress: stats.averageRating ? (stats.averageRating / 5) * 100 : 0,
      icon: Star,
      color: (stats.averageRating || 0) >= 4 ? "text-yellow-600" : (stats.averageRating || 0) >= 3 ? "text-yellow-500" : "text-gray-500",
      bgColor: (stats.averageRating || 0) >= 4 ? "bg-yellow-100" : (stats.averageRating || 0) >= 3 ? "bg-yellow-50" : "bg-gray-100",
      description: "Évaluation par les employeurs"
    }
  ];

  const overallScore = Math.round((responseRate + onTimeRate + completionRate + ((stats.averageRating || 0) * 20)) / 4);

  return (
    <AnimationWrapper direction="up" duration={0.6}>
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance
            </CardTitle>
            <Badge 
              variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}
              className="text-sm"
            >
              {overallScore >= 80 ? "Excellence" : overallScore >= 60 ? "Bien" : "À améliorer"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score global */}
          <FadeInCard delay={0.1}>
            <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-1">{overallScore}%</div>
              <div className="text-sm text-gray-600">Score Global de Performance</div>
            </div>
          </FadeInCard>

          {/* Métriques détaillées */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <FadeInCard key={index} delay={index * 0.1}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${metric.bgColor}`}>
                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{metric.title}</p>
                        <p className="text-xs text-gray-500">{metric.description}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${metric.color}`}>{metric.value}</span>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              </FadeInCard>
            ))}
          </StaggerContainer>

        {/* Statistiques rapides */}
        <FadeInCard delay={0.5}>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{stats.completedMissions}</div>
              <div className="text-xs text-gray-500">Missions terminées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{stats.avgResponseTime}min</div>
              <div className="text-xs text-gray-500">Temps de réponse</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{stats.daysAvailable}</div>
              <div className="text-xs text-gray-500">Jours disponibles</div>
            </div>
          </div>
        </FadeInCard>

        {/* Conseils d'amélioration */}
        {overallScore < 80 && (
          <FadeInCard delay={0.6}>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 text-sm">Conseils d'amélioration</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                {responseRate < 80 && <p>• Répondez plus rapidement aux offres d'emploi</p>}
                {onTimeRate < 90 && <p>• Améliorez votre ponctualité aux missions</p>}
                {completionRate < 85 && <p>• Terminez toutes vos missions acceptées</p>}
                {(stats.averageRating || 0) < 4 && <p>• Sollicitez des retours pour améliorer vos évaluations</p>}
              </div>
            </div>
          </FadeInCard>
        )}
      </CardContent>
    </Card>
    </AnimationWrapper>
  );
}
