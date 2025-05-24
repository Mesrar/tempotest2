"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { FileUpIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateProfileCardProps {
  candidate: {
    id: string;
    name: string;
    avatarUrl?: string;
    isAvailable: boolean;
    rating?: number;
    skills?: string[];
  };
  onEditProfile?: () => void;
  onUploadDocuments?: () => void;
}

export function CandidateProfileCard({ 
  candidate, 
  onEditProfile, 
  onUploadDocuments 
}: CandidateProfileCardProps) {
  const initials = candidate.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="w-full overflow-hidden border-2 border-muted/30">
      <CardHeader className="pb-2 relative">
        <div className="absolute right-4 top-4">
          <AvailabilityBadge isAvailable={candidate.isAvailable} />
        </div>
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-2 border-2 border-primary/20">
            <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
            <AvatarFallback className="text-xl font-medium">{initials}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{candidate.name}</h3>
          
          {candidate.rating !== undefined && (
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={cn("text-lg", i < candidate.rating! ? "text-yellow-500" : "text-gray-300")}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-2">
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {candidate.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 pt-0 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Button 
          variant="outline" 
          className="w-full sm:flex-1"
          onClick={onEditProfile}
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Modifier Profil
        </Button>
        <Button 
          variant="default" 
          className="w-full sm:flex-1"
          onClick={onUploadDocuments}
        >
          <FileUpIcon className="h-4 w-4 mr-2" />
          Télécharger Documents
        </Button>
      </CardFooter>
    </Card>
  );
}