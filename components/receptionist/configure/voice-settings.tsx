"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  Languages,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { toast, notify } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import VoiceSelection from "./voice-selection";
import { ReceptionistProgressWrapper } from "@/components/onboarding/receptionist-progress-wrapper";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
];

export default function VoiceSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [currentVoice, setCurrentVoice] = useState("alloy");
  const [shouldRefreshVoice, setShouldRefreshVoice] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    default_language: "en",
    supported_languages: ["en"],
    timezone: "America/New_York",
  });

  useEffect(() => {
    fetchBusinessData();
  }, [shouldRefreshVoice]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Get business data
      const { data: userData } = await supabase
        .from("users")
        .select("business_id")
        .eq("id", user.id)
        .maybeSingle();

      if (!userData?.business_id) throw new Error("No business found");
      setBusinessId(userData.business_id);

      // Get business config for voice
      const { data: configRes } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", userData.business_id)
        .maybeSingle();

      if (configRes?.config?.voiceProfile?.voice) {
        setCurrentVoice(configRes.config.voiceProfile.voice);
      }

      // Get business data for language/timezone
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", userData.business_id)
        .single();

      if (businessData) {
        setFormData({
          default_language: businessData.default_language || "en",
          supported_languages: businessData.supported_languages || ["en"],
          timezone: businessData.timezone || "America/New_York",
        });
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSaved = () => {
    // Trigger refresh to get updated voice
    setShouldRefreshVoice(!shouldRefreshVoice);
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

      // Ensure default language is always included
      if (!langs.includes(prev.default_language)) {
        langs.push(prev.default_language);
      }

      return { ...prev, supported_languages: langs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!businessId) throw new Error("No business ID found");

      // Update business language/timezone settings
      const businessUpdate = {
        default_language: formData.default_language,
        supported_languages: formData.supported_languages,
        timezone: formData.timezone,
        updated_at: new Date().toISOString(),
      };

      const { error: businessError } = await supabase
        .from("businesses")
        .update(businessUpdate)
        .eq("id", businessId);

      if (businessError) throw businessError;

      notify.settings.saved();

      // Trigger onboarding progress refresh
      triggerOnboardingRefresh();
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to save settings", {
        description: err.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <ReceptionistProgressWrapper />
      
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Languages className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Voice & Language
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              Configure voice profiles, language settings, and pronunciation preferences
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Language Settings Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  Language Settings
                </CardTitle>
                <CardDescription className="text-base pt-1">
                  Configure language preferences for your AI receptionist. These settings determine how your receptionist communicates with callers.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Language */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="default_language" className="text-base font-semibold">
                  Default Language
                </Label>
                <Badge variant="secondary" className="text-xs">Required</Badge>
              </div>
              <p className="text-sm text-muted-foreground -mt-1">
                The primary language your receptionist will use for conversations
              </p>
              <Select
                value={formData.default_language}
                onValueChange={(value) =>
                  handleChange("default_language", value)
                }
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Supported Languages */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold">
                  Supported Languages
                </Label>
                <Badge variant="outline" className="text-xs">
                  {formData.supported_languages.length} {formData.supported_languages.length === 1 ? 'language' : 'languages'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground -mt-1">
                Select which languages your receptionist can understand and respond in. The default language is always enabled.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
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
                      disabled={isDefault}
                      className={`
                        group relative px-5 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200
                        flex items-center gap-2.5 min-w-[140px]
                        ${
                          isDefault
                            ? "bg-primary text-primary-foreground border-primary shadow-md cursor-default"
                            : isSupported
                            ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/15 hover:border-primary/50 shadow-sm"
                            : "bg-background text-muted-foreground border-border hover:bg-accent hover:border-primary/30 hover:text-foreground"
                        }
                        ${isDefault ? "" : "hover:scale-105 active:scale-95"}
                      `}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {isDefault && (
                        <CheckCircle2 className="h-4 w-4 ml-auto" />
                      )}
                      {isSupported && !isDefault && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Click languages to enable or disable them. The default language cannot be disabled.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            Changes will affect how your receptionist communicates with callers
          </div>
          <Button 
            type="submit" 
            disabled={saving} 
            size="lg"
            className="min-w-[140px] shadow-md hover:shadow-lg transition-shadow"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Voice Selection Card */}
      {businessId && (
        <VoiceSelection
          businessId={businessId}
          currentVoice={currentVoice}
          onVoiceSaved={handleVoiceSaved}
        />
      )}
    </div>
  );
}
