"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AvailabilityBadgeProps {
  isAvailable: boolean;
  className?: string;
}

export function AvailabilityBadge({ 
  isAvailable, 
  className 
}: AvailabilityBadgeProps) {
  return (
    <Badge 
      variant={isAvailable ? "default" : "outline"} 
      className={cn(
        "font-medium text-xs md:text-sm",
        isAvailable ? "bg-green-600 hover:bg-green-700" : "text-muted-foreground",
        className
      )}
    >
      {isAvailable ? "Disponible Maintenant" : "Non Disponible"}
    </Badge>
  );
}