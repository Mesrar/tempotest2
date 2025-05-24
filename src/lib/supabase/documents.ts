"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";

// Types pour les documents
export interface DocumentUploadParams {
  staffId: string;
  file: File;
  type: string;
  onProgress?: (progress: number) => void;
}

export interface DocumentDeleteParams {
  id: string;
  filePath: string;
}

/**
 * Télécharge un document vers le stockage Supabase
 */
export async function uploadDocument({
  staffId,
  file,
  type,
  onProgress
}: DocumentUploadParams) {
  try {
    const supabase = createClientComponentClient();
    
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `staff/${staffId}/documents/${fileName}`;
    
    // Télécharger le fichier au stockage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        // @ts-ignore - onUploadProgress n'est pas dans les types mais est supporté par Supabase
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          if (onProgress) onProgress(percent);
        },
        cacheControl: '3600',
        upsert: false
      });
      
    if (storageError) throw storageError;
    
    // Générer une URL publique pour le fichier
    const { data: urlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365); // URL valide pendant 1 an
    
    const publicUrl = urlData?.signedUrl || '';
    
    // Créer un enregistrement dans la base de données
    const { data: docData, error: docError } = await supabase
      .from('staff_documents')
      .insert({
        staff_id: staffId,
        name: file.name,
        type: type,
        url: publicUrl,
        file_path: filePath,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (docError) throw docError;
    
    return { document: docData, success: true };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { error, success: false };
  }
}

/**
 * Supprime un document du stockage et de la base de données
 */
export async function deleteDocument({ id, filePath }: DocumentDeleteParams) {
  try {
    const supabase = createClientComponentClient();
    
    // Supprimer le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);
      
    if (storageError) throw storageError;
    
    // Supprimer l'enregistrement de la base de données
    const { error: dbError } = await supabase
      .from('staff_documents')
      .delete()
      .eq('id', id);
      
    if (dbError) throw dbError;
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { error, success: false };
  }
}
