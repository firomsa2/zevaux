"use client";

import type { Plan } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useTransition } from "react";

interface BillingPlansComparisonProps {
  allPlans: Plan[];
  currentPlan: string;
  businessId: string;
}

export function BillingPlansComparison({
  allPlans,
  currentPlan,
  businessId,
}: BillingPlansComparisonProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = (planSlug: string) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/stripe/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId, planSlug }),
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error("Error upgrading plan:", error);
      }
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {allPlans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative ${
            plan.slug === currentPlan ? "ring-2 ring-green-500 shadow-lg" : ""
          } ${plan.slug === "pro" ? "md:scale-105" : ""}`}
        >
          {plan.slug === "pro" && (
            <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-blue-600 to-blue-500">
              Most Popular
            </Badge>
          )}

          {plan.slug === currentPlan && (
            <Badge className="absolute -top-3 right-6 bg-green-600">
              Current Plan
            </Badge>
          )}

          <CardHeader>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold">${plan.monthly_price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y">
              <div>
                <p className="text-xs text-muted-foreground">Minutes</p>
                <p className="font-semibold">{plan.minutes_limit}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Numbers</p>
                <p className="font-semibold">{plan.max_phone_numbers}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team</p>
                <p className="font-semibold">{plan.max_team_members}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Support</p>
                <p className="font-semibold">
                  {plan.slug === "pro" ? "Priority" : "Standard"}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {Object.entries(plan.features as Record<string, any>).map(
                ([key, value]) => {
                  if (typeof value === "boolean" && key !== "description") {
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-2 text-sm ${
                          value ? "" : "opacity-50"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            value ? "text-green-600" : "text-muted-foreground"
                          }`}
                        />
                        <span className="capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }
              )}
            </div>

            {plan.slug === currentPlan ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleUpgrade(plan.slug)}
                variant={plan.slug === "pro" ? "default" : "outline"}
                disabled={isPending}
              >
                {isPending
                  ? "Loading..."
                  : plan.slug === "pro"
                  ? "Upgrade"
                  : "Downgrade"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
