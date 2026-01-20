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
  Mic,
  Volume2,
  Languages,
} from "lucide-react";
import { toast, notify } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VoiceSelection from "./voice-selection";
import { ReceptionistProgressWrapper } from "@/components/onboarding/receptionist-progress-wrapper";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";

const LANGUAGES1 = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReceptionistProgressWrapper />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voice & Language</h1>
        <p className="text-muted-foreground">
          Configure voice profiles, language settings, and pronunciation
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Language Settings Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Language Settings
            </CardTitle>
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
                    {LANGUAGES1.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Supported Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES1.map((lang) => {
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
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
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
                      {tz.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Changes affect voice and language behavior
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
          onVoiceSaved={handleVoiceSaved} // Changed from onVoiceChange
        />
      )}
    </div>
  );
}
