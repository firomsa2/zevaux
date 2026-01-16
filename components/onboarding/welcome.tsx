"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  name: string;
  slug: string;
  monthly_price: number;
  minutes_limit: number;
  max_phone_numbers: number;
  max_team_members: number;
  features: Record<string, any>;
}

export function OnboardingWelcome({ userId }: { userId: string }) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: "1",
      name: "Starter",
      slug: "starter",
      monthly_price: 29,
      minutes_limit: 500,
      max_phone_numbers: 1,
      max_team_members: 2,
      features: {
        voicemail: true,
        sms: false,
        webChat: false,
        whatsApp: false,
        analytics: false,
        apiAccess: false,
        priority_support: false,
        description:
          "Perfect for small businesses getting started with AI receptionists",
      },
    },
    {
      id: "2",
      name: "Pro",
      slug: "pro",
      monthly_price: 79,
      minutes_limit: 2000,
      max_phone_numbers: 5,
      max_team_members: 10,
      features: {
        voicemail: true,
        sms: true,
        webChat: true,
        whatsApp: false,
        analytics: true,
        apiAccess: true,
        priority_support: true,
        description: "For growing businesses with advanced needs",
      },
    },
  ];

  const handleSelectPlan = async (planSlug: string) => {
    setLoading(true);
    setSelectedPlan(planSlug);
    // Redirect to business setup
    setTimeout(() => {
      router.push(`/onboarding/business-setup?plan=${planSlug}`);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Welcome to Zevaux
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your AI receptionist is ready to transform how you handle calls. Let's
          get your business set up in just a few minutes.
        </p>
      </div>

      {/* Plans Section */}
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Choose Your Plan
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Start with Starter for free. Upgrade to Pro anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.slug
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-lg"
              } ${plan.slug === "pro" ? "md:scale-105" : ""}`}
              onClick={() => handleSelectPlan(plan.slug)}
            >
              {plan.slug === "pro" && (
                <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-blue-600 to-blue-500">
                  Recommended
                </Badge>
              )}

              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {plan.features.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    ${plan.monthly_price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Plan stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Minutes per month
                    </p>
                    <p className="text-xl font-semibold">
                      {plan.minutes_limit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Phone numbers
                    </p>
                    <p className="text-xl font-semibold">
                      Up to {plan.max_phone_numbers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team size</p>
                    <p className="text-xl font-semibold">
                      Up to {plan.max_team_members}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Support</p>
                    <p className="text-xl font-semibold">
                      {plan.slug === "pro" ? "Priority" : "Standard"}
                    </p>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Features included:</p>
                  <ul className="space-y-2">
                    {Object.entries(plan.features).map(([key, value]) => {
                      if (
                        typeof value === "boolean" &&
                        key !== "priority_support"
                      ) {
                        return (
                          <li key={key} className="flex items-center gap-2">
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                value
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <span className="text-sm capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    {plan.slug === "pro" && (
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Priority support</span>
                      </li>
                    )}
                  </ul>
                </div>

                <Button
                  className="w-full"
                  variant={plan.slug === "pro" ? "default" : "outline"}
                  disabled={loading}
                  onClick={() => handleSelectPlan(plan.slug)}
                >
                  {selectedPlan === plan.slug ? "Setting up..." : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info boxes */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <Zap className="w-8 h-8 text-blue-600 mb-3" />
              <p className="font-semibold text-sm mb-1">Start Free</p>
              <p className="text-xs text-muted-foreground">
                No credit card required. Try for 14 days.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-green-600 mb-3" />
              <p className="font-semibold text-sm mb-1">Easy Upgrade</p>
              <p className="text-xs text-muted-foreground">
                Upgrade or downgrade anytime, no penalties.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
            <CardContent className="pt-6">
              <BarChart3 className="w-8 h-8 text-purple-600 mb-3" />
              <p className="font-semibold text-sm mb-1">Always Visible</p>
              <p className="text-xs text-muted-foreground">
                Track usage and costs in real-time.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4 text-sm text-muted-foreground">
          <p>
            Have questions?{" "}
            <Link href="/support" className="text-blue-600 hover:underline">
              Contact our sales team
            </Link>
          </p>
          <p>
            All plans include access to core AI receptionist features, email
            support, and our knowledge base.
          </p>
        </div>
      </div>
    </div>
  );
}
