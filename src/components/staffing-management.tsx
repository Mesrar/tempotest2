"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  FileText,
  X,
  Eye,
  Edit,
  Filter
} from "lucide-react";
import { RtlAware } from "./rtl-aware";

interface StaffingRequest {
  id: string;
  title: string;
  department: string;
  urgency: 'low' | 'medium' | 'high';
  staffCount: number;
  duration: string;
  startDate: string;
  skills: string[];
  status: 'pending' | 'in_progress' | 'fulfilled' | 'cancelled';
  description: string;
}

interface StaffingManagementProps {
  locale: string;
  className?: string;
}

export default function StaffingManagement({ locale, className }: StaffingManagementProps) {
  const [requests, setRequests] = useState<StaffingRequest[]>([
    {
      id: '1',
      title: 'Warehouse Workers Needed',
      department: 'Logistics',
      urgency: 'high',
      staffCount: 5,
      duration: '2 weeks',
      startDate: '2024-02-01',
      skills: ['Physical fitness', 'Inventory management', 'Forklift operation'],
      status: 'pending',
      description: 'Need experienced warehouse workers for seasonal peak'
    },
    {
      id: '2',
      title: 'Customer Service Representatives',
      department: 'Support',
      urgency: 'medium',
      staffCount: 3,
      duration: '1 month',
      startDate: '2024-02-15',
      skills: ['Communication', 'Problem solving', 'Multi-lingual'],
      status: 'in_progress',
      description: 'Temporary customer service support for product launch'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<Partial<StaffingRequest>>({
    title: '',
    department: '',
    urgency: 'medium',
    staffCount: 1,
    duration: '',
    startDate: '',
    skills: [],
    description: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const suggestedSkills = [
    'Physical fitness', 'Inventory management', 'Forklift operation',
    'Communication', 'Problem solving', 'Multi-lingual', 'Customer service',
    'Data entry', 'Microsoft Office', 'Time management', 'Teamwork',
    'Leadership', 'Sales experience', 'Cash handling', 'Heavy lifting'
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fulfilled': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleCreateRequest = () => {
    if (newRequest.title && newRequest.department) {
      const request: StaffingRequest = {
        id: Date.now().toString(),
        title: newRequest.title,
        department: newRequest.department,
        urgency: newRequest.urgency || 'medium',
        staffCount: newRequest.staffCount || 1,
        duration: newRequest.duration || '',
        startDate: newRequest.startDate || '',
        skills: newRequest.skills || [],
        status: 'pending',
        description: newRequest.description || ''
      };
      
      setRequests([request, ...requests]);
      setNewRequest({
        title: '',
        department: '',
        urgency: 'medium',
        staffCount: 1,
        duration: '',
        startDate: '',
        skills: [],
        description: ''
      });
      setIsDialogOpen(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !newRequest.skills?.includes(skillInput.trim())) {
      setNewRequest({
        ...newRequest,
        skills: [...(newRequest.skills || []), skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setNewRequest({
      ...newRequest,
      skills: newRequest.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  const addSuggestedSkill = (skill: string) => {
    if (!newRequest.skills?.includes(skill)) {
      setNewRequest({
        ...newRequest,
        skills: [...(newRequest.skills || []), skill]
      });
    }
  };

  const updateRequestStatus = (id: string, newStatus: StaffingRequest['status']) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const filteredRequests = requests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const totalStaffNeeded = requests
    .filter(r => r.status !== 'cancelled' && r.status !== 'fulfilled')
    .reduce((sum, r) => sum + r.staffCount, 0);

  const activeRequests = requests.filter(r => r.status === 'in_progress').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  return (
    <RtlAware className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-900">
                  Manage your temporary staffing needs here
                </CardTitle>
                <p className="text-blue-700 mt-1">
                  Create, track, and manage all your temporary staffing requests
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Staffing Request</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your temporary staffing needs
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Request Title</Label>
                      <Input
                        id="title"
                        value={newRequest.title}
                        onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                        placeholder="e.g., Warehouse Workers Needed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={newRequest.department}
                        onValueChange={(value) => setNewRequest({...newRequest, department: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="support">Customer Support</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="administration">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="staffCount">Staff Count</Label>
                      <Input
                        id="staffCount"
                        type="number"
                        min="1"
                        value={newRequest.staffCount}
                        onChange={(e) => setNewRequest({...newRequest, staffCount: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newRequest.duration}
                        onChange={(e) => setNewRequest({...newRequest, duration: e.target.value})}
                        placeholder="e.g., 2 weeks"
                      />
                    </div>
                    <div>
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select
                        value={newRequest.urgency}
                        onValueChange={(value: 'low' | 'medium' | 'high') => setNewRequest({...newRequest, urgency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newRequest.startDate}
                      onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                    />
                  </div>
                  
                  {/* Enhanced Skills Section */}
                  <div>
                    <Label>Required Skills</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a required skill..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                        <Button type="button" onClick={addSkill} size="sm">
                          Add
                        </Button>
                      </div>
                      
                      {/* Current Skills */}
                      {newRequest.skills && newRequest.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newRequest.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-1 hover:bg-gray-200 rounded-full p-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Suggested Skills */}
                      <div>
                        <Label className="text-sm text-gray-600">Suggested Skills:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suggestedSkills
                            .filter(skill => !newRequest.skills?.includes(skill))
                            .slice(0, 8)
                            .map((skill, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-blue-50"
                                onClick={() => addSuggestedSkill(skill)}
                              >
                                + {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                      placeholder="Describe the staffing requirements..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRequest}>
                    Create Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff Needed</p>
                <p className="text-2xl font-bold text-blue-600">{totalStaffNeeded}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-green-600">{activeRequests}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Fill Time</p>
                <p className="text-2xl font-bold text-purple-600">2.5 days</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Staffing Requests List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Recent Staffing Requests
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{request.title}</h3>
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(request.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{request.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{request.staffCount} staff needed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{request.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {request.startDate}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{request.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {request.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        onClick={() => updateRequestStatus(request.id, 'in_progress')}
                      >
                        Start Processing
                      </Button>
                    </div>
                  )}
                  
                  {request.status === 'in_progress' && (
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        onClick={() => updateRequestStatus(request.id, 'fulfilled')}
                      >
                        Mark Fulfilled
                      </Button>
                    </div>
                  )}
                  
                  {request.status !== 'cancelled' && request.status !== 'fulfilled' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => updateRequestStatus(request.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No requests found for the selected filter.
            </div>
          )}
        </CardContent>
      </Card>
    </RtlAware>
  );
}