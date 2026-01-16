"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStepIndex: number;
  completedSteps?: string[]; // Optional: explicit list of completed step IDs
}

export function Stepper({ steps, currentStepIndex, completedSteps = [] }: StepperProps) {
  return (
    <nav aria-label="Progress" className="w-full mb-2 sm:mb-4">
      <ol
        role="list"
        className="flex w-full overflow-hidden rounded-md border border-gray-200 bg-white"
      >
        {steps.map((step, stepIdx) => {
          // Check if step is explicitly marked as completed, or if it's before current step
          const isExplicitlyCompleted = completedSteps.includes(step.id);
          const isBeforeCurrent = stepIdx < currentStepIndex;
          const isComplete = isExplicitlyCompleted || isBeforeCurrent;
          
          const status =
            isComplete
              ? "complete"
              : stepIdx === currentStepIndex
              ? "current"
              : "upcoming";

          const stepNumber = stepIdx + 1;

          return (
            <li key={step.id} className="relative flex flex-1 items-center">
              {/* Step content */}
              <div
                className={cn(
                  "flex w-full items-center",
                  "gap-1.5 min-[375px]:gap-2 sm:gap-3",
                  "px-1.5 min-[375px]:px-2 sm:px-4",
                  "py-2 min-[375px]:py-2.5 sm:py-4",
                  "text-[10px] min-[375px]:text-[12px] sm:text-sm sm:text-base",
                  "font-medium"
                )}
              >
                {/* Circle */}
                {status === "complete" ? (
                  <span className="flex size-6 min-[375px]:size-7 sm:size-9 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3.5 min-[375px]:size-4 sm:size-5 text-primary-foreground" />
                  </span>
                ) : status === "current" ? (
                  <span className="flex size-6 min-[375px]:size-7 sm:size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary">
                    <span className="text-[10px] min-[375px]:text-[11px] sm:text-sm font-semibold text-primary">
                      {stepNumber}
                    </span>
                  </span>
                ) : (
                  <span className="flex size-6 min-[375px]:size-7 sm:size-9 shrink-0 items-center justify-center rounded-full border border-gray-300">
                    <span className="text-[10px] min-[375px]:text-[11px] sm:text-sm font-semibold text-gray-500">
                      {stepNumber}
                    </span>
                  </span>
                )}

                {/* Label */}
                <span
                  className={cn(
                    "whitespace-nowrap truncate",
                    "max-w-[3.75rem] sm:max-w-none",
                    status === "current" && "text-primary",
                    status === "complete" && "text-foreground",
                    status === "upcoming" && "text-gray-500"
                  )}
                >
                  {/* Mobile: first word */}
                  <span className="sm:hidden">{step.label.split(" ")[0]}</span>

                  {/* Desktop: full label */}
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
              </div>

              {/* Arrow */}
              {stepIdx !== steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-full w-3 sm:w-5"
                >
                  <svg
                    viewBox="0 0 22 80"
                    preserveAspectRatio="none"
                    className="h-full w-full text-gray-200"
                    fill="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
