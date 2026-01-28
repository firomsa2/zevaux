"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Plan } from "@/types/database";

interface UsageMeterWidgetProps {
  plan: Plan | null;
  minutesUsed: number;
  callsThisMonth: number;
}

export function UsageMeterWidget({
  plan,
  minutesUsed,
  callsThisMonth,
}: UsageMeterWidgetProps) {
  if (!plan) return null;

  const minutesIncluded = plan.minutes_limit || 500;
  const minutesPercentage = Math.min(
    (minutesUsed / minutesIncluded) * 100,
    100
  );
  const isNearLimit = minutesPercentage > 70;
  const isAtLimit = minutesPercentage >= 100;
  const overmeter = minutesUsed - minutesIncluded;

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 -mr-16 -mt-16 blur-2xl" />

      <CardHeader>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Monthly Minutes
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track your usage for the current billing period
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {minutesUsed}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              of {minutesIncluded} minutes
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Main Progress Bar */}
        <div className="space-y-2">
          <Progress
            value={Math.min(minutesPercentage, 100)}
            className={`h-3 rounded-full ${
              isAtLimit ? "bg-red-200 dark:bg-red-900" : ""
            }`}
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {minutesPercentage.toFixed(0)}% used
            </span>
            {isAtLimit && (
              <span className="text-red-600 dark:text-red-400 font-semibold">
                +{overmeter} minutes over
              </span>
            )}
            {!isAtLimit && (
              <span className="text-primary font-semibold">
                {minutesIncluded - minutesUsed} minutes remaining
              </span>
            )}
          </div>
        </div>

        {/* Status Alert */}
        {isAtLimit && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-red-900 dark:text-red-200">
                  Limit Exceeded
                </h4>
                <p className="text-xs text-red-800 dark:text-red-300 mt-1">
                  You've exceeded your monthly limit. Additional minutes are
                  being charged at ${plan && 'overage_rate' in plan ? (plan as any).overage_rate : 0.25}/min. Upgrade to lower
                  your rates.
                </p>
                <Link href="/dashboard/billing" className="inline-block mt-2">
                  <Button size="sm" variant="outline">
                    Manage Plan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                  Approaching Limit
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                  {minutesIncluded - minutesUsed} minutes remaining. Consider
                  upgrading to avoid running out.
                </p>
                <Link href="/dashboard/billing" className="inline-block mt-2">
                  <Button size="sm" variant="outline">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase">
                Calls This Month
              </span>
            </div>
            <div className="text-2xl font-bold">{callsThisMonth}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase mb-1">
              Avg Per Call
            </div>
            <div className="text-2xl font-bold">
              {callsThisMonth > 0
                ? (minutesUsed / callsThisMonth).toFixed(1)
                : "0"}
              m
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
