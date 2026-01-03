"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Shield, Users, Star, BadgeCheck } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    description: "Perfect for small businesses",
    price: "$49",
    period: "/month",
    popular: false,
    gradient: "from-gray-500 to-gray-600",
    features: [
      { text: "500 minutes/month", included: true },
      { text: "24/7 Call Answering", included: true },
      { text: "Appointment Booking", included: true },
      { text: "Basic Analytics", included: true },
      { text: "Email Support", included: true },
      { text: "CRM Integration", included: false },
      { text: "Multilingual Support", included: false },
      { text: "Advanced Routing", included: false },
    ],
    cta: "Get 500 Free Minutes",
    trial: "Includes 500 free minutes",
  },
  {
    name: "Professional",
    description: "Best for growing businesses",
    price: "$99",
    period: "/month",
    popular: true,
    gradient: "from-primary to-primary/70",
    features: [
      { text: "2,000 minutes/month", included: true },
      { text: "Everything in Starter", included: true },
      { text: "CRM Integration", included: true },
      { text: "Multilingual Support", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Priority Support", included: true },
      { text: "Custom AI Training", included: true },
      { text: "API Access", included: true },
    ],
    cta: "Get Started",
    trial: "Most Popular Choice",
  },
];

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual"
  );

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business. Get started with 500 free
            minutes.
          </p>

          {/* Billing Toggle */}
          {/* <div className="inline-flex items-center gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-8">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 rounded-full ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "annual" ? "default" : "ghost"}
              onClick={() => setBillingCycle("annual")}
              className={`px-6 rounded-full ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Save 20%
              </span>
            </Button>
          </div> */}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan, index) => (
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <Card
                className={`h-full p-8 border-2 transition-all duration-300 ${
                  plan.popular
                    ? "border-primary shadow-2xl transform scale-105"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                }`}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>

                  <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    {plan.trial}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400" />
                      )}
                      <span
                        className={`${
                          feature.included
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full py-6 text-lg font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-primary/10 hover:to-primary/5 text-gray-900 dark:text-white border hover:text-accent"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Card>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        {/* <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Enterprise Solutions</h3>
              <p className="text-gray-300 mb-6">
                Need custom pricing, dedicated support, or enterprise features?
                Our team will create a tailored solution for your organization.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Custom AI model training",
                  "Dedicated infrastructure",
                  "SLA with 99.9% uptime guarantee",
                  "White-label solutions",
                  "Advanced security & compliance",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Schedule Enterprise Demo
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Average Setup", value: "2 Days" },
                { label: "Dedicated Support", value: "24/7" },
                { label: "Minimum Contract", value: "12 Months" },
                { label: "Custom Terms", value: "Available" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Trust Badges */}
        {/* <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Trusted by 5,000+ businesses worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              "SOC2 Certified",
              "HIPAA Compliant",
              "GDPR Ready",
              "24/7 Support",
              "99.9% Uptime",
              "Money-Back Guarantee",
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
