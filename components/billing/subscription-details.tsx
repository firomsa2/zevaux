"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Business, Plan } from "@/types/database";

interface SubscriptionDetailsProps {
  business: Business;
  currentPlan: Plan | null;
}

export function SubscriptionDetails({
  business,
  currentPlan,
}: SubscriptionDetailsProps) {
  if (!currentPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Plan</CardTitle>
          <CardDescription>You are currently on the free tier</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Choose a plan to unlock advanced features and support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Plan</p>
              <p className="text-2xl font-bold">{currentPlan.name}</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Monthly Cost</p>
              <p className="font-medium">${currentPlan.monthly_price}/month</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Minutes Limit</p>
              <p className="font-medium">
                {currentPlan.minutes_limit?.toLocaleString() || "Unlimited"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full bg-transparent">
            Update Payment Method
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent text-destructive"
          >
            Cancel Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
