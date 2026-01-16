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
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight, Sparkles, X } from "lucide-react";
import Link from "next/link";
import type { OnboardingProgress } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import { ReceptionistProgressCard } from "./receptionist-progress";
import { useOnboardingProgress } from "@/hooks/use-onboarding-progress";

interface OnboardingGuideProps {
  initialProgress: OnboardingProgress;
  userId: string;
}

export function OnboardingGuide({
  initialProgress,
  userId,
}: OnboardingGuideProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Use optimized hook for progress tracking
  const { progress, isLoading } = useOnboardingProgress(initialProgress, {
    enabled: !isDismissed,
    refetchInterval: 15000, // 15 seconds
  });

  const isComplete = progress.isComplete;

  if (isDismissed && !isComplete) {
    return null;
  }

  // Show completion celebration
  if (isComplete) {
    return (
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500 p-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">🎉 Congratulations!</CardTitle>
                <CardDescription className="text-base mt-1">
                  You've successfully completed the setup. Your AI receptionist
                  is ready to handle calls!
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDismissed(true)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mt-4">
            <Link href="/dashboard/calls">
              <Button variant="outline">View Calls</Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button>View Analytics</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStep = progress.currentStep;

  if (!currentStep) {
    return null;
  }

  return (
    <Card className="border-accent bg-accent/5 mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
              Get Started with Zevaux
            </CardTitle>
            <CardDescription className="mt-2">
              Follow these steps to set up your AI receptionist in minutes
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDismissed(true)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Step {progress.completedSteps + 1} of {progress.totalSteps}
            </span>
            <span className="text-muted-foreground">
              {progress.progressPercentage}% Complete
            </span>
          </div>
          <Progress value={progress.progressPercentage} className="h-2" />
        </div>

        {/* Current Step Highlight */}
        <div className="rounded-lg border-2 border-accent bg-accent/10 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {currentStep.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-accent-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{currentStep.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStep.description}
              </p>
              {currentStep.actionUrl && currentStep.actionLabel && (
                <Link
                  href={currentStep.actionUrl}
                  className="mt-3 inline-block"
                >
                  <Button size="sm" className="gap-2">
                    {currentStep.actionLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Your Progress:
          </p>
          {progress.steps
            .filter((step) => step.id !== "welcome")
            .map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-colors",
                  step.completed
                    ? "bg-green-50 dark:bg-green-950/20"
                    : step.id === currentStep.id
                    ? "bg-accent/20"
                    : "bg-transparent"
                )}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      step.id === currentStep.id
                        ? "text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm",
                      step.completed
                        ? "text-green-700 dark:text-green-400 line-through"
                        : step.id === currentStep.id
                        ? "font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
