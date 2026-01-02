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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const INDUSTRIES = [
  "Hair Salon",
  "Dental Clinic",
  "Medical Practice",
  "Law Firm",
  "Real Estate",
  "Restaurant",
  "Retail Store",
  "Fitness Studio",
  "Consulting",
  "Technology",
  "Education",
  "Hospitality",
  "Automotive",
  "Construction",
  "Other",
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "America/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Hong_Kong",
  "Australia/Sydney",
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
];

const TONES = [
  "Warm, friendly, simple, professional",
  "Formal and corporate",
  "Casual and conversational",
  "Empathetic and caring",
  "Energetic and enthusiastic",
  "Calm and reassuring",
];

import { triggerPromptWebhook } from "@/utils/webhooks";

export default function BusinessConfigForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    businessName: "",
    assistantName: "",
    description: "",
    industry: "",
    timezone: "America/New_York",
    default_language: "en",
    supported_languages: ["en"],
    tone: "Warm, friendly, simple, professional",
    phone_main: "",
    escalation_number: "",
    introScript: "",
    closingScript: "",
  });

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Get business data
      const { data: userData } = await supabase
        .from("users")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (!userData?.business_id) throw new Error("No business found");

      setBusinessId(userData.business_id);

      // Fetch business and config
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

      // Set form data from business
      if (businessRes.data) {
        setFormData({
          businessName: businessRes.data.name || "",
          assistantName: businessRes.data.assistant_name || "",
          description: businessRes.data.description || "",
          industry: businessRes.data.industry || "",
          timezone: businessRes.data.timezone || "America/New_York",
          default_language: businessRes.data.default_language || "en",
          supported_languages: businessRes.data.supported_languages || ["en"],
          tone: businessRes.data.tone || "Warm, friendly, simple, professional",
          phone_main: businessRes.data.phone_main || "",
          escalation_number: businessRes.data.escalation_number || "",
          introScript: configRes.data?.config?.introScript || "",
          closingScript: configRes.data?.config?.closingScript || "",
        });
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

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => {
      const langs = [...prev.supported_languages];
      const index = langs.indexOf(language);

      if (index > -1) {
        // Remove if it's not the default language
        if (language !== prev.default_language) {
          langs.splice(index, 1);
        }
      } else {
        langs.push(language);
      }

      return { ...prev, supported_languages: langs };
    });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setSaving(true);
  //   setError(null);
  //   setSuccess(false);

  //   try {
  //     if (!businessId) throw new Error("No business ID found");

  //     // Prepare business data
  //     const businessData = {
  //       name: formData.businessName.trim(),
  //       industry: formData.industry,
  //       timezone: formData.timezone,
  //       default_language: formData.default_language,
  //       supported_languages: formData.supported_languages,
  //       tone: formData.tone,
  //       phone_main: formData.phone_main || null,
  //       escalation_number: formData.escalation_number || null,
  //       updated_at: new Date().toISOString(),
  //     };

  //     // Prepare config data
  //     const configData = {
  //       business_id: businessId,
  //       config: {
  //         introScript: formData.introScript,
  //         closingScript: formData.closingScript,
  //       },
  //       updated_at: new Date().toISOString(),
  //     };

  //     // Update business
  //     const { error: businessError } = await supabase
  //       .from("businesses")
  //       .update(businessData)
  //       .eq("id", businessId);

  //     if (businessError) throw businessError;

  //     // Update or insert config
  //     const { error: configError } = await supabase
  //       .from("business_configs")
  //       .upsert(configData, {
  //         onConflict: "business_id",
  //       });

  //     if (configError) throw configError;

  //     // Update the prompt
  //     const { error: promptError } = await supabase.rpc(
  //       "update_business_prompt_trigger",
  //       { p_business_id: businessId }
  //     );

  //     if (promptError) {
  //       console.warn("Prompt update failed:", promptError);
  //     }

  //     setSuccess(true);
  //     toast({
  //       title: "Success",
  //       description: "Business configuration saved successfully",
  //       variant: "default",
  //     });

  //     // Refresh data
  //     setTimeout(() => {
  //       fetchBusinessData();
  //     }, 1000);
  //   } catch (err: any) {
  //     setError(err.message);
  //     toast({
  //       title: "Error",
  //       description: err.message,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // components/dashboard/configure/business-config.tsx (partial update)
  // Update the handleSubmit function:

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (!businessId) throw new Error("No business ID found");

      // Prepare business data
      const businessData = {
        name: formData.businessName.trim(),
        assistant_name: formData.assistantName.trim(),
        description: formData.description.trim(),
        industry: formData.industry,
        timezone: formData.timezone,
        default_language: formData.default_language,
        supported_languages: formData.supported_languages,
        tone: formData.tone,
        phone_main: formData.phone_main || null,
        escalation_number: formData.escalation_number || null,
        updated_at: new Date().toISOString(),
      };

      // Get existing config
      const { data: existingConfig } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", businessId)
        .single();

      // Prepare config data with introScript and closingScript
      const configData = {
        business_id: businessId,
        config: {
          ...(existingConfig?.config || {}),
          introScript: formData.introScript,
          closingScript: formData.closingScript,
        },
        updated_at: new Date().toISOString(),
      };

      // Update business
      const { error: businessError } = await supabase
        .from("businesses")
        .update(businessData)
        .eq("id", businessId);

      if (businessError) throw businessError;

      // Update or insert config
      const { error: configError } = await supabase
        .from("business_configs")
        .upsert(configData, {
          onConflict: "business_id",
        });

      if (configError) throw configError;

      // Update the prompt
      const { error: promptError } = await supabase.rpc(
        "update_business_prompt_trigger",
        { p_business_id: businessId }
      );

      if (promptError) {
        console.warn("Prompt update failed:", promptError);
      }

      // Trigger webhook
      await triggerPromptWebhook(businessId);

      setSuccess(true);
      toast({
        title: "Success",
        description: "Business configuration saved successfully",
        variant: "default",
      });

      // Refresh data
      setTimeout(() => {
        fetchBusinessData();
      }, 1000);
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
        <h1 className="text-3xl font-bold tracking-tight">
          Business Configuration
        </h1>
        <p className="text-muted-foreground">
          Configure your business details and receptionist settings
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configuration saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Business Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your business name and industry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  placeholder="Glow & Grace Hair Studio"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assistantName">Assistant Name *</Label>
                <Input
                  id="assistantName"
                  value={formData.assistantName}
                  onChange={(e) =>
                    handleChange("assistantName", e.target.value)
                  }
                  placeholder="Zevaux"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder=" "
                  className="min-h-20"
                />
                <p className="text-xs text-muted-foreground">
                  Short description of your business.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => handleChange("industry", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Phone numbers for your business, only support twilio currently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_main">Phone Number</Label>
                <Input
                  id="phone_main"
                  value={formData.phone_main}
                  onChange={(e) => handleChange("phone_main", e.target.value)}
                  placeholder="+13015550123"
                  type="tel"
                />
                <p className="text-xs text-muted-foreground">
                  This is the number customers will call
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="escalation_number">Fallback Number</Label>
                <Input
                  id="escalation_number"
                  value={formData.escalation_number}
                  onChange={(e) =>
                    handleChange("escalation_number", e.target.value)
                  }
                  placeholder="+13015550124"
                  type="tel"
                />
                <p className="text-xs text-muted-foreground">
                  Tranfer call here when the assistant is unavailable
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Language Settings */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Language Settings</CardTitle>
            <CardDescription>
              Configure language preferences for your receptionist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="default_language">Default Language *</Label>
                <Select
                  value={formData.default_language}
                  onValueChange={(value) =>
                    handleChange("default_language", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleChange("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Supported Languages</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => {
                  const isSupported = formData.supported_languages.includes(
                    lang.code
                  );
                  const isDefault = formData.default_language === lang.code;

                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageToggle(lang.code)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm border transition-colors
                        ${
                          isDefault
                            ? "bg-primary text-primary-foreground border-primary"
                            : isSupported
                            ? "bg-secondary text-secondary-foreground border-secondary"
                            : "bg-background text-muted-foreground border-border hover:bg-accent"
                        }
                      `}
                    >
                      {lang.name}
                      {isDefault && " (Default)"}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Click languages to enable/disable. Default language cannot be
                disabled.
              </p>
            </div>
          </CardContent>
        </Card> */}

        {/* Tone & Scripts */}
        <Card>
          <CardHeader>
            <CardTitle>Tone & Scripts</CardTitle>
            <CardDescription>
              Define the personality and greeting messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Receptionist Tone *</Label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) => handleChange("tone", value)}
                >
                  <SelectTrigger>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="introScript">Greeting Message</Label>
                  <Textarea
                    id="introScript"
                    value={formData.introScript}
                    onChange={(e) =>
                      handleChange("introScript", e.target.value)
                    }
                    placeholder="Thank you for calling A and B Service. This is the virtual assistant. How can I help you today?"
                    className="min-h-20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Custom greeting when calls are answered.
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
                    placeholder="Thank you for calling A and B Service. Have a great day!"
                    className="min-h-20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Custom closing message at the end of calls.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            All changes are saved automatically
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
