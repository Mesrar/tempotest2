"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Home,
  BriefcaseIcon,
  FileTextIcon,
  User,
  Calendar,
  Star,
  Bell
} from "lucide-react";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingJobsCount: number;
  notificationsCount: number;
  className?: string;
}

export function MobileBottomNav({ 
  activeTab, 
  onTabChange, 
  pendingJobsCount, 
  notificationsCount,
  className 
}: MobileBottomNavProps) {
  const navItems = [
    {
      id: "overview",
      label: "Accueil",
      icon: Home,
      badge: null
    },
    {
      id: "jobs",
      label: "Offres",
      icon: BriefcaseIcon,
      badge: pendingJobsCount > 0 ? pendingJobsCount : null
    },
    {
      id: "documents",
      label: "Docs",
      icon: FileTextIcon,
      badge: null
    },
    {
      id: "profile",
      label: "Profil",
      icon: User,
      badge: null
    }
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
      "bg-background border-t border-border shadow-lg",
      "pb-safe-area-inset-bottom",
      className
    )}>
      <Card className="rounded-none border-t-0 border-l-0 border-r-0">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 flex-1 relative",
                "transition-all duration-200",
                activeTab === item.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                activeTab === item.id && "scale-110"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* Badge pour les notifications */}
              {item.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse"
                >
                  {item.badge > 9 ? "9+" : item.badge}
                </Badge>
              )}
              
              {/* Indicateur d'état actif */}
              {activeTab === item.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}

interface MobileTabIndicatorProps {
  activeTab: string;
  tabs: Array<{ id: string; label: string; count?: number }>;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function MobileTabIndicator({ 
  activeTab, 
  tabs, 
  onTabChange,
  className 
}: MobileTabIndicatorProps) {
  return (
    <div className={cn(
      "flex gap-1 p-1 bg-muted rounded-lg overflow-x-auto scrollbar-hide",
      className
    )}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          size="sm"
          className={cn(
            "relative whitespace-nowrap min-w-0 flex-shrink-0",
            "transition-all duration-200"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="truncate">{tab.label}</span>
          {tab.count && tab.count > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
            >
              {tab.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}

export function MobileActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  badge,
  variant = "outline",
  className 
}: {
  icon: any;
  label: string;
  onClick: () => void;
  badge?: number;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      className={cn(
        "relative flex items-center gap-2 min-w-0",
        className
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{label}</span>
      {badge && badge > 0 && (
        <Badge 
          variant="destructive" 
          className="ml-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
        >
          {badge > 9 ? "9+" : badge}
        </Badge>
      )}
    </Button>
  );
}
