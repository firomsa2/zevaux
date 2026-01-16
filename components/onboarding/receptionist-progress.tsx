"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Settings,
  Package,
  Mic,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { ReceptionistProgress } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface ReceptionistProgressProps {
  progress: ReceptionistProgress;
}

const SUBSTEP_ICONS: Record<string, any> = {
  receptionist_configuration: Settings,
  receptionist_services: Package,
  receptionist_voice: Mic,
  receptionist_hours: Clock,
};

export function ReceptionistProgressCard({
  progress,
}: ReceptionistProgressProps) {
  const { subSteps, currentSubStep, progressPercentage } = progress;

  if (progress.isComplete) {
    return null; // Don't show if complete
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Receptionist Setup Progress
            </CardTitle>
            <CardDescription className="mt-1">
              Complete these steps to fully configure your AI receptionist
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {progress.completedSubSteps} of {progress.totalSubSteps} completed
            </span>
            <span className="text-muted-foreground">
              {progressPercentage}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Current Step Highlight */}
        {currentSubStep && (
          <div className="rounded-lg border-2 border-blue-300 bg-blue-100/50 dark:bg-blue-900/30 dark:border-blue-800 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {(() => {
                  const Icon = SUBSTEP_ICONS[currentSubStep.id] || Settings;
                  return <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
                })()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">{currentSubStep.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentSubStep.description}
                </p>
                <Link href={currentSubStep.actionUrl} className="mt-3 inline-block">
                  <Button size="sm" className="gap-2">
                    {currentSubStep.actionLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sub-steps List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Receptionist Configuration Steps:
          </p>
          {subSteps.map((subStep) => {
            const Icon = SUBSTEP_ICONS[subStep.id] || Settings;
            return (
              <div
                key={subStep.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md transition-colors",
                  subStep.completed
                    ? "bg-green-50 dark:bg-green-950/20"
                    : subStep.id === currentSubStep?.id
                    ? "bg-blue-100/50 dark:bg-blue-900/20"
                    : "bg-transparent"
                )}
              >
                {subStep.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      subStep.id === currentSubStep?.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground"
                    )}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm",
                      subStep.completed
                        ? "text-green-700 dark:text-green-400 line-through"
                        : subStep.id === currentSubStep?.id
                        ? "font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {subStep.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

