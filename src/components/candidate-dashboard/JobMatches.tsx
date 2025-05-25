"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, CalendarIcon, BriefcaseIcon, Clock, CheckIcon, XIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientOnlyDateFormat } from "@/components/ui/ClientOnlyDateFormat";

interface JobMatch {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  location: string;
  startDate: Date;
  endDate?: Date;
  salary: number;
  skills: string[];
  matchPercentage: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

interface JobMatchesProps {
  matches: JobMatch[];
  isLoading?: boolean;
  onAcceptJob: (jobId: string) => Promise<void>;
  onRejectJob: (jobId: string) => Promise<void>;
}

export function JobMatches({ 
  matches, 
  isLoading = false,
  onAcceptJob,
  onRejectJob
}: JobMatchesProps) {
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);

  const handleAcceptJob = async (jobId: string) => {
    try {
      setProcessingJobId(jobId);
      await onAcceptJob(jobId);
    } catch (error) {
      console.error("Error accepting job:", error);
    } finally {
      setProcessingJobId(null);
    }
  };

  const handleRejectJob = async (jobId: string) => {
    try {
      setProcessingJobId(jobId);
      await onRejectJob(jobId);
    } catch (error) {
      console.error("Error rejecting job:", error);
    } finally {
      setProcessingJobId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="py-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <BriefcaseIcon className="h-12 w-12 text-muted-foreground/60" />
            <div>
              <p className="text-lg font-medium">Aucune offre d'emploi correspondante</p>
              <p className="text-sm text-muted-foreground">
                Vous recevrez des notifications lorsque des emplois correspondant à votre profil seront disponibles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((job) => (
        <Card key={job.id} className="overflow-hidden">
          <div className={cn(
            "h-2 w-full",
            job.status === 'pending' ? "bg-blue-500" :
            job.status === 'accepted' ? "bg-green-500" :
            job.status === 'rejected' ? "bg-gray-400" :
            "bg-purple-500"
          )} />
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <span className="font-medium">{job.company.name}</span>
                </CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <Badge 
                  className={cn(
                    "text-xs",
                    job.matchPercentage >= 90 ? "bg-green-600" :
                    job.matchPercentage >= 70 ? "bg-green-500" :
                    "bg-blue-500"
                  )}
                >
                  Correspondance {job.matchPercentage}%
                </Badge>
                <p className="text-sm font-medium mt-1">{job.salary} MAD/h</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3 space-y-3">
            <div className="flex flex-wrap gap-1">
              {job.skills.slice(0, 5).map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.skills.length - 5}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col space-y-1 text-sm">
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Du <ClientOnlyDateFormat date={job.startDate} />
                  {job.endDate && (
                    <>
                      {" au "}
                      <ClientOnlyDateFormat date={job.endDate} />
                    </>
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>En attente de réponse</span>
            </div>
          </CardContent>
          
          <CardFooter className={cn(
            "border-t bg-muted/30 p-3",
            job.status !== 'pending' && "justify-center"
          )}>
            {job.status === 'pending' ? (
              <div className="flex justify-between w-full">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-[48%]"
                  onClick={() => handleRejectJob(job.id)}
                  disabled={processingJobId === job.id}
                >
                  {processingJobId === job.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <XIcon className="h-4 w-4 mr-1" />
                      Décliner
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-[48%]"
                  onClick={() => handleAcceptJob(job.id)}
                  disabled={processingJobId === job.id}
                >
                  {processingJobId === job.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Accepter
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center text-sm">
                {job.status === 'accepted' && (
                  <span className="flex items-center text-green-600">
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Offre acceptée
                  </span>
                )}
                {job.status === 'rejected' && (
                  <span className="flex items-center text-muted-foreground">
                    <XIcon className="h-4 w-4 mr-1" />
                    Offre déclinée
                  </span>
                )}
                {job.status === 'completed' && (
                  <span className="flex items-center text-purple-600">
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Mission terminée
                  </span>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
