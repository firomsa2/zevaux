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
import { PLANS } from "@/lib/products";
import { format } from "date-fns";

export function SubscriptionDetails({ subscription }: any) {
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Choose a plan to get started with your AI receptionist.
          </p>
        </CardContent>
      </Card>
    );
  }

  const plan = PLANS.find((p) => p.id === subscription.plan_id);

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
              <p className="text-2xl font-bold">{plan?.name}</p>
            </div>
            <Badge
              className={
                subscription.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {subscription.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Billing Cycle</p>
              <p className="font-medium">
                {format(
                  new Date(subscription.current_period_start),
                  "MMM dd, yyyy"
                )}{" "}
                -{" "}
                {format(
                  new Date(subscription.current_period_end),
                  "MMM dd, yyyy"
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Monthly Cost</p>
              <p className="font-medium">${plan?.pricePerMonth}/month</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Voice Minutes</p>
              <p className="font-medium">
                {plan?.voiceMinutes.toLocaleString()}/month
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Phone Numbers</p>
              <p className="font-medium">{plan?.phoneNumbers}</p>
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
          <Button variant="outline" className="w-full bg-transparent">
            {subscription.cancel_at_period_end
              ? "Reactivate Subscription"
              : "Cancel Subscription"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
