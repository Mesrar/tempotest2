"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  UserIcon,
  BriefcaseIcon,
  FileTextIcon,
  Star,
  Calendar,
  Bell,
  Settings,
  Home,
  ChevronRight
} from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingJobsCount: number;
  notificationsCount: number;
  onEditProfile: () => void;
  onUploadDocuments: () => void;
}

export function MobileNavigation({
  activeTab,
  onTabChange,
  pendingJobsCount,
  notificationsCount,
  onEditProfile,
  onUploadDocuments
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: Home,
      badge: null,
      description: "Tableau de bord principal"
    },
    {
      id: "profile",
      label: "Mon Profil",
      icon: UserIcon,
      badge: null,
      description: "Informations personnelles"
    },
    {
      id: "jobs",
      label: "Offres d'Emploi",
      icon: BriefcaseIcon,
      badge: pendingJobsCount > 0 ? pendingJobsCount : null,
      description: `${pendingJobsCount} offre(s) en attente`
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileTextIcon,
      badge: null,
      description: "Certificats et permis"
    },
    {
      id: "reviews",
      label: "Évaluations",
      icon: Star,
      badge: null,
      description: "Notes et recommandations"
    }
  ];

  const quickActions = [
    {
      label: "Modifier le profil",
      icon: Settings,
      onClick: onEditProfile,
      description: "Mettre à jour mes informations"
    },
    {
      label: "Ajouter des documents",
      icon: FileTextIcon,
      onClick: onUploadDocuments,
      description: "Télécharger certificats"
    },
    {
      label: "Gérer ma disponibilité",
      icon: Calendar,
      onClick: () => {
        window.location.href = "/fr/dashboard/candidate/availability";
      },
      description: "Définir mes créneaux"
    }
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Menu className="h-4 w-4 mr-2" />
            Navigation
            {(pendingJobsCount > 0 || notificationsCount > 0) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Menu Principal
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Navigation principale */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Navigation</h3>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleTabChange(item.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.label}</span>
                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Actions Rapides</h3>
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={action.onClick}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <action.icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <span className="font-medium">{action.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            {(pendingJobsCount > 0 || notificationsCount > 0) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-900 text-sm">Attention requise</span>
                </div>
                <div className="space-y-1 text-xs text-red-700">
                  {pendingJobsCount > 0 && (
                    <p>• {pendingJobsCount} offre(s) d'emploi en attente de réponse</p>
                  )}
                  {notificationsCount > 0 && (
                    <p>• {notificationsCount} notification(s) non lue(s)</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
