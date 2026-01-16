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
import { AlertCircle, Calendar, Check } from "lucide-react";
import type { Subscription, Plan } from "@/types/database";
import { useTransition } from "react";

interface SubscriptionCardProps {
  subscription: Subscription | null;
  plan: Plan | null;
  businessId: string;
}

export function SubscriptionCard({
  subscription,
  plan,
  businessId,
}: SubscriptionCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/portal/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch("/api/stripe/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, planId: "pro" }),
      });
      const data = await response.json();
      if (data.session_id) {
        window.location.href = `https://checkout.stripe.com/pay/${data.session_id}`;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!subscription || !plan) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            You don't have an active subscription yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleUpgrade} disabled={isPending}>
            {isPending ? "Setting up..." : "Get Started"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isTrialing = subscription.status === "trialing";
  const isPastDue = subscription.status === "past_due";
  const isCanceled = subscription.status === "canceled";

  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end)
    : null;
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end)
    : null;

  return (
    <Card
      className={`
        ${isPastDue ? "border-red-200 bg-red-50 dark:bg-red-950/20" : ""}
        ${isTrialing ? "border-blue-200 bg-blue-50 dark:bg-blue-950/20" : ""}
      `}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              {plan.name} Plan
            </CardTitle>
            <CardDescription className="mt-1">
              ${plan.monthly_price}/month
            </CardDescription>
          </div>
          {isTrialing && <Badge className="bg-blue-600">Free Trial</Badge>}
          {isPastDue && <Badge variant="destructive">Payment Failed</Badge>}
          {isCanceled && <Badge variant="secondary">Canceled</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Details */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div>
            <p className="text-xs text-muted-foreground">Minutes per month</p>
            <p className="text-lg font-semibold">{plan.minutes_limit}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone numbers</p>
            <p className="text-lg font-semibold">
              Up to {plan.max_phone_numbers}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Team size</p>
            <p className="text-lg font-semibold">
              Up to {plan.max_team_members}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-lg font-semibold capitalize">
              {subscription.status}
            </p>
          </div>
        </div>

        {/* Billing Period */}
        {(periodEnd || trialEnd) && (
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="font-semibold text-sm">
                {isTrialing ? "Trial ends on" : "Next billing date"}
              </p>
            </div>
            <p className="text-sm font-mono">
              {(isTrialing ? trialEnd : periodEnd)?.toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
            {isTrialing && (
              <p className="text-xs text-muted-foreground mt-2">
                After trial ends, we'll charge your payment method $
                {plan.monthly_price}/month
              </p>
            )}
          </div>
        )}

        {/* Messages */}
        {isPastDue && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3">
            <p className="text-sm text-red-700 dark:text-red-400">
              Your payment failed. Please update your billing information to
              continue service.
            </p>
          </div>
        )}

        {isCanceled && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Your subscription was canceled. You can reactivate it anytime.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            disabled={isPending}
          >
            Manage Subscription
          </Button>
          {!isCanceled && (
            <Button
              onClick={handleUpgrade}
              disabled={isPending}
              className="ml-auto"
            >
              Upgrade Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
