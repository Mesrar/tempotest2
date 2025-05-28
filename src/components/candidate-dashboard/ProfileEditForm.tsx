"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  X, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Briefcase, 
  Star,
  Calendar,
  DollarSign,
  FileText,
  Trash2,
  Upload
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DocumentUpload } from "./DocumentUpload";

interface ProfileEditFormProps {
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ProfileFormData>;
  isSubmitting?: boolean;
  // Props pour les documents
  documents?: any[];
  onUploadDocuments?: (files: File[]) => Promise<void>;
  onDeleteDocument?: (id: string) => Promise<void>;
  isUploading?: boolean;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  experiences: ExperienceEntry[];
  hourlyRate: string;
  isAvailable: boolean;
  availabilityStart?: Date;
  availabilityEnd?: Date;
}

interface ExperienceEntry {
  id?: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent: boolean;
}

export function ProfileEditForm({ 
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
  documents = [],
  onUploadDocuments,
  onDeleteDocument,
  isUploading = false
}: ProfileEditFormProps) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(
    initialData?.experiences || []
  );
  const [activeTab, setActiveTab] = useState("personal");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      location: initialData?.location || "",
      bio: initialData?.bio || "",
      hourlyRate: initialData?.hourlyRate || "",
      isAvailable: initialData?.isAvailable ?? true,
    }
  });

  // Watch isAvailable to show/hide availability dates
  const isAvailable = watch("isAvailable");

  // Add skill
  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim() && !skills.includes(skillInput.trim())) {
      e.preventDefault();
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addSkillButton = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Add experience
  const addExperience = () => {
    const newExperience: ExperienceEntry = {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false
    };
    setExperiences([...experiences, newExperience]);
  };

  // Update experience
  const updateExperience = (index: number, field: keyof ExperienceEntry, value: any) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
    setExperiences(updatedExperiences);
  };

  // Remove experience
  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data: ProfileFormData) => {
    onSubmit({
      ...data,
      skills,
      experiences
    });
  };

  return (
    <form id="profile-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informations personnelles
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Expérience professionnelle
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Disponibilité
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-600" />
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom complet *
                  </Label>
                  <Input
                    id="fullName"
                    {...register("fullName", { required: "Le nom est requis" })}
                    placeholder="Votre nom complet"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "L'email est requis",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Format d'email invalide"
                      }
                    })}
                    placeholder="votre.email@exemple.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localisation
                  </Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Paris, France"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Présentation
                </Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Décrivez votre parcours, vos motivations et ce qui vous rend unique..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Une bonne présentation aide les employeurs à mieux vous connaître
                </p>
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Compétences
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder="Ajoutez une compétence (Entrée pour valider)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addSkillButton}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Experience Tab */}
        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Expérience professionnelle
                </span>
                <Button
                  type="button"
                  onClick={addExperience}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une expérience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune expérience ajoutée</p>
                  <p className="text-sm">Cliquez sur "Ajouter une expérience" pour commencer</p>
                </div>
              ) : (
                experiences.map((exp, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="space-y-2">
                            <Label htmlFor={`title-${index}`}>Poste *</Label>
                            <Input
                              id={`title-${index}`}
                              value={exp.title}
                              onChange={(e) => updateExperience(index, 'title', e.target.value)}
                              placeholder="Développeur Frontend"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`company-${index}`}>Entreprise *</Label>
                            <Input
                              id={`company-${index}`}
                              value={exp.company}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              placeholder="Nom de l'entreprise"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${index}`}>Date de début</Label>
                            <Input
                              id={`startDate-${index}`}
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${index}`}>Date de fin</Label>
                            <Input
                              id={`endDate-${index}`}
                              type="date"
                              value={exp.endDate || ''}
                              onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                              disabled={exp.isCurrent}
                            />
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`current-${index}`}
                                checked={exp.isCurrent}
                                onCheckedChange={(checked) => {
                                  updateExperience(index, 'isCurrent', checked);
                                  if (checked) {
                                    updateExperience(index, 'endDate', '');
                                  }
                                }}
                              />
                              <Label htmlFor={`current-${index}`} className="text-sm">
                                Poste actuel
                              </Label>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Textarea
                          id={`description-${index}`}
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          placeholder="Décrivez vos missions et accomplissements..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Disponibilité et tarification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">Disponible pour de nouvelles missions</h3>
                  <p className="text-sm text-gray-600">
                    Activez cette option pour recevoir des propositions d'emploi
                  </p>
                </div>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={(checked) => setValue("isAvailable", checked)}
                />
              </div>

              {isAvailable && (
                <div className="space-y-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Tarif horaire (MAD)
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        step="0.5"
                        min="0"
                        {...register("hourlyRate")}
                        placeholder="65.00"
                      />
                      <p className="text-xs text-gray-600">
                        Tarif indicatif, négociable selon la mission
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                Documents et certifications
              </CardTitle>
              <p className="text-sm text-gray-600">
                Téléchargez vos certifications, permis et autres documents importants
              </p>
            </CardHeader>
            <CardContent>
              {onUploadDocuments && (
                <DocumentUpload 
                  onUpload={onUploadDocuments}
                  onCancel={onCancel}
                  isUploading={isUploading}
                  existingDocuments={documents}
                  onDeleteDocument={onDeleteDocument}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
