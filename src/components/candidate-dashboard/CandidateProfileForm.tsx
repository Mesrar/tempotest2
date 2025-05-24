"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, Save, CalendarIcon, PlusCircle } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CandidateProfileFormProps {
  onSubmit: (data: CandidateFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CandidateFormData>;
  isSubmitting?: boolean;
}

export interface CandidateFormData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  skills: string[];
  certifications: string[];
  experience: ExperienceEntry[];
  availabilityStart?: Date;
  availabilityEnd?: Date;
  hourlyRate: string;
  isAvailable: boolean;
  bio: string;
}

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  isCurrent: boolean;
}

export function CandidateProfileForm({ 
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false
}: CandidateProfileFormProps) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [certifications, setCertifications] = useState<string[]>(initialData?.certifications || []);
  const [skillInput, setSkillInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(
    initialData?.experience || []
  );
  const [activeTab, setActiveTab] = useState("info");
  const [availabilityRange, setAvailabilityRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: initialData?.availabilityStart,
    to: initialData?.availabilityEnd,
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CandidateFormData>({
    defaultValues: {
      fullName: initialData?.fullName || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      location: initialData?.location || "",
      hourlyRate: initialData?.hourlyRate || "",
      isAvailable: initialData?.isAvailable !== undefined ? initialData.isAvailable : true,
      bio: initialData?.bio || "",
    }
  });

  const isAvailableValue = watch("isAvailable");

  // Add skill
  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Add certification
  const addCertification = () => {
    if (certificationInput && !certifications.includes(certificationInput)) {
      setCertifications([...certifications, certificationInput]);
      setCertificationInput("");
    }
  };

  // Remove certification
  const removeCertification = (certToRemove: string) => {
    setCertifications(certifications.filter(cert => cert !== certToRemove));
  };

  // Add new experience entry
  const addExperience = () => {
    const newExperience: ExperienceEntry = {
      id: Date.now().toString(),
      title: "",
      company: "",
      startDate: new Date(),
      description: "",
      isCurrent: false
    };
    setExperiences([...experiences, newExperience]);
  };

  // Update experience entry
  const updateExperience = (id: string, field: string, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Remove experience entry
  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const onFormSubmit = (data: CandidateFormData) => {
    const formData = {
      ...data,
      skills,
      certifications,
      experience: experiences,
      availabilityStart: availabilityRange.from,
      availabilityEnd: availabilityRange.to
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Profil Candidat</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="experience">Expérience</TabsTrigger>
              <TabsTrigger value="availability">Disponibilité</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="px-6 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">
                    Nom Complet <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Votre nom complet"
                    {...register("fullName", { required: true })}
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && (
                    <span className="text-destructive text-sm">Ce champ est requis</span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    {...register("email", { required: true })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <span className="text-destructive text-sm">Ce champ est requis</span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">
                    Téléphone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+212 6XX XXXXXX"
                    {...register("phone", { required: true })}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <span className="text-destructive text-sm">Ce champ est requis</span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">
                    Localisation <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="ex. Casablanca, Maroc"
                    {...register("location", { required: true })}
                    className={errors.location ? "border-destructive" : ""}
                  />
                  {errors.location && (
                    <span className="text-destructive text-sm">Ce champ est requis</span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    placeholder="Une courte description de vous, votre parcours et vos objectifs professionnels"
                    className="resize-none"
                    {...register("bio")}
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="px-6 py-4">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <Label>Compétences</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="py-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Ajouter une compétence"
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>
                      Ajouter
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Certifications & Permis</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="py-1">
                        {cert}
                        <button
                          type="button"
                          onClick={() => removeCertification(cert)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={certificationInput}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      placeholder="ex. CACES 3, Permis B"
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    />
                    <Button type="button" onClick={addCertification}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="px-6 py-4">
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <Card key={exp.id} className="border border-muted">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-medium">
                        Expérience {index + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid gap-3">
                        <div className="grid gap-2">
                          <Label htmlFor={`title-${exp.id}`}>
                            Poste <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`title-${exp.id}`}
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                            placeholder="ex. Agent de logistique"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`company-${exp.id}`}>
                            Entreprise <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`company-${exp.id}`}
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="ex. LogiTrans"
                          />
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`dates-${exp.id}`}>
                              Période <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal cursor-pointer">
                                Poste actuel
                              </Label>
                              <input 
                                type="checkbox"
                                id={`current-${exp.id}`}
                                checked={exp.isCurrent}
                                onChange={(e) => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                                className="rounded text-primary focus:ring-primary"
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="w-1/2">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !exp.startDate && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {exp.startDate ? format(exp.startDate, "PPP", { locale: fr }) : "Date de début"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={exp.startDate}
                                    onSelect={(date) => updateExperience(exp.id, 'startDate', date)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            {!exp.isCurrent && (
                              <div className="w-1/2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !exp.endDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {exp.endDate ? format(exp.endDate, "PPP", { locale: fr }) : "Date de fin"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={exp.endDate}
                                      onSelect={(date) => updateExperience(exp.id, 'endDate', date)}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`description-${exp.id}`}>Description</Label>
                          <Textarea
                            id={`description-${exp.id}`}
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            placeholder="Décrivez vos responsabilités et réalisations"
                            className="resize-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addExperience}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter une expérience
                </Button>
              </div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="px-6 py-4">
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label>Disponibilité</Label>
                  <RadioGroup defaultValue={isAvailableValue ? "true" : "false"} className="flex flex-row space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="true" 
                        id="available-yes" 
                        {...register("isAvailable")}
                        onChange={() => {}}
                      />
                      <Label htmlFor="available-yes" className="font-normal">Disponible maintenant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="false" 
                        id="available-no" 
                        {...register("isAvailable")}
                        onChange={() => {}}
                      />
                      <Label htmlFor="available-no" className="font-normal">Non disponible</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label>Période de disponibilité</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !availabilityRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {availabilityRange.from ? (
                            format(availabilityRange.from, "PPP", { locale: fr })
                          ) : (
                            "Sélectionnez une date de début"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={availabilityRange.from}
                          onSelect={(date) => setAvailabilityRange({ ...availabilityRange, from: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !availabilityRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {availabilityRange.to ? (
                            format(availabilityRange.to, "PPP", { locale: fr })
                          ) : (
                            "Sélectionnez une date de fin"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={availabilityRange.to}
                          onSelect={(date) => setAvailabilityRange({ ...availabilityRange, to: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hourlyRate">
                    Taux horaire souhaité (MAD) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    placeholder="ex. 60"
                    {...register("hourlyRate", { required: true })}
                    className={errors.hourlyRate ? "border-destructive" : ""}
                  />
                  {errors.hourlyRate && (
                    <span className="text-destructive text-sm">Ce champ est requis</span>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between p-6 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
