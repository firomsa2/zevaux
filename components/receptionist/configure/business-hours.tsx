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
import { Loader2, Save, AlertCircle, Clock, Plus, Trash2 } from "lucide-react";
import { toast, notify } from "@/lib/toast";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { triggerPromptWebhook } from "@/utils/webhooks";
import { ReceptionistProgressWrapper } from "@/components/onboarding/receptionist-progress-wrapper";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";

const DAYS = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
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

interface TimeSlot {
  open: string;
  close: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

export default function BusinessHoursForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const supabase = createClient();

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    monday: { enabled: true, slots: [{ open: "09:00", close: "17:00" }] },
    tuesday: { enabled: true, slots: [{ open: "09:00", close: "17:00" }] },
    wednesday: { enabled: true, slots: [{ open: "09:00", close: "17:00" }] },
    thursday: { enabled: true, slots: [{ open: "09:00", close: "17:00" }] },
    friday: { enabled: true, slots: [{ open: "09:00", close: "17:00" }] },
    saturday: { enabled: false, slots: [{ open: "09:00", close: "12:00" }] },
    sunday: { enabled: false, slots: [{ open: "09:00", close: "12:00" }] },
  });
  const [formData, setFormData] = useState({
    timezone: "America/New_York",
  });

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

      const { data: configRes } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", userData.business_id)
        .single();

      if (configRes?.config?.hours) {
        // Transform stored hours to match our format
        const storedSchedule: Record<string, DaySchedule> = {};
        DAYS.forEach((day) => {
          const dayHours = configRes.config.hours[day.id];
          if (dayHours && dayHours.length > 0) {
            storedSchedule[day.id] = {
              enabled: true,
              slots: dayHours.map((slot: any) => ({
                open: slot.open || "09:00",
                close: slot.close || "17:00",
              })),
            };
          } else {
            storedSchedule[day.id] = {
              enabled: false,
              slots: [{ open: "09:00", close: "17:00" }],
            };
          }
        });
        setSchedule(storedSchedule);
      }
      // Get business name for pronunciation
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", userData.business_id)
        .single();

      if (businessData?.timezone) {
        setFormData((prev) => {
          console.log("🚀 ~ fetchBusinessData ~ prev:", prev);
          return {
            ...prev,
            timezone: businessData.timezone,
          };
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

  const toggleDay = (dayId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled: !prev[dayId].enabled,
      },
    }));
  };

  const updateTimeSlot = (
    dayId: string,
    slotIndex: number,
    field: "open" | "close",
    value: string
  ) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const newSlots = [...newSchedule[dayId].slots];
      newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
      newSchedule[dayId] = { ...newSchedule[dayId], slots: newSlots };
      return newSchedule;
    });
  };

  const addTimeSlot = (dayId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        slots: [...prev[dayId].slots, { open: "09:00", close: "17:00" }],
      },
    }));
  };

  const removeTimeSlot = (dayId: string, slotIndex: number) => {
    if (schedule[dayId].slots.length <= 1) return;

    setSchedule((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        slots: prev[dayId].slots.filter((_, index) => index !== slotIndex),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!businessId) throw new Error("No business ID found");

      // Persist language/timezone settings to businesses table
      const businessUpdate = {
        timezone: formData.timezone,
        updated_at: new Date().toISOString(),
      };

      const { error: businessError } = await supabase
        .from("businesses")
        .update(businessUpdate)
        .eq("id", businessId);

      if (businessError) throw businessError;

      // Transform schedule to match database format
      const hours: Record<string, TimeSlot[]> = {};
      DAYS.forEach((day) => {
        if (schedule[day.id].enabled && schedule[day.id].slots.length > 0) {
          hours[day.id] = schedule[day.id].slots.filter(
            (slot) => slot.open && slot.close && slot.open !== slot.close
          );
        } else {
          hours[day.id] = [];
        }
      });

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
          hours,
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

      // Trigger webhook
      await triggerPromptWebhook(businessId);

      notify.settings.saved();

      // Trigger onboarding progress refresh
      triggerOnboardingRefresh();
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to save hours", {
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
        <h1 className="text-3xl font-bold tracking-tight">Business Hours</h1>
        <p className="text-muted-foreground">
          Configure when your receptionist should be available
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Schedule
                </CardTitle>
                <CardDescription>
                  Set your business hours for each day of the week
                </CardDescription>
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
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {DAYS.map((day) => (
                <div key={day.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={schedule[day.id].enabled}
                        onCheckedChange={() => toggleDay(day.id)}
                      />
                      <Label className="font-medium cursor-pointer">
                        {day.label}
                      </Label>
                    </div>
                    {schedule[day.id].enabled && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(day.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Time Slot
                      </Button>
                    )}
                  </div>

                  {schedule[day.id].enabled && (
                    <div className="space-y-3 pl-10">
                      {schedule[day.id].slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={slot.open}
                              onChange={(e) =>
                                updateTimeSlot(
                                  day.id,
                                  slotIndex,
                                  "open",
                                  e.target.value
                                )
                              }
                              className="w-32"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={slot.close}
                              onChange={(e) =>
                                updateTimeSlot(
                                  day.id,
                                  slotIndex,
                                  "close",
                                  e.target.value
                                )
                              }
                              className="w-32"
                            />
                          </div>
                          {schedule[day.id].slots.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTimeSlot(day.id, slotIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!schedule[day.id].enabled && (
                    <div className="pl-10">
                      <p className="text-sm text-muted-foreground italic">
                        Closed
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="pt-6 border-t">
              <h3 className="font-medium mb-3">Schedule Preview</h3>
              <div className="bg-muted rounded-lg p-4">
                <div className="space-y-2">
                  {DAYS.map((day) => {
                    const daySchedule = schedule[day.id];
                    return (
                      <div
                        key={day.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="font-medium">{day.label}:</span>
                        <span>
                          {daySchedule.enabled &&
                          daySchedule.slots.length > 0 ? (
                            daySchedule.slots
                              .map((slot) => `${slot.open} - ${slot.close}`)
                              .join(", ")
                          ) : (
                            <span className="text-muted-foreground italic">
                              Closed
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t">
              <div className="flex justify-end">
                <Button type="submit" disabled={saving} size="lg">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Hours
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
