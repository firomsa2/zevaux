"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Building, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Business, Plan } from "@/types/database";

interface PlansOverviewProps {
  business: Business;
  currentPlan: Plan | null;
  plans: Plan[];
}

const PLAN_META: Record<
  string,
  {
    icon: any;
    description: string;
    popular?: boolean;
    color: string;
    features_highlight?: string[];
  }
> = {
  starter: {
    icon: Zap,
    description: "Perfect for small businesses and solo owners.",
    popular: false,
    color: "text-blue-500",
    features_highlight: [
      "Custom greeting & agent name",
      "Message taking",
      "Call transfers",
    ],
  },
  pro: {
    icon: Crown,
    description: "For growing businesses needing full automation.",
    popular: true,
    color: "text-amber-500",
    features_highlight: [
      "Appointment booking",
      "Live call transfers",
      "Advanced routing",
      "Priority support",
    ],
  },
  enterprise: {
    icon: Building,
    description: "Custom solutions for complex organizations.",
    popular: false,
    color: "text-slate-500",
    features_highlight: [
      "Multiple locations",
      "Custom AI training",
      "Dedicated account manager",
    ],
  },
};

export function PlansOverview({
  business,
  currentPlan,
  plans,
}: PlansOverviewProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);

  const handleUpgrade = async (planId: string) => {
    setLoading(planId);
    try {
      const plan = plans.find((p) => p.id === planId);
      const response = await fetch("/api/stripe/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          planId: planId,
          planSlug: plan?.slug,
          interval: isAnnual ? "year" : "month",
        }),
      });

      const data = await response.json();

      if (data.session_id) {
        // Redirect to Stripe checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.session_id}`;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  // Ensure plans is an array before sorting
  if (!plans || !Array.isArray(plans) || plans.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
        <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No plans available</h3>
        <p className="text-muted-foreground">Checking availability...</p>
      </div>
    );
  }

  const sortedPlans = [...plans].sort(
    (a, b) => (a.monthly_price || 0) - (b.monthly_price || 0),
  );

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1 bg-slate-100/80 border rounded-full relative">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              !isAnnual
                ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center gap-2 ${
              isAnnual
                ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            Annual
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedPlans.map((plan) => {
          const meta = PLAN_META[plan.slug] || {
            icon: Sparkles,
            description: "Advanced AI features",
            popular: false,
            color: "text-primary",
          };
          const Icon = meta.icon;
          const isCurrentPlan = currentPlan?.id === plan.id;
          const isPopular = meta.popular;

          // Calculate display price
          const monthlyPrice = plan.monthly_price || 0;
          const annualPrice = Math.floor(monthlyPrice * 0.8); // 20% off estimate for display
          const displayPrice = isAnnual ? annualPrice : monthlyPrice;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 overflow-hidden ${
                isPopular
                  ? "border-primary border-2 shadow-2xl scale-[1.02] z-10 bg-white"
                  : "border-border shadow-md hover:shadow-xl hover:-translate-y-1 bg-white/50"
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm uppercase tracking-wider">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="pt-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2.5 rounded-lg ${
                      isPopular ? "bg-primary/10" : "bg-slate-100"
                    } ${meta.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xl">{plan.name}</h3>
                </div>
                <CardDescription className="text-sm min-h-[40px]">
                  {meta.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                <div>
                  <div className="flex items-baseline gap-1">
                    {plan.monthly_price !== null ? (
                      <>
                        <span className="text-4xl font-bold tracking-tight">
                          ${displayPrice}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                          /mo
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">Custom</span>
                    )}
                  </div>
                  {plan.monthly_price !== null && (
                    <p className="text-xs text-muted-foreground mt-1 font-medium h-4">
                      {isAnnual && (
                        <span className="text-green-600">
                          Billed ${annualPrice * 12} yearly
                        </span>
                      )}
                      {!isAnnual && "Billed monthly"}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-semibold flex items-center gap-2 pb-1 border-b">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Key Features
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <div className="p-0.5 rounded-full bg-green-100 text-green-600 mt-0.5 shadow-sm">
                        <Check className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                      </div>
                      <span>
                        <strong className="font-medium text-foreground">
                          {plan.minutes_limit > 0
                            ? plan.minutes_limit.toLocaleString()
                            : "Unlimited"}
                        </strong>{" "}
                        minutes included
                      </span>
                    </li>

                    {/* Render static highlights if available, otherwise fallback to DB features */}
                    {(meta.features_highlight || []).length > 0
                      ? meta.features_highlight?.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm"
                          >
                            <div className="p-0.5 rounded-full bg-green-100 text-green-600 mt-0.5 shadow-sm">
                              <Check className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                            </div>
                            <span className="text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))
                      : plan.features &&
                        typeof plan.features === "object" &&
                        Object.entries(plan.features)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <li
                              key={key}
                              className="flex items-start gap-3 text-sm"
                            >
                              <div className="p-0.5 rounded-full bg-green-100 text-green-600 mt-0.5 shadow-sm">
                                <Check className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                              </div>
                              <span className="text-muted-foreground">
                                {/* Clean up boolean/string features */}
                                {value === true
                                  ? key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) => str.toUpperCase())
                                  : String(value)}
                              </span>
                            </li>
                          ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-2 pb-8">
                {isCurrentPlan ? (
                  <Button
                    disabled
                    className="w-full h-11 bg-muted text-muted-foreground border"
                    variant="outline"
                  >
                    Current Plan
                  </Button>
                ) : plan.monthly_price === null ? (
                  <Button
                    className="w-full h-11"
                    variant="outline"
                    onClick={() =>
                      (window.location.href = "mailto:sales@zevaux.com")
                    }
                  >
                    Contact Sales
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading === plan.id}
                    className={`w-full h-11 font-bold shadow-sm transition-all text-sm ${
                      isPopular
                        ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                        : "bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-0.5"
                    }`}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Select ${plan.name}`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-8 pb-4">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            All plans come with a 14-day money back guarantee • Upgrade or
            cancel anytime
          </span>
        </p>
      </div>
    </div>
  );
}
