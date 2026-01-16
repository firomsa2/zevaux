"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses",
    price: "$97",
    priceId: "price_starter_monthly",
    minutes: 500,
    features: [
      "500 minutes/month",
      "1 phone number",
      "Basic analytics",
      "Email support",
      "Knowledge base (basic)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams",
    price: "$197",
    priceId: "price_pro_monthly",
    minutes: 1500,
    featured: true,
    features: [
      "1,500 minutes/month",
      "3 phone numbers",
      "Advanced analytics",
      "SMS & WhatsApp",
      "Priority support",
      "Custom voice profiles",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    priceId: "custom",
    minutes: 5000,
    features: [
      "Unlimited minutes",
      "Unlimited phone numbers",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "SLA guarantee",
      "Custom contract",
    ],
  },
];

export function UpdatedPlansOverview({ currentPlan, onSelectPlan }: any) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (priceId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: currentPlan?.business_id,
          priceId,
        }),
      });

      const data = await response.json();
      if (data.session_id) {
        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.session_id}`;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`card border-2 flex flex-col relative ${
              plan.featured ? "border-accent md:scale-105" : "border-border"
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-text-secondary text-sm mb-6">
              {plan.description}
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.price !== "Custom" && (
                <span className="text-text-secondary">/month</span>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleUpgrade(plan.priceId)}
              disabled={loading || currentPlan?.billing_plan === plan.id}
              className={
                plan.featured ? "btn-primary w-full" : "btn-secondary w-full"
              }
            >
              {currentPlan?.billing_plan === plan.id
                ? "Current Plan"
                : "Get Started"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
