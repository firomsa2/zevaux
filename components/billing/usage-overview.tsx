"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PlanLike {
  name?: string | null;
  minutes_limit?: number | null;
  overage_rate?: number | null;
}

interface UsageOverviewProps {
  plan: PlanLike;
  usage: {
    minutesUsed: number;
    purchasedMinutes?: number;
    callsCount: number;
    activePhoneNumbers: number;
    teamMembers: number;
  };
}

export function UsageOverview({ plan, usage }: UsageOverviewProps) {
  const purchasedMinutes = usage.purchasedMinutes || 0;
  const baseIncluded = plan.minutes_limit ?? 0;
  const minutesIncluded = baseIncluded + purchasedMinutes;

  const minutesPercentage =
    minutesIncluded > 0
      ? Math.min((usage.minutesUsed / minutesIncluded) * 100, 120)
      : 0;

  const remaining = Math.max(0, minutesIncluded - usage.minutesUsed);
  const overage = Math.max(0, usage.minutesUsed - minutesIncluded);

  const isNearLimit = minutesPercentage >= 80;
  const isOverLimit = overage > 0;

  const overageRate = plan.overage_rate ?? 0;
  const overageCost = overage * overageRate;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monthly Usage</CardTitle>
        <CardDescription>
          {plan.name ?? "Current"} Plan • {baseIncluded} min included
          {purchasedMinutes > 0 && <span> + {purchasedMinutes} bought</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Minutes Used */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Minutes</span>
            <span
              className={
                isOverLimit ? "text-red-600 font-bold" : "text-muted-foreground"
              }
            >
              {usage.minutesUsed} / {minutesIncluded}
            </span>
          </div>

          <div className="relative">
            <Progress
              value={
                minutesIncluded > 0
                  ? (usage.minutesUsed / minutesIncluded) * 100
                  : 0
              }
              className={`h-2.5 ${
                isOverLimit ? "bg-red-100 dark:bg-red-950" : ""
              }`}
            />
          </div>

          <div className="flex justify-between items-center pt-1">
            {isOverLimit ? (
              <div className="text-xs font-semibold text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>
                  Overage: {overage} min (${overageCost.toFixed(2)})
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                {remaining} minutes remaining
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {(isNearLimit || isOverLimit) && (
          <div className="pt-2">
            <Link href="/dashboard/billing">
              <Button
                variant={isOverLimit ? "destructive" : "default"}
                size="sm"
                className="w-full"
              >
                {isOverLimit ? "Upgrade to Stop Overage" : "Upgrade Plan"}
              </Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Calls this month
            </span>
            <span className="text-lg font-semibold">{usage.callsCount}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Billing period ends
            </span>
            {/* Note: Period end date isn't in props yet; using placeholder */}
            <span className="text-sm font-medium">End of cycle</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
