"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";

export function ReceptionistSettings({ receptionistConfig, userId }: any) {
  const [config, setConfig] = useState(receptionistConfig || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    // try {
    //   if (receptionistConfig?.id) {
    //     const { error: updateError } = await supabase
    //       .from("receptionist_config")
    //       .update(config)
    //       .eq("id", receptionistConfig.id);

    //     if (updateError) throw updateError;
    //   } else {
    //     const { error: insertError } = await supabase
    //       .from("receptionist_config")
    //       .insert({
    //         user_id: userId,
    //         ...config,
    //       });

    //     if (insertError) throw insertError;
    //   }

    //   setSuccess(true);
    //   setTimeout(() => setSuccess(false), 3000);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "Failed to save settings");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Configuration</CardTitle>
          <CardDescription>
            Customize your AI receptionist's voice and personality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
              Settings updated successfully
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone">Voice Tone</Label>
              <Select
                value={config.voice_tone || ""}
                onValueChange={(value) =>
                  setConfig({ ...config, voice_tone: value })
                }
              >
                <SelectTrigger id="tone" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">Voice Gender</Label>
              <Select
                value={config.voice_gender || ""}
                onValueChange={(value) =>
                  setConfig({ ...config, voice_gender: value })
                }
              >
                <SelectTrigger id="gender" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="greeting">Greeting Message</Label>
            <Textarea
              id="greeting"
              value={config.greeting_message || ""}
              onChange={(e) =>
                setConfig({ ...config, greeting_message: e.target.value })
              }
              placeholder="Hello, thank you for calling..."
              className="mt-2 min-h-24"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Saving..." : "Save Voice Settings"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours & Escalation</CardTitle>
          <CardDescription>
            Set your operating hours and escalation contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="time"
                value={config.business_hours_start || ""}
                onChange={(e) =>
                  setConfig({ ...config, business_hours_start: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="time"
                value={config.business_hours_end || ""}
                onChange={(e) =>
                  setConfig({ ...config, business_hours_end: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Fallback Email</Label>
            <Input
              id="email"
              type="email"
              value={config.fallback_email || ""}
              onChange={(e) =>
                setConfig({ ...config, fallback_email: e.target.value })
              }
              placeholder="support@example.com"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">Fallback Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={config.fallback_phone || ""}
              onChange={(e) =>
                setConfig({ ...config, fallback_phone: e.target.value })
              }
              placeholder="+1 (555) 000-0000"
              className="mt-2"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Saving..." : "Save Business Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
