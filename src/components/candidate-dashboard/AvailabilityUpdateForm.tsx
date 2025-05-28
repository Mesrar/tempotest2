"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, CheckIcon, Loader2 } from "lucide-react";
import { ClientOnlyDateFormat } from "@/components/ui/ClientOnlyDateFormat";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { updateCandidateAvailability } from "@/lib/supabase-client";
import { toast } from "@/components/ui/use-toast";

interface AvailabilityUpdateFormProps {
  initialAvailable?: boolean;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onUpdate?: (data: {
    isAvailable: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
  }) => void;
  className?: string;
}

export function AvailabilityUpdateForm({
  initialAvailable = true,
  initialStartDate = new Date(),
  initialEndDate = null,
  onUpdate,
  className,
}: AvailabilityUpdateFormProps) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  
  // Fonctions wrapper pour gérer la conversion des types pour les sélecteurs de dates
  const handleStartDateSelect = (date: Date | undefined) => setStartDate(date || null);
  const handleEndDateSelect = (date: Date | undefined) => setEndDate(date || null);

  const handleSubmit = async () => {
    if (!startDate && isAvailable) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date de début de disponibilité",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Dans une application réelle, on enverrait ces données à l'API
      // await updateCandidateAvailability("candidate-id", isAvailable, startDate?.toISOString(), endDate?.toISOString());

      // Pour la démo, on simule un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Disponibilité mise à jour",
        description: isAvailable 
          ? "Votre statut de disponibilité a été activé" 
          : "Votre statut de disponibilité a été désactivé",
      });

      if (onUpdate) {
        onUpdate({
          isAvailable,
          startDate,
          endDate,
        });
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre disponibilité",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="availability" className="flex items-center">
          <span>Je suis disponible pour des missions</span>
        </Label>
        <Switch
          id="availability"
          checked={isAvailable}
          onCheckedChange={setIsAvailable}
          disabled={isSubmitting}
        />
      </div>

      <div className={cn(!isAvailable && "opacity-50 pointer-events-none")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date de début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting || !isAvailable}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    <ClientOnlyDateFormat date={startDate} formatString="PPP" />
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate || undefined}
                  onSelect={handleStartDateSelect}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Date de fin (optionnelle)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting || !isAvailable}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    <ClientOnlyDateFormat date={endDate} formatString="PPP" />
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={handleEndDateSelect}
                  initialFocus
                  disabled={(date) =>
                    startDate ? date < startDate : date < new Date()
                  }
                  required={false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mise à jour...
          </>
        ) : (
          <>
            <CheckIcon className="mr-2 h-4 w-4" />
            Mettre à jour ma disponibilité
          </>
        )}
      </Button>
    </div>
  );
}
