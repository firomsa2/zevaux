"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  Sparkles,
  Phone,
} from "lucide-react";
import type { Business } from "@/types/database";
import { INDUSTRIES } from "@/lib/constants";

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

export interface Service {
  id?: string;
  name: string;
  description: string;
  price?: string;
  duration?: string;
}

export interface BusinessInfoFormData {
  businessName: string;
  industry: string;
  industryOther?: string; // For "Other" industry option
  timezone: string;
  businessDescription: string;
  agentName: string;
  personalizedGreeting: string;
  escalationNumber: string;
  transferCallsEnabled: boolean;
  faqs: FAQ[];
  services: Service[];
}

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
    id: "services",
    title: "Services",
    description: "Review your service menu",
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
    id: "transfer_calls",
    title: "Transfer Calls",
    description: "Setup call forwarding",
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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "service" | "faq";
    id?: string;
    index?: number;
  } | null>(null);

  // Track which specific fields are being edited
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    () => {
      // If no scraped config, all primary fields are editable by default
      if (!Boolean(scrapedConfig)) {
        return {
          businessName: true,
          industry: true,
          businessDescription: true,
          agentName: true,
          personalizedGreeting: true,
        };
      }
      // Otherwise, all fields start as read-only
      return {} as Record<string, boolean>;
    },
  );

  // Per-FAQ editing state (keyed by faq.id)
  const [faqEditing, setFaqEditing] = useState<Record<string, boolean>>({});

  // Per-Service editing state (keyed by service.id)
  const [serviceEditing, setServiceEditing] = useState<Record<string, boolean>>(
    {},
  );

  // Overall service edit mode (simple view vs detailed edit view)
  const [isServiceEditMode, setIsServiceEditMode] = useState(false);

  // Ref for escalation number input to auto-focus
  const escalationNumberInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data with logic to handle scraped content
  const initializeFormData = () => {
    // Determine industry
    let industry = business.industry || "";
    let industryOther = "";

    // Normalize industry casing if it matches a known industry
    const knownIndustry = INDUSTRIES.find(
      (i) => i.toLowerCase() === industry.toLowerCase(),
    );
    if (knownIndustry) {
      industry = knownIndustry;
    }

    // Check scraped industry first
    const scrapedInd = scrapedConfig?.industry;

    if (scrapedInd) {
      const match = INDUSTRIES.find(
        (i) => i.toLowerCase() === scrapedInd.toLowerCase(),
      );
      if (match) {
        industry = match;
      } else {
        industry = "Other";
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
      industry = "Other";
    }

    // Determine FAQs: Prioritize saved FAQs, otherwise suggest from services
    let initialFaqs: FAQ[] = [];

    if (scrapedConfig?.faqs && Array.isArray(scrapedConfig.faqs)) {
      initialFaqs = scrapedConfig.faqs.map((f: any, i: number) => ({
        id: f.id || `saved-faq-${i}-${Date.now()}`,
        question: f.question || "",
        answer: f.answer || "",
      }));
    } else if (
      scrapedConfig?.services &&
      Array.isArray(scrapedConfig.services)
    ) {
      initialFaqs = scrapedConfig.services
        .map((s: any, i: number) => ({
          id: Date.now().toString() + i,
          question: `Do you offer ${s.name}?`,
          answer: [
            s.description,
            s.price ? `Price starts at $${s.price}.` : null,
          ]
            .filter(Boolean)
            .join(" "),
        }))
        // Only suggest for the first 5 services initially to avoid overwhelming
        .slice(0, 5);
    }

    // Determine Services
    let initialServices: Service[] = [];
    if (scrapedConfig?.services && Array.isArray(scrapedConfig.services)) {
      initialServices = scrapedConfig.services.map((s: any, i: number) => ({
        id: Date.now().toString() + "-svc-" + i,
        name: s.name || "",
        description: s.description || "",
        price: s.price ? s.price.toString() : "",
        duration:
          s.duration || (s.durationMinutes ? `${s.durationMinutes} mins` : ""),
      }));
    }

    return {
      businessName: scrapedConfig?.business_name || business.name || "",
      industry,
      industryOther,
      timezone: business.timezone || "UTC",
      businessDescription:
        scrapedConfig?.business_description || business.description || "",
      services: initialServices,
      agentName: business.assistant_name || "Zevaux Assistant",
      personalizedGreeting:
        scrapedConfig?.introScript ||
        (business as any).personalized_greeting ||
        "",
      escalationNumber: business.escalation_number || "",
      transferCallsEnabled: !!business.escalation_number,
      faqs: initialFaqs,
    };
  };

  const [formData, setFormData] =
    useState<BusinessInfoFormData>(initializeFormData());

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    setHasInteracted(true);

    if (itemToDelete.type === "service") {
      if (typeof itemToDelete.index === "number") {
        setFormData((prev) => ({
          ...prev,
          services: prev.services.filter((_, i) => i !== itemToDelete.index),
        }));
      }
      if (itemToDelete.id) {
        setServiceEditing((prev) => {
          const next = { ...prev };
          delete next[itemToDelete.id!];
          return next;
        });
      }
    } else if (itemToDelete.type === "faq") {
      if (itemToDelete.id) {
        setFormData((prev) => ({
          ...prev,
          faqs: prev.faqs.filter((f) => f.id !== itemToDelete.id),
        }));
        setFaqEditing((prev) => {
          const next = { ...prev };
          delete next[itemToDelete.id!];
          return next;
        });
      }
    }

    setItemToDelete(null);
  };

  // Determine which FAQs to display: show ALL FAQs in state
  const displayedFaqs = formData?.faqs || [];

  // Effect to update form if scrapedConfig loads later (though typically it should be passed initially)
  useEffect(() => {
    if (scrapedConfig) {
      // If scraped config arrives after mount and the user hasn't interacted yet,
      // adopt it (prefill) and default to read-only until they click Edit.
      if (!hasInteracted) {
        setFormData(initializeFormData());
        setEditingFields({});
      }
    }
  }, [scrapedConfig]); // Minimal dependency to avoid reset loops

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Helper function to toggle editing for a specific field
  const toggleFieldEdit = (fieldName: string) => {
    setEditingFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Helper function to check if a field is editable
  const isFieldEditing = (fieldName: string) => {
    return editingFields[fieldName] || false;
  };

  const subStep = SUB_STEPS[currentSubStep];
  const isFirst = currentSubStep === 0;
  const isLast = currentSubStep === SUB_STEPS.length - 1;
  const progress = ((currentSubStep + 1) / SUB_STEPS.length) * 100;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setHasInteracted(true);
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
    setHasInteracted(true);
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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
      if (formData.industry === "Other" && !formData.industryOther?.trim()) {
        errors.industryOther = "Please specify your industry";
      }
      if (!formData.businessDescription.trim()) {
        errors.businessDescription = "Business description is required";
      }
    } else if (currentSubStep === 1) {
      // Services validation
      // We don't strictly require services, but if any exist, they must have names
      formData.services.forEach((svc, index) => {
        if (!svc.name.trim()) {
          errors[`service_${index}_name`] = "Service name is required";
        }
      });
    } else if (currentSubStep === 2) {
      // Agent Setup & Greeting validation (merged step)
      if (!formData.agentName.trim()) {
        errors.agentName = "Agent name is required";
      }
      if (!formData.personalizedGreeting.trim()) {
        errors.personalizedGreeting = "Greeting message is required";
      }
    } else if (currentSubStep === 3) {
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
    } else if (currentSubStep === 4) {
      if (formData.transferCallsEnabled && !formData.escalationNumber.trim()) {
        errors.escalationNumber = "Transfer number is required when enabled";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      // If validation fails, enable editing for fields with errors
      Object.keys(validationErrors).forEach((key) => {
        const fieldName = key.split("_")[0]; // Extract base field name from error key
        if (
          [
            "businessName",
            "industry",
            "businessDescription",
            "agentName",
            "personalizedGreeting",
            "escalationNumber",
          ].includes(fieldName)
        ) {
          setEditingFields((prev) => ({ ...prev, [fieldName]: true }));
        }

        // If Service validation failed, put each Service into edit mode
        if (fieldName === "service") {
          const map: Record<string, boolean> = {};
          (formData.services || []).forEach((s) => {
            if (s.id) map[s.id] = true;
          });
          setServiceEditing((prev) => ({ ...prev, ...map }));
        }

        // If FAQ validation failed, put each FAQ into edit mode
        if (fieldName === "faqs") {
          const map: Record<string, boolean> = {};
          (formData.faqs || []).forEach((f) => {
            map[f.id] = true;
          });
          setFaqEditing((prev) => ({ ...prev, ...map }));
        }
      });
      return;
    }

    // Auto-add first FAQ if entering FAQs step and no FAQs exist
    if (currentSubStep === 2 && formData.faqs.length === 0) {
      const newFaqId = Date.now().toString();
      setFormData((prev) => ({
        ...prev,
        faqs: [
          {
            id: newFaqId,
            question: "",
            answer: "",
          },
        ],
      }));
      setFaqEditing((prev) => ({ ...prev, [newFaqId]: true }));
    }

    const isLast = currentSubStep === SUB_STEPS.length - 1;

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

  const handleSuggestFaqs = () => {
    if (!formData.services || formData.services.length === 0) return;

    setHasInteracted(true);
    const suggestedFaqs = formData.services
      .map((s, i) => ({
        id: Date.now().toString() + "-suggestion-" + i,
        question: `Do you offer ${s.name}?`,
        answer: [s.description, s.price ? `Price starts at $${s.price}.` : null]
          .filter(Boolean)
          .join(" "),
      }))
      // Filter out suggestions that might already be covered (simple duplicate check on question)
      .filter(
        (suggestion) =>
          !formData.faqs.some(
            (existing) =>
              existing.question.toLowerCase() ===
              suggestion.question.toLowerCase(),
          ),
      );
    // Removed slice to suggest for all available services as requested
    // .slice(0, 3);

    if (suggestedFaqs.length > 0) {
      setFormData((prev) => ({
        ...prev,
        faqs: [...prev.faqs, ...suggestedFaqs],
      }));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      {/* Hero Heading */}
      <div className="text-center space-y-2 mb-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Configure Your Business Info
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Help your AI receptionist understand your services and customers.
        </p>
      </div>

      {/* Sub-step Content */}
      <Card className="border shadow-md overflow-hidden flex flex-col relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        <CardHeader className="px-6 py-5 border-b bg-muted/30">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  {subStep.id === "business_details" && (
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  {subStep.id === "services" && (
                    <div className="p-1.5 rounded-md bg-secondary/10 text-secondary">
                      <Plus className="w-4 h-4" />
                    </div>
                  )}
                  {subStep.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  {subStep.description}
                </CardDescription>
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-medium px-2.5 py-1 bg-background border rounded-full text-muted-foreground shadow-sm">
                  Step {currentSubStep + 1} of {SUB_STEPS.length}
                </span>
              </div>
            </div>
            {scrapedConfig && (
              <div className="flex items-center gap-2 mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-md w-fit">
                <span className="text-amber-500 text-sm">✨</span>
                We pre-filled these fields from your website.
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Business Details Sub-step */}
          {currentSubStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="businessName"
                      className="text-sm font-semibold"
                    >
                      Business Name
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFieldEdit("businessName")}
                      disabled={loading}
                      className="h-6 px-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isFieldEditing("businessName") ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs font-medium">Done</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs font-medium">Edit</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="e.g., John's Dental Practice"
                    disabled={loading || !isFieldEditing("businessName")}
                    className={`transition-all ${isFieldEditing("businessName") ? "ring-2 ring-primary/20" : "bg-slate-50 text-muted-foreground"}`}
                  />
                  {validationErrors.businessName && (
                    <p className="text-xs font-medium text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {validationErrors.businessName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="industry"
                      className="text-sm font-semibold"
                    >
                      Industry
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFieldEdit("industry")}
                      disabled={loading}
                      className="h-6 px-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isFieldEditing("industry") ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs font-medium">Done</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs font-medium">Edit</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      handleSelectChange("industry", value)
                    }
                    disabled={loading || !isFieldEditing("industry")}
                  >
                    <SelectTrigger
                      id="industry"
                      className={
                        isFieldEditing("industry")
                          ? "ring-2 ring-primary/20"
                          : "bg-slate-50 text-muted-foreground"
                      }
                    >
                      <SelectValue placeholder="Select Industry..." />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.industry && (
                    <p className="text-xs font-medium text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {validationErrors.industry}
                    </p>
                  )}

                  {/* Show text input if "Other" is selected */}
                  {formData.industry === "Other" && (
                    <div className="mt-2 animate-in slide-in-from-top-2 fade-in duration-300">
                      <Input
                        id="industryOther"
                        name="industryOther"
                        value={formData.industryOther || ""}
                        onChange={handleInputChange}
                        placeholder="Specify your industry"
                        disabled={loading || !isFieldEditing("industry")}
                        className="bg-accent/20"
                      />
                      {validationErrors.industryOther && (
                        <p className="text-xs font-medium text-red-600 mt-1">
                          {validationErrors.industryOther}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="businessDescription"
                    className="text-sm font-semibold"
                  >
                    Description
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEdit("businessDescription")}
                    disabled={loading}
                    className="h-6 px-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isFieldEditing("businessDescription") ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs font-medium">Done</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs font-medium">Edit</span>
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  placeholder="Brief description of your business..."
                  rows={4}
                  disabled={loading || !isFieldEditing("businessDescription")}
                  className={`resize-none transition-all ${isFieldEditing("businessDescription") ? "ring-2 ring-primary/20" : "bg-slate-50 text-muted-foreground"}`}
                />
                {validationErrors.businessDescription && (
                  <p className="text-xs font-medium text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {validationErrors.businessDescription}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Services Sub-step */}
          {currentSubStep === 1 && (
            <div className="space-y-6">
              {!isServiceEditMode && (formData.services || []).length > 0 ? (
                <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-foreground">
                      Here are the core services we&apos;ve identified. Does
                      this look right?
                    </h3>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 py-4">
                    {formData.services.map((service, index) => (
                      <div
                        key={service.id || index}
                        className="bg-white border rounded-full px-5 py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-default flex items-center gap-2"
                      >
                        {service.name}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsServiceEditMode(true)}
                      className="rounded-full px-6 gap-2"
                    >
                      Make changes
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {validationErrors.services && (
                    <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm items-center">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.services}
                    </div>
                  )}

                  <div className="space-y-4">
                    {(formData.services || []).map((service, index) => {
                      const svcId = service.id || `svc-${index}`;
                      const isEditing = serviceEditing[svcId];

                      return (
                        <div
                          key={svcId}
                          className="relative group animate-in slide-in-from-bottom-2 duration-300"
                        >
                          <div
                            className={`p-4 rounded-xl border transition-all duration-200 ${isEditing ? "bg-white border-primary/20 shadow-md ring-1 ring-primary/5" : "bg-slate-50/50 hover:bg-slate-50 border-slate-200"}`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                {/* Service Name Input - Prominent */}
                                <div className="flex-1 flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                                  <span className="text-xs sm:text-sm font-bold text-primary shrink-0 sm:w-20 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                                    Service
                                  </span>
                                  <div className="flex-1 w-full">
                                    {isEditing ? (
                                      <Input
                                        value={service.name}
                                        onChange={(e) => {
                                          const newServices = [
                                            ...formData.services,
                                          ];
                                          newServices[index] = {
                                            ...service,
                                            name: e.target.value,
                                          };
                                          setFormData((prev) => ({
                                            ...prev,
                                            services: newServices,
                                          }));
                                        }}
                                        placeholder="Service Name"
                                        className="font-medium text-base bg-transparent border-transparent px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 -ml-1 pl-1"
                                        autoFocus
                                      />
                                    ) : (
                                      <h4 className="font-medium text-base py-1">
                                        {service.name || "Untitled Service"}
                                      </h4>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setServiceEditing((prev) => ({
                                        ...prev,
                                        [svcId]: !prev[svcId],
                                      }));
                                    }}
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    disabled={loading}
                                  >
                                    {isEditing ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Edit2 className="h-4 w-4" />
                                    )}
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setItemToDelete({
                                        type: "service",
                                        id: svcId,
                                        index: index,
                                      });
                                    }}
                                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                    disabled={loading}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Description Field */}
                              {(isEditing || service.description) && (
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start">
                                  <span className="text-xs sm:text-sm font-bold text-muted-foreground shrink-0 sm:w-20 sm:pt-1 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                                    Description
                                  </span>
                                  <div className="flex-1 w-full">
                                    {isEditing ? (
                                      <Textarea
                                        value={service.description}
                                        onChange={(e) => {
                                          const newServices = [
                                            ...formData.services,
                                          ];
                                          newServices[index] = {
                                            ...service,
                                            description: e.target.value,
                                          };
                                          setFormData((prev) => ({
                                            ...prev,
                                            services: newServices,
                                          }));
                                        }}
                                        placeholder="Brief description..."
                                        className="resize-none bg-transparent border-transparent px-0 py-0 h-auto focus-visible:ring-0 text-muted-foreground text-sm -ml-1 pl-1 min-h-[auto]"
                                        rows={2}
                                      />
                                    ) : (
                                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {service.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {validationErrors[`service_${index}_name`] && (
                                <p className="text-xs text-red-600 pt-1">
                                  {validationErrors[`service_${index}_name`]}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newId = Date.now().toString();
                        const newService = {
                          id: newId,
                          name: "",
                          description: "",
                          price: "",
                          duration: "",
                        };
                        setFormData((prev) => ({
                          ...prev,
                          services: [...(prev.services || []), newService],
                        }));
                        setServiceEditing((prev) => ({
                          ...prev,
                          [newId]: true,
                        }));
                      }}
                      className="w-full border-dashed border-2 py-4 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 h-auto"
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Service
                    </Button>

                    <div className="flex justify-center pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsServiceEditMode(false)}
                        className="text-muted-foreground"
                      >
                        Done Editing
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Agent Setup & Greeting Sub-step (Merged) */}
          {currentSubStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="agentName"
                    className="text-sm font-semibold"
                  >
                    AI Receptionist Name
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEdit("agentName")}
                    disabled={loading}
                    className="h-6 px-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isFieldEditing("agentName") ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs font-medium">Done</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs font-medium">Edit</span>
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  id="agentName"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  placeholder="e.g., Sarah, Alex"
                  disabled={loading || !isFieldEditing("agentName")}
                  className={`transition-all ${isFieldEditing("agentName") ? "ring-2 ring-primary/20" : "bg-slate-50 text-muted-foreground"}`}
                />
                {validationErrors.agentName && (
                  <p className="text-xs font-medium text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {validationErrors.agentName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="personalizedGreeting"
                    className="text-sm font-semibold"
                  >
                    Greeting Message
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFieldEdit("personalizedGreeting")}
                    disabled={loading}
                    className="h-6 px-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isFieldEditing("personalizedGreeting") ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs font-medium">Done</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs font-medium">Edit</span>
                      </>
                    )}
                  </Button>
                </div>
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
                  rows={4}
                  disabled={loading || !isFieldEditing("personalizedGreeting")}
                  className={`resize-none transition-all ${isFieldEditing("personalizedGreeting") ? "ring-2 ring-primary/20" : "bg-slate-50 text-muted-foreground"}`}
                />
                {validationErrors.personalizedGreeting && (
                  <p className="text-xs font-medium text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {validationErrors.personalizedGreeting}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* FAQs Sub-step */}
          {currentSubStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  {validationErrors.faqs && (
                    <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm items-center">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.faqs}
                    </div>
                  )}
                </div>
                <div />
              </div>

              <div className="space-y-4">
                {displayedFaqs.map((faq, displayIndex) => {
                  const index = (formData.faqs || []).findIndex(
                    (x) => x.id === faq.id,
                  );
                  const isEditing = faqEditing[faq.id];

                  return (
                    <div
                      key={faq.id}
                      className="relative group animate-in slide-in-from-bottom-2 duration-300"
                    >
                      <div
                        className={`p-4 rounded-xl border transition-all duration-200 ${isEditing ? "bg-white border-primary/20 shadow-md ring-1 ring-primary/5" : "bg-slate-50/50 hover:bg-slate-50 border-slate-200 hover:border-slate-300"}`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            {/* Question Input - Prominent */}
                            <div className="flex-1 flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
                              <span className="text-xs sm:text-sm font-bold text-primary shrink-0 sm:w-20 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                                Question
                              </span>
                              <div className="flex-1 w-full">
                                {isEditing ? (
                                  <Input
                                    value={faq.question}
                                    onChange={(e) => {
                                      setHasInteracted(true);
                                      const newFaqs = [...formData.faqs];
                                      const idx = newFaqs.findIndex(
                                        (x) => x.id === faq.id,
                                      );
                                      if (idx > -1) {
                                        newFaqs[idx] = {
                                          ...faq,
                                          question: e.target.value,
                                        };
                                        setFormData((prev) => ({
                                          ...prev,
                                          faqs: newFaqs,
                                        }));
                                      }
                                    }}
                                    placeholder="Type your question here..."
                                    className="font-medium text-base bg-transparent border-transparent px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 -ml-1 pl-1"
                                    autoFocus
                                  />
                                ) : (
                                  <h4 className="font-medium text-base py-1">
                                    {faq.question || "Untitled Question"}
                                  </h4>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setFaqEditing((prev) => ({
                                    ...prev,
                                    [faq.id]: !prev[faq.id],
                                  }));
                                }}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                disabled={loading}
                              >
                                {isEditing ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Edit2 className="h-4 w-4" />
                                )}
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setItemToDelete({
                                    type: "faq",
                                    id: faq.id,
                                  });
                                }}
                                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Answer Field */}
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start">
                            <span className="text-xs sm:text-sm font-bold text-muted-foreground shrink-0 sm:w-20 sm:pt-1 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                              Answer
                            </span>
                            <div className="flex-1 w-full">
                              {isEditing ? (
                                <Textarea
                                  value={faq.answer}
                                  onChange={(e) => {
                                    setHasInteracted(true);
                                    const newFaqs = [...formData.faqs];
                                    const idx = newFaqs.findIndex(
                                      (x) => x.id === faq.id,
                                    );
                                    if (idx > -1) {
                                      newFaqs[idx] = {
                                        ...faq,
                                        answer: e.target.value,
                                      };
                                      setFormData((prev) => ({
                                        ...prev,
                                        faqs: newFaqs,
                                      }));
                                    }
                                  }}
                                  placeholder="Type the answer here..."
                                  className="resize-none bg-transparent border-transparent px-0 py-0 h-auto focus-visible:ring-0 text-muted-foreground text-sm -ml-1 pl-1 min-h-[auto]"
                                  rows={2}
                                />
                              ) : (
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                  {faq.answer}
                                </p>
                              )}
                            </div>
                          </div>

                          {validationErrors[`faq_${index}_question`] && (
                            <p className="text-xs text-red-600 pt-1">
                              {validationErrors[`faq_${index}_question`]}
                            </p>
                          )}
                          {validationErrors[`faq_${index}_answer`] && (
                            <p className="text-xs text-red-600 pt-1">
                              {validationErrors[`faq_${index}_answer`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setHasInteracted(true);
                    const newFaq = {
                      id: Date.now().toString(),
                      question: "",
                      answer: "",
                    };
                    // Append new FAQ to the end
                    setFormData((prev) => ({
                      ...prev,
                      faqs: Array.isArray(prev.faqs)
                        ? [...prev.faqs, newFaq]
                        : [newFaq],
                    }));
                    // open edit mode for new FAQ
                    setFaqEditing((prev) => ({ ...prev, [newFaq.id]: true }));
                  }}
                  className="flex-1 border-dashed border-2 py-4 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 h-auto"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another FAQ
                </Button>

                {formData.services && formData.services.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSuggestFaqs}
                    className="flex-1 border-dashed border-2 py-4 text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300 h-auto"
                    disabled={
                      loading ||
                      // Disable if almost all services already have FAQs
                      (formData.faqs.some((f) =>
                        formData.services.some(
                          (s) => f.question === `Do you offer ${s.name}?`,
                        ),
                      ) &&
                        formData.faqs.length >= formData.services.length)
                    }
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate from Services
                  </Button>
                )}
              </div>

              {formData.faqs.length === 0 && (
                <div className="text-center py-8 px-4 border-2 border-dashed rounded-xl bg-slate-50">
                  <p className="text-sm text-muted-foreground">
                    No FAQs added yet. Adding common questions helps your
                    receptionist handle calls better.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Transfer Calls Sub-step */}
          {currentSubStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-card bg-slate-50/50">
                <div className="space-y-0.5">
                  <FieldLabel className="text-base flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Transfer Calls
                  </FieldLabel>
                  <CardDescription>
                    Enable call transfer to a specific number.
                  </CardDescription>
                </div>
                <Switch
                  checked={formData.transferCallsEnabled}
                  onCheckedChange={(checked) => {
                    setHasInteracted(true);
                    setFormData((prev) => ({
                      ...prev,
                      transferCallsEnabled: checked,
                    }));
                    
                    // Auto-enable edit mode and focus if switch is turned ON and escalation number is empty
                    if (checked && !formData.escalationNumber?.trim()) {
                      setEditingFields((prev) => ({
                        ...prev,
                        escalationNumber: true,
                      }));
                      // Use setTimeout to ensure the input is rendered before focusing
                      setTimeout(() => {
                        escalationNumberInputRef.current?.focus();
                      }, 100);
                    }
                  }}
                  disabled={loading}
                />
              </div>

              {formData.transferCallsEnabled && (
                <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300 p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="escalationNumber"
                      className="text-sm font-semibold"
                    >
                      Transfer Number
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFieldEdit("escalationNumber")}
                      disabled={loading}
                      className="h-6 px-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isFieldEditing("escalationNumber") ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs font-medium">Done</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs font-medium">Edit</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <Input
                    ref={escalationNumberInputRef}
                    id="escalationNumber"
                    name="escalationNumber"
                    value={formData.escalationNumber}
                    onChange={handleInputChange}
                    placeholder="(555) 555-5555"
                    disabled={loading || !isFieldEditing("escalationNumber")}
                    className={`transition-all ${isFieldEditing("escalationNumber") ? "ring-2 ring-primary/20" : "bg-slate-50 text-muted-foreground"}`}
                  />
                  {validationErrors.escalationNumber && (
                    <p className="text-xs font-medium text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {validationErrors.escalationNumber}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Calls will be transferred to this number when the caller
                    asks to speak to a human or transfer.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Review Sub-step */}
          {currentSubStep === 5 && (
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
                    {formData.industry === "Other"
                      ? formData.industryOther || "Other"
                      : formData.industry}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-muted-foreground mb-1">Services</p>
                  <div className="space-y-2 mt-1">
                    {(formData.services || []).length > 0 ? (
                      (formData.services || []).map((svc, i) => (
                        <div key={svc.id || i} className="text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{svc.name}</span>
                            {svc.price && (
                              <span className="text-muted-foreground text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                                ${svc.price}
                              </span>
                            )}
                          </div>
                          {svc.description && (
                            <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5">
                              {svc.description}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No services added
                      </p>
                    )}
                  </div>
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
                  <p className="text-xs text-muted-foreground mb-1">
                    Call Transfer
                  </p>
                  {formData.transferCallsEnabled ? (
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {formData.escalationNumber}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Disabled
                    </p>
                  )}
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
          <div className="flex gap-4 pt-6 border-t mt-6 items-center">
            <Button
              variant="ghost"
              onClick={isFirst ? onCancel : handleBack}
              disabled={loading}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              {isFirst ? "Back to Website" : "Back"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              size="lg"
              className="flex items-center gap-2 ml-auto shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 bg-primary hover:opacity-90 text-white font-medium px-8"
            >
              {isLast ? "Save & Continue" : "Next Step"}
              {!isLast && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{" "}
              {itemToDelete?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
