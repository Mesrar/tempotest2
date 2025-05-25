"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserIcon,
  FileTextIcon,
  Calendar,
  Star,
  Settings,
  BriefcaseIcon,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { AnimationWrapper, StaggerContainer, FadeInCard } from "./AnimationWrapper";

interface QuickActionsProps {
  onEditProfile: () => void;
  onUploadDocuments: () => void;
  onViewJobs: () => void;
  onViewReviews: () => void;
  pendingJobsCount: number;
  documentsCount: number;
  profileCompleteness: number;
}

export function QuickActions({
  onEditProfile,
  onUploadDocuments,
  onViewJobs,
  onViewReviews,
  pendingJobsCount,
  documentsCount,
  profileCompleteness
}: QuickActionsProps) {
  const actions = [
    {
      title: "Modifier Profil",
      description: `${profileCompleteness}% complété`,
      icon: UserIcon,
      onClick: onEditProfile,
      variant: (profileCompleteness < 80 ? "default" : "outline") as "default" | "outline",
      urgent: profileCompleteness < 80
    },
    {
      title: "Mes Documents",
      description: `${documentsCount} document(s)`,
      icon: FileTextIcon,
      onClick: onUploadDocuments,
      variant: (documentsCount === 0 ? "default" : "outline") as "default" | "outline",
      urgent: documentsCount === 0
    },
    {
      title: "Offres d'Emploi",
      description: pendingJobsCount > 0 ? `${pendingJobsCount} en attente` : "À jour",
      icon: BriefcaseIcon,
      onClick: onViewJobs,
      variant: (pendingJobsCount > 0 ? "default" : "outline") as "default" | "outline",
      urgent: pendingJobsCount > 0,
      badge: pendingJobsCount > 0 ? pendingJobsCount : undefined
    },
    {
      title: "Évaluations",
      description: "Voir mes notes",
      icon: Star,
      onClick: onViewReviews,
      variant: "outline" as "outline",
      urgent: false
    }
  ];

  return (
    <AnimationWrapper direction="up" duration={0.5}>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Actions Prioritaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actions.map((action, index) => (
              <FadeInCard key={index} delay={index * 0.1}>
                <Button
                  variant={action.variant}
                  className={`h-auto p-4 flex flex-col items-start gap-2 relative w-full ${
                    action.urgent ? 'ring-2 ring-primary/20' : ''
                  }`}
                  onClick={action.onClick}
                >
                  <div className="flex items-center gap-2 w-full">
                    <action.icon className="h-5 w-5" />
                    <span className="font-medium">{action.title}</span>
                    {action.badge && (
                      <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs flex items-center justify-center">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground w-full text-left">
                    {action.description}
                  </span>
                  {action.urgent && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </Button>
              </FadeInCard>
            ))}
          </StaggerContainer>

        {/* Indicateur de progression globale */}
        <FadeInCard delay={0.4}>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profil complété</span>
              <span className="text-sm text-muted-foreground">{profileCompleteness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  profileCompleteness >= 80 ? 'bg-green-500' : 
                  profileCompleteness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${profileCompleteness}%` }}
              />
            </div>
            {profileCompleteness < 100 && (
              <p className="text-xs text-muted-foreground mt-1">
                Complétez votre profil pour recevoir plus d'offres !
              </p>
            )}
          </div>
        </FadeInCard>
      </CardContent>
    </Card>
    </AnimationWrapper>
  );
}
