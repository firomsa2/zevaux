"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, Calendar, Check, X } from "lucide-react";
import { toast } from "@/lib/toast";
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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);

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
      const planSlug = plan?.slug ?? "pro";

      // First, try to update existing subscription
      const updateResponse = await fetch("/api/stripe/subscriptions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          planSlug,
        }),
      });

      const updateData = await updateResponse.json();

      if (updateResponse.ok && updateData.success) {
        // Subscription updated successfully - reload page to show new plan
        window.location.reload();
        return;
      }

      // If update failed because no subscription exists, create new one
      if (
        updateData.error?.includes("No active subscription") ||
        updateData.redirectToCheckout
      ) {
        const checkoutResponse = await fetch("/api/stripe/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId,
            planSlug,
          }),
        });

        const checkoutData = await checkoutResponse.json();
        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = async (cancelImmediately: boolean) => {
    setCanceling(true);
    try {
      const response = await fetch("/api/stripe/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          cancelImmediately,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Subscription canceled", {
          description: data.message,
        });
        setCancelDialogOpen(false);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(data.error || "Failed to cancel subscription");
      }
    } catch (error) {
      toast.error("Failed to cancel subscription", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setCanceling(false);
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
  // `cancel_at` does not exist on type, so only check `cancel_at_period_end`
  const isCancelingAtPeriodEnd = subscription.cancel_at_period_end;

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
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3 space-y-2">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Payment Failed
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">
              Your payment method could not be charged. Please update your
              billing information to continue service. You have a 3-day grace
              period before features are restricted.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              className="mt-2"
            >
              Update Payment Method
            </Button>
          </div>
        )}

        {isCancelingAtPeriodEnd && !isCanceled && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Your subscription is scheduled to cancel at the end of the current
              billing period. You'll continue to have access until{" "}
              {periodEnd?.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              .
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
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            disabled={isPending}
          >
            Manage Subscription
          </Button>
          {!isCanceled && !isCancelingAtPeriodEnd && (
            <>
              <Button
                onClick={handleUpgrade}
                disabled={isPending}
                className="ml-auto"
              >
                Upgrade Plan
              </Button>
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isPending}
                    className="ml-auto"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription? Choose
                      how you'd like to proceed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="rounded-lg border p-4 space-y-2">
                      <h4 className="font-semibold text-sm">
                        Cancel at Period End (Recommended)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your subscription will remain active until{" "}
                        {periodEnd?.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        . You'll continue to have full access until then, and
                        won't be charged again.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCancel(false)}
                        disabled={canceling}
                      >
                        {canceling ? "Processing..." : "Cancel at Period End"}
                      </Button>
                    </div>
                    <div className="rounded-lg border border-destructive/50 p-4 space-y-2">
                      <h4 className="font-semibold text-sm text-destructive">
                        Cancel Immediately
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your subscription will end immediately. You'll lose
                        access to all features right away.
                      </p>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleCancel(true)}
                        disabled={canceling}
                      >
                        {canceling ? "Processing..." : "Cancel Immediately"}
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setCancelDialogOpen(false)}
                    >
                      Keep Subscription
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
