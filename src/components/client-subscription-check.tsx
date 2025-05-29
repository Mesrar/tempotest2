"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Crown,
  Users,
  Calendar,
  TrendingUp
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'basic' | 'premium' | 'enterprise';
  staffLimit: number;
  requestsLimit: number;
  features: string[];
  price: number;
}

interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan;
  usage: {
    staffRequests: number;
    activeStaff: number;
    requestsThisMonth: number;
  };
  expiresAt?: string;
}

interface ClientSubscriptionCheckProps {
  className?: string;
}

export default function ClientSubscriptionCheck({ className }: ClientSubscriptionCheckProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock subscription data - in real app, this would come from API
  useEffect(() => {
    const mockSubscription: SubscriptionStatus = {
      isActive: true,
      plan: {
        id: 'basic',
        name: 'Basic Plan',
        type: 'basic',
        staffLimit: 20,
        requestsLimit: 10,
        features: [
          'Up to 20 staff requests per month',
          'Basic candidate matching',
          'Email support',
          'Standard reporting'
        ],
        price: 99
      },
      usage: {
        staffRequests: 8,
        activeStaff: 15,
        requestsThisMonth: 6
      },
      expiresAt: '2024-03-15'
    };

    setTimeout(() => {
      setSubscriptionStatus(mockSubscription);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />;
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 animate-spin" />
            <span>Checking subscription status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionStatus) {
    return (
      <Alert className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load subscription information. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const { isActive, plan, usage, expiresAt } = subscriptionStatus;
  const staffUsagePercentage = getUsagePercentage(usage.staffRequests, plan.staffLimit);
  const requestsUsagePercentage = getUsagePercentage(usage.requestsThisMonth, plan.requestsLimit);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Subscription Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${getStatusColor(isActive)}`}>
                {getStatusIcon(isActive)}
                <CardTitle>
                  Subscription Status: {isActive ? 'Active' : 'Inactive'}
                </CardTitle>
              </div>
              <Badge className={getPlanColor(plan.type)}>
                <Crown className="w-3 h-3 mr-1" />
                {plan.name}
              </Badge>
            </div>
            {!isActive && (
              <Button>
                Upgrade Plan
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan Details */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Plan Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Price: ${plan.price}/month</p>
                {expiresAt && (
                  <p>Expires: {new Date(expiresAt).toLocaleDateString()}</p>
                )}
                <p>Staff Limit: {plan.staffLimit}</p>
                <p>Monthly Requests: {plan.requestsLimit}</p>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Current Usage</h4>
              
              {/* Staff Requests Usage */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Staff Requests</span>
                  <span>{usage.staffRequests}/{plan.staffLimit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageColor(staffUsagePercentage)}`}
                    style={{ width: `${staffUsagePercentage}%` }}
                  />
                </div>
              </div>

              {/* Monthly Requests Usage */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Monthly Requests</span>
                  <span>{usage.requestsThisMonth}/{plan.requestsLimit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageColor(requestsUsagePercentage)}`}
                    style={{ width: `${requestsUsagePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Quick Stats</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{usage.activeStaff} Active Staff</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>{usage.requestsThisMonth} Requests This Month</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>85% Fill Rate</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings and Alerts */}
      {staffUsagePercentage >= 80 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're approaching your staff request limit ({usage.staffRequests}/{plan.staffLimit}). 
            Consider upgrading your plan to avoid service interruption.
          </AlertDescription>
        </Alert>
      )}

      {requestsUsagePercentage >= 80 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You're approaching your monthly request limit ({usage.requestsThisMonth}/{plan.requestsLimit}). 
            Consider upgrading your plan for unlimited requests.
          </AlertDescription>
        </Alert>
      )}

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}