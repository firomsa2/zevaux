"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, TrendingUp } from "lucide-react";
import type { Plan } from "@/types/database";

interface UsageOverviewProps {
  plan: Plan | null;
  usage: {
    minutesUsed: number;
    callsCount: number;
    activePhoneNumbers: number;
    teamMembers: number;
  };
}

export function UsageOverview({ plan, usage }: UsageOverviewProps) {
  if (!plan) return null;

  const minutesPercentage = Math.min(
    (usage.minutesUsed / plan.minutes_limit) * 100,
    100
  );
  const numbersPercentage = Math.min(
    (usage.activePhoneNumbers / plan.max_phone_numbers) * 100,
    100
  );
  const teamPercentage = Math.min(
    (usage.teamMembers / plan.max_team_members) * 100,
    100
  );

  const isNearLimit = minutesPercentage > 80;
  const isOverLimit = minutesPercentage > 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Usage</CardTitle>
        <CardDescription>Track your plan limits and usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Minutes Used */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm">Minutes Used</label>
            <span
              className={`text-sm font-mono ${
                isOverLimit ? "text-red-600" : "text-muted-foreground"
              }`}
            >
              {usage.minutesUsed} / {plan.minutes_limit} minutes
            </span>
          </div>
          <Progress value={minutesPercentage} className="h-2" />
          {isNearLimit && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-950/20 p-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                You're using {minutesPercentage.toFixed(0)}% of your monthly
                limit
              </p>
            </div>
          )}
        </div>

        {/* Phone Numbers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm">Phone Numbers</label>
            <span className="text-sm text-muted-foreground">
              {usage.activePhoneNumbers} / {plan.max_phone_numbers}
            </span>
          </div>
          <Progress value={numbersPercentage} className="h-2" />
        </div>

        {/* Team Members */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm">Team Members</label>
            <span className="text-sm text-muted-foreground">
              {usage.teamMembers} / {plan.max_team_members}
            </span>
          </div>
          <Progress value={teamPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Calls</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <p className="font-semibold">{usage.callsCount}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="font-semibold text-green-600">
              {Math.max(0, plan.minutes_limit - usage.minutesUsed)} min
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
