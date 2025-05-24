"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BriefcaseIcon, FileTextIcon, UserIcon, Calendar, Star, Bell, HistoryIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNavBar({ locale = "fr" }: { locale?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsVisible(window.innerWidth < 640);
    };

    // Check on mount
    checkIfMobile();

    // Check on resize
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  if (!isVisible) return null;

  const basePath = `/${locale}/dashboard/candidate`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <Card className="rounded-b-none border-t shadow-lg">
        <div className="flex justify-around items-center h-16">
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "flex flex-col h-full pt-2 rounded-none flex-1",
              isActive("/profile") && "bg-primary/10 text-primary"
            )}
            onClick={() => router.push(`${basePath}`)}
          >
            <UserIcon className="h-5 w-5 mb-1" />
            <span className="text-xs">Profil</span>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "flex flex-col h-full pt-2 rounded-none flex-1",
              isActive("/jobs") && "bg-primary/10 text-primary"
            )}
            onClick={() => router.push(`${basePath}/jobs`)}
          >
            <BriefcaseIcon className="h-5 w-5 mb-1" />
            <span className="text-xs">Offres</span>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "flex flex-col h-full pt-2 rounded-none flex-1",
              isActive("/documents") && "bg-primary/10 text-primary"
            )}
            onClick={() => router.push(`${basePath}/documents/upload`)}
          >
            <FileTextIcon className="h-5 w-5 mb-1" />
            <span className="text-xs">Documents</span>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "flex flex-col h-full pt-2 rounded-none flex-1",
              isActive("/availability") && "bg-primary/10 text-primary"
            )}
            onClick={() => router.push(`${basePath}/availability`)}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-xs">Dispo</span>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "flex flex-col h-full pt-2 rounded-none flex-1",
              isActive("/reviews") && "bg-primary/10 text-primary"
            )}
            onClick={() => router.push(`${basePath}/reviews`)}
          >
            <Star className="h-5 w-5 mb-1" />
            <span className="text-xs">Notes</span>
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "flex flex-col h-full pt-2 rounded-none flex-1",
              isActive("/missions") && "bg-primary/10 text-primary"
            )}
            onClick={() => router.push(`${basePath}/missions`)}
          >
            <HistoryIcon className="h-5 w-5 mb-1" />
            <span className="text-xs">Missions</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
