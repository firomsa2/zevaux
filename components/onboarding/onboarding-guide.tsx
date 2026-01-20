"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import type { OnboardingProgress } from "@/types/onboarding";
import { cn } from "@/lib/utils";
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
  const [isExpanded, setIsExpanded] = useState(false);

  // Use optimized hook for progress tracking
  const { progress } = useOnboardingProgress(initialProgress, {
    enabled: !isDismissed,
    refetchInterval: 15000, // 15 seconds
  });

  const isComplete = progress.isComplete;

  if (isDismissed) {
    return null;
  }

  // Compact Completion Card
  if (isComplete) {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/10 mb-6 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                Setup Complete!
              </h3>
              <p className="text-xs text-green-700 dark:text-green-300">
                Your AI receptionist is ready.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/calls">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-green-200 hover:bg-green-100 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900"
              >
                View Calls
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDismissed(true)}
              className="h-7 w-7 text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const currentStep = progress.currentStep;

  if (!currentStep) {
    return null;
  }

  return (
    <Card className="border-accent/40 bg-accent/5 mb-6 transition-all duration-200">
      <div className="flex items-center justify-between gap-4 p-3">
        {/* Left: Progress + Info */}
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Circular Progress */}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm">
            <svg
              className="absolute h-full w-full -rotate-90 p-0.5"
              viewBox="0 0 100 100"
            >
              <circle
                className="stroke-muted/20"
                strokeWidth="8"
                fill="none"
                cx="50"
                cy="50"
                r="42"
              />
              <circle
                className="stroke-primary transition-all duration-500 ease-in-out"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                cx="50"
                cy="50"
                r="42"
                strokeDasharray="264"
                strokeDashoffset={
                  264 - (264 * progress.progressPercentage) / 100
                }
              />
            </svg>
            <span className="text-[10px] font-bold">
              {Math.round(progress.progressPercentage)}%
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-medium truncate flex items-center gap-2">
              {currentStep.title}
              <span className="inline-flex items-center rounded-full bg-background border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Step {progress.completedSteps + 1}/{progress.totalSteps}
              </span>
            </h3>
            <p className="text-xs text-muted-foreground truncate max-w-[300px] sm:max-w-md">
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {currentStep.actionUrl && (
            <Link href={currentStep.actionUrl}>
              <Button size="sm" className="h-7 px-3 text-xs mr-1 shadow-sm">
                {currentStep.actionLabel || "Start"}
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDismissed(true)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t bg-muted/30 px-3 py-2">
          <div className="grid gap-1">
            {progress.steps
              .filter((step) => step.id !== "welcome")
              .map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors text-sm",
                    step.id === currentStep.id
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50",
                  )}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <div
                      className={cn(
                        "h-3.5 w-3.5 rounded-full border-2",
                        step.id === currentStep.id
                          ? "border-primary"
                          : "border-muted-foreground/30",
                      )}
                    />
                  )}
                  <div className="flex flex-1 items-center justify-between">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        step.completed
                          ? "text-muted-foreground line-through decoration-slate-400/50"
                          : step.id === currentStep.id
                            ? "text-foreground"
                            : "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                    {step.id === currentStep.id && (
                      <span className="text-[10px] text-primary font-medium px-1.5 py-0.5 bg-primary/10 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  );
}
