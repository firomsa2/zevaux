"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, AlertCircle, Plus, Trash2 } from "lucide-react";
import type { Business } from "@/types/database";

interface BusinessInfoSubStepsProps {
  business: Business;
  scrapedConfig?: any;
  onComplete: (data: BusinessInfoFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BusinessInfoFormData {
  businessName: string;
  industry: string;
  industryOther?: string; // For "Other" industry option
  timezone: string;
  businessDescription: string;
  agentName: string;
  personalizedGreeting: string;
  faqs: FAQ[];
}

const INDUSTRIES = [
  "Healthcare",
  "Legal Services",
  "Real Estate",
  "Dental",
  "Veterinary",
  "Accounting",
  "IT Support",
  "Home Services",
  "Consulting",
  "Restaurant",
  "Retail",
  "Other",
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

const SUB_STEPS = [
  {
    id: "business_details",
    title: "Business Details",
    description: "Tell us about your business",
  },
  {
    id: "agent_setup",
    title: "Agent & Greeting",
    description: "Setup your AI receptionist",
  },
  {
    id: "faqs",
    title: "FAQs",
    description: "Add your frequently asked questions",
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm everything looks good",
  },
];

export function BusinessInfoSubSteps({
  business,
  scrapedConfig,
  onComplete,
  onCancel,
  loading = false,
  error = null,
}: BusinessInfoSubStepsProps) {
  const [currentSubStep, setCurrentSubStep] = useState(0);

  // Initialize form data with logic to handle scraped content
  const initializeFormData = () => {
    // Determine industry
    let industry = business.industry || "";
    let industryOther = "";

    // Check scraped industry first
    const scrapedInd = scrapedConfig?.industry;

    if (scrapedInd) {
      const match = INDUSTRIES.find(
        (i) => i.toLowerCase() === scrapedInd.toLowerCase()
      );
      if (match) {
        industry = match.toLowerCase();
      } else {
        industry = "other";
        industryOther = scrapedInd;
      }
    } else if (
      industry &&
      !INDUSTRIES.some((i) => i.toLowerCase() === industry.toLowerCase())
    ) {
      // Handle existing industry that might be custom
      // If it's stored as 'other', we don't know the custom text unless we stored it somewhere
      // But for this logic, assume if it's not in list, it's custom.
      industryOther = industry; // This logic might need adjustment if DB stores 'other' literally
      industry = "other";
    }

    // Determine FAQs from services if available
    let initialFaqs: FAQ[] = [];
    if (scrapedConfig?.services && Array.isArray(scrapedConfig.services)) {
      initialFaqs = scrapedConfig.services.map((s: any, i: number) => ({
        id: Date.now().toString() + i,
        question: `Do you offer ${s.name}?`,
        answer: [s.description, s.price ? `Price starts at $${s.price}.` : null]
          .filter(Boolean)
          .join(" "),
      }));
    }

    return {
      businessName: scrapedConfig?.business_name || business.name || "",
      industry,
      industryOther,
      timezone: business.timezone || "UTC",
      businessDescription:
        scrapedConfig?.business_description || business.description || "",
      agentName: business.assistant_name || "Zevaux Assistant",
      personalizedGreeting:
        scrapedConfig?.introScript ||
        (business as any).personalized_greeting ||
        "",
      faqs: initialFaqs,
    };
  };

  const [formData, setFormData] = useState<BusinessInfoFormData>(
    initializeFormData()
  );

  // Effect to update form if scrapedConfig loads later (though typically it should be passed initially)
  useEffect(() => {
    if (scrapedConfig) {
      setFormData((prev) => {
        // Only update if fields are empty to avoid overwriting user edits
        // Or if we specifically want to overwrite.
        // For now, let's just respect the initial load.
        // But if the component mounts with null scrapedConfig and then it arrives, we should update.
        if (!prev.businessName && scrapedConfig.business_name) {
          return initializeFormData();
        }
        return prev;
      });
    }
  }, [scrapedConfig]); // Minimal dependency to avoid reset loops

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const subStep = SUB_STEPS[currentSubStep];
  const isFirst = currentSubStep === 0;
  const isLast = currentSubStep === SUB_STEPS.length - 1;
  const progress = ((currentSubStep + 1) / SUB_STEPS.length) * 100;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentSubStep === 0) {
      // Business Details validation
      if (!formData.businessName.trim()) {
        errors.businessName = "Business name is required";
      }
      if (!formData.industry) {
        errors.industry = "Industry is required";
      }
      // If "Other" is selected, require the custom industry text
      if (formData.industry === "other" && !formData.industryOther?.trim()) {
        errors.industryOther = "Please specify your industry";
      }
      if (!formData.businessDescription.trim()) {
        errors.businessDescription = "Business description is required";
      }
    } else if (currentSubStep === 1) {
      // Agent Setup & Greeting validation (merged step)
      if (!formData.agentName.trim()) {
        errors.agentName = "Agent name is required";
      }
      if (!formData.personalizedGreeting.trim()) {
        errors.personalizedGreeting = "Greeting message is required";
      }
    } else if (currentSubStep === 2) {
      // FAQs validation
      if (!formData.faqs || formData.faqs.length === 0) {
        errors.faqs = "At least one FAQ is required";
      }
      // Validate each FAQ
      formData.faqs.forEach((faq, index) => {
        if (!faq.question.trim()) {
          errors[`faq_${index}_question`] = "Question is required";
        }
        if (!faq.answer.trim()) {
          errors[`faq_${index}_answer`] = "Answer is required";
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Auto-add first FAQ if entering FAQs step and no FAQs exist
    if (currentSubStep === 1 && formData.faqs.length === 0) {
      setFormData((prev) => ({
        ...prev,
        faqs: [
          {
            id: Date.now().toString(),
            question: "",
            answer: "",
          },
        ],
      }));
    }

    if (isLast) {
      // Submit form
      await onComplete(formData);
    } else {
      setCurrentSubStep(currentSubStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentSubStep(currentSubStep - 1);
    }
  };

  return (
    <div className="w-full">
      {/* Sub-step Content */}
      <Card>
        <CardHeader className="pb-0 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* <div className=""> */}
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{subStep.title}</CardTitle>
            <CardDescription className="text-sm">
              {subStep.description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">Welcome to Zevaux</CardTitle>
            <CardDescription className="text-sm">
              Let's get your AI receptionist up and running
            </CardDescription>
          </div>
          {/* </div> */}
        </CardHeader>
        <CardContent className="space-y-4 ">
          {error && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Business Details Sub-step */}
          {currentSubStep === 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="businessName">
                      Business Name
                    </FieldLabel>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="e.g., John's Dental Practice"
                      disabled={loading}
                    />
                  </Field>
                  {validationErrors.businessName && (
                    <p className="text-sm text-red-600 mt-1">
                      {validationErrors.businessName}
                    </p>
                  )}
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="industry">Industry</FieldLabel>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) =>
                        handleSelectChange("industry", value)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind} value={ind.toLowerCase()}>
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  {validationErrors.industry && (
                    <p className="text-sm text-red-600 mt-1">
                      {validationErrors.industry}
                    </p>
                  )}

                  {/* Show text input if "Other" is selected */}
                  {formData.industry === "other" && (
                    <div className="mt-2">
                      <Input
                        id="industryOther"
                        name="industryOther"
                        value={formData.industryOther || ""}
                        onChange={handleInputChange}
                        placeholder="Specify your industry"
                        disabled={loading}
                        className="mt-1"
                      />
                      {validationErrors.industryOther && (
                        <p className="text-sm text-red-600 mt-1">
                          {validationErrors.industryOther}
                        </p>
                      )}
                    </div>
                  )}
                </FieldGroup>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="businessDescription">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="businessDescription"
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description of your business..."
                    rows={3}
                    disabled={loading}
                  />
                </Field>
                {validationErrors.businessDescription && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors.businessDescription}
                  </p>
                )}
              </FieldGroup>
            </div>
          )}

          {/* Agent Setup & Greeting Sub-step (Merged) */}
          {currentSubStep === 1 && (
            <div className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="agentName">
                    AI Receptionist Name
                  </FieldLabel>
                  <Input
                    id="agentName"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleInputChange}
                    placeholder="e.g., Sarah, Alex"
                    disabled={loading}
                  />
                </Field>
                {validationErrors.agentName && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors.agentName}
                  </p>
                )}
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="personalizedGreeting">
                    Welcome Greeting
                  </FieldLabel>
                  <Textarea
                    id="personalizedGreeting"
                    name="personalizedGreeting"
                    value={formData.personalizedGreeting}
                    onChange={handleInputChange}
                    placeholder={`Thank you for calling ${
                      formData.businessName || "your business"
                    }. This is ${
                      formData.agentName || "Sarah"
                    }. How can I help you?`}
                    rows={3}
                    disabled={loading}
                  />
                </Field>
                {validationErrors.personalizedGreeting && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors.personalizedGreeting}
                  </p>
                )}
              </FieldGroup>
            </div>
          )}

          {/* FAQs Sub-step */}
          {currentSubStep === 2 && (
            <div className="space-y-4">
              {validationErrors.faqs && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    {validationErrors.faqs}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {formData.faqs.map((faq, index) => (
                  <Card key={faq.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          FAQ {index + 1}
                        </span>
                        {formData.faqs.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                faqs: prev.faqs.filter((f) => f.id !== faq.id),
                              }));
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <FieldLabel>Question</FieldLabel>
                          <Input
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...formData.faqs];
                              newFaqs[index] = {
                                ...faq,
                                question: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                faqs: newFaqs,
                              }));
                            }}
                            placeholder="e.g., What are your opening hours?"
                            disabled={loading}
                          />
                          {validationErrors[`faq_${index}_question`] && (
                            <p className="text-sm text-red-600 mt-1">
                              {validationErrors[`faq_${index}_question`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <FieldLabel>Answer</FieldLabel>
                          <Textarea
                            value={faq.answer}
                            onChange={(e) => {
                              const newFaqs = [...formData.faqs];
                              newFaqs[index] = {
                                ...faq,
                                answer: e.target.value,
                              };
                              setFormData((prev) => ({
                                ...prev,
                                faqs: newFaqs,
                              }));
                            }}
                            placeholder="e.g., We are open Monday to Friday from 9am to 5pm."
                            rows={2}
                            disabled={loading}
                          />
                          {validationErrors[`faq_${index}_answer`] && (
                            <p className="text-sm text-red-600 mt-1">
                              {validationErrors[`faq_${index}_answer`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    faqs: [
                      ...prev.faqs,
                      {
                        id: Date.now().toString(),
                        question: "",
                        answer: "",
                      },
                    ],
                  }));
                }}
                className="w-full"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>

              {formData.faqs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Add at least one FAQ for your business
                </p>
              )}
            </div>
          )}

          {/* Review Sub-step */}
          {currentSubStep === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="border-b pb-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Business Name
                  </p>
                  <p className="font-semibold">{formData.businessName}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-muted-foreground mb-1">Industry</p>
                  <p className="font-medium capitalize">
                    {formData.industry === "other"
                      ? formData.industryOther || "Other"
                      : formData.industry}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Agent Name
                  </p>
                  <p className="font-medium">{formData.agentName}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-muted-foreground mb-1">Greeting</p>
                  <p className="font-medium">{formData.personalizedGreeting}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-muted-foreground mb-1">FAQs</p>
                  <div className="space-y-1 mt-1">
                    {formData.faqs.length > 0 ? (
                      formData.faqs.map((faq) => (
                        <div key={faq.id} className="text-sm">
                          <span className="font-medium">Q: {faq.question}</span>
                          <p className="text-muted-foreground ml-2">
                            A: {faq.answer}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No FAQs added
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm">{formData.businessDescription}</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar - Moved to bottom */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Section Progress
              </span>
              <span className="text-sm font-medium">
                {currentSubStep + 1} of {SUB_STEPS.length}
              </span>
            </div>
            <div className="w-full bg-accent h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirst || loading}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 ml-auto"
            >
              {isLast ? "Complete" : "Next"}
              {!isLast && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
