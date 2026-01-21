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

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      monthlyPrice: 47.99,
      annualPrice: 37.99,
      description:
        "Perfect for small businesses and solo owners who need calls answered when they can't.",
      popular: false,
      features: [
        "Unlimited minutes",
        "Custom greeting & agent name",
        "Message taking with custom questions",
        "Bilingual support (English & Spanish)",
        "Email & SMS notifications",
        "Call recordings & transcripts",
        "Custom FAQs & answers",
        "Spam filtering",
        "Choose your area code",
        "Zapier integration",
      ],
      cta: "Start Free Trial",
      href: "/signup",
    },
    {
      name: "Pro",
      icon: Crown,
      monthlyPrice: 97.99,
      annualPrice: 87.99,
      description:
        "For growing businesses that want Zevaux to answer calls and take action on their behalf.",
      popular: true,
      features: [
        "Everything in Professional, plus:",
        "Appointment booking integration",
        "Google Calendar, Calendly, Acuity",
        "Call transfers to your team",
        "Send text links during calls",
        "Warm transfers",
        "Priority support",
        "Advanced call routing",
        "Custom integrations",
        "Detailed analytics dashboard",
      ],
      cta: "Start Free Trial",
      href: "/signup",
    },
    {
      name: "Enterprise",
      icon: Building,
      monthlyPrice: null,
      annualPrice: null,
      description:
        "For complex or multi-location businesses needing custom solutions and advanced training.",
      popular: false,
      features: [
        "Everything in Scale, plus:",
        "Multiple locations support",
        "Multi-unit franchises",
        "Fully custom AI prompts",
        "Advanced agent training",
        "Training file uploads",
        "Dedicated account manager",
        "Custom SLA guarantees",
        "White-label options",
        "Enterprise SSO & security",
      ],
      cta: "Contact Sales",
      href: "/contact",
    },
  ];

  const includedInAll = [
    "Unlimited minutes on all plans",
    "AI trained on your specific business",
    "Available 24/7/365",
    "Enterprise-grade security",
    "No setup fees",
    "Cancel anytime",
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      </div>

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
            Start with a 7-day free trial. No credit card required. All features
            included.
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
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "border-primary bg-gradient-to-b from-primary/5 via-card to-card shadow-xl lg:scale-105 z-10"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-lg">
                      <Crown className="h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
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
                    {price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          ${price}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                        {isAnnual && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            ${plan.monthlyPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-foreground">
                        Custom
                      </div>
                    )}
                    {isAnnual && price !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed annually (${price * 12}/year)
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className={`w-full mb-8 ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                    size="lg"
                  >
                    <Link
                      href={plan.href}
                      className="flex items-center justify-center gap-2"
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <Check
                          className={`h-5 w-5 flex-shrink-0 ${
                            plan.popular
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
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
