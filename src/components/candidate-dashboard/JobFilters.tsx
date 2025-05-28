"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FilterIcon, MapPinIcon, Euro, Clock } from "lucide-react";
import { ClientOnlyDateFormat } from "@/components/ui/ClientOnlyDateFormat";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface JobFiltersProps {
  onApplyFilters: (filters: JobFilters) => void;
  onResetFilters: () => void;
  cities?: string[];
  skills?: string[];
}

export interface JobFilters {
  keyword?: string;
  location?: string;
  rateMin?: number;
  rateMax?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  selectedSkills?: string[];
  sortBy?: "matchScore" | "rateHigh" | "rateLow" | "dateRecent" | "dateOldest";
}

const DEFAULT_FILTERS: JobFilters = {
  keyword: "",
  location: "",
  rateMin: 0,
  rateMax: 500,
  startDate: null,
  endDate: null,
  selectedSkills: [],
  sortBy: "matchScore",
};

export function JobFilters({
  onApplyFilters,
  onResetFilters,
  cities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Tanger",
    "Fès",
    "Agadir",
    "Meknès",
    "Oujda",
    "Tétouan",
  ],
  skills = [
    "Manutention",
    "Conduite de chariot élévateur",
    "Gestion d'entrepôt",
    "Préparation de commandes",
    "Inventaire",
    "Emballage",
    "Expédition",
    "Réception",
    "Gestion de la chaîne d'approvisionnement",
    "FIFO/LIFO",
    "Étiquetage",
    "Chargement de camions",
    "WMS",
    "ERP",
    "SAP",
  ],
}: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = <K extends keyof JobFilters>(
    key: K,
    value: JobFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRateRangeChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      rateMin: value[0],
      rateMax: value[1],
    }));
  };

  const toggleSkill = (skill: string) => {
    setFilters((prev) => {
      const selectedSkills = prev.selectedSkills || [];
      if (selectedSkills.includes(skill)) {
        return {
          ...prev,
          selectedSkills: selectedSkills.filter((s) => s !== skill),
        };
      } else {
        return {
          ...prev,
          selectedSkills: [...selectedSkills, skill],
        };
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onResetFilters();
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filtrer les offres
          </CardTitle>
          <Button
            variant="link"
            size="sm"
            onClick={handleReset}
            className="h-auto p-0"
          >
            Réinitialiser
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-4">
        {/* Keyword search */}
        <div>
          <div className="mb-2">
            <Label htmlFor="keyword">Mots-clés</Label>
          </div>
          <Input
            id="keyword"
            placeholder="Rechercher par titre, entreprise..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location filter */}
          <div>
            <div className="mb-2">
              <Label htmlFor="location">Lieu</Label>
            </div>
            <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isLocationOpen}
                  className="w-full justify-between"
                >
                  {filters.location || "Toutes les villes"}
                  <MapPinIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Rechercher une ville..." />
                  <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        handleFilterChange("location", "");
                        setIsLocationOpen(false);
                      }}
                    >
                      Toutes les villes
                    </CommandItem>
                    {cities.map((city) => (
                      <CommandItem
                        key={city}
                        onSelect={() => {
                          handleFilterChange("location", city);
                          setIsLocationOpen(false);
                        }}
                      >
                        {city}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort order */}
          <div>
            <div className="mb-2">
              <Label htmlFor="sortBy">Trier par</Label>
            </div>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                handleFilterChange(
                  "sortBy",
                  value as JobFilters["sortBy"]
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Trier par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="matchScore">Meilleure correspondance</SelectItem>
                  <SelectItem value="rateHigh">Taux horaire (élevé à bas)</SelectItem>
                  <SelectItem value="rateLow">Taux horaire (bas à élevé)</SelectItem>
                  <SelectItem value="dateRecent">Date (plus récent)</SelectItem>
                  <SelectItem value="dateOldest">Date (plus ancien)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Rate range slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Taux horaire</Label>
                <span className="text-sm text-muted-foreground">
                  {filters.rateMin} - {filters.rateMax} DH/h
                </span>
              </div>
              <Slider
                defaultValue={[0, 500]}
                value={[filters.rateMin || 0, filters.rateMax || 500]}
                min={0}
                max={500}
                step={10}
                onValueChange={handleRateRangeChange}
                className="my-4"
              />
            </div>

            <div className="space-y-4">
              {/* Date range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate ? (
                          <ClientOnlyDateFormat date={filters.startDate} formatString="PPP" />
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.startDate || undefined}
                        onSelect={(date) =>
                          handleFilterChange("startDate", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate ? (
                          <ClientOnlyDateFormat date={filters.endDate} formatString="PPP" />
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.endDate || undefined}
                        onSelect={(date) => handleFilterChange("endDate", date)}
                        initialFocus
                        disabled={(date) =>
                          filters.startDate
                            ? date < filters.startDate
                            : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Compétences</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={
                        filters.selectedSkills?.includes(skill)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="pt-0">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded
              ? "Masquer les filtres avancés"
              : "Afficher les filtres avancés"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t">
        <Button onClick={handleApply} className="w-full">
          Appliquer les filtres
        </Button>
      </CardFooter>
    </Card>
  );
}
