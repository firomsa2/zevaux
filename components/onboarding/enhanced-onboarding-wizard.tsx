"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { useToast } from "@/hooks/use-toast";
import {
  BusinessInfoSubSteps,
  type BusinessInfoFormData,
} from "./business-info-substeps";
import { PhoneVerificationStep } from "./phone-verification-step";
import { TestCallStep } from "./test-call-step";
import { WebsiteUrlStep } from "./website-url-step";
import { PlansOverview } from "@/components/billing/plans-overview";
import type { Business, Plan } from "@/types/database";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

interface EnhancedOnboardingWizardProps {
  userId: string;
  business: Business;
}

type OnboardingStep =
  | "website_url"
  | "business_info"
  | "phone_verification"
  | "test_call"
  | "pricing";

export function EnhancedOnboardingWizard({
  userId,
  business: initialBusiness,
}: EnhancedOnboardingWizardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [business, setBusiness] = useState<Business>(initialBusiness);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("website_url");
  const [loading, setLoading] = useState(true); // Start with loading to fetch progress
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(
    new Set()
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [businessConfig, setBusinessConfig] = useState<any>(null);
  const [phoneData, setPhoneData] = useState({
    phoneNumber: initialBusiness.phone_main || null,
    status: "pending" as "pending" | "in_progress" | "completed" | "failed",
    error: null as string | null,
  });

  const parseBusinessConfig = (raw: unknown) => {
    if (raw == null) return null;
    if (typeof raw === "object") return raw;
    if (typeof raw !== "string") return null;

    const tryParse = (value: string) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    };

    let current: unknown = raw;

    // Handle config values that are stored as JSON strings (sometimes double-encoded).
    for (let i = 0; i < 3 && typeof current === "string"; i++) {
      const parsed = tryParse(current);
      if (parsed == null) break;
      current = parsed;
    }

    return typeof current === "object" ? current : null;
  };

  const fetchLatestBusinessConfig = async (businessId: string) => {
    const supabase = createClient();

    const fetchFrom = async (table: string) => {
      const { data, error } = await supabase
        .from(table)
        .select("config, updated_at")
        .eq("business_id", businessId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return { data, error };
    };

    const primary = await fetchFrom("business_configs");
    const primaryConfig = primary.data?.config;

    if (primaryConfig) {
      setBusinessConfig(parseBusinessConfig(primaryConfig));
      return;
    }

    // Fallback for older DBs / different table naming.
    const fallback = await fetchFrom("business_config");
    const fallbackConfig = fallback.data?.config;

    if (fallbackConfig) {
      setBusinessConfig(parseBusinessConfig(fallbackConfig));
    }
  };

  // Fetch onboarding progress on mount to determine starting step
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // First, check if a phone number already exists and set phone_main if needed
        const phoneStatusResponse = await fetch(
          `/api/phone/status/${business.id}`
        );
        if (phoneStatusResponse.ok) {
          const phoneStatus = await phoneStatusResponse.json();
          if (phoneStatus.status === "completed" && phoneStatus.phoneNumber) {
            // Phone exists and is active - update phone data
            setPhoneData({
              phoneNumber: phoneStatus.phoneNumber,
              status: "completed",
              error: null,
            });
          }
        }

        const response = await fetch("/api/onboarding/progress");
        if (response.ok) {
          const progress = await response.json();

          // Determine completed steps
          const completed = new Set<OnboardingStep>();
          if (progress.steps) {
            progress.steps.forEach((step: any) => {
              if (step.completed) {
                // Map step IDs to onboarding step types
                if (step.id === "website_training")
                  completed.add("website_url");
                if (step.id === "business_info") completed.add("business_info");
                if (step.id === "phone_verification")
                  completed.add("phone_verification");
                if (step.id === "test_call") completed.add("test_call");
              }
            });
          }
          setCompletedSteps(completed);

          // Determine current step based on progress
          const currentProgressStep = progress.currentStep;
          if (currentProgressStep) {
            // Map progress step ID to onboarding step
            if (currentProgressStep.id === "website_training") {
              setCurrentStep("website_url");
            } else if (currentProgressStep.id === "business_info") {
              setCurrentStep("business_info");
            } else if (currentProgressStep.id === "phone_verification") {
              setCurrentStep("phone_verification");
            } else if (currentProgressStep.id === "test_call") {
              setCurrentStep("test_call");
            } else if (currentProgressStep.id === "go_live") {
              setCurrentStep("pricing");
            } else {
              // Default: start from website_url if not completed
              setCurrentStep(
                completed.has("website_url") ? "business_info" : "website_url"
              );
            }
          } else {
            // If no current step, determine from completed steps
            if (completed.has("website_url")) {
              setCurrentStep("business_info");
            } else {
              setCurrentStep("website_url");
            }
          }
        }

        // Fetch plans from database
        const supabase = createClient();
        const { data: plansData, error: plansError } = await supabase
          .from("plans")
          .select("*")
          .order("monthly_price", { ascending: true });

        if (!plansError && plansData) {
          setPlans(plansData);

          // Get current plan if business has a billing_plan
          if (business.billing_plan) {
            const currentPlanData = plansData.find(
              (p) => p.id === business.billing_plan
            );
            if (currentPlanData) {
              setCurrentPlan(currentPlanData);
            }
          }
        }

        // Fetch latest business config (scraped website data)
        await fetchLatestBusinessConfig(business.id);
      } catch (error) {
        console.error("Error fetching onboarding progress:", error);
        // Fallback to checking business.website
        setCurrentStep(
          initialBusiness.website ? "business_info" : "website_url"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [initialBusiness.website, business.id, business.billing_plan]);

  const steps: { id: OnboardingStep; label: string }[] = [
    { id: "website_url", label: "Website" },
    { id: "business_info", label: "Business Info" },
    { id: "phone_verification", label: "Phone Setup" },
    { id: "test_call", label: "Test Call" },
    { id: "pricing", label: "Select Plan" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Poll for phone provisioning status
  useEffect(() => {
    if (currentStep === "phone_verification") {
      // If status is pending, check immediately for existing phone
      if (phoneData.status === "pending") {
        const checkExistingPhone = async () => {
          try {
            const response = await fetch(`/api/phone/status/${business.id}`);
            if (response.ok) {
              const data = await response.json();

              // Map API status to frontend status
              let status = data.status;
              if (data.status === "completed" || data.status === "active") {
                status = "completed";
              } else if (data.status === "provisioning") {
                status = "in_progress";
              }

              setPhoneData({
                phoneNumber: data.phoneNumber,
                status: status,
                error: data.error,
              });

              if (status === "completed" && data.phoneNumber) {
                // When phone is completed, explicitly mark it as verified in the database
                // The status API should have set phone_main, but we also call mark-phone-verified to be sure
                try {
                  await fetch("/api/onboarding/mark-phone-verified", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      businessId: business.id,
                      phoneNumber: data.phoneNumber,
                    }),
                  });
                } catch (error) {
                  console.error("[v0] Error marking phone verified:", error);
                }

                toast({
                  title: "Success",
                  description: `Phone number ${data.phoneNumber} is ready!`,
                });
              }
            }
          } catch (error) {
            console.error("[v0] Error checking phone status:", error);
          }
        };

        checkExistingPhone();
      }

      // If status is in_progress, poll continuously
      if (phoneData.status === "in_progress") {
        const interval = setInterval(async () => {
          try {
            const response = await fetch(`/api/phone/status/${business.id}`);
            if (response.ok) {
              const data = await response.json();

              // Map API status to frontend status
              let status = data.status;
              if (data.status === "active") status = "completed";
              if (data.status === "provisioning") status = "in_progress";

              setPhoneData({
                phoneNumber: data.phoneNumber,
                status: status,
                error: data.error,
              });

              if (status === "completed") {
                // When phone is completed, explicitly mark it as verified in the database
                if (data.phoneNumber) {
                  try {
                    await fetch("/api/onboarding/mark-phone-verified", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        businessId: business.id,
                        phoneNumber: data.phoneNumber,
                      }),
                    });
                  } catch (error) {
                    console.error("[v0] Error marking phone verified:", error);
                  }
                }

                toast({
                  title: "Success",
                  description: `Phone number ${data.phoneNumber} provisioned!`,
                });
                clearInterval(interval);
              } else if (status === "failed") {
                toast({
                  title: "Error",
                  description: data.error || "Phone provisioning failed",
                  variant: "destructive",
                });
                clearInterval(interval);
              }
            }
          } catch (error) {
            console.error("[v0] Error polling phone status:", error);
            clearInterval(interval);
          }
        }, 1000); // Check every second to be snappier

        return () => clearInterval(interval);
      }
    }
  }, [currentStep, phoneData.status, business.id, toast]);

  const handleWebsiteUrlComplete = async (url: string) => {
    setLoading(true);
    try {
      // Mark website_url as completed
      setCompletedSteps((prev) => new Set(prev).add("website_url"));

      // Poll for business info update (optional, but good if analysis is fast)
      // or just fetch once.
      const supabase = createClient();

      // Wait a moment for webhook to potentially process
      // In a real scenario, we might show a "Analyzing..." loading state for a few seconds
      // But since we returned immediately from API, we'll try to fetch.
      // If it's not ready, the user will just see empty fields.

      // Delay 2 seconds to give valid time for database update if it's very fast
      await new Promise((r) => setTimeout(r, 2000));

      const { data: updatedBusiness } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", business.id)
        .single();

      if (updatedBusiness) {
        setBusiness(updatedBusiness);

        // Also fetch updated config (webhook may have just written it)
        await fetchLatestBusinessConfig(business.id);

        toast({
          title: "Analysis Complete",
          description: "We've pre-filled your business information.",
        });
      }

      setCurrentStep("business_info");
    } catch (err) {
      console.error("Error fetching updated business info:", err);
      // Proceed anyway
      setCurrentStep("business_info");
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessInfoComplete = async (formData: BusinessInfoFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Save business info
      const saveResponse = await fetch("/api/onboarding/save-business-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          formData,
        }),
      });

      if (!saveResponse.ok) {
        const data = await saveResponse.json();
        throw new Error(data.error || "Failed to save business information");
      }

      // Mark business_info as completed
      setCompletedSteps((prev) => new Set(prev).add("business_info"));

      toast({
        title: "Success",
        description: "Business information saved",
      });

      // Trigger phone provisioning in the background
      try {
        const provisionResponse = await fetch("/api/phone/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId: business.id }),
        });

        if (provisionResponse.ok) {
          const provisionData = await provisionResponse.json();
          // If we got the number back immediately, use it
          if (provisionData.phoneNumber) {
            setPhoneData({
              phoneNumber: provisionData.phoneNumber,
              status: "completed",
              error: null,
            });
            toast({
              title: "Success",
              description: `Phone number ${provisionData.phoneNumber} assigned!`,
            });
          } else {
            // Otherwise fallback to polling
            setPhoneData({
              phoneNumber: null,
              status: "in_progress",
              error: null,
            });
          }
        } else {
          // If already requested or other error, just ignore for now or handle gracefully
          const errorData = await provisionResponse.json();
          // Actually if it fails we might want to let user retry in next step
          console.log("Provision request result:", errorData);
        }
      } catch (provisionError) {
        console.error("[v0] Phone provisioning error:", provisionError);
        setPhoneData({
          phoneNumber: null,
          status: "failed",
          error: "Failed to initiate provisioning",
        });
      }

      // Move to next step
      setCurrentStep("phone_verification");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete business setup"
      );
      toast({
        title: "Error",
        description: error || "Failed to save business information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerified = async () => {
    try {
      // Explicitly mark phone as verified in the database
      // This ensures phone_main is set and onboarding progress is updated
      const response = await fetch("/api/onboarding/mark-phone-verified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          phoneNumber: phoneData.phoneNumber,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("[v0] Failed to mark phone verified:", data.error);
        toast({
          title: "Warning",
          description: "Phone verified but progress may not have been saved",
          variant: "destructive",
        });
      } else {
        console.log("[v0] Phone verification saved to database");
      }

      // Update local state
      setCompletedSteps((prev) => new Set(prev).add("phone_verification"));
      setCurrentStep("test_call");
    } catch (error) {
      console.error("[v0] Error verifying phone:", error);
      // Still proceed even if save fails
      setCompletedSteps((prev) => new Set(prev).add("phone_verification"));
      setCurrentStep("test_call");
    }
  };

  const handleTestCallComplete = async () => {
    try {
      // Save test call completion to database
      const response = await fetch("/api/onboarding/mark-test-call-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to save test call completion:", data.error);
        toast({
          title: "Warning",
          description:
            "Test call completed but progress may not have been saved",
          variant: "destructive",
        });
      }

      // Mark test_call as completed in local state
      setCompletedSteps((prev) => new Set(prev).add("test_call"));
      // Instead of finishing, go to Pricing
      setCurrentStep("pricing");
    } catch (error) {
      console.error("Error saving test call completion:", error);
      // Still proceed with UI update even if save fails
      setCompletedSteps((prev) => new Set(prev).add("test_call"));
      setCurrentStep("pricing");
    }
  };

  const handlePricingComplete = () => {
    // Finalize onboarding
    toast({
      title: "Congratulations!",
      description: "Your AI receptionist is live and ready to take calls",
    });
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center p-2">
      <div className="w-full max-w-4xl">
        {/* Header */}
        {/* <div className="mb-2 text-center">
          <h1 className="text-3xl font-bold mb-1">Welcome to Zevaux</h1>
          <p className="text-muted-foreground">
            Let's get your AI receptionist up and running
          </p>
        </div> */}

        {/* Progress */}
        <div className="mb-0">
          <Stepper
            steps={steps}
            currentStepIndex={currentStepIndex}
            completedSteps={Array.from(completedSteps)}
          />
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Step Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading onboarding progress...
            </p>
          </div>
        ) : (
          <div
            className={
              currentStep === "pricing"
                ? ""
                : "bg-white rounded-lg shadow-sm p-0"
            }
          >
            {currentStep === "website_url" &&
              !completedSteps.has("website_url") && (
                <WebsiteUrlStep
                  businessId={business.id}
                  onComplete={handleWebsiteUrlComplete}
                  loading={loading}
                />
              )}

            {/* If website_url is completed but we're somehow on that step, redirect */}
            {currentStep === "website_url" &&
              completedSteps.has("website_url") && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Website training already completed!
                  </p>
                  <Button onClick={() => setCurrentStep("business_info")}>
                    Continue to Business Info
                  </Button>
                </div>
              )}

            {currentStep === "business_info" && (
              <BusinessInfoSubSteps
                business={business}
                scrapedConfig={businessConfig}
                onComplete={handleBusinessInfoComplete}
                onCancel={() => setCurrentStep("website_url")}
                loading={loading}
                error={error}
              />
            )}

            {currentStep === "phone_verification" && (
              <PhoneVerificationStep
                businessId={business.id}
                phoneNumber={phoneData.phoneNumber}
                provisioningStatus={phoneData.status}
                provisioningError={phoneData.error}
                onNext={handlePhoneVerified}
                onBack={() => setCurrentStep("business_info")}
                loading={loading}
                onRetrySuccess={(phoneNumber) => {
                  setPhoneData({
                    phoneNumber: phoneNumber,
                    status: "completed",
                    error: null,
                  });
                }}
              />
            )}

            {currentStep === "test_call" && (
              <TestCallStep
                businessId={business.id}
                phoneNumber={phoneData.phoneNumber || "Provisioning..."}
                businessName={business.name}
                agentName={business.assistant_name || "Your AI Receptionist"}
                onNext={handleTestCallComplete}
                onBack={() => setCurrentStep("phone_verification")}
                loading={loading}
              />
            )}

            {currentStep === "pricing" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-4">Select a Plan</h2>
                  {plans && Array.isArray(plans) && plans.length > 0 ? (
                    <PlansOverview
                      business={business}
                      currentPlan={currentPlan}
                      plans={plans}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Loading plans...
                      </p>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handlePricingComplete} size="lg">
                      Complete Setup
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Need help?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
