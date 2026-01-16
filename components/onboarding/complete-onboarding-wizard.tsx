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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Phone,
  Settings,
  Zap,
} from "lucide-react";
import type { Business } from "@/types/database";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";

// CHANGED: Consolidated onboarding flow with 5 critical steps for SMBs
const ONBOARDING_STEPS = [
  {
    id: "business_info",
    title: "Business Information",
    description:
      "Tell us about your business to personalize your AI receptionist",
    icon: Settings,
  },
  {
    id: "phone_setup",
    title: "Phone Number Setup",
    description:
      "Your customers will use this number to reach your AI receptionist",
    icon: Phone,
  },
  {
    id: "receptionist_config",
    title: "Receptionist Configuration",
    description: "Customize voice, greeting, and business hours",
    icon: Zap,
  },
  {
    id: "knowledge_base",
    title: "Knowledge Base",
    description: "Help the AI understand your business with documents or FAQs",
    icon: FileText,
  },
  {
    id: "test_call",
    title: "Ready to Go Live",
    description: "Review your setup and activate your AI receptionist",
    icon: CheckCircle2,
  },
];

const INDUSTRIES = [
  "Hair Salon",
  "Dental Office",
  "Medical Practice",
  "Law Firm",
  "Real Estate",
  "Consulting",
  "Cleaning Services",
  "Plumbing",
  "HVAC",
  "Accounting",
  "Restaurant",
  "Gym",
  "Other",
];

const TIMEZONES = [
  { value: "EST", label: "Eastern Standard Time (EST)" },
  { value: "CST", label: "Central Standard Time (CST)" },
  { value: "MST", label: "Mountain Standard Time (MST)" },
  { value: "PST", label: "Pacific Standard Time (PST)" },
  { value: "UTC", label: "UTC" },
];

const VOICE_TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly & Approachable" },
  { value: "energetic", label: "Energetic & Upbeat" },
];

const VOICE_GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "neutral", label: "Neutral" },
];

interface CompleteOnboardingWizardProps {
  userId: string;
  business: Business;
}

interface FormData {
  businessName: string;
  industry: string;
  timezone: string;
  description: string;
  phone_number: string;
  greetingMessage: string;
  voiceTone: string;
  voiceGender: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  knowledgeBaseUrl: string;
  businessHoursConfigured: boolean;
}

export function CompleteOnboardingWizard({
  userId,
  business,
}: CompleteOnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    businessName: business.name || "",
    industry: business.industry || "",
    timezone: business.timezone || "EST",
    description: business.description || "",
    phone_number: "",
    greetingMessage: `Thank you for calling ${
      business.name || "us"
    }. How can we help you today?`,
    voiceTone: business.tone || "professional",
    voiceGender: "female",
    businessHoursStart: "09:00",
    businessHoursEnd: "17:00",
    knowledgeBaseUrl: "",
    businessHoursConfigured: false,
  });

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const step = ONBOARDING_STEPS[currentStep];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Business Info
        if (!formData.businessName.trim()) {
          setError("Business name is required");
          return false;
        }
        if (!formData.industry) {
          setError("Please select your industry");
          return false;
        }
        return true;
      case 1: // Phone Setup
        // Phone number provisioning happens asynchronously
        // For now, we'll allow proceeding with a note
        return true;
      case 2: // Receptionist Config
        if (!formData.greetingMessage.trim()) {
          setError("Please enter a greeting message");
          return false;
        }
        return true;
      case 3: // Knowledge Base
        // Knowledge base is optional
        return true;
      case 4: // Test/Go Live
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    setError(null);

    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          businessId: business.id,
          formData: {
            ...formData,
            businessHoursConfigured: true,
            hoursStart: formData.businessHoursStart,
            hoursEnd: formData.businessHoursEnd,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete onboarding");
      }

      triggerOnboardingRefresh();
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete onboarding"
      );
      console.error("[v0] Onboarding error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-4 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to Zvaux
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Let's set up your AI receptionist in just 5 minutes
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
          {/* Progress Section */}
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {step.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {Math.round(progress)}% Complete
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />

              {/* Step Indicators */}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {ONBOARDING_STEPS.map((s, idx) => {
                  const Icon = s.icon;
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (idx <= currentStep) {
                          setCurrentStep(idx);
                        }
                      }}
                      className="group relative"
                      title={s.title}
                    >
                      <div
                        className={`flex items-center justify-center h-12 rounded-lg transition-all ${
                          isCurrent
                            ? "bg-blue-600 text-white shadow-lg"
                            : isCompleted
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <p className="text-xs font-medium mt-1 text-center text-slate-700 dark:text-slate-300 hidden group-hover:block absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white px-2 py-1 rounded z-10">
                        {s.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardHeader>

          {/* Content Section */}
          <CardContent className="pt-8 pb-8">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Business Information */}
            {currentStep === 0 && (
              <FieldGroup className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                    Tell us about your business
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    This helps us personalize your AI receptionist for your
                    specific industry.
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="businessName">
                    Business Name *
                  </FieldLabel>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                    placeholder="Your business name"
                    className="mt-2"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="industry">Industry *</FieldLabel>
                  <Select
                    value={formData.industry}
                    onValueChange={(val) => handleInputChange("industry", val)}
                  >
                    <SelectTrigger id="industry" className="mt-2">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    We'll customize responses for your industry
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <Select
                    value={formData.timezone}
                    onValueChange={(val) => handleInputChange("timezone", val)}
                  >
                    <SelectTrigger id="timezone" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">
                    Business Description
                  </FieldLabel>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="What does your business do?"
                    className="mt-2"
                  />
                  <FieldDescription>
                    Optional: Helps the AI understand your business better
                  </FieldDescription>
                </Field>
              </FieldGroup>
            )}

            {/* Step 2: Phone Number Setup */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                    Phone Number Setup
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Your customers will call this number to reach your AI
                    receptionist. Phone provisioning happens automatically.
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
                  <div className="flex gap-3">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        We'll provision your phone number automatically
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                        A dedicated phone number will be assigned to your
                        account right after setup. Your customers will call this
                        number to reach your AI receptionist.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    Setup Options
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Get a new Zevaux number
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Recommended. We provision a dedicated number for you.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Use your existing Twilio number
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Configure an existing number to route to your AI
                          receptionist.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4">
                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                        Setup Timeline
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                        Your phone number will be ready within minutes after you
                        complete setup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Receptionist Configuration */}
            {currentStep === 2 && (
              <FieldGroup className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                    Customize Your Receptionist
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Personalize how your AI receptionist greets callers and
                    interacts with customers.
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="greetingMessage">
                    Greeting Message *
                  </FieldLabel>
                  <Input
                    id="greetingMessage"
                    value={formData.greetingMessage}
                    onChange={(e) =>
                      handleInputChange("greetingMessage", e.target.value)
                    }
                    placeholder="Thank you for calling. How can we help?"
                    className="mt-2"
                  />
                  <FieldDescription>
                    What callers will hear when they reach you
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="voiceTone">Voice Tone</FieldLabel>
                  <Select
                    value={formData.voiceTone}
                    onValueChange={(val) => handleInputChange("voiceTone", val)}
                  >
                    <SelectTrigger id="voiceTone" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICE_TONES.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Choose how your receptionist should sound
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="voiceGender">Voice Gender</FieldLabel>
                  <Select
                    value={formData.voiceGender}
                    onValueChange={(val) =>
                      handleInputChange("voiceGender", val)
                    }
                  >
                    <SelectTrigger id="voiceGender" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICE_GENDERS.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="businessHoursStart">
                    Business Hours Start
                  </FieldLabel>
                  <Input
                    id="businessHoursStart"
                    type="time"
                    value={formData.businessHoursStart}
                    onChange={(e) =>
                      handleInputChange("businessHoursStart", e.target.value)
                    }
                    className="mt-2"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="businessHoursEnd">
                    Business Hours End
                  </FieldLabel>
                  <Input
                    id="businessHoursEnd"
                    type="time"
                    value={formData.businessHoursEnd}
                    onChange={(e) =>
                      handleInputChange("businessHoursEnd", e.target.value)
                    }
                    className="mt-2"
                  />
                </Field>
              </FieldGroup>
            )}

            {/* Step 4: Knowledge Base */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                    Knowledge Base (Optional)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Help your AI receptionist answer questions accurately by
                    providing business information.
                  </p>
                </div>

                <div className="rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 p-6 text-center bg-slate-50 dark:bg-slate-900/50">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">
                    Upload Documents
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    FAQs, pricing, policies, and other business documents
                  </p>
                  <Button variant="outline" className="mt-4 bg-transparent">
                    Add Files (Coming Soon)
                  </Button>
                </div>

                <Field>
                  <FieldLabel htmlFor="knowledgeBaseUrl">
                    Or Provide a Website URL
                  </FieldLabel>
                  <Input
                    id="knowledgeBaseUrl"
                    type="url"
                    value={formData.knowledgeBaseUrl}
                    onChange={(e) =>
                      handleInputChange("knowledgeBaseUrl", e.target.value)
                    }
                    placeholder="https://example.com"
                    className="mt-2"
                  />
                  <FieldDescription>
                    We'll crawl your website to understand your business
                  </FieldDescription>
                </Field>

                <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4">
                  <p className="text-sm font-medium text-green-900 dark:text-green-200">
                    You can add more documents later
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                    Knowledge base setup is optional. You can add and update
                    documents anytime from your dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Ready to Go Live */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    You're all set!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Your AI receptionist is ready to handle calls.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                      Setup Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Business:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formData.businessName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Industry:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formData.industry}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Voice Tone:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formData.voiceTone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Business Hours:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formData.businessHoursStart} -{" "}
                          {formData.businessHoursEnd}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
                    <div className="flex gap-3">
                      <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          Your AI receptionist is now live
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                          Calls are being routed to your new phone number. You
                          can update settings anytime from your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2">
                      Human Backup Available
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      You can configure call forwarding and human escalation
                      from your dashboard. Your customers will always be able to
                      reach a human if needed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Navigation Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 px-8 py-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className="flex-1 gap-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {currentStep === ONBOARDING_STEPS.length - 1
                    ? "Activating..."
                    : "Loading..."}
                </>
              ) : currentStep === ONBOARDING_STEPS.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Go to Dashboard
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Footer Trust Message */}
        <div className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
          <p>
            No credit card required. Your setup is secure and encrypted.{" "}
            <a
              href="/privacy"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
