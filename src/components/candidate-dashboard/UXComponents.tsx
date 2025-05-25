"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  Loader2,
  Wifi,
  WifiOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Composant de squelette pour le dashboard
export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div>
              <Skeleton className="w-48 h-7 mb-2" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-32 h-10" />
            <Skeleton className="w-40 h-10" />
            <Skeleton className="w-28 h-10" />
          </div>
        </div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="w-24 h-4 mb-2" />
                  <Skeleton className="w-16 h-8" />
                </div>
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
              <Skeleton className="w-32 h-3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="w-48 h-6" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="w-3/4 h-5 mb-2" />
                  <Skeleton className="w-1/2 h-4 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-16 h-6" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <Skeleton className="w-full h-32" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <Skeleton className="w-full h-24" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Composant de notification toast améliioré
interface ToastNotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ToastNotification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  action 
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Attendre la fin de l'animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600"
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 max-w-sm w-full",
      "transform transition-all duration-300 ease-in-out",
      isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    )}>
      <Card className={cn("border-l-4", colors[type])}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColors[type])} />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{title}</h4>
              {message && (
                <p className="text-sm mt-1 opacity-80">{message}</p>
              )}
              {action && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-auto p-0 text-sm underline"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 opacity-70 hover:opacity-100"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Indicateur de connexion
export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-2">
      <div className="flex items-center justify-center gap-2 text-sm">
        <WifiOff className="h-4 w-4" />
        <span>Connexion internet indisponible</span>
      </div>
    </div>
  );
}

// État de chargement pour les actions
export function LoadingState({ 
  message = "Chargement en cours...", 
  size = "default" 
}: { 
  message?: string; 
  size?: "sm" | "default" | "lg" 
}) {
  const sizes = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      <span className="text-muted-foreground text-sm">{message}</span>
    </div>
  );
}

// État vide amélioré
export function EmptyState({ 
  icon: Icon,
  title,
  description,
  action
}: {
  icon: any;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Badge de statut amélioré
export function StatusBadge({ 
  status, 
  children 
}: { 
  status: "success" | "error" | "warning" | "info" | "neutral";
  children: React.ReactNode;
}) {
  const variants = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <Badge className={cn("border", variants[status])}>
      {children}
    </Badge>
  );
}
