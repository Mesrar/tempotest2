"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BriefcaseIcon,
  Clock,
  MapPin,
  CalendarIcon,
  Euro,
  Building,
  CheckCircle,
  StarIcon,
  Star,
  FileText,
  Calendar,
  ListFilter,
  X
} from "lucide-react";
import { getStatusBadge } from "./mission-utils";
import { ClientOnlyDateFormat } from "@/components/ui/ClientOnlyDateFormat";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type MissionStatus = "upcoming" | "active" | "completed" | "cancelled" | "pending";

interface Mission {
  id: string;
  title: string;
  company: {
    name: string;
    logoUrl: string;
  };
  location: string;
  startDate: Date;
  endDate?: Date;
  status: MissionStatus;
  rating?: number;
  paymentAmount: number;
  paymentStatus: "paid" | "pending" | "overdue";
  description: string;
  skills: string[];
  hourlyRate?: number;
  totalHours?: number;
  contactPerson?: {
    name: string;
    email?: string;
    position?: string;
  };
  documents?: {
    id: string;
    name: string;
    url: string;
  }[];
  hasBeenReviewed?: boolean;
}

interface MissionHistoryProps {
  missions?: Mission[];
  onSubmitReview?: (missionId: string, rating: number, comment: string) => Promise<void>;
}

export function MissionHistory({
  missions = [],
  onSubmitReview
}: MissionHistoryProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showReviewDialog, setShowReviewDialog] = useState<boolean>(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const filteredMissions = missions.filter(mission => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        mission.title.toLowerCase().includes(term) ||
        mission.company.name.toLowerCase().includes(term) ||
        mission.location.toLowerCase().includes(term)
      );
    }

    // Filter by tab
    if (activeTab === "all") return true;
    return mission.status === activeTab;
  });

  const handleSubmitReview = async () => {
    if (!onSubmitReview) return;
    
    setIsSubmittingReview(true);
    try {
      await onSubmitReview(selectedMissionId, rating, comment);
      setShowReviewDialog(false);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleOpenReviewDialog = (missionId: string) => {
    setSelectedMissionId(missionId);
    setRating(0);
    setComment("");
    setShowReviewDialog(true);
  };

  const upcomingCount = missions.filter(m => m.status === "upcoming").length;
  const activeCount = missions.filter(m => m.status === "active").length;
  const completedCount = missions.filter(m => m.status === "completed").length;

  const getStatusLabel = (status: MissionStatus) => {
    switch (status) {
      case "upcoming":
        return "À venir";
      case "active":
        return "En cours";
      case "completed":
        return "Terminée";
      case "cancelled":
        return "Annulée";
    }
  };

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            {getStatusLabel(status)}
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            {getStatusLabel(status)}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            {getStatusLabel(status)}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            {getStatusLabel(status)}
          </Badge>
        );
    }
  };

  return (
    <>
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle className="text-lg flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2 text-primary" />
              Historique des Missions
            </CardTitle>
            
            <div className="mt-4 sm:mt-0">
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Rechercher une mission..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <ListFilter className="h-4 w-4 text-muted-foreground" />
                </div>
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs onValueChange={setActiveTab} defaultValue="all">
            <TabsList className="mb-4 grid w-full grid-cols-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="upcoming">À venir ({upcomingCount})</TabsTrigger>
              <TabsTrigger value="active">En cours ({activeCount})</TabsTrigger>
              <TabsTrigger value="completed">Terminées ({completedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredMissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <BriefcaseIcon className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  {searchTerm ? (
                    <p className="text-muted-foreground">Aucune mission ne correspond à votre recherche</p>
                  ) : (
                    <>
                      <p className="text-muted-foreground">Aucune mission à afficher</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Vos missions apparaîtront ici lorsque vous en accepterez
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMissions.map((mission) => (
                    <MissionCard 
                      key={mission.id}
                      mission={mission}
                      onReview={mission.status === "completed" && !mission.hasBeenReviewed ? 
                        () => handleOpenReviewDialog(mission.id) : undefined}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {filteredMissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Calendar className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground">Aucune mission à venir</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMissions.map((mission) => (
                    <MissionCard 
                      key={mission.id}
                      mission={mission}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {filteredMissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Clock className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground">Aucune mission en cours</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMissions.map((mission) => (
                    <MissionCard 
                      key={mission.id}
                      mission={mission}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filteredMissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <CheckCircle className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground">Aucune mission terminée</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMissions.map((mission) => (
                    <MissionCard 
                      key={mission.id}
                      mission={mission}
                      onReview={!mission.hasBeenReviewed ? 
                        () => handleOpenReviewDialog(mission.id) : undefined}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Évaluer votre expérience</DialogTitle>
            <DialogDescription>
              Partagez votre expérience pour aider les autres candidats et améliorer nos services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Votre évaluation</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="icon"
                    onClick={() => setRating(star)}
                    className="hover:bg-transparent p-1 h-auto"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8",
                        star <= rating 
                          ? "text-yellow-500 fill-yellow-500" 
                          : "text-muted"
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Commentaire (optionnel)</Label>
              <Textarea
                id="comment"
                placeholder="Partagez votre expérience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isSubmittingReview}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={rating === 0 || isSubmittingReview}
            >
              {isSubmittingReview ? "Envoi..." : "Soumettre l'évaluation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface MissionCardProps {
  mission: Mission;
  onReview?: () => void;
}

function MissionCard({ mission, onReview }: MissionCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      showDetails ? "border-primary/30" : "border"
    )}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="text-base font-medium mr-2">{mission.title}</h3>
                {getStatusBadge(mission.status)}
              </div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Building className="h-3.5 w-3.5 mr-1" />
                {mission.company.name}
              </div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {mission.location}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center text-sm font-medium">
                <Euro className="h-4 w-4 mr-1" />
                {mission.hourlyRate} MAD/h
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {mission.totalHours} heures
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div className="flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>
                Du <ClientOnlyDateFormat date={mission.startDate} formatString="d MMM" />
                {mission.endDate && (
                  <>
                    {" au "}
                    <ClientOnlyDateFormat date={mission.endDate} formatString="d MMM" />
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>{(mission.totalHours || 0) * (mission.hourlyRate || 0)} MAD (total)</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-8 px-2 text-xs"
            >
              {showDetails ? "Masquer les détails" : "Voir les détails"}
            </Button>
            
            {mission.status === "completed" && onReview && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReview}
                className="h-8 px-2 text-xs"
              >
                <StarIcon className="h-3.5 w-3.5 mr-1" />
                Évaluer
              </Button>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 pt-0 border-t mt-4 space-y-4">
            {mission.description && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm">{mission.description}</p>
              </div>
            )}

            {mission.contactPerson && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Contact</h4>
                <div className="text-sm">
                  <div>{mission.contactPerson.name}</div>
                  {mission.contactPerson.position && (
                    <div className="text-muted-foreground text-xs">{mission.contactPerson.position}</div>
                  )}
                  <div className="flex flex-wrap gap-x-4 mt-1 text-xs">
                    {mission.contactPerson.email && (
                      <div>Email: {mission.contactPerson.email}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {mission.documents && mission.documents.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Documents</h4>
                <div className="grid gap-2">
                  {mission.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {doc.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
