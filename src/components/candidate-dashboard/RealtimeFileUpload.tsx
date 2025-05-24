"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase-client";
import { Camera, Upload, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RealtimeFileUploadProps {
  bucketName: string;
  filePath: string;
  onComplete?: (url: string) => void;
  showPreview?: boolean;
  maxSizeMB?: number;
  accept?: string;
  variant?: "avatar" | "document" | "image";
  customButton?: React.ReactNode;
}

export function RealtimeFileUpload({
  bucketName,
  filePath,
  onComplete,
  showPreview = true,
  maxSizeMB = 5,
  accept = "image/*",
  variant = "image",
  customButton
}: RealtimeFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vérifier si un fichier existe déjà à ce chemin et obtenir son URL
  const checkExistingFile = async () => {
    try {
      const { data } = await supabase.storage.from(bucketName).getPublicUrl(filePath);
      
      if (data?.publicUrl) {
        setPreviewUrl(data.publicUrl);
      }
    } catch (error) {
      console.error("Error checking existing file:", error);
    }
  };

  // Vérifier l'existence du fichier au chargement initial
  useState(() => {
    checkExistingFile();
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    // Vérifier la taille du fichier
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `La taille maximale du fichier est de ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }
    
    await uploadFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) {
      return;
    }
    
    const file = event.dataTransfer.files[0];
    
    // Vérifier la taille du fichier
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `La taille maximale du fichier est de ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }
    
    await uploadFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);
      
      // Télécharger le fichier vers Supabase Storage
      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        // @ts-ignore - onUploadProgress n'est pas dans les types mais est supporté par Supabase
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setProgress(percent);
        },
      });
      
      if (error) throw error;
      
      // Obtenir l'URL publique du fichier téléchargé
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      
      if (urlData) {
        setPreviewUrl(urlData.publicUrl);
        
        if (onComplete) {
          onComplete(urlData.publicUrl);
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du téléchargement du fichier.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Styles conditionnels en fonction du variant
  const getContainerStyles = () => {
    switch (variant) {
      case "avatar":
        return "relative h-24 w-24 rounded-full overflow-hidden";
      case "document":
        return "relative h-32 border border-dashed rounded-lg flex flex-col items-center justify-center";
      case "image":
      default:
        return "relative h-48 border border-dashed rounded-lg flex flex-col items-center justify-center";
    }
  };

  // Icône de téléchargement en fonction du variant
  const getUploadIcon = () => {
    switch (variant) {
      case "avatar":
        return <Camera className="h-6 w-6" />;
      default:
        return <Upload className="h-6 w-6" />;
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      
      <div
        className={getContainerStyles()}
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Aperçu du fichier si disponible et si showPreview est activé */}
        {showPreview && previewUrl && (
          variant === "avatar" ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain p-2"
            />
          )
        )}
        
        {/* Couche de superposition pour le téléchargement */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center ${
            previewUrl ? "bg-black/50 opacity-0 hover:opacity-100 transition-opacity" : "bg-muted/50"
          }`}
        >
          {uploading ? (
            <RefreshCw className="h-8 w-8 text-white animate-spin" />
          ) : (
            customButton || (
              <div className="flex flex-col items-center justify-center text-white">
                {getUploadIcon()}
                <span className="text-xs mt-1">
                  {previewUrl ? "Changer" : "Télécharger"}
                </span>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* Barre de progression */}
      {uploading && (
        <div className="mt-2">
          <Progress value={progress} />
          <p className="text-xs text-center mt-1">{progress}%</p>
        </div>
      )}
    </div>
  );
}
