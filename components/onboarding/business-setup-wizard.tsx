"use client";

import type React from "react";

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
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import type { Business } from "@/types/database";

const SETUP_STEPS = [
  {
    id: "business_info",
    title: "Business Information",
    description: "Tell us more about your business",
  },
  {
    id: "receptionist_config",
    title: "Configure Receptionist",
    description: "Set up your AI receptionist preferences",
  },
  {
    id: "payment",
    title: "Payment Method",
    description: "Add your payment information",
  },
  {
    id: "complete",
    title: "Setup Complete",
    description: "You're all set!",
  },
];

interface BusinessSetupWizardProps {
  userId: string;
  business: Business;
  selectedPlan: string;
}

export function BusinessSetupWizard({
  userId,
  business,
  selectedPlan,
}: BusinessSetupWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: business.name || "",
    industry: business.industry || "",
    timezone: business.timezone || "UTC",
    assistantName: business.assistant_name || "Zevaux Assistant",
    description: business.description || "",
  });

  const progress = ((currentStep + 1) / SETUP_STEPS.length) * 100;
  const step = SETUP_STEPS[currentStep];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    setError(null);

    if (currentStep === 2 && selectedPlan === "pro") {
      setLoading(true);
      try {
        const saveResponse = await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            businessId: business.id,
            formData,
            selectedPlan,
            isProCheckout: true, // Flag to indicate we'll handle Stripe separately
          }),
        });

        if (!saveResponse.ok) {
          const data = await saveResponse.json();
          setError(data.error || "Failed to save business data");
          setLoading(false);
          return;
        }

        // Now proceed to checkout
        const checkoutResponse = await fetch("/api/stripe/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId: business.id, planSlug: "pro" }),
        });

        const checkoutData = await checkoutResponse.json();

        if (checkoutData.url) {
          // Redirect to Stripe checkout
          window.location.href = checkoutData.url;
          return;
        } else if (checkoutData.error) {
          setError(checkoutData.error);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("[v0] Checkout error:", err);
        setError("Failed to initiate checkout. Please try again.");
        setLoading(false);
        return;
      }
    }

    if (currentStep < SETUP_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding for Starter plan
      setLoading(true);
      try {
        const response = await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            businessId: business.id,
            formData,
            selectedPlan,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to complete onboarding");
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("[v0] Error completing onboarding:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to complete setup. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        {/* Header */}
        <CardHeader>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle className="text-2xl">{step.title}</CardTitle>
                <CardDescription className="mt-2">
                  {step.description}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  Step {currentStep + 1} of {SETUP_STEPS.length}
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Step 1: Business Info */}
          {currentStep === 0 && (
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your business name"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="industry">Industry</FieldLabel>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g., Healthcare, Legal, Consulting"
                />
                <FieldDescription>
                  This helps us tailor the AI responses to your industry
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                <Input
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  placeholder="UTC"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">
                  Business Description
                </FieldLabel>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="What does your business do?"
                />
                <FieldDescription>
                  Optional: Helps personalize the receptionist
                </FieldDescription>
              </Field>
            </FieldGroup>
          )}

          {/* Step 2: Receptionist Config */}
          {currentStep === 1 && (
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="assistantName">Assistant Name</FieldLabel>
                <Input
                  id="assistantName"
                  name="assistantName"
                  value={formData.assistantName}
                  onChange={handleInputChange}
                  placeholder="e.g., Sarah, Michael"
                />
                <FieldDescription>
                  The name callers will hear when they reach your receptionist
                </FieldDescription>
              </Field>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4">
                <p className="text-sm font-semibold mb-2">Plan Selected</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan === "pro" ? "Pro" : "Starter"} Plan - $
                  {selectedPlan === "pro" ? "79" : "29"}/month
                </p>
              </div>

              <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4">
                <p className="text-sm font-semibold mb-3">What's included:</p>
                <ul className="space-y-2">
                  {selectedPlan === "pro" ? (
                    <>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        2000 minutes per month
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Up to 5 phone numbers
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        SMS, Web Chat & Voice
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Analytics & API access
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        500 minutes per month
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />1
                        phone number
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Voice & voicemail
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        14-day free trial
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </FieldGroup>
          )}

          {/* Step 3: Payment */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {selectedPlan === "pro" && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4">
                  <p className="text-sm font-semibold mb-2">
                    Payment Required for Pro Plan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Complete your setup by adding a payment method to activate
                    your Pro plan.
                  </p>
                </div>
              )}

              {selectedPlan === "starter" && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
                  <p className="text-sm font-semibold mb-2">
                    Free Trial Starts Now
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You're starting with a 14-day free trial of the Starter
                    plan. No credit card required.
                  </p>
                </div>
              )}

              <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Plan:</span>
                  <span className="text-sm">
                    {selectedPlan === "pro" ? "Pro" : "Starter"}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-sm font-semibold">
                    {selectedPlan === "starter"
                      ? "Free for 14 days"
                      : "Monthly charge"}
                  </span>
                  <span className="text-sm font-semibold">
                    {selectedPlan === "starter"
                      ? "$0"
                      : `$${selectedPlan === "pro" ? "79" : "29"}`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {selectedPlan === "starter"
                  ? "After 14 days, your payment method will be charged $29/month."
                  : "We'll process your payment and activate your Pro plan immediately."}
              </p>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Setup Complete!</h3>
              <p className="text-muted-foreground">
                Your AI receptionist is ready to handle calls. You'll be
                redirected to your dashboard to configure phone numbers and
                other settings.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className="flex-1 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={loading} className="flex-1">
              {currentStep === SETUP_STEPS.length - 1 ? (
                <>Go to Dashboard</>
              ) : currentStep === 2 && selectedPlan === "pro" ? (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
