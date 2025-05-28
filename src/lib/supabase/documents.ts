"use client";

import { createClient } from "../../../supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

// Types pour les documents
export interface DocumentDeleteParams {
  id: string;
  filePath: string;
}

// Fonction utilitaire pour s'assurer qu'un fichier est valide
async function validateAndFixFile(file: File): Promise<File> {
  console.log("🔍 Validation du fichier:", {
    name: file.name,
    type: file.type,
    size: file.size,
    constructor: file.constructor.name
  });
  
  // Si le fichier a perdu son type MIME, essayer de le déduire de l'extension
  if (!file.type || file.type === 'application/json' || file.type === '') {
    const extension = file.name.split('.').pop()?.toLowerCase();
    let mimeType = file.type;
    
    console.log(`⚠️ Type MIME problématique détecté: "${file.type}", extension: "${extension}"`);
    
    switch (extension) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      default:
        mimeType = file.type || 'application/octet-stream';
    }
    
    // Créer un nouveau File avec le bon type MIME
    if (mimeType !== file.type) {
      console.log(`🔧 Correction du type MIME: "${file.type}" → "${mimeType}"`);
      try {
        // Lire le contenu du fichier et créer un nouveau Blob
        const fileData = await file.arrayBuffer();
        const correctedBlob = new Blob([fileData], { type: mimeType });
        const correctedFile = new File([correctedBlob], file.name, {
          type: mimeType,
          lastModified: file.lastModified
        });
        console.log("✅ Fichier corrigé créé:", {
          name: correctedFile.name,
          type: correctedFile.type,
          size: correctedFile.size
        });
        return correctedFile;
      } catch (error) {
        console.error("❌ Erreur lors de la création du fichier corrigé:", error);
        return file; // Retourner le fichier original en cas d'erreur
      }
    }
  }
  
  console.log("✅ Fichier valide, aucune correction nécessaire");
  return file;
}

// Fonction pour créer le client Supabase de manière sécurisée
// Utilise le même client que le contexte pour éviter les problèmes de session
function getSupabaseClient(): SupabaseClient {
  return createClient();
}

/**
 * Télécharge un document vers le stockage Supabase
 */
export async function uploadDocument(
  file: File,
  candidateId: string,
  userId: string
): Promise<{ document?: any; error?: any; success: boolean }> {
  const supabase = getSupabaseClient();
  
  try {
    // Valider et réparer le fichier si nécessaire
    const validatedFile = await validateAndFixFile(file);
    
    // Vérification détaillée des paramètres d'entrée
    console.log("🔄 Début upload document - Paramètres:", {
      fileName: validatedFile.name, 
      candidateId, 
      userId,
      fileSize: validatedFile.size,
      fileType: validatedFile.type,
      originalFileType: file.type,
      wasFixed: validatedFile !== file
    });

    // Vérifier l'authentification de manière plus robuste
    console.log("🔐 Vérification session...");
    
    // D'abord, essayer de récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("📋 Auth info:", {
      hasUser: !!user,
      userError,
      currentUserId: user?.id,
      userEmail: user?.email
    });

    if (userError) {
      console.error("❌ Erreur d'authentification:", userError);
      return { 
        error: { 
          message: "Erreur d'authentification. Veuillez vous reconnecter.",
          code: 'AUTH_ERROR',
          details: userError
        }, 
        success: false 
      };
    }

    if (!user) {
      console.error("❌ Aucun utilisateur connecté");
      return { 
        error: { 
          message: "Vous devez être connecté pour télécharger des documents. Veuillez vous reconnecter.",
          code: 'NO_USER'
        }, 
        success: false 
      };
    }

    // Vérifier que l'utilisateur correspond
    if (user.id !== userId) {
      console.error("❌ UserId ne correspond pas:", { 
        currentUserId: user.id, 
        paramUserId: userId 
      });
      return { 
        error: { 
          message: "Utilisateur non autorisé pour cette action.",
          code: 'UNAUTHORIZED'
        }, 
        success: false 
      };
    }

    console.log("✅ Authentification validée pour:", user.email);

    // Vérifier aussi la session pour plus de sécurité
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.warn("⚠️ Problème de session:", sessionError);
      // Continuer car getUser() a fonctionné
    }

    // 1. Upload vers le bucket avec userId dans le chemin (IMPORTANT pour la sécurité)
    const fileExt = validatedFile.name.split('.').pop();
    // Utiliser une méthode compatible avec le navigateur pour générer l'UUID
    const randomId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${userId}/${randomId}.${fileExt}`;
    
    console.log("📁 Tentative upload storage:", {
      bucket: 'candidates',
      fileName,
      fileSize: validatedFile.size,
      fileType: validatedFile.type,
      fileConstructor: validatedFile.constructor.name,
      isFileInstance: validatedFile instanceof File,
      isBlob: validatedFile instanceof Blob
    });

    // Vérifier que nous avons un vrai fichier
    if (typeof validatedFile !== 'object' || !validatedFile || (!('type' in validatedFile) || !('size' in validatedFile))) {
      console.error("❌ L'objet reçu n'est pas un fichier valide:", typeof validatedFile);
      return { 
        error: { 
          message: "Le fichier reçu n'est pas valide. Veuillez réessayer.",
          code: 'INVALID_FILE'
        }, 
        success: false 
      };
    }
    
    // NOUVELLE APPROCHE: Upload direct avec FormData pour contrôler le Content-Type
    console.log("📤 Upload direct avec FormData pour éviter les problèmes de type MIME");
    
    // Vérifier que nous avons une session valide
    if (!session?.access_token) {
      console.error("❌ Pas de token d'accès");
      return { 
        error: { 
          message: "Session invalide. Veuillez vous reconnecter.",
          code: 'NO_SESSION'
        }, 
        success: false 
      };
    }

    // Créer FormData pour l'upload - le navigateur va automatiquement définir le bon Content-Type
    const formData = new FormData();
    formData.append('', validatedFile); // Clé vide pour Supabase Storage
    
    // URL d'upload direct vers Supabase Storage
    const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/candidates/${fileName}`;
    
    console.log("📁 Upload direct vers Supabase:", {
      url: uploadUrl,
      fileName,
      fileType: validatedFile.type,
      fileSize: validatedFile.size,
      hasToken: !!session.access_token
    });

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'cache-control': 'max-age=3600',
          // Pas de Content-Type - FormData va automatiquement le définir avec boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur HTTP lors de l'upload:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        return { 
          error: { 
            message: `Erreur HTTP ${response.status}: ${errorText || response.statusText}`,
            code: 'HTTP_ERROR',
            details: { status: response.status, statusText: response.statusText, error: errorText }
          }, 
          success: false 
        };
      }

      const uploadData = await response.json();
      console.log("✅ Upload réussi avec FormData:", uploadData);
      
    } catch (fetchError) {
      console.error("❌ Erreur lors de la requête fetch:", fetchError);
      return { 
        error: { 
          message: `Erreur de requête: ${fetchError instanceof Error ? fetchError.message : 'Erreur inconnue'}`,
          code: 'FETCH_ERROR',
          details: fetchError
        }, 
        success: false 
      };
    }

    console.log("✅ Fichier uploadé avec succès vers Supabase Storage");

    // 2. Obtenir l'URL publique signée (sécurisée)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('candidates')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // URL valide 1 an

    if (urlError) {
      console.error("❌ Erreur URL signée:", urlError);
      return { 
        error: { 
          message: `Erreur lors de la génération de l'URL du fichier: ${urlError.message}`,
          code: 'URL_ERROR',
          details: urlError
        }, 
        success: false 
      };
    }

    // 3. Insérer dans candidate_documents
    console.log("🔄 Insertion en base de données...", {
      candidate_id: candidateId,
      name: file.name,
      file_path: fileName,
      file_type: file.type,
      file_size: file.size,
      table: 'candidate_documents'
    });

    const { data: docData, error: dbError } = await supabase
      .from('candidate_documents')
      .insert({
        candidate_id: candidateId,
        name: validatedFile.name,
        file_path: fileName,
        file_type: validatedFile.type,
        file_size: validatedFile.size,
        public_url: urlData.signedUrl
      })
      .select()
      .single();

    if (dbError) {
      console.error("❌ Erreur DB détaillée:", {
        error: dbError,
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
        candidateId,
        userId
      });
      
      // Nettoyer le fichier uploadé en cas d'erreur DB
      try {
        const deleteUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/candidates/${fileName}`;
        await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        console.log("🧹 Fichier nettoyé après erreur DB");
      } catch (cleanupError) {
        console.warn("⚠️ Impossible de nettoyer le fichier:", cleanupError);
      }
        
      return { 
        error: { 
          message: `Erreur lors de l'enregistrement en base de données: ${dbError.message}`,
          code: 'DATABASE_ERROR',
          details: dbError
        }, 
        success: false 
      };
    }

    console.log("✅ Document créé en DB:", docData);
    return { document: docData, success: true };
  } catch (error) {
    console.error("❌ Erreur complète lors de l'upload:", {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'Erreur inconnue lors du téléchargement',
        code: 'UNKNOWN_ERROR',
        details: error 
      }, 
      success: false 
    };
  }
}

/**
 * Supprime un document du stockage et de la base de données
 */
export async function deleteDocument({ id, filePath }: DocumentDeleteParams) {
  const supabase = getSupabaseClient();
  
  try {
    console.log("🗑️ Début de la suppression du document:", { id, filePath });
    
    // Supprimer le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('candidates')
      .remove([filePath]);
      
    if (storageError) {
      console.error("❌ Erreur lors de la suppression du stockage:", storageError);
      throw storageError;
    }
    
    console.log("✅ Fichier supprimé du stockage");
    
    // Supprimer l'enregistrement de la base de données
    const { error: dbError } = await supabase
      .from('candidate_documents')
      .delete()
      .eq('id', id);
      
    if (dbError) {
      console.error("❌ Erreur lors de la suppression de la base de données:", dbError);
      throw dbError;
    }
    
    console.log("✅ Enregistrement supprimé de la base de données");
    
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur complète lors de la suppression:", {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    return { 
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la suppression', 
      success: false 
    };
  }
}
