"use client";

import { useState } from "react";
import { Check, Crown, Zap, Sparkles, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/products";
import { cn } from "@/lib/utils";

interface BillingStepProps {
  onSelectPlan: (planId: string, isAnnual: boolean) => void;
  selectedPlanId?: string;
  loading?: boolean;
}

export function BillingStep({
  onSelectPlan,
  selectedPlanId,
  loading,
}: BillingStepProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  // Filter out plans that shouldn't be selectable (like custom/enterprise if needed, but we include them here)
  const displayPlans = PLANS.filter((p) => p.id !== "custom"); // Usually Custom is contact sales

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Select a Plan</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose the plan that best fits your business needs. You can change
          this later.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center p-1 bg-muted/50 border rounded-full relative mb-8">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
              !isAnnual
                ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:text-foreground/70",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
              isAnnual
                ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:text-foreground/70",
            )}
          >
            Annual
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {displayPlans.map((plan) => {
          const Icon =
            plan.id === "starter"
              ? Zap
              : plan.id === "basic"
                ? Sparkles
                : Crown;

          const price = isAnnual
            ? Math.round(plan.pricePerMonth * 0.8)
            : plan.pricePerMonth;
          const isSelected = selectedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-xl border-2 p-4 transition-all cursor-pointer hover:border-primary/50",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-muted bg-card",
                plan.popular &&
                  !isSelected &&
                  "border-amber-200 dark:border-amber-900",
              )}
              onClick={() => onSelectPlan(plan.id, isAnnual)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm whitespace-nowrap">
                    <Crown className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    plan.popular
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">${price}</span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {plan.features.slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.features.length > 4 && (
                  <div className="text-xs text-primary font-medium pl-5">
                    + {plan.features.length - 4} more benefits
                  </div>
                )}
              </div>

              <Button
                size="sm"
                variant={isSelected ? "default" : "outline"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlan(plan.id, isAnnual);
                }}
                disabled={loading}
              >
                {isSelected ? "Selected" : "Select Plan"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Trusted by hundreds of businesses. You won't be charged until your
          trial ends.
        </p>
      </div>
    </div>
  );
}
