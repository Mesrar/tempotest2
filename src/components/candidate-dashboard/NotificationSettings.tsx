"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Smartphone, Mail, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Type pour les préférences de notification
interface NotificationPreferences {
  jobMatches: boolean;
  missionReminders: boolean;
  statusUpdates: boolean;
  documentVerifications: boolean;
  emergencyAlerts: boolean;
  marketing: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface NotificationSettingsProps {
  candidateId: string;
  initialPreferences?: Partial<NotificationPreferences>;
  onSave?: (preferences: NotificationPreferences) => Promise<void>;
}

export function NotificationSettings({
  candidateId,
  initialPreferences,
  onSave
}: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    jobMatches: true,
    missionReminders: true,
    statusUpdates: true,
    documentVerifications: true,
    emergencyAlerts: true,
    marketing: false,
    email: true,
    sms: true,
    push: false
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialPreferences) {
      setPreferences(prev => ({ ...prev, ...initialPreferences }));
    }
    
    // Dans un cas réel, on chargerait les préférences depuis la base de données
    // Exemple:
    // async function loadPreferences() {
    //   const { data, error } = await supabase
    //     .from('notification_preferences')
    //     .select('*')
    //     .eq('candidate_id', candidateId)
    //     .single();
    //
    //   if (data && !error) {
    //     setPreferences(data);
    //   }
    // }
    // loadPreferences();
    
  }, [initialPreferences, candidateId]);

  const handleTogglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(preferences);
      } else {
        // Mock de sauvegarde avec délai
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de notification ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Bell className="h-5 w-5 mr-2 text-primary" />
          Paramètres de Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Types de notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="jobMatches" className="cursor-pointer">Offres d'emploi correspondantes</Label>
              </div>
              <Switch 
                id="jobMatches" 
                checked={preferences.jobMatches}
                onCheckedChange={() => handleTogglePreference('jobMatches')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="missionReminders" className="cursor-pointer">Rappels de missions</Label>
              </div>
              <Switch 
                id="missionReminders" 
                checked={preferences.missionReminders}
                onCheckedChange={() => handleTogglePreference('missionReminders')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="statusUpdates" className="cursor-pointer">Mises à jour de statut</Label>
              </div>
              <Switch 
                id="statusUpdates" 
                checked={preferences.statusUpdates}
                onCheckedChange={() => handleTogglePreference('statusUpdates')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="documentVerifications" className="cursor-pointer">Vérifications de documents</Label>
              </div>
              <Switch 
                id="documentVerifications" 
                checked={preferences.documentVerifications}
                onCheckedChange={() => handleTogglePreference('documentVerifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <Label htmlFor="emergencyAlerts" className="cursor-pointer">Alertes d'urgence</Label>
              </div>
              <Switch 
                id="emergencyAlerts" 
                checked={preferences.emergencyAlerts}
                onCheckedChange={() => handleTogglePreference('emergencyAlerts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellOff className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="marketing" className="cursor-pointer">Communications marketing</Label>
              </div>
              <Switch 
                id="marketing" 
                checked={preferences.marketing}
                onCheckedChange={() => handleTogglePreference('marketing')}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Canaux de notification</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email" className="cursor-pointer">Notifications par email</Label>
              </div>
              <Switch 
                id="email" 
                checked={preferences.email}
                onCheckedChange={() => handleTogglePreference('email')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sms" className="cursor-pointer">Notifications par SMS</Label>
              </div>
              <Switch 
                id="sms" 
                checked={preferences.sms}
                onCheckedChange={() => handleTogglePreference('sms')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="push" className="cursor-pointer">Notifications push</Label>
              </div>
              <Switch 
                id="push" 
                checked={preferences.push}
                onCheckedChange={() => handleTogglePreference('push')}
              />
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSave}
          className="w-full"
          disabled={saving}
        >
          {saving ? "Enregistrement..." : "Enregistrer les préférences"}
        </Button>
      </CardContent>
    </Card>
  );
}
