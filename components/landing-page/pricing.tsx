"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      recommended: false,
      description: "Perfect for small businesses just getting started.",
      features: [
        "Up to 500 minutes/month",
        "Call answering & message taking",
        "Custom greeting",
        "Email & SMS notifications",
        "Call recordings & transcripts",
        "Basic FAQs",
        "Community support",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Pro",
      price: "$149",
      recommended: true,
      description: "Our most popular plan for growing businesses.",
      features: [
        "Unlimited minutes*",
        "Everything in Starter, plus:",
        "Appointment booking integration",
        "Advanced lead qualification",
        "Call transfers to your team",
        "Send text links during calls",
        "Priority support",
        "Custom integrations",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      recommended: false,
      description: "For large teams with complex needs.",
      features: [
        "Everything in Pro, plus:",
        "Unlimited everything",
        "Dedicated account manager",
        "Custom training & setup",
        "Advanced analytics & reporting",
        "Multi-location support",
        "SLA guarantees",
        "Custom AI training",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No setup fees. No long-term contracts. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border transition-all ${
                plan.recommended
                  ? "border-accent bg-gradient-to-b from-secondary/50 to-background lg:scale-105 shadow-xl"
                  : "border-border bg-card"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-accent text-accent-foreground px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground ml-2">/month</span>
                  )}
                </div>

                <Button
                  asChild
                  className={`w-full mb-8 ${
                    plan.recommended
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                  size="lg"
                >
                  <Link href="#pricing">{plan.cta}</Link>
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-3 items-start">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-secondary/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            *Pro plan: Fair-use policy applies. Includes up to 3,000 minutes
            with alerts at 1,500.
          </p>
        </div>
      </div>
    </section>
  );
}
