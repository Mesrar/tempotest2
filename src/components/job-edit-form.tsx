"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Locale } from "@/lib/i18n";
import { useSupabase } from "@/context/supabase-provider";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface JobEditFormProps {
  locale: Locale;
  job: any;
}

export default function JobEditForm({ locale, job }: JobEditFormProps) {
  const router = useRouter();
  const supabase = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState(job.title || "");
  const [description, setDescription] = useState(job.description || "");
  const [location, setLocation] = useState(job.location || "");
  const [jobType, setJobType] = useState(job.job_type || "full-time-temp");
  const [startDate, setStartDate] = useState(job.start_date || "");
  const [durationDays, setDurationDays] = useState(
    job.duration_days?.toString() || "",
  );
  const [hourlyRate, setHourlyRate] = useState(
    job.hourly_rate?.toString() || "",
  );
  const [positionsCount, setPositionsCount] = useState(
    job.positions_count?.toString() || "",
  );
  const [status, setStatus] = useState(job.status || "active");

  // Skills and certifications
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(job.required_skills || []);
  const [certificationInput, setCertificationInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>(
    job.required_certifications || [],
  );
  const [equipmentInput, setEquipmentInput] = useState("");
  const [equipment, setEquipment] = useState<string[]>(
    job.equipment_proficiency || [],
  );
  const [experienceYears, setExperienceYears] = useState(
    job.experience_years?.toString() || "",
  );

  // Add skill to the list
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // Remove skill from the list
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Add certification to the list
  const addCertification = () => {
    if (
      certificationInput.trim() &&
      !certifications.includes(certificationInput.trim())
    ) {
      setCertifications([...certifications, certificationInput.trim()]);
      setCertificationInput("");
    }
  };

  // Remove certification from the list
  const removeCertification = (certToRemove: string) => {
    setCertifications(certifications.filter((cert) => cert !== certToRemove));
  };

  // Add equipment to the list
  const addEquipment = () => {
    if (equipmentInput.trim() && !equipment.includes(equipmentInput.trim())) {
      setEquipment([...equipment, equipmentInput.trim()]);
      setEquipmentInput("");
    }
  };

  // Remove equipment from the list
  const removeEquipment = (equipToRemove: string) => {
    setEquipment(equipment.filter((equip) => equip !== equipToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !title ||
        !description ||
        !location ||
        !startDate ||
        !durationDays ||
        !hourlyRate ||
        !positionsCount ||
        skills.length === 0
      ) {
        toast({
          title: "Missing required fields",
          description:
            "Please fill in all required fields and add at least one required skill.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Update job posting
      const { data, error } = await supabase
        .from("job_postings")
        .update({
          title,
          description,
          location,
          job_type: jobType,
          start_date: startDate,
          duration_days: parseInt(durationDays),
          hourly_rate: parseFloat(hourlyRate),
          positions_count: parseInt(positionsCount),
          required_skills: skills,
          required_certifications:
            certifications.length > 0 ? certifications : null,
          equipment_proficiency: equipment.length > 0 ? equipment : null,
          experience_years: experienceYears ? parseInt(experienceYears) : null,
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Job updated successfully",
        description: "Your job posting has been updated.",
      });

      // Redirect to the job details page
      router.push(`/${locale}/dashboard/jobs/${job.id}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error updating job",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Job Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Basic Job Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="job-title" className="required">
                Job Title
              </Label>
              <Input
                id="job-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Warehouse Associate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-location" className="required">
                Location
              </Label>
              <Input
                id="job-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Casablanca"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description" className="required">
              Job Description
            </Label>
            <Textarea
              id="job-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job responsibilities and requirements"
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="job-type" className="required">
                Job Type
              </Label>
              <select
                id="job-type"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                required
              >
                <option value="full-time-temp">Full-time Temporary</option>
                <option value="part-time-temp">Part-time Temporary</option>
                <option value="seasonal">Seasonal</option>
                <option value="day-labor">Day Labor</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date" className="required">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="required">
                Duration (days)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="e.g. 30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hourly-rate" className="required">
                Hourly Rate (MAD)
              </Label>
              <Input
                id="hourly-rate"
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="e.g. 50.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="positions" className="required">
                Number of Positions
              </Label>
              <Input
                id="positions"
                type="number"
                min="1"
                value={positionsCount}
                onChange={(e) => setPositionsCount(e.target.value)}
                placeholder="e.g. 5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="required">
                Status
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                required
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="filled">Filled</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills and Requirements */}
        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-xl font-semibold">Skills and Requirements</h2>

          <div className="space-y-2">
            <Label htmlFor="skills" className="required">
              Required Skills
            </Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. Forklift operation"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill}>
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Add at least one required skill
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">
              Required Certifications (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="certifications"
                value={certificationInput}
                onChange={(e) => setCertificationInput(e.target.value)}
                placeholder="e.g. Forklift License"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCertification();
                  }
                }}
              />
              <Button type="button" onClick={addCertification}>
                Add
              </Button>
            </div>
            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    {cert}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeCertification(cert)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment Proficiency (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="equipment"
                value={equipmentInput}
                onChange={(e) => setEquipmentInput(e.target.value)}
                placeholder="e.g. Pallet Jack"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addEquipment();
                  }
                }}
              />
              <Button type="button" onClick={addEquipment}>
                Add
              </Button>
            </div>
            {equipment.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {equipment.map((equip, index) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100"
                  >
                    {equip}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeEquipment(equip)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              Minimum Years of Experience (Optional)
            </Label>
            <Input
              id="experience"
              type="number"
              min="0"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="e.g. 2"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t flex justify-end">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Job...
                </>
              ) : (
                "Update Job"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
