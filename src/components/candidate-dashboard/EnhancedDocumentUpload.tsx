"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, FileIcon, Loader2, UploadIcon } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { CandidateDocument } from "@/lib/supabase-client";

interface FileUploadProgressProps {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  errorMessage?: string;
}

const FileUploadProgress = ({ fileName, progress, status, errorMessage }: FileUploadProgressProps) => {
  return (
    <div className="bg-muted p-3 rounded-md space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileIcon className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm font-medium truncate max-w-[180px]">{fileName}</p>
        </div>
        {status === "uploading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
        {status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
      </div>
      
      <Progress value={progress} className="h-1" />
      
      {status === "error" && errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};

interface EnhancedDocumentUploadProps {
  candidateId: string;
  onComplete?: (documents: CandidateDocument[]) => void;
  onCancel?: () => void;
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
}

export function EnhancedDocumentUpload({
  candidateId,
  onComplete,
  onCancel,
  allowedFileTypes = ["application/pdf", "image/png", "image/jpeg"],
  maxFileSizeMB = 5
}: EnhancedDocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, FileUploadProgressProps>>({});
  const [overallStatus, setOverallStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadedDocuments, setUploadedDocuments] = useState<CandidateDocument[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      return `Le fichier dépasse la taille maximale de ${maxFileSizeMB}MB.`;
    }

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      return `Type de fichier non autorisé. Types acceptés: ${allowedFileTypes.join(", ")}.`;
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    const newProgress: Record<string, FileUploadProgressProps> = {};

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        // Add to progress with error
        newProgress[file.name] = {
          fileName: file.name,
          progress: 0,
          status: "error",
          errorMessage: error
        };
      } else {
        validFiles.push(file);
      }
    });

    setFiles(prev => [...prev, ...validFiles]);
    setUploadProgress(prev => ({ ...prev, ...newProgress }));
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    
    // Remove from progress tracking if exists
    if (uploadProgress[fileName]) {
      const newProgress = { ...uploadProgress };
      delete newProgress[fileName];
      setUploadProgress(newProgress);
    }
  };

  const uploadFile = async (file: File, documentName: string): Promise<CandidateDocument | null> => {
    try {
      // Initialize progress for this file
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: {
          fileName: file.name,
          progress: 0,
          status: "uploading"
        }
      }));

      // Generate a unique file path
      const filePath = `candidates/${candidateId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      
      // Upload file to Supabase storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          // @ts-ignore - onUploadProgress n'est pas dans les types mais est supporté par Supabase
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: {
                ...prev[file.name],
                progress: percent
              }
            }));
          },
        });
      
      if (fileError) {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: "error",
            errorMessage: fileError.message
          }
        }));
        return null;
      }
      
      // Create document record in database
      const { data, error } = await supabase
        .from('candidate_documents')
        .insert({
          candidate_id: candidateId,
          name: documentName || file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          status: 'pending',
          upload_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        // Delete the uploaded file if we couldn't create the record
        await supabase.storage.from('documents').remove([filePath]);
        
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: "error",
            errorMessage: error.message
          }
        }));
        return null;
      }

      // Update progress to success
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: "success",
          progress: 100
        }
      }));

      return data;
    } catch (error) {
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: "error",
          errorMessage: (error as Error).message
        }
      }));
      return null;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setOverallStatus("uploading");
    const uploadedDocs: CandidateDocument[] = [];
    
    for (const file of files) {
      const result = await uploadFile(file, file.name);
      if (result) {
        uploadedDocs.push(result);
      }
    }

    setUploadedDocuments(uploadedDocs);
    setOverallStatus(uploadedDocs.length > 0 ? "success" : "error");
    
    if (onComplete && uploadedDocs.length > 0) {
      onComplete(uploadedDocs);
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const isUploading = overallStatus === "uploading";
  const hasErrors = Object.values(uploadProgress).some(p => p.status === "error");

  return (
    <Card className="p-6 space-y-6">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
          accept={allowedFileTypes.join(",")}
        />
        <label htmlFor="file-upload" className="block cursor-pointer">
          <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-1">
            Glissez et déposez vos documents ici
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            ou cliquez pour sélectionner des fichiers
          </p>
          <p className="text-xs text-muted-foreground">
            Formats acceptés: PDF, PNG, JPEG (max. {maxFileSizeMB}MB)
          </p>
        </label>
      </div>

      {/* Selected files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Fichiers sélectionnés ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.name}
                className="flex items-center justify-between p-3 bg-muted/40 rounded-md"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  <FileIcon className="h-5 w-5 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB | {file.type}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeFile(file.name)}
                  disabled={isUploading}
                >
                  Supprimer
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Progression du téléchargement</h3>
          <div className="space-y-2">
            {Object.values(uploadProgress).map((file) => (
              <FileUploadProgress 
                key={file.fileName}
                fileName={file.fileName}
                progress={file.progress}
                status={file.status}
                errorMessage={file.errorMessage}
              />
            ))}
          </div>
        </div>
      )}

      {/* Success message */}
      {overallStatus === "success" && uploadedDocuments.length > 0 && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Téléchargement réussi</AlertTitle>
          <AlertDescription>
            {uploadedDocuments.length === 1
              ? "Votre document a été téléchargé avec succès."
              : `${uploadedDocuments.length} documents ont été téléchargés avec succès.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Error message for overall process */}
      {overallStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Des erreurs sont survenues lors du téléchargement. Veuillez vérifier les détails ci-dessus et réessayer.
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
      <div className="flex justify-end space-x-3">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          disabled={isUploading}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleUpload} 
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Téléchargement en cours...
            </>
          ) : (
            <>
              <UploadIcon className="mr-2 h-4 w-4" />
              Télécharger {files.length > 0 && `(${files.length})`}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
