"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ThumbsUp, Quote, User, MapPin, Calendar, Clock, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Review {
  id: string;
  reviewer: {
    name: string;
    company: string;
    position: string;
    avatarUrl?: string;
  };
  rating: number;
  comment: string;
  date: Date;
  missionName?: string;
}

interface Reference {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  message?: string;
}

interface CandidateReviewsProps {
  reviews: Review[];
  references: Reference[];
}

export function CandidateReviews({
  reviews,
  references,
}: CandidateReviewsProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="h-5 w-5 mr-2 text-primary" />
            Évaluations et Commentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="py-8 text-center">
              <Quote className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground">
                Pas encore d'évaluations
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Les évaluations apparaîtront ici après avoir complété des missions
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">/ 5</span>
                </div>
                
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i <= Math.round(averageRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={review.reviewer.avatarUrl}
                            alt={review.reviewer.name}
                          />
                          <AvatarFallback>
                            {review.reviewer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {review.reviewer.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {review.reviewer.position} chez{" "}
                            {review.reviewer.company}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i <= review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-muted"
                              )}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground text-right mt-1">
                          {format(review.date, "d MMMM yyyy", { locale: fr })}
                        </div>
                      </div>
                    </div>
                    
                    {review.missionName && (
                      <Badge variant="outline" className="ml-9">
                        Mission: {review.missionName}
                      </Badge>
                    )}
                    
                    <blockquote className="ml-9 text-sm border-l-2 pl-4 italic">
                      {review.comment}
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ThumbsUp className="h-5 w-5 mr-2 text-primary" />
            Références Professionnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {references.length === 0 ? (
            <div className="py-8 text-center">
              <User className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground">
                Pas encore de références
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Les références professionnelles apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {references.map((reference) => (
                <div
                  key={reference.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={reference.avatarUrl}
                        alt={reference.name}
                      />
                      <AvatarFallback>
                        {reference.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{reference.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {reference.position} chez {reference.company}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    {reference.message && (
                      <blockquote className="border-l-2 pl-4 italic text-sm">
                        "{reference.message}"
                      </blockquote>
                    )}
                    
                    <div className="flex items-center gap-1 mt-2">
                      <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {reference.email}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
