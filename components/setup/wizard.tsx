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
import { Progress } from "@/components/ui/progress";
import { StepPhoneNumber } from "./steps/step-phone-number";
import { StepVoiceConfig } from "./steps/step-voice-config";
import { StepGreeting } from "./steps/step-greeting";
import { StepBusinessHours } from "./steps/step-business-hours";
import { StepFallback } from "./steps/step-fallback";
import { StepKnowledgeBase } from "./steps/step-knowledge-base";
import { StepReview } from "./steps/step-review";
import { createClient } from "@/utils/supabase/client";

const STEPS = [
  {
    id: 1,
    title: "Phone Number",
    description: "Assign or connect your phone number",
  },
  {
    id: 2,
    title: "Voice Configuration",
    description: "Choose voice tone and language",
  },
  { id: 3, title: "Greeting Message", description: "Set your custom greeting" },
  { id: 4, title: "Business Hours", description: "Configure operating hours" },
  { id: 5, title: "Fallback Contact", description: "Set escalation contact" },
  {
    id: 6,
    title: "Knowledge Base",
    description: "Upload business information",
  },
  { id: 7, title: "Review & Launch", description: "Review and activate" },
];

interface WizardConfig {
  phone_number: string;
  voice_tone: string;
  language: string;
  voice_gender: string;
  greeting_message: string;
  business_hours_start: string;
  business_hours_end: string;
  timezone: string;
  fallback_email: string;
  fallback_phone: string;
  knowledge_base_url: string;
}

export function SetupWizard({ user, initialConfig }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const [config, setConfig] = useState<WizardConfig>({
    phone_number: initialConfig?.phone_number || "",
    voice_tone: initialConfig?.voice_tone || "professional",
    language: initialConfig?.language || "en",
    voice_gender: initialConfig?.voice_gender || "female",
    greeting_message:
      initialConfig?.greeting_message ||
      "Hello, thank you for calling. How can I help you?",
    business_hours_start: initialConfig?.business_hours_start || "09:00",
    business_hours_end: initialConfig?.business_hours_end || "17:00",
    timezone: initialConfig?.timezone || "UTC",
    fallback_email: initialConfig?.fallback_email || "",
    fallback_phone: initialConfig?.fallback_phone || "",
    knowledge_base_url: initialConfig?.knowledge_base_url || "",
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfigChange = (updates: Partial<WizardConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      if (initialConfig?.id) {
        // Update existing config
        const { error: updateError } = await supabase
          .from("receptionist_config")
          .update(config)
          .eq("id", initialConfig.id);

        if (updateError) throw updateError;
      } else {
        // Create new config
        const { error: insertError } = await supabase
          .from("receptionist_config")
          .insert({
            user_id: user.id,
            business_name: user.email?.split("@")[0] || "My Business",
            ...config,
          });

        if (insertError) throw insertError;
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save configuration"
      );
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-surface p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Setup Your AI Receptionist
          </h1>
          <p className="text-text-secondary">
            Complete these steps to activate your receptionist in 5 minutes
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Step {currentStep} of {STEPS.length}
                </span>
                <span className="text-text-secondary">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {STEPS[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {currentStep === 1 && (
              <StepPhoneNumber config={config} onChange={handleConfigChange} />
            )}
            {currentStep === 2 && (
              <StepVoiceConfig config={config} onChange={handleConfigChange} />
            )}
            {currentStep === 3 && (
              <StepGreeting config={config} onChange={handleConfigChange} />
            )}
            {currentStep === 4 && (
              <StepBusinessHours
                config={config}
                onChange={handleConfigChange}
              />
            )}
            {currentStep === 5 && (
              <StepFallback config={config} onChange={handleConfigChange} />
            )}
            {currentStep === 6 && (
              <StepKnowledgeBase
                config={config}
                onChange={handleConfigChange}
              />
            )}
            {currentStep === 7 && <StepReview config={config} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1 || loading}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Previous
          </Button>

          {currentStep === STEPS.length ? (
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? "Activating..." : "Activate Receptionist"}
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1 btn-primary">
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
