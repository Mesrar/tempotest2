"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Clock,
  BriefcaseIcon,
  FileText,
  User
} from "lucide-react";
import { ClientOnlyTimeAgo } from "@/components/ui/ClientOnlyTimeAgo";
import { AnimationWrapper, StaggerContainer, FadeInCard } from "./AnimationWrapper";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "urgent";
  title: string;
  message: string;
  timestamp: Date;
  actionLabel?: string;
  onAction?: () => void;
  category: "job" | "profile" | "document" | "system";
}

interface SmartNotificationsProps {
  notifications?: Notification[];
  pendingJobsCount: number;
  profileCompleteness: number;
  documentsCount: number;
  onViewJobs: () => void;
  onEditProfile: () => void;
  onUploadDocuments: () => void;
}

export function SmartNotifications({
  notifications = [],
  pendingJobsCount,
  profileCompleteness,
  documentsCount,
  onViewJobs,
  onEditProfile,
  onUploadDocuments
}: SmartNotificationsProps) {
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);

  // Générer des notifications intelligentes basées sur l'état du profil
  const generateSmartNotifications = (): Notification[] => {
    const smartNotifs: Notification[] = [];

    if (pendingJobsCount > 0) {
      smartNotifs.push({
        id: "pending-jobs",
        type: "urgent",
        title: `${pendingJobsCount} offre(s) en attente`,
        message: "Des employeurs attendent votre réponse. Répondez rapidement pour maximiser vos chances !",
        timestamp: new Date(),
        actionLabel: "Voir les offres",
        onAction: onViewJobs,
        category: "job"
      });
    }

    if (profileCompleteness < 80) {
      smartNotifs.push({
        id: "complete-profile",
        type: "warning",
        title: "Profil incomplet",
        message: `Votre profil n'est complété qu'à ${profileCompleteness}%. Complétez-le pour recevoir plus d'offres.`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        actionLabel: "Compléter",
        onAction: onEditProfile,
        category: "profile"
      });
    }

    if (documentsCount === 0) {
      smartNotifs.push({
        id: "upload-documents",
        type: "warning",
        title: "Aucun document",
        message: "Ajoutez vos certifications et permis pour renforcer votre candidature.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        actionLabel: "Ajouter",
        onAction: onUploadDocuments,
        category: "document"
      });
    }

    if (profileCompleteness >= 90 && documentsCount > 0) {
      smartNotifs.push({
        id: "profile-excellent",
        type: "success",
        title: "Profil excellent !",
        message: "Votre profil est complet et attractif pour les employeurs.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30min ago
        category: "profile"
      });
    }

    return smartNotifs;
  };

  const allNotifications = [...notifications, ...generateSmartNotifications()]
    .filter(notif => !dismissedNotifications.includes(notif.id))
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, warning: 1, info: 2, success: 3 };
      return priorityOrder[a.type] - priorityOrder[b.type];
    });

  const dismissNotification = (id: string) => {
    setDismissedNotifications(prev => [...prev, id]);
  };

  const getNotificationIcon = (type: string, category: string) => {
    if (type === "urgent") return AlertCircle;
    if (type === "success") return CheckCircle;
    if (category === "job") return BriefcaseIcon;
    if (category === "document") return FileText;
    if (category === "profile") return User;
    return Info;
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "urgent":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "success":
        return "border-green-200 bg-green-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case "urgent":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "success":
        return "text-green-600";
      default:
        return "text-blue-600";
    }
  };

  if (allNotifications.length === 0) {
    return (
      <AnimationWrapper direction="up" duration={0.5}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FadeInCard>
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">Tout est à jour !</p>
                <p className="text-xs">Aucune notification pour le moment</p>
              </div>
            </FadeInCard>
          </CardContent>
        </Card>
      </AnimationWrapper>
    );
  }

  return (
    <AnimationWrapper direction="up" duration={0.5}>
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Notifications
            </CardTitle>
            <Badge variant="outline">
              {allNotifications.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <StaggerContainer>
            {allNotifications.slice(0, 5).map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type, notification.category);
              
              return (
                <FadeInCard key={notification.id} delay={index * 0.1}>
                  <div
                    className={`p-3 rounded-lg border ${getNotificationStyle(notification.type)} relative`}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className={`h-4 w-4 mt-0.5 flex-shrink-0 ${getIconStyle(notification.type)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 hover:bg-transparent"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <ClientOnlyTimeAgo date={notification.timestamp} />
                          </div>
                          {notification.actionLabel && notification.onAction && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={notification.onAction}
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInCard>
              );
            })}
          </StaggerContainer>

          {allNotifications.length > 5 && (
            <FadeInCard delay={0.6}>
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  Voir {allNotifications.length - 5} notification(s) supplémentaire(s)
                </Button>
              </div>
            </FadeInCard>
          )}
        </CardContent>
      </Card>
    </AnimationWrapper>
  );
}
