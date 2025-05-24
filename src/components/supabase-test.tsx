"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCandidates } from "@/hooks/use-supabase-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SupabaseTestComponent() {
  const { user, loading: authLoading } = useAuth();
  const { data: candidates, isLoading: candidatesLoading } = useCandidates("test-job-id");

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Chargement de l'authentification...
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Test Supabase Context</h3>
      
      <div className="space-y-2">
        <p>
          <strong>Utilisateur:</strong> {user ? user.email : "Non connecté"}
        </p>
        
        <p>
          <strong>Candidats:</strong> {candidatesLoading ? "Chargement..." : `${candidates?.length || 0} trouvés`}
        </p>
        
        <div className="mt-4">
          <Button variant="outline" size="sm">
            ✅ Context Supabase fonctionnel
          </Button>
        </div>
      </div>
    </div>
  );
}
