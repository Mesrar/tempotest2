"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useT } from "@/lib/translations";
import { useTranslation } from "@/lib/i18n";
import { RtlAware, RtlIcon } from "./rtl-aware";
import { InfoIcon } from "lucide-react";
import { Locale } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";

interface TranslatedPostJobProps {
  locale: Locale;
  userId: string;
}

export default function TranslatedPostJob({ locale, userId }: TranslatedPostJobProps) {
  const { t } = useT();
  const isRtl = locale === "ar";
  const [jobType, setJobType] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");

  const handleAddSkill = () => {
    if (skillInput.trim() !== "" && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  async function postJobAction(formData: FormData) {
    // This function would normally be defined server-side
    // But we simulate it client-side for now
    formData.append("user_id", userId);
    formData.append("skills", JSON.stringify(skills));
    
    // Submission logic would go here
    // Redirect to a success page
    window.location.href = `/${locale}/dashboard`;
  }

  return (
    <main className="w-full">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">
            {t("postJob.title")}
          </h1>
          <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
            <InfoIcon size="14" />
            <span>
              {t("postJob.formHint")}
            </span>
          </div>
        </header>

        {/* Job Form */}
        <form action={postJobAction} className="bg-white p-6 rounded-xl border shadow-sm space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                {t("postJob.jobTitleLabel")}
              </Label>
              <Input id="title" name="title" placeholder={t("postJob.jobTitlePlaceholder")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_type">
                {t("postJob.jobTypeLabel")}
              </Label>
              <Select name="job_type" value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("postJob.jobTypePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">{t("postJob.jobTypeFullTime")}</SelectItem>
                  <SelectItem value="part_time">{t("postJob.jobTypePartTime")}</SelectItem>
                  <SelectItem value="contract">{t("postJob.jobTypeContract")}</SelectItem>
                  <SelectItem value="temporary">{t("postJob.jobTypeTemporary")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                {t("postJob.locationLabel")}
              </Label>
              <Input id="location" name="location" placeholder={t("postJob.locationPlaceholder")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">
                {t("postJob.salaryLabel")}
              </Label>
              <Input id="salary" name="salary" type="number" placeholder={t("postJob.salaryPlaceholder")} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>
                {t("postJob.requiredSkillsLabel")}
              </Label>
              <div className="flex gap-2">
                <Input 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  onKeyDown={handleKeyDown}
                  placeholder={t("postJob.skillsPlaceholder")} 
                />
                <Button type="button" onClick={handleAddSkill}>
                  {t("postJob.addSkillButton")}
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <div key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-blue-500 hover:text-blue-700">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">
                {t("postJob.descriptionLabel")}
              </Label>
              <Textarea id="description" name="description" placeholder={t("postJob.descriptionPlaceholder")} className="h-32" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">
                {t("postJob.startDateLabel")}
              </Label>
              <Input id="start_date" name="start_date" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">
                {t("postJob.endDateLabel")}
              </Label>
              <Input id="end_date" name="end_date" type="date" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="requirements">
                {t("postJob.requirementsLabel")}
              </Label>
              <Textarea id="requirements" name="requirements" placeholder={t("postJob.requirementsPlaceholder")} className="h-24" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {t("postJob.publishButton")}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
