"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/context/supabase-provider";
import { useCandidates, useToggleShortlist } from "@/hooks/use-supabase-query";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  StarHalf,
  MessageSquare,
  UserCheck,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CandidatesListProps {
  jobId: string;
  locale: Locale;
}

interface Candidate {
  id: string;
  job_id: string;
  candidate_id: string;
  match_score: number;
  status: string;
  shortlisted: boolean;
  offer_sent_at: string | null;
  offer_response: string | null;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    email: string;
  };
}

export default function CandidatesList({ jobId, locale }: CandidatesListProps) {
  const supabase = useSupabase();
  const { data: candidates = [], isLoading: loading, error, refetch } = useCandidates(jobId);
  const toggleShortlistMutation = useToggleShortlist();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [candidatesList, setCandidates] = useState<Candidate[]>([]);

  // Update local candidates list when data changes
  useEffect(() => {
    if (candidates) {
      setCandidates(candidates);
    }
  }, [candidates]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading candidates",
        description: error.message || "Failed to load candidates",
        variant: "destructive",
      });
    }
  }, [error]);

  // Toggle shortlist status
  const toggleShortlist = async (
    candidateId: string,
    currentStatus: boolean,
  ) => {
    setActionLoading(candidateId);
    try {
      await toggleShortlistMutation.mutateAsync({
        candidateId,
        shortlisted: !currentStatus,
      });

      toast({
        title: currentStatus ? "Removed from shortlist" : "Added to shortlist",
        description: currentStatus
          ? "Candidate has been removed from your shortlist"
          : "Candidate has been added to your shortlist",
      });
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message || "Failed to update shortlist status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Send job offer
  const sendOffer = async (candidateId: string) => {
    setActionLoading(candidateId);
    try {
      const { error } = await supabase
        .from("job_candidates")
        .update({
          status: "offer_sent",
          offer_sent_at: new Date().toISOString(),
        })
        .eq("id", candidateId);

      if (error) throw error;

      // Update local state
      setCandidates(
        candidatesList?.map((candidate) =>
          candidate.id === candidateId
            ? {
                ...candidate,
                status: "offer_sent",
                offer_sent_at: new Date().toISOString(),
              }
            : candidate,
        ) || [],
      );

      toast({
        title: "Offer sent",
        description: "Job offer has been sent to the candidate",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send offer",
        description:
          error.message || "An error occurred while sending the offer",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Render match score stars
  const renderMatchScore = (score: number) => {
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = score % 20 >= 10;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        )}
        <span className="ml-2 text-sm font-medium">{score}%</span>
      </div>
    );
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Matched
          </Badge>
        );
      case "shortlisted":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Shortlisted
          </Badge>
        );
      case "offer_sent":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Offer Sent
          </Badge>
        );
      case "offer_accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Offer Accepted
          </Badge>
        );
      case "offer_rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Offer Rejected
          </Badge>
        );
      case "hired":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Hired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading candidates...</span>
      </div>
    );
  }

  if (candidatesList?.length === 0) {
    return (
      <div className="text-center py-12">
        <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Candidates Yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Our AI is still matching candidates for this job. Check back soon or
          adjust your job requirements to find more matches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and sorting options could go here */}

      {/* Candidates list */}
      <div className="space-y-4">
        {candidatesList?.map((candidate) => (
          <div
            key={candidate.id}
            className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={candidate.user.avatar_url || undefined}
                    alt={candidate.user.name}
                  />
                  <AvatarFallback>
                    {candidate.user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{candidate.user.name}</h3>
                    {getStatusBadge(candidate.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {candidate.user.email}
                  </p>
                  <div className="mt-2">
                    {renderMatchScore(candidate.match_score)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={candidate.shortlisted ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    toggleShortlist(candidate.id, candidate.shortlisted)
                  }
                  disabled={actionLoading === candidate.id}
                >
                  {actionLoading === candidate.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>{candidate.shortlisted ? "Shortlisted" : "Shortlist"}</>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>

                {(candidate.status === "matched" ||
                  candidate.status === "shortlisted") && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => sendOffer(candidate.id)}
                    disabled={actionLoading === candidate.id}
                  >
                    {actionLoading === candidate.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send Offer"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
