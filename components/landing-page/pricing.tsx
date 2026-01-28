"use client";

import { useState } from "react";
import {
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  Crown,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  // LOGIC: Annual price is approx 20% off monthly.
  // Defined Plans:
  // Starter: $49/mo -> $49 * .8 = $39.2 -> $39/mo billed annually
  // Basic: $79/mo -> $79 * .8 = $63.2 -> $63/mo billed annually
  // Pro: $129/mo -> $129 * .8 = $103.2 -> $103/mo billed annually
  
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      monthlyPrice: 49,
      annualPrice: 39,
      description:
        "Perfect for solo owners and very small teams who need calls answered professionally.",
      popular: false,
      features: [
        "200 AI-handled minutes / month",
        "24/7 call answering",
        "Custom greeting & agent name",
        "Message taking with your questions",
        "Instant email & SMS summaries",
        "Spam & robocall filtering",
      ],
      cta: "Start Free Trial",
      href: "/signup",
    },
    {
      name: "Basic",
      icon: Sparkles,
      monthlyPrice: 79,
      annualPrice: 63,
      description: "Designed for small businesses getting steady call volume.",
      popular: false,
      features: [
        "Everything in Starter, plus:",
        "300 AI-handled minutes / month",
        "Smart call routing",
        "Lead qualification questions",
        "SMS follow-ups after calls",
        "Missed-call recovery logic",
      ],
      cta: "Start Free Trial",
      href: "/signup",
    },
    {
      name: "Pro",
      icon: Crown,
      monthlyPrice: 129,
      annualPrice: 103,
      description:
        "For growing businesses that want Zevaux to take action, not just messages.",
      popular: true,
      features: [
        "Everything in Basic, plus:",
        "500 AI-handled minutes / month",
        "Appointment booking automation",
        "Live call transfers to your team",
        "CRM integrations (Google, Calendly)",
        "Priority support",
      ],
      cta: "Start Free Trial",
      href: "/signup",
    },
    {
      name: "Custom",
      icon: Building,
      monthlyPrice: null,
      annualPrice: null,
      description: "Built for high-volume and multi-location businesses.",
      popular: false,
      features: [
        "Custom minute bundles (1,000+)",
        "Multiple locations & numbers",
        "Franchise support",
        "Fully custom AI prompts",
        "White-label options",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      href: "/contact",
    },
  ];

  const includedInAll = [
    "AI trained on your specific business",
    "Available 24/7/365",
    "Enterprise-grade security",
    "No setup fees",
    "Cancel anytime",
    "Call recordings & transcripts",
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-background" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            Plans That Scale With Your Business
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing. No hidden fees. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1 bg-muted/50 border rounded-full relative">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                !isAnnual
                  ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                  : "text-muted-foreground hover:text-foreground/70"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center gap-2 ${
                isAnnual
                  ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
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

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "border-primary bg-gradient-to-b from-primary/5 via-card to-card shadow-xl scale-105 z-10"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg whitespace-nowrap">
                      <Crown className="h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        plan.popular
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${plan.popular ? "" : "text-primary"}`}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {plan.monthlyPrice !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          ${price}
                        </span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                          Custom
                        </span>
                      </div>
                    )}
                    {isAnnual && plan.monthlyPrice !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed annually (${(plan.annualPrice || 0) * 12}/yr)
                      </p>
                    )}
                    {!isAnnual && plan.monthlyPrice !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                         Billed monthly
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  <div className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className={`w-full ${
                      plan.popular ? "bg-primary" : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                    variant={plan.popular ? "default" : "secondary"}
                  >
                    <Link href={plan.href}>
                      {plan.cta} <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Plans Include */}
        <div className="bg-muted/30 rounded-2xl p-8 border border-border">
          <h3 className="text-lg font-bold text-foreground text-center mb-6">
            All Plans Include
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {includedInAll.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Have questions about pricing?{" "}
            <Link
              href="#faq"
              className="text-primary font-medium hover:underline"
            >
              Check our FAQ
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
