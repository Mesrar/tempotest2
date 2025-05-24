"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentUpload } from "@/components/candidate-dashboard/DocumentUpload";
import { useCurrentStaff } from "@/hooks/useCurrentStaff";
import { mapSupabaseDataToComponentProps } from "@/components/candidate-dashboard/mappers";
import { uploadDocument, deleteDocument } from "@/lib/supabase/documents";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface DocumentUploadPageClientProps {
  locale: Locale;
  dict: any;
}

export function DocumentUploadPageClient({ locale, dict }: DocumentUploadPageClientProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  
  // Récupérer les données du candidat à partir de Supabase
  const { user, profile, experiences, documents: supabaseDocuments, loading, error } = useCurrentStaff();
  
  // Convertir les documents Supabase au format attendu par le composant
  const mappedData = mapSupabaseDataToComponentProps({ 
    user, 
    profile, 
    experiences, 
    documents: supabaseDocuments, 
    jobMatches: []
  });

  // Afficher un état de chargement pendant la récupération des données
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Vérifier si l'utilisateur a un profil
  if (!profile) {
    toast({
      title: "Erreur",
      description: "Vous devez d'abord créer un profil pour télécharger des documents.",
      variant: "destructive",
    });
    router.push(`/${locale}/dashboard/candidate`);
    return null;
  }

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      if (!profile) {
        throw new Error("Profil non trouvé");
      }

      const uploadPromises = files.map(file => 
        uploadDocument(profile.id, file, file.name)
      );
      
      await Promise.all(uploadPromises);
      
      toast({
        title: "Documents téléchargés",
        description: `${files.length} document(s) ont été téléchargés avec succès.`,
      });
      
      // Redirect back to the dashboard
      router.push(`/${locale}/dashboard/candidate`);
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du téléchargement de vos documents.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      // Récupérer le chemin du fichier avant suppression
      const documentToDelete = supabaseDocuments.find(doc => doc.id === id);
      
      if (!documentToDelete) {
        throw new Error("Document non trouvé");
      }
      
      const { success, error } = await deleteDocument(id, documentToDelete.file_path);
      
      if (!success) {
        throw error;
      }
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      });
      
      // Actualiser la page pour montrer les changements
      router.refresh();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du document.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 pb-10">
      <div className="bg-background py-4 shadow-sm border-b mb-6">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold">{dict.dashboard?.uploadDocuments || "Télécharger des documents"}</h1>
          <p className="text-muted-foreground">
            Téléchargez vos certifications, permis et autres documents importants
          </p>
        </div>
      </div>
      
      <div className="container max-w-3xl mx-auto px-4">
        <DocumentUpload 
          onUpload={handleUpload}
          onCancel={() => router.push(`/${locale}/dashboard/candidate`)}
          isUploading={isUploading}
          existingDocuments={mappedData?.documents || []}
          onDeleteDocument={handleDeleteDocument}
        />
      </div>
    </main>
  );
}
