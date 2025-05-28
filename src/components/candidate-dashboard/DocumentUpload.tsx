"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileIcon, Loader2, UploadIcon, TrashIcon, FileText, FileImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  onCancel: () => void;
  isUploading?: boolean;
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
  existingDocuments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }[];
  onDeleteDocument?: (id: string) => Promise<void>;
}

export function DocumentUpload({
  onUpload,
  onCancel,
  isUploading = false,
  maxFileSizeMB = 5,
  allowedFileTypes = ["application/pdf", "image/png", "image/jpeg"],
  existingDocuments = [],
  onDeleteDocument
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

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
      return `Le fichier "${file.name}" dépasse la taille maximale de ${maxFileSizeMB}MB.`;
    }

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      return `Le type de fichier "${file.type}" n'est pas autorisé. Types autorisés: ${allowedFileTypes.join(", ")}.`;
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const errors: string[] = [];
    const validFiles: File[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setUploadErrors(errors);
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
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

  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteDocument = async (id: string) => {
    if (onDeleteDocument) {
      try {
        setIsDeletingId(id);
        await onDeleteDocument(id);
      } catch (error) {
        console.error("Error deleting document:", error);
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) {
      return <FileIcon className="h-6 w-6 text-gray-500" />;
    }
    
    if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes('image')) {
      return <FileImageIcon className="h-6 w-6 text-blue-500" />;
    } else {
      return <FileIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleSubmit = async () => {
    if (files.length > 0) {
      await onUpload(files);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Télécharger des Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Documents */}
        {existingDocuments.length > 0 && (
          <div className="space-y-3">
            <Label>Documents existants</Label>
            <div className="space-y-2">
              {existingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.type)}
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Ajouté le {new Intl.DateTimeFormat('fr-FR').format(new Date(doc.uploadedAt))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        Voir
                      </a>
                    </Button>
                    {onDeleteDocument && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteDocument(doc.id)}
                        disabled={isDeletingId === doc.id}
                      >
                        {isDeletingId === doc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload new documents */}
        <div className="space-y-3">
          <Label>Ajouter de nouveaux documents</Label>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
              dragActive ? "border-primary bg-muted/30" : "border-muted-foreground/25"
            )}
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
            <Label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <UploadIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-base font-medium">
                Glissez et déposez vos fichiers ici
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ou cliquez pour sélectionner des fichiers
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                PDF, PNG ou JPG (max. {maxFileSizeMB}MB)
              </p>
            </Label>
          </div>

          {/* Upload errors */}
          {uploadErrors.length > 0 && (
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive">
              <p className="font-medium text-destructive mb-1">Erreurs d'upload:</p>
              <ul className="list-disc list-inside text-sm text-destructive">
                {uploadErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Selected files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="font-medium">Fichiers sélectionnés:</p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted p-2 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <p className="truncate max-w-[200px] text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} disabled={files.length === 0 || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              <UploadIcon className="mr-2 h-4 w-4" />
              Télécharger {files.length > 0 && `(${files.length})`}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
