"use client";

import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckIcon, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays } from "date-fns";
import { fr, ar, enUS } from "date-fns/locale";
import { Locale } from "@/lib/i18n";

// Types
interface AvailabilityEvent {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  type: 'available' | 'unavailable' | 'partial';
}

interface Dictionary {
  [key: string]: any;
}

interface AvailabilityPageClientProps {
  dict: Dictionary;
  locale: Locale;
}

// Mock data generator
const generateMockAvailability = (): AvailabilityEvent[] => {
  const events: AvailabilityEvent[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    if (Math.random() > 0.3) { // 70% chance of having availability
      events.push({
        id: `event-${i}`,
        date,
        startTime: isWeekend ? "10:00" : "08:00",
        endTime: isWeekend ? "16:00" : "18:00",
        isAvailable: true,
        type: Math.random() > 0.8 ? 'partial' : 'available'
      });
    } else {
      events.push({
        id: `event-${i}`,
        date,
        startTime: "00:00",
        endTime: "23:59",
        isAvailable: false,
        type: 'unavailable'
      });
    }
  }
  
  return events;
};

export function AvailabilityPageClient({ dict, locale }: AvailabilityPageClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<AvailabilityEvent[]>(generateMockAvailability());
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [isToggleAllOn, setIsToggleAllOn] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Get availability status for a specific day
  const getAvailability = (date: Date) => {
    return availability.find(event => isSameDay(event.date, date));
  };

  // Get locale for date-fns
  const getDateFnsLocale = () => {
    switch (locale) {
      case 'fr': return fr;
      case 'ar': return ar;
      default: return enUS;
    }
  };

  // Toggle availability for a specific date
  const toggleAvailability = (date: Date) => {
    setAvailability(prev => {
      const existing = prev.find(event => isSameDay(event.date, date));
      
      if (existing) {
        // Toggle existing availability
        return prev.map(event => 
          isSameDay(event.date, date) 
            ? { ...event, isAvailable: !event.isAvailable, type: event.isAvailable ? 'unavailable' : 'available' as const }
            : event
        );
      } else {
        // Add new availability
        return [...prev, {
          id: `new-${Date.now()}`,
          date,
          startTime: "08:00",
          endTime: "18:00",
          isAvailable: true,
          type: 'available' as const
        }];
      }
    });
  };

  // Toggle all availability
  const toggleAllAvailability = () => {
    const newStatus = !isToggleAllOn;
    setIsToggleAllOn(newStatus);
    
    setAvailability(prev => 
      prev.map(event => ({
        ...event,
        isAvailable: newStatus,
        type: newStatus ? 'available' as const : 'unavailable' as const
      }))
    );
  };

  // Get week days for week view
  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  // Render calendar with availability indicators
  const renderCalendarDay = (date: Date) => {
    const availability = getAvailability(date);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    
    return (
      <div
        className={cn(
          "relative p-2 cursor-pointer rounded-md transition-colors",
          isSelected && "bg-primary text-primary-foreground",
          !isSelected && availability?.isAvailable && "bg-green-100 text-green-800",
          !isSelected && availability && !availability.isAvailable && "bg-red-100 text-red-800",
          !isSelected && availability?.type === 'partial' && "bg-yellow-100 text-yellow-800"
        )}
        onClick={() => setSelectedDate(date)}
      >
        <div className="text-center">
          {format(date, 'd')}
        </div>
        {availability && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              availability.isAvailable ? "bg-green-500" : "bg-red-500",
              availability.type === 'partial' && "bg-yellow-500"
            )} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {dict?.candidate?.availability?.title || "Disponibilités"}
        </h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedView} onValueChange={(value: 'month' | 'week' | 'day') => setSelectedView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">{dict?.candidate?.availability?.views?.month || "Mois"}</SelectItem>
              <SelectItem value="week">{dict?.candidate?.availability?.views?.week || "Semaine"}</SelectItem>
              <SelectItem value="day">{dict?.candidate?.availability?.views?.day || "Jour"}</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="toggle-all"
              checked={isToggleAllOn}
              onCheckedChange={toggleAllAvailability}
            />
            <Label htmlFor="toggle-all">
              {dict?.candidate?.availability?.toggleAll || "Tout activer/désactiver"}
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>{dict?.candidate?.availability?.calendar || "Calendrier"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedView === 'month' && (
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={getDateFnsLocale()}
                className="rounded-md border"
                components={{
                  Day: ({ day }) => renderCalendarDay(day.date)
                }}
              />
            )}
            
            {selectedView === 'week' && selectedDate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(subDays(selectedDate, 7))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-semibold">
                    {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMMM yyyy', { locale: getDateFnsLocale() })}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDays(selectedDate).map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium mb-2">
                        {format(day, 'EEE', { locale: getDateFnsLocale() })}
                      </div>
                      {renderCalendarDay(day)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedView === 'day' && selectedDate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-semibold">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy', { locale: getDateFnsLocale() })}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  {renderCalendarDay(selectedDate)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{dict?.candidate?.availability?.details || "Détails"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDate && (
              <>
                <div>
                  <h4 className="font-medium mb-2">
                    {format(selectedDate, 'EEEE, MMMM d', { locale: getDateFnsLocale() })}
                  </h4>
                  
                  {(() => {
                    const dayAvailability = getAvailability(selectedDate);
                    if (!dayAvailability) {
                      return (
                        <div className="text-muted-foreground">
                          {dict?.candidate?.availability?.noAvailability || "Aucune disponibilité définie"}
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-2">
                        <Badge variant={dayAvailability.isAvailable ? "default" : "destructive"}>
                          {dayAvailability.isAvailable 
                            ? (dict?.candidate?.availability?.available || "Disponible")
                            : (dict?.candidate?.availability?.unavailable || "Indisponible")
                          }
                        </Badge>
                        
                        {dayAvailability.isAvailable && (
                          <div className="text-sm text-muted-foreground">
                            {dayAvailability.startTime} - {dayAvailability.endTime}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                
                <Button
                  onClick={() => toggleAvailability(selectedDate)}
                  className="w-full"
                >
                  {getAvailability(selectedDate)?.isAvailable
                    ? (dict?.candidate?.availability?.markUnavailable || "Marquer indisponible")
                    : (dict?.candidate?.availability?.markAvailable || "Marquer disponible")
                  }
                </Button>
              </>
            )}
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">
                {dict?.candidate?.availability?.legend || "Légende"}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>{dict?.candidate?.availability?.available || "Disponible"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>{dict?.candidate?.availability?.partial || "Partiellement disponible"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>{dict?.candidate?.availability?.unavailable || "Indisponible"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {dict?.candidate?.availability?.quickActions || "Actions rapides"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setSelectedView('month')}>
              <CalendarIcon className="w-4 h-4 mr-2" />
              {dict?.candidate?.availability?.viewMonth || "Vue mensuelle"}
            </Button>
            <Button variant="outline" onClick={() => setSelectedView('week')}>
              <Clock className="w-4 h-4 mr-2" />
              {dict?.candidate?.availability?.viewWeek || "Vue hebdomadaire"}
            </Button>
            <Button variant="outline" onClick={toggleAllAvailability}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {isToggleAllOn 
                ? (dict?.candidate?.availability?.disableAll || "Désactiver tout")
                : (dict?.candidate?.availability?.enableAll || "Activer tout")
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
