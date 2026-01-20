"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Zap, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OnboardingGuide } from "@/components/onboarding/onboarding-guide";
import { PostOnboardingCelebration } from "@/components/onboarding/post-onboarding-celebration";
import type { OnboardingProgress } from "@/types/onboarding";
import { useState } from "react";

interface DashboardData {
  totalCalls: number;
  avgDuration: string;
  successRate: string;
  recentCalls: any[];
  isSetupComplete: boolean;
  businessName: string;
}

export function DashboardContent({
  user,
  data,
  onboardingProgress,
}: {
  user: any;
  data: DashboardData;
  onboardingProgress: OnboardingProgress;
}) {
  const {
    isSetupComplete,
    totalCalls,
    avgDuration,
    successRate,
    recentCalls,
    businessName,
  } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (minutes: string | null) => {
    if (!minutes) return "-";
    const mins = Number.parseFloat(minutes);
    if (mins < 1) return "< 1 min";
    return `${mins.toFixed(1)} min`;
  };

  const [dismissCelebration, setDismissCelebration] = useState(false);

  return (
    <main className="flex-1 px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {onboardingProgress.isComplete
              ? `Welcome back${businessName ? `, ${businessName}` : ""}`
              : `Welcome${
                  businessName ? `, ${businessName}` : ""
                }! Let's get you started.`}
          </p>
        </div>
        {isSetupComplete && (
          <Link href="/dashboard/receptionist/configure">
            <Button variant="outline">Configure Receptionist</Button>
          </Link>
        )}
      </div>

      {/* CHANGED: Show celebration when onboarding is complete and not dismissed */}
      {onboardingProgress.isComplete &&
        isSetupComplete &&
        !dismissCelebration && (
          <PostOnboardingCelebration
            businessName={businessName}
            phoneNumber={data.recentCalls[0]?.phone_number || "+1-XXX-XXX-XXXX"}
            onDismiss={() => setDismissCelebration(true)}
          />
        )}

      {/* Onboarding Guide - Show for users who haven't completed setup */}
      {!onboardingProgress.isComplete && (
        <OnboardingGuide
          initialProgress={onboardingProgress}
          userId={user.id}
        />
      )}

      {/* Legacy Setup Status - Only show if onboarding is complete but setup isn't */}
      {onboardingProgress.isComplete && !isSetupComplete && (
        <Card className="border-accent bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-foreground" />
              Get Started with Your AI Receptionist
            </CardTitle>
            <CardDescription>
              Complete the setup wizard to activate your receptionist in 5
              minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/receptionist/configure">
              <Button className="btn-primary">Start Setup</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDuration}</div>
            <p className="text-xs text-muted-foreground">Per call</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}</div>
            <p className="text-xs text-muted-foreground">Calls {">"} 20s</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div
              className={`w-2 h-2 rounded-full ${
                isSetupComplete ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isSetupComplete ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-muted-foreground">System status</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest calls and interactions
            </CardDescription>
          </div>
          <Link href="/dashboard/calls">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentCalls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No calls yet. Start your setup to begin receiving calls.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Caller</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCalls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">{call.caller}</TableCell>
                    <TableCell>{formatDate(call.created_at)}</TableCell>
                    <TableCell>{formatDuration(call.minutes)}</TableCell>
                    <TableCell>
                      <Badge variant={call.end_time ? "secondary" : "default"}>
                        {call.end_time ? "Completed" : "Live"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
