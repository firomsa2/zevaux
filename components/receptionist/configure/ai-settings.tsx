"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Save,
  AlertCircle,
  Bot,
  Zap,
  Shield,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SAFETY_RULES = [
  "Never provide medical advice",
  "Never provide financial or legal advice",
  "Do not share personal contact information",
  "Do not make promises or guarantees",
  "Always maintain professional boundaries",
  "Escalate complex issues to humans",
  "Do not discuss political or religious topics",
  "Maintain strict confidentiality",
];

const BOOKING_FIELDS = [
  { id: "name", label: "Name", required: true },
  { id: "phone", label: "Phone Number", required: true },
  { id: "email", label: "Email", required: false },
  { id: "service", label: "Service", required: true },
  { id: "date", label: "Date", required: true },
  { id: "time", label: "Time", required: true },
  { id: "notes", label: "Notes", required: false },
  { id: "preferences", label: "Preferences", required: false },
  { id: "address", label: "Address", required: false },
];

export default function AISettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Safety settings
    safety: {
      disallowMedicalAdvice: true,
      disallowFinancialAdvice: true,
      maintainConfidentiality: true,
      escalateComplexIssues: true,
      additionalRules: [] as string[],
    },
    // Booking settings
    bookingRules: {
      minNoticeHours: 2,
      maxDaysAhead: 30,
      allowSameDay: true,
      allowRescheduling: true,
      allowCancellations: true,
      cancellationNoticeHours: 24,
      collectFields: [
        "name",
        "phone",
        "service",
        "date",
        "time",
        "notes",
      ] as string[],
    },
    // Escalation settings
    escalation: {
      transferNumber: "",
      escalateWhen: [
        "caller is upset or angry",
        "complex complaints or refunds",
        "requests to speak with a specific person",
        "situations where AI is not sure what to do",
      ] as string[],
      allowVoicemail: true,
      voicemailInstructions:
        "Please leave your name, number, and a brief message after the tone.",
      followUpHours: 24,
    },
    // Additional instructions
    additionalInstructions: `You are a professional and helpful AI receptionist. Your primary goals are:
1. Greet callers warmly and professionally
2. Understand their needs quickly
3. Provide accurate information when available
4. Book appointments efficiently
5. Escalate appropriately when needed
6. Maintain a positive brand image

Always be patient, even with frustrated callers. If you don't know something, be honest about it and offer to take a message or escalate.`,
  });

  const [customRule, setCustomRule] = useState("");

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: userData } = await supabase
        .from("users")
        .select("business_id")
        .eq("id", user.id)
        .maybeSingle();

      if (!userData?.business_id) throw new Error("No business found");
      setBusinessId(userData.business_id);

      const { data: configRes } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", userData.business_id)
        .maybeSingle();

      if (configRes?.config) {
        const config = configRes.config;
        setFormData((prev) => ({
          ...prev,
          safety: {
            disallowMedicalAdvice: config.safety?.disallowMedicalAdvice ?? true,
            disallowFinancialAdvice:
              config.safety?.disallowFinancialAdvice ?? true,
            maintainConfidentiality:
              config.safety?.maintainConfidentiality ?? true,
            escalateComplexIssues: config.safety?.escalateComplexIssues ?? true,
            additionalRules: config.safety?.additionalRules || [],
          },
          bookingRules: {
            minNoticeHours: config.bookingRules?.minNoticeHours ?? 2,
            maxDaysAhead: config.bookingRules?.maxDaysAhead ?? 30,
            allowSameDay: config.bookingRules?.allowSameDay ?? true,
            allowRescheduling: config.bookingRules?.allowRescheduling ?? true,
            allowCancellations: config.bookingRules?.allowCancellations ?? true,
            cancellationNoticeHours:
              config.bookingRules?.cancellationNoticeHours ?? 24,
            collectFields: config.bookingRules?.collectFields || [
              "name",
              "phone",
              "service",
              "date",
              "time",
              "notes",
            ],
          },
          escalation: {
            transferNumber: config.escalation?.transferNumber || "",
            escalateWhen: config.escalation?.escalateWhen || [
              "caller is upset or angry",
              "complex complaints or refunds",
              "requests to speak with a specific person",
              "situations where AI is not sure what to do",
            ],
            allowVoicemail: config.escalation?.allowVoicemail ?? true,
            voicemailInstructions:
              config.escalation?.voicemailInstructions ||
              "Please leave your name, number, and a brief message after the tone.",
            followUpHours: config.escalation?.followUpHours ?? 24,
          },
          additionalInstructions:
            config.additionalInstructions || prev.additionalInstructions,
        }));
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSafetyToggle = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      safety: {
        ...prev.safety,
        [field]: value,
      },
    }));
  };

  const handleBookingToggle = (field: string, value: boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        [field]: value,
      },
    }));
  };

  const handleBookingFieldToggle = (fieldId: string) => {
    setFormData((prev) => {
      const currentFields = [...prev.bookingRules.collectFields];
      const index = currentFields.indexOf(fieldId);

      if (index > -1) {
        currentFields.splice(index, 1);
      } else {
        currentFields.push(fieldId);
      }

      return {
        ...prev,
        bookingRules: {
          ...prev.bookingRules,
          collectFields: currentFields,
        },
      };
    });
  };

  const handleEscalationChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      escalation: {
        ...prev.escalation,
        [field]: value,
      },
    }));
  };

  const addEscalationRule = () => {
    if (customRule.trim()) {
      setFormData((prev) => ({
        ...prev,
        escalation: {
          ...prev.escalation,
          escalateWhen: [...prev.escalation.escalateWhen, customRule.trim()],
        },
      }));
      setCustomRule("");
    }
  };

  const removeEscalationRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      escalation: {
        ...prev.escalation,
        escalateWhen: prev.escalation.escalateWhen.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const addSafetyRule = (rule: string) => {
    setFormData((prev) => ({
      ...prev,
      safety: {
        ...prev.safety,
        additionalRules: [...prev.safety.additionalRules, rule],
      },
    }));
  };

  const removeSafetyRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      safety: {
        ...prev.safety,
        additionalRules: prev.safety.additionalRules.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!businessId) throw new Error("No business ID found");

      // Get existing config
      const { data: existingConfig } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", businessId)
        .single();

      const configData = {
        business_id: businessId,
        config: {
          ...(existingConfig?.config || {}),
          safety: formData.safety,
          bookingRules: formData.bookingRules,
          escalation: formData.escalation,
          additionalInstructions: formData.additionalInstructions,
        },
        updated_at: new Date().toISOString(),
      };

      // Update config
      const { error: configError } = await supabase
        .from("business_configs")
        .upsert(configData, {
          onConflict: "business_id",
        });

      if (configError) throw configError;

      // Update prompt
      const { error: promptError } = await supabase.rpc(
        "update_business_prompt_trigger",
        { p_business_id: businessId }
      );

      if (promptError) {
        console.warn("Prompt update failed:", promptError);
      }

      toast({
        title: "Success",
        description: "AI settings saved successfully",
        variant: "default",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Settings</h1>
        <p className="text-muted-foreground">
          Configure AI behavior, safety rules, and business logic
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="safety" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="safety" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Booking Rules
            </TabsTrigger>
            <TabsTrigger value="escalation" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Escalation
            </TabsTrigger>
            <TabsTrigger
              value="instructions"
              className="flex items-center gap-2"
            >
              <Bot className="h-4 w-4" />
              Instructions
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Safety Tab */}
          <TabsContent value="safety">
            <Card>
              <CardHeader>
                <CardTitle>Safety & Compliance</CardTitle>
                <CardDescription>
                  Configure safety rules to ensure your AI receptionist operates
                  within guidelines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Medical Advice</Label>
                      <p className="text-sm text-muted-foreground">
                        Prevent AI from providing any medical advice
                      </p>
                    </div>
                    <Switch
                      checked={formData.safety.disallowMedicalAdvice}
                      onCheckedChange={(value) =>
                        handleSafetyToggle("disallowMedicalAdvice", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Financial/Legal Advice
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Prevent AI from providing financial or legal advice
                      </p>
                    </div>
                    <Switch
                      checked={formData.safety.disallowFinancialAdvice}
                      onCheckedChange={(value) =>
                        handleSafetyToggle("disallowFinancialAdvice", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Confidentiality</Label>
                      <p className="text-sm text-muted-foreground">
                        Maintain strict confidentiality of customer information
                      </p>
                    </div>
                    <Switch
                      checked={formData.safety.maintainConfidentiality}
                      onCheckedChange={(value) =>
                        handleSafetyToggle("maintainConfidentiality", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Complex Issue Escalation
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically escalate complex issues to human agents
                      </p>
                    </div>
                    <Switch
                      checked={formData.safety.escalateComplexIssues}
                      onCheckedChange={(value) =>
                        handleSafetyToggle("escalateComplexIssues", value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Additional Safety Rules</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {SAFETY_RULES.map((rule) => (
                      <div
                        key={rule}
                        className="flex items-center p-3 border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => addSafetyRule(rule)}
                      >
                        <div className="flex-1">
                          <p className="text-sm">{rule}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>

                  {formData.safety.additionalRules.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <Label>Active Rules</Label>
                      <div className="space-y-2">
                        {formData.safety.additionalRules.map((rule, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                          >
                            <p className="text-sm">{rule}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSafetyRule(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Rules Tab */}
          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle>Booking Rules</CardTitle>
                <CardDescription>
                  Configure rules for appointment scheduling and management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minNoticeHours">
                      Minimum Notice (hours)
                    </Label>
                    <Input
                      id="minNoticeHours"
                      type="number"
                      min="0"
                      max="168"
                      value={formData.bookingRules.minNoticeHours}
                      onChange={(e) =>
                        handleBookingToggle(
                          "minNoticeHours",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum hours required before an appointment
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxDaysAhead">Maximum Days Ahead</Label>
                    <Input
                      id="maxDaysAhead"
                      type="number"
                      min="1"
                      max="365"
                      value={formData.bookingRules.maxDaysAhead}
                      onChange={(e) =>
                        handleBookingToggle(
                          "maxDaysAhead",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      How far in advance appointments can be booked
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancellationNoticeHours">
                      Cancellation Notice (hours)
                    </Label>
                    <Input
                      id="cancellationNoticeHours"
                      type="number"
                      min="0"
                      max="168"
                      value={formData.bookingRules.cancellationNoticeHours}
                      onChange={(e) =>
                        handleBookingToggle(
                          "cancellationNoticeHours",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Hours required for cancellation without penalty
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Allow Same-Day Appointments
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to book appointments for today
                      </p>
                    </div>
                    <Switch
                      checked={formData.bookingRules.allowSameDay}
                      onCheckedChange={(value) =>
                        handleBookingToggle("allowSameDay", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow Rescheduling</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to reschedule existing appointments
                      </p>
                    </div>
                    <Switch
                      checked={formData.bookingRules.allowRescheduling}
                      onCheckedChange={(value) =>
                        handleBookingToggle("allowRescheduling", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow Cancellations</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to cancel appointments
                      </p>
                    </div>
                    <Switch
                      checked={formData.bookingRules.allowCancellations}
                      onCheckedChange={(value) =>
                        handleBookingToggle("allowCancellations", value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Information to Collect</Label>
                  <p className="text-sm text-muted-foreground">
                    Select which information to collect during booking
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {BOOKING_FIELDS.map((field) => {
                      const isSelected =
                        formData.bookingRules.collectFields.includes(field.id);
                      return (
                        <div
                          key={field.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-accent"
                          }`}
                          onClick={() => handleBookingFieldToggle(field.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{field.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {field.required ? "Required" : "Optional"}
                              </p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "border-border"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Escalation Tab */}
          <TabsContent value="escalation">
            <Card>
              <CardHeader>
                <CardTitle>Escalation Settings</CardTitle>
                <CardDescription>
                  Configure when and how calls should be escalated to human
                  agents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transferNumber">Transfer Number</Label>
                    <Input
                      id="transferNumber"
                      type="tel"
                      value={formData.escalation.transferNumber}
                      onChange={(e) =>
                        handleEscalationChange("transferNumber", e.target.value)
                      }
                      placeholder="+13015550124"
                    />
                    <p className="text-xs text-muted-foreground">
                      Phone number to transfer calls when escalation is needed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="followUpHours">
                      Follow-up Timeframe (hours)
                    </Label>
                    <Input
                      id="followUpHours"
                      type="number"
                      min="1"
                      max="168"
                      value={formData.escalation.followUpHours}
                      onChange={(e) =>
                        handleEscalationChange(
                          "followUpHours",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Hours within which escalated calls should be followed up
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow Voicemail</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow callers to leave voicemail when escalation fails
                      </p>
                    </div>
                    <Switch
                      checked={formData.escalation.allowVoicemail}
                      onCheckedChange={(value) =>
                        handleEscalationChange("allowVoicemail", value)
                      }
                    />
                  </div>

                  {formData.escalation.allowVoicemail && (
                    <div className="space-y-2">
                      <Label htmlFor="voicemailInstructions">
                        Voicemail Instructions
                      </Label>
                      <Textarea
                        id="voicemailInstructions"
                        value={formData.escalation.voicemailInstructions}
                        onChange={(e) =>
                          handleEscalationChange(
                            "voicemailInstructions",
                            e.target.value
                          )
                        }
                        className="min-h-20"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Escalation Triggers</Label>
                  <p className="text-sm text-muted-foreground">
                    Add conditions that should trigger escalation to human
                    agents
                  </p>

                  <div className="space-y-3">
                    {formData.escalation.escalateWhen.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                      >
                        <p className="text-sm">{rule}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEscalationRule(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={customRule}
                      onChange={(e) => setCustomRule(e.target.value)}
                      placeholder="Add a new escalation trigger..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEscalationRule();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addEscalationRule}
                      disabled={!customRule.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instructions Tab */}
          <TabsContent value="instructions">
            <Card>
              <CardHeader>
                <CardTitle>Additional Instructions</CardTitle>
                <CardDescription>
                  Provide custom instructions to guide your AI receptionist's
                  behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Textarea
                    value={formData.additionalInstructions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        additionalInstructions: e.target.value,
                      }))
                    }
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Enter detailed instructions for your AI receptionist..."
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Characters: {formData.additionalInstructions.length} |
                      Words:{" "}
                      {
                        formData.additionalInstructions
                          .split(/\s+/)
                          .filter(Boolean).length
                      }
                    </span>
                    <span>Markdown supported</span>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    Tips for effective instructions:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Be specific about your business processes</li>
                    <li>• Include examples of appropriate responses</li>
                    <li>• Define boundaries clearly</li>
                    <li>• Mention brand voice and tone preferences</li>
                    <li>• Include handling procedures for common scenarios</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Preview</CardTitle>
                <CardDescription>
                  Review your AI settings before saving
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Safety Rules</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-sm">
                          Medical Advice:{" "}
                          {formData.safety.disallowMedicalAdvice
                            ? "Blocked"
                            : "Allowed"}
                        </p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-sm">
                          Financial Advice:{" "}
                          {formData.safety.disallowFinancialAdvice
                            ? "Blocked"
                            : "Allowed"}
                        </p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-sm">
                          Confidentiality:{" "}
                          {formData.safety.maintainConfidentiality
                            ? "Enforced"
                            : "Not enforced"}
                        </p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-sm">
                          Complex Escalation:{" "}
                          {formData.safety.escalateComplexIssues
                            ? "Enabled"
                            : "Disabled"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Booking Rules</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-sm font-medium">Min Notice</p>
                        <p className="text-sm">
                          {formData.bookingRules.minNoticeHours} hours
                        </p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-sm font-medium">Max Days</p>
                        <p className="text-sm">
                          {formData.bookingRules.maxDaysAhead} days
                        </p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-sm font-medium">Same Day</p>
                        <p className="text-sm">
                          {formData.bookingRules.allowSameDay ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="p-2 bg-secondary rounded">
                        <p className="text-sm font-medium">Fields</p>
                        <p className="text-sm">
                          {formData.bookingRules.collectFields.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Escalation</h4>
                    <div className="p-3 bg-secondary rounded">
                      <p className="text-sm">
                        <span className="font-medium">Transfer Number:</span>{" "}
                        {formData.escalation.transferNumber || "Not set"}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Triggers:</span>{" "}
                        {formData.escalation.escalateWhen.length} rules
                        configured
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Voicemail:</span>{" "}
                        {formData.escalation.allowVoicemail
                          ? "Enabled"
                          : "Disabled"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Changes affect how your AI receptionist behaves
          </div>
          <Button type="submit" disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save AI Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
