"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
  Pencil,
  X,
} from "lucide-react";
import { toast, notify } from "@/lib/toast";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";
import { INDUSTRIES } from "@/lib/constants";
import { triggerPromptWebhook } from "@/utils/webhooks";
import { ReceptionistProgressWrapper } from "@/components/onboarding/receptionist-progress-wrapper";

const TONES = [
  "Warm, friendly, simple, professional",
  "Formal and corporate",
  "Casual and conversational",
  "Empathetic and caring",
  "Energetic and enthusiastic",
  "Calm and reassuring",
];

export default function BusinessConfigForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    businessName: "",
    assistantName: "",
    description: "",
    industry: "",
    industryOther: "",
    tone: "Warm, friendly, simple, professional",
    phone_main: "",
    escalation_number: "",
    introScript: "",
    closingScript: "",
  });

  const [originalData, setOriginalData] = useState<typeof formData | null>(
    null,
  );

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
        .single();

      if (!userData?.business_id) throw new Error("No business found");
      setBusinessId(userData.business_id);

      const [businessRes, configRes] = await Promise.all([
        supabase
          .from("businesses")
          .select("*")
          .eq("id", userData.business_id)
          .maybeSingle(),
        supabase
          .from("business_configs")
          .select("*")
          .eq("business_id", userData.business_id)
          .maybeSingle(),
      ]);

      if (businessRes.error) throw businessRes.error;

      if (businessRes.data) {
        let normalizedIndustry = businessRes.data.industry || "";
        let industryOther = "";

        const match = INDUSTRIES.find(
          (i) => i.toLowerCase() === normalizedIndustry.toLowerCase(),
        );

        if (match) {
          normalizedIndustry = match;
        } else if (normalizedIndustry) {
          industryOther = normalizedIndustry;
          normalizedIndustry = "Other";
        }

        const initialData = {
          businessName: businessRes.data.name || "",
          assistantName: businessRes.data.assistant_name || "",
          description: businessRes.data.description || "",
          industry: normalizedIndustry,
          industryOther: industryOther,
          tone: businessRes.data.tone || "Warm, friendly, simple, professional",
          phone_main: businessRes.data.phone_main || "",
          escalation_number: businessRes.data.escalation_number || "",
          introScript: configRes.data?.config?.introScript || "",
          closingScript: configRes.data?.config?.closingScript || "",
        };

        setFormData(initialData);
        setOriginalData(initialData);
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (!businessId) throw new Error("No business ID found");

      const industryValue =
        formData.industry === "Other"
          ? formData.industryOther || "Other"
          : formData.industry;

      const businessData = {
        name: formData.businessName.trim(),
        assistant_name: formData.assistantName.trim(),
        description: formData.description.trim(),
        industry: industryValue,
        tone: formData.tone,
        phone_main: formData.phone_main || null,
        escalation_number: formData.escalation_number || null,
        updated_at: new Date().toISOString(),
      };

      const { data: existingConfig } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", businessId)
        .single();

      const configData = {
        business_id: businessId,
        config: {
          ...(existingConfig?.config || {}),
          introScript: formData.introScript,
          closingScript: formData.closingScript,
        },
        updated_at: new Date().toISOString(),
      };

      const { error: businessError } = await supabase
        .from("businesses")
        .update(businessData)
        .eq("id", businessId);

      if (businessError) throw businessError;

      const { error: configError } = await supabase
        .from("business_configs")
        .upsert(configData, {
          onConflict: "business_id",
        });

      if (configError) throw configError;

      const { error: promptError } = await supabase.rpc(
        "update_business_prompt_trigger",
        { p_business_id: businessId },
      );

      if (promptError) {
        console.warn("Prompt update failed:", promptError);
      }

      await triggerPromptWebhook(businessId);

      setSuccess(true);
      notify.settings.saved();

      setIsEditing(false);
      setOriginalData(formData);
      triggerOnboardingRefresh();

      setTimeout(() => {
        fetchBusinessData();
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to save configuration", {
        description: err.message,
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
    <div className="max-w-4xl mx-auto space-y-6">
      <ReceptionistProgressWrapper />

      <div>
        <h1 className="text-2xl font-bold">Business Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your business details and receptionist settings
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* {success && (
        <Alert className="bg-green-50 border-green-200 animate-in fade-in">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configuration saved successfully!
          </AlertDescription>
        </Alert>
      )} */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Settings Card */}
        <Card className="border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>Core business information</CardDescription>
              </div>
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleChange("businessName", e.target.value)
                    }
                    placeholder="Glow & Grace Hair Studio"
                    required
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assistantName">Assistant Name</Label>
                  <Input
                    id="assistantName"
                    value={formData.assistantName}
                    onChange={(e) =>
                      handleChange("assistantName", e.target.value)
                    }
                    placeholder="Zevaux"
                    required
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description of your business"
                  className={`min-h-20 ${!isEditing ? "bg-muted/50" : ""}`}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="industry">Industry</Label>
                  <div className="flex flex-col sm:items-center gap-1 sm:flex-row">
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleChange("industry", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger
                        className={!isEditing ? "bg-muted/50" : ""}
                      >
                        <SelectValue placeholder="Select Industry..." />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {formData.industry === "Other" && (
                      <Input
                        value={formData.industryOther}
                        onChange={(e) =>
                          handleChange("industryOther", e.target.value)
                        }
                        placeholder="Specify your industry"
                        className={`${!isEditing ? "bg-muted/50" : ""}`}
                        disabled={!isEditing}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Assistant Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => handleChange("tone", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? "bg-muted/50" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="escalation_number">Escalation Number</Label>
                  <Input
                    id="escalation_number"
                    value={formData.escalation_number}
                    onChange={(e) =>
                      handleChange("escalation_number", e.target.value)
                    }
                    placeholder="+1 (555) 987-6543"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            {/* <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_main">Main Phone</Label>
                  <Input
                    id="phone_main"
                    value={formData.phone_main}
                    onChange={(e) => handleChange("phone_main", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escalation_number">Escalation Number</Label>
                  <Input
                    id="escalation_number"
                    value={formData.escalation_number}
                    onChange={(e) =>
                      handleChange("escalation_number", e.target.value)
                    }
                    placeholder="+1 (555) 987-6543"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
              </div>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="introScript">Greeting Message</Label>
                <Textarea
                  id="introScript"
                  value={formData.introScript}
                  onChange={(e) => handleChange("introScript", e.target.value)}
                  placeholder="Thank you for calling [Business]. This is [Assistant]. How can I help you today?"
                  className={`min-h-20 ${!isEditing ? "bg-muted/50" : ""}`}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  First message when calls are answered
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingScript">Closing Message</Label>
                <Textarea
                  id="closingScript"
                  value={formData.closingScript}
                  onChange={(e) =>
                    handleChange("closingScript", e.target.value)
                  }
                  placeholder="Thank you for calling [Business]. Have a great day!"
                  className={`min-h-20 ${!isEditing ? "bg-muted/50" : ""}`}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Final message at the end of calls
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scripts Card */}
        {/* <Card className="border">
          <CardHeader>
            <CardTitle>Conversation Scripts</CardTitle>
            <CardDescription>
              Customize how your assistant responds
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="introScript">Greeting Message</Label>
                <Textarea
                  id="introScript"
                  value={formData.introScript}
                  onChange={(e) => handleChange("introScript", e.target.value)}
                  placeholder="Thank you for calling [Business]. This is [Assistant]. How can I help you today?"
                  className={`min-h-32 ${!isEditing ? "bg-muted/50" : ""}`}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  First message when calls are answered
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingScript">Closing Message</Label>
                <Textarea
                  id="closingScript"
                  value={formData.closingScript}
                  onChange={(e) =>
                    handleChange("closingScript", e.target.value)
                  }
                  placeholder="Thank you for calling [Business]. Have a great day!"
                  className={`min-h-32 ${!isEditing ? "bg-muted/50" : ""}`}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Final message at the end of calls
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Action Bar */}
        {isEditing && (
          <div className="sticky bottom-6 z-50">
            <div className="max-w-4xl mx-auto bg-background/95 backdrop-blur rounded-lg border shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Editing mode is active
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={saving}
                    onClick={handleCancel}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
