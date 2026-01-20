"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { toast } from "@/lib/toast";
import {
  BusinessInfoSubSteps,
  type BusinessInfoFormData,
} from "./business-info-substeps";
import { PhoneVerificationStep } from "./phone-verification-step";
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
  | "pricing";

export function EnhancedOnboardingWizard({
  userId,
  business: initialBusiness,
}: EnhancedOnboardingWizardProps) {
  const router = useRouter();

  const [business, setBusiness] = useState<Business>(initialBusiness);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("website_url");
  const [loading, setLoading] = useState(true); // Start with loading to fetch progress
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(
    new Set(),
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [businessConfig, setBusinessConfig] = useState<any>(null);
  const [phoneData, setPhoneData] = useState({
    phoneNumber: initialBusiness.phone_main || null,
    // Initialize as "completed" if phone already exists, otherwise "pending"
    status: initialBusiness.phone_main
      ? ("completed" as "pending" | "in_progress" | "completed" | "failed")
      : ("pending" as "pending" | "in_progress" | "completed" | "failed"),
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
          `/api/phone/status/${business.id}`,
        );
        let phoneAlreadyExists = false;
        if (phoneStatusResponse.ok) {
          const phoneStatus = await phoneStatusResponse.json();
          if (
            (phoneStatus.status === "completed" ||
              phoneStatus.status === "active") &&
            phoneStatus.phoneNumber
          ) {
            // Phone exists and is active - update phone data
            setPhoneData({
              phoneNumber: phoneStatus.phoneNumber,
              status: "completed",
              error: null,
            });
            phoneAlreadyExists = true;
          }
        }

        const response = await fetch("/api/onboarding/progress");
        if (response.ok) {
          const progress = await response.json();

          // Initialize phone data from progress API if available
          if (progress.phoneNumber && progress.phoneProvisioningStatus) {
            const mappedStatus =
              progress.phoneProvisioningStatus === "active"
                ? "completed"
                : progress.phoneProvisioningStatus;
            setPhoneData({
              phoneNumber: progress.phoneNumber,
              status: mappedStatus,
              error: progress.phoneProvisioningError || null,
            });
            if (mappedStatus === "completed") {
              phoneAlreadyExists = true;
            }
          }

          // Determine completed steps from API response
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
                if (step.id === "go_live") completed.add("pricing");
              }
            });
          }

          // Also mark phone_verification as completed if phone exists (even if flag not set)
          if (phoneAlreadyExists) {
            completed.add("phone_verification");
          }

          setCompletedSteps(completed);

          // Determine current step based on progress - resume from where user left off
          const currentProgressStep = progress.currentStep;
          if (currentProgressStep) {
            // Map progress step ID to onboarding step
            if (currentProgressStep.id === "website_training") {
              setCurrentStep("website_url");
            } else if (currentProgressStep.id === "business_info") {
              setCurrentStep("business_info");
            } else if (currentProgressStep.id === "phone_verification") {
              setCurrentStep("phone_verification");
            } else if (currentProgressStep.id === "go_live") {
              setCurrentStep("pricing");
            } else {
              // Default: find first incomplete step
              if (!completed.has("website_url")) {
                setCurrentStep("website_url");
              } else if (!completed.has("business_info")) {
                setCurrentStep("business_info");
              } else if (!completed.has("phone_verification")) {
                setCurrentStep("phone_verification");
              } else {
                setCurrentStep("pricing");
              }
            }
          } else {
            // If no current step from API, determine from completed steps
            if (!completed.has("website_url")) {
              setCurrentStep("website_url");
            } else if (!completed.has("business_info")) {
              setCurrentStep("business_info");
            } else if (!completed.has("phone_verification")) {
              setCurrentStep("phone_verification");
            } else {
              setCurrentStep("pricing");
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
              (p) => p.id === business.billing_plan,
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
          initialBusiness.website ? "business_info" : "website_url",
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

                toast.success(`Phone number ${data.phoneNumber} is ready!`);
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

                // toast.success(`Phone number ${data.phoneNumber} provisioned!`);
                clearInterval(interval);
              } else if (status === "failed") {
                toast.error(data.error || "Phone provisioning failed");
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
  }, [currentStep, phoneData.status, business.id]);

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

        toast.success("We've pre-filled your business information.");
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

      // Update local business state to reflect changes
      setBusiness((prev) => ({
        ...prev,
        name: formData.businessName,
        industry:
          formData.industry === "other"
            ? formData.industryOther || "Other"
            : formData.industry,
        timezone: formData.timezone,
        description: formData.businessDescription,
        assistant_name: formData.agentName,
        personalized_greeting: formData.personalizedGreeting,
        escalation_number: formData.transferCallsEnabled
          ? formData.escalationNumber
          : null,
      }));

      toast.success("Business information saved!");

      // Only trigger phone provisioning if phone doesn't already exist
      // The API endpoint is idempotent, but we avoid unnecessary calls
      const phoneAlreadyExists =
        phoneData.status === "completed" && phoneData.phoneNumber;

      if (!phoneAlreadyExists && !completedSteps.has("phone_verification")) {
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

              // Show different message if phone already existed
              if (provisionData.alreadyExists) {
                toast.info(`Your phone number ${provisionData.phoneNumber} is already assigned.`);
              } else {
                toast.success(`Phone number ${provisionData.phoneNumber} assigned!`);
              }
            } else {
              // Otherwise fallback to polling
              setPhoneData({
                phoneNumber: null,
                status: "in_progress",
                error: null,
              });
            }
          } else {
            // If already requested or other error, check status instead
            const errorData = await provisionResponse.json();
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
      } else {
        // Phone already exists, just log it
        console.log(
          "[v0] Phone already exists, skipping provisioning:",
          phoneData.phoneNumber,
        );
      }

      // Move to next step
      setCurrentStep("phone_verification");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete business setup",
      );
      toast.error(error || "Failed to save business information");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerified = async () => {
    try {
      // Ensure we use the active phone saved in phone_endpoints (authoritative source)
      let phoneNumberToSave = phoneData.phoneNumber;

      if (!phoneNumberToSave) {
        const statusRes = await fetch(`/api/phone/status/${business.id}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.phoneNumber) {
            phoneNumberToSave = statusData.phoneNumber;
            setPhoneData((prev) => ({
              ...prev,
              phoneNumber: statusData.phoneNumber,
              status:
                statusData.status === "active" ? "completed" : prev.status,
            }));
          }
        }
      }

      // Explicitly mark phone as verified in the database
      // This ensures phone_main is set and onboarding progress is updated
      const response = await fetch("/api/onboarding/mark-phone-verified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          phoneNumber: phoneNumberToSave,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("[v0] Failed to mark phone verified:", data.error);
        toast.warning("Phone verified but progress may not have been saved");
      } else {
        console.log("[v0] Phone verification saved to database");
      }

      // Update local state and go directly to pricing
      setCompletedSteps((prev) => new Set(prev).add("phone_verification"));
      setCurrentStep("pricing");
    } catch (error) {
      console.error("[v0] Error verifying phone:", error);
      // Still proceed even if save fails
      setCompletedSteps((prev) => new Set(prev).add("phone_verification"));
      setCurrentStep("pricing");
    }
  };

  const handlePricingComplete = () => {
    // Finalize onboarding
    toast.success("Congratulations! Your AI receptionist is live and ready to take calls!");
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center p-2 pt-1 md:p-4 md:pt-0 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-5xl space-y-4">
        {/* Header - Optional, can be uncommented if needed */}
        {/* <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Setup Your Receptionist</h1> 
        </div> */}

        {/* Progress */}
        <div className="w-full max-w-3xl mx-auto">
          <Stepper
            steps={steps}
            currentStepIndex={currentStepIndex}
            completedSteps={Array.from(completedSteps)}
            onStepClick={(stepId, stepIndex) => {
              // Allow navigation to any step that is completed
              // or the current step
              const step = steps[stepIndex];
              // Calculate effective completion status
              // Users can go back to completed steps
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = step.id === currentStep;

              if (isCompleted || isCurrent) {
                setCurrentStep(step.id);
              }
            }}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step Content */}
        {loading ? (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground font-medium">
              Loading your setup...
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            {currentStep === "website_url" &&
              !completedSteps.has("website_url") && (
                <div className="max-w-3xl mx-auto">
                  <WebsiteUrlStep
                    businessId={business.id}
                    onComplete={handleWebsiteUrlComplete}
                    loading={loading}
                  />
                </div>
              )}

            {/* If website_url is completed but we're somehow on that step, redirect */}
            {currentStep === "website_url" &&
              completedSteps.has("website_url") && (
                <div className="max-w-3xl mx-auto text-center py-12 bg-white rounded-xl shadow-sm border">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Website Training Complete
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Your business information has been analyzed.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setCurrentStep("business_info")}
                  >
                    Continue to Business Info
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

            {currentStep === "business_info" && (
              <div className="max-w-3xl mx-auto">
                <BusinessInfoSubSteps
                  business={business}
                  scrapedConfig={businessConfig}
                  onComplete={handleBusinessInfoComplete}
                  onCancel={() => setCurrentStep("website_url")}
                  loading={loading}
                  error={error}
                />
              </div>
            )}

            {currentStep === "phone_verification" && (
              <div className="max-w-4xl mx-auto">
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
                  businessName={business.name}
                />
              </div>
            )}

            {currentStep === "pricing" && (
              <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                {/* Full width for pricing to show 3 cards */}
                <div className="">
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      Choose Your Plan
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                      Select a plan to activate your AI receptionist. You can
                      change this anytime.
                    </p>
                  </div>

                  {plans && Array.isArray(plans) && plans.length > 0 ? (
                    <PlansOverview
                      business={business}
                      currentPlan={currentPlan}
                      plans={plans}
                    />
                  ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Loading plans...</p>
                    </div>
                  )}
                  {/* Note: The Complete Setup button is moved to within the plans or below them if needed */}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
