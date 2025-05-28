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

  // Gestion des erreurs de session ou de chargement
  if (error) {
    console.error("Error loading staff data:", error);
    
    // Gestion spécifique des erreurs d'authentification
    if (error.message?.includes("session") || error.message?.includes("JWT")) {
      toast({
        title: "Session expirée",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      router.push(`/${locale}/auth/signin`);
      return null;
    }
    
    toast({
      title: "Erreur de chargement",
      description: "Impossible de charger vos données. Veuillez actualiser la page.",
      variant: "destructive",
    });
    
    return (
      <main className="min-h-screen bg-muted/40 pb-10">
        <div className="bg-background py-4 shadow-sm border-b mb-6">
          <div className="container max-w-5xl mx-auto px-4">
            <h1 className="text-2xl font-bold">{dict.dashboard?.uploadDocuments || "Télécharger des documents"}</h1>
            <p className="text-muted-foreground text-red-600">
              Erreur de chargement des données. Veuillez actualiser la page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Afficher un état de chargement pendant la récupération des données
  if (loading) {
    return (
      <main className="min-h-screen bg-muted/40 pb-10">
        <div className="bg-background py-4 shadow-sm border-b mb-6">
          <div className="container max-w-5xl mx-auto px-4">
            <h1 className="text-2xl font-bold">{dict.dashboard?.uploadDocuments || "Télécharger des documents"}</h1>
            <p className="text-muted-foreground">
              Chargement de vos données...
            </p>
          </div>
        </div>
        
        <div className="container max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Chargement...</span>
          </div>
        </div>
      </main>
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
    console.log("🚀 Début handleUpload DocumentUpload:", {
      filesCount: files.length,
      hasProfile: !!profile,
      hasUser: !!user,
      profileId: profile?.id,
      userId: user?.id,
      userEmail: user?.email,
      firstFileType: files[0]?.type,
      firstFileSize: files[0]?.size,
      firstFileName: files[0]?.name,
      isFirstFileInstance: files[0] instanceof File
    });
    
    try {
      if (!profile) {
        throw new Error("Profil non trouvé");
      }
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      // Vérifier que tous les fichiers sont valides avant de commencer l'upload
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log("📄 Vérification fichier:", {
          name: file.name,
          type: file.type,
          size: file.size,
          constructor: file.constructor.name,
          isFile: file instanceof File,
          isBlob: file instanceof Blob
        });
        
        if (!(file instanceof File)) {
          throw new Error(`Le fichier à l'index ${i} n'est pas valide.`);
        }
      }

      const uploadPromises = files.map(async (file) => {
        console.log(`🔄 Upload du fichier: ${file.name}`);
        const result = await uploadDocument(file, profile.id, user.id);
        if (!result.success) {
          throw new Error(
            result.error?.message || 
            `Erreur lors du téléchargement de ${file.name}`
          );
        }
        return result;
      });
      
      const results = await Promise.all(uploadPromises);
      
      toast({
        title: "Documents téléchargés",
        description: `${files.length} document(s) ont été téléchargés avec succès.`,
      });
      
      // Redirect back to the dashboard
      router.push(`/${locale}/dashboard/candidate`);
    } catch (error) {
      console.error("Error uploading documents:", error);
      
      let errorMessage = "Une erreur s'est produite lors du téléchargement de vos documents.";
      let errorTitle = "Erreur";
      
      if (error instanceof Error) {
        const message = error.message;
        
        // Messages d'erreur spécifiques selon le type d'erreur
        if (message.includes("session") || message.includes("authentification") || message.includes("connecté")) {
          errorTitle = "Problème de connexion";
          errorMessage = "Votre session a expiré. Veuillez vous reconnecter et réessayer.";
          
          // Rediriger vers la page de connexion après un délai
          setTimeout(() => {
            router.push(`/${locale}/auth/signin`);
          }, 3000);
        } else if (message.includes("autorisé")) {
          errorTitle = "Accès refusé";
          errorMessage = "Vous n'êtes pas autorisé à effectuer cette action.";
        } else if (message.includes("stockage") || message.includes("storage")) {
          errorTitle = "Erreur de téléchargement";
          errorMessage = "Impossible de télécharger le fichier. Vérifiez la taille et le format du fichier.";
        } else if (message.includes("base de données") || message.includes("database")) {
          errorTitle = "Erreur de sauvegarde";
          errorMessage = "Le fichier a été téléchargé mais n'a pas pu être enregistré. Contactez le support.";
        } else {
          errorMessage = message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
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
      
      const { success, error } = await deleteDocument({
        id,
        filePath: documentToDelete.file_path
      });
      
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
