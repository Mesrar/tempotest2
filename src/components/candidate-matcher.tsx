"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Users,
  Star,
  MapPin,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Award,
  Briefcase
} from "lucide-react";
import { RtlAware } from "./rtl-aware";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  availability: 'immediate' | 'within_week' | 'within_month';
  rating: number;
  skills: string[];
  experience: string;
  hourlyRate: number;
  status: 'available' | 'assigned' | 'unavailable';
  lastActive: string;
  completedJobs: number;
  profileImage?: string;
}

interface StaffingRequest {
  id: string;
  title: string;
  department: string;
  skills: string[];
  urgency: 'low' | 'medium' | 'high';
  staffCount: number;
  duration: string;
  startDate: string;
}

interface CandidateMatcherProps {
  className?: string;
  selectedRequest?: StaffingRequest;
}

export default function CandidateMatcher({ className, selectedRequest }: CandidateMatcherProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      location: 'New York, NY',
      availability: 'immediate',
      rating: 4.8,
      skills: ['Forklift operation', 'Inventory management', 'Physical fitness'],
      experience: '5 years warehouse operations',
      hourlyRate: 18,
      status: 'available',
      lastActive: '2024-01-15',
      completedJobs: 23
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1-555-0124',
      location: 'Los Angeles, CA',
      availability: 'within_week',
      rating: 4.9,
      skills: ['Communication', 'Multi-lingual', 'Customer service', 'Problem solving'],
      experience: '3 years customer support',
      hourlyRate: 16,
      status: 'available',
      lastActive: '2024-01-14',
      completedJobs: 18
    },
    {
      id: '3',
      name: 'David Johnson',
      email: 'david.johnson@email.com',
      phone: '+1-555-0125',
      location: 'Chicago, IL',
      availability: 'immediate',
      rating: 4.6,
      skills: ['Heavy lifting', 'Physical fitness', 'Teamwork', 'Time management'],
      experience: '2 years warehouse operations',
      hourlyRate: 15,
      status: 'available',
      lastActive: '2024-01-16',
      completedJobs: 12
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const calculateMatchScore = (candidate: Candidate, request?: StaffingRequest) => {
    if (!request) return 0;
    
    const skillMatches = candidate.skills.filter(skill => 
      request.skills.some(reqSkill => 
        skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
    
    const skillScore = (skillMatches / Math.max(request.skills.length, 1)) * 40;
    const ratingScore = (candidate.rating / 5) * 30;
    const availabilityScore = candidate.availability === 'immediate' ? 20 : 
                             candidate.availability === 'within_week' ? 15 : 10;
    const experienceScore = Math.min(candidate.completedJobs / 10, 1) * 10;
    
    return Math.round(skillScore + ratingScore + availabilityScore + experienceScore);
  };

  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSkill = !skillFilter || candidate.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase()));
      const matchesAvailability = availabilityFilter === 'all' || candidate.availability === availabilityFilter;
      const isAvailable = candidate.status === 'available';
      
      return matchesSearch && matchesSkill && matchesAvailability && isAvailable;
    })
    .sort((a, b) => {
      if (selectedRequest) {
        return calculateMatchScore(b, selectedRequest) - calculateMatchScore(a, selectedRequest);
      }
      return b.rating - a.rating;
    });

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'immediate': return 'bg-green-100 text-green-800';
      case 'within_week': return 'bg-yellow-100 text-yellow-800';
      case 'within_month': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <RtlAware className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-green-900">
                  Candidate Matching
                </CardTitle>
                <p className="text-green-700 mt-1">
                  Find the perfect candidates for your staffing requests
                </p>
              </div>
            </div>
            {selectedRequest && (
              <Badge className="bg-blue-100 text-blue-800 text-sm">
                Matching for: {selectedRequest.title}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Skills</SelectItem>
                  <SelectItem value="forklift">Forklift Operation</SelectItem>
                  <SelectItem value="customer">Customer Service</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="physical">Physical Fitness</SelectItem>
                  <SelectItem value="inventory">Inventory Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="within_week">Within a Week</SelectItem>
                  <SelectItem value="within_month">Within a Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedCandidates.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium">
                  {selectedCandidates.length} candidate(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedCandidates([])}>
                  Clear Selection
                </Button>
                <Button>
                  Send Invitations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Available Candidates ({filteredCandidates.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredCandidates.map((candidate) => {
            const matchScore = selectedRequest ? calculateMatchScore(candidate, selectedRequest) : 0;
            const isSelected = selectedCandidates.includes(candidate.id);
            
            return (
              <div 
                key={candidate.id} 
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleCandidateSelection(candidate.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{candidate.name}</h3>
                        {selectedRequest && (
                          <Badge className={`px-2 py-1 text-xs ${getMatchScoreColor(matchScore)}`}>
                            {matchScore}% Match
                          </Badge>
                        )}
                        <Badge className={getAvailabilityColor(candidate.availability)}>
                          {candidate.availability.replace('_', ' ')}
                        </Badge>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>${candidate.hourlyRate}/hr</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{candidate.completedJobs} jobs completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(candidate.rating)}
                          <span className="ml-1">({candidate.rating})</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{candidate.experience}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant={selectedRequest?.skills.some(reqSkill => 
                              skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                              reqSkill.toLowerCase().includes(skill.toLowerCase())
                            ) ? "default" : "outline"}
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        Profile
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Last active: {new Date(candidate.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredCandidates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No candidates found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </RtlAware>
  );
}