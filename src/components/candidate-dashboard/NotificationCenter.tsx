"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, X, Clock, Info } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "job_match" | "offer" | "system" | "reminder";
  isRead: boolean;
  createdAt: Date;
  link?: string;
  jobId?: string;
}

interface NotificationCenterProps {
  onViewAllNotifications?: () => void;
  onMarkAllAsRead?: () => void;
}

export function NotificationCenter({
  onViewAllNotifications,
  onMarkAllAsRead,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Mock data - À remplacer par une requête API/Supabase
  useEffect(() => {
    // Simuler le chargement des notifications depuis une API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Nouvelle offre correspondante",
        message: "Un nouveau poste de manutentionnaire correspond à votre profil",
        type: "job_match",
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        jobId: "job-123",
        link: "/fr/dashboard/candidate/jobs",
      },
      {
        id: "2",
        title: "Rappel d'entretien",
        message: "Vous avez un entretien avec Logistic Pro aujourd'hui à 14h00",
        type: "reminder",
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 3600000), // 3 hours ago
      },
      {
        id: "3",
        title: "Votre profil est incomplet",
        message: "Complétez votre profil pour augmenter vos chances de trouver des missions",
        type: "system",
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 3600000), // 1 day ago
        link: "/fr/dashboard/candidate/profile/edit",
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => 
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    onMarkAllAsRead?.();
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "job_match":
        return <Bell className="h-4 w-4 text-primary" />;
      case "offer":
        return <Bell className="h-4 w-4 text-green-500" />;
      case "system":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "reminder":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      return format(date, "d MMMM", { locale: fr });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 px-2"
                  onClick={handleMarkAllAsRead}
                >
                  <BellOff className="h-3 w-3 mr-1" />
                  Tout marquer comme lu
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <BellOff className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Vous n'avez pas de notifications
                </p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/30 transition-colors",
                      !notification.isRead && "bg-primary/5"
                    )}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-8"
              onClick={() => {
                setIsOpen(false);
                onViewAllNotifications?.();
              }}
            >
              Voir toutes les notifications
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
