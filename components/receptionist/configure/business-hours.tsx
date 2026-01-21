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
import { Loader2, Save, AlertCircle, Clock, Plus, Trash2, Globe } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { triggerPromptWebhook } from "@/utils/webhooks";
import { ReceptionistProgressWrapper } from "@/components/onboarding/receptionist-progress-wrapper";
import { triggerOnboardingRefresh } from "@/utils/onboarding-refresh";

const DAYS = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
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
      
      const { data: businessData } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", userData.business_id)
        .single();

      if (businessData?.timezone) {
        setFormData((prev) => ({
          ...prev,
          timezone: businessData.timezone,
        }));
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

      // Persist timezone settings to businesses table
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
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    );
  }

  const enabledDaysCount = DAYS.filter(day => schedule[day.id].enabled).length;

  return (
    <div className="space-y-8 pb-8">
      <ReceptionistProgressWrapper />
      
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Business Hours
            </h1>
            <p className="text-muted-foreground mt-1 text-base">
              Configure when your AI receptionist should be available to handle calls
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  Weekly Schedule
                </CardTitle>
                <CardDescription className="text-base pt-1">
                  Set your business hours for each day of the week. Your receptionist will only be available during these times.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {/* Timezone Selection */}
            <div className="space-y-3 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Label htmlFor="timezone" className="text-base font-semibold">
                  Timezone
                </Label>
                <Badge variant="secondary" className="text-xs">Required</Badge>
              </div>
              <p className="text-sm text-muted-foreground -mt-1">
                Select the timezone for your business location
              </p>
              <Select
                value={formData.timezone}
                onValueChange={(value) => handleChange("timezone", value)}
              >
                <SelectTrigger id="timezone" className="h-12 text-base max-w-md">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Days Schedule */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-base font-semibold">Weekly Schedule</Label>
                <Badge variant="outline" className="text-xs">
                  {enabledDaysCount} {enabledDaysCount === 1 ? 'day' : 'days'} active
                </Badge>
              </div>
              
              <div className="space-y-3">
                {DAYS.map((day) => {
                  const daySchedule = schedule[day.id];
                  const isWeekend = day.id === "saturday" || day.id === "sunday";
                  
                  return (
                    <div
                      key={day.id}
                      className={`
                        rounded-lg border-2 p-4 transition-all duration-200
                        ${daySchedule.enabled 
                          ? "border-primary/30 bg-primary/5" 
                          : "border-border bg-muted/30"
                        }
                        ${isWeekend ? "opacity-90" : ""}
                      `}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={daySchedule.enabled}
                            onCheckedChange={() => toggleDay(day.id)}
                          />
                          <Label className="font-semibold text-base cursor-pointer">
                            {day.label}
                          </Label>
                          {isWeekend && (
                            <Badge variant="outline" className="text-xs">
                              Weekend
                            </Badge>
                          )}
                        </div>
                        {daySchedule.enabled && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(day.id)}
                            className="h-8"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Add Slot
                          </Button>
                        )}
                      </div>

                      {daySchedule.enabled ? (
                        <div className="space-y-2.5 pl-11">
                          {daySchedule.slots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className="flex items-center gap-3 p-2.5 rounded-md bg-background border border-border/50"
                            >
                              <div className="flex items-center gap-2.5 flex-1">
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
                                  className="w-32 h-9"
                                />
                                <span className="text-muted-foreground text-sm font-medium">to</span>
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
                                  className="w-32 h-9"
                                />
                              </div>
                              {daySchedule.slots.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTimeSlot(day.id, slotIndex)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="pl-11">
                          <p className="text-sm text-muted-foreground italic">
                            Closed
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Quick Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold">Quick Preview</Label>
                <Badge variant="outline" className="text-xs">
                  {formData.timezone.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {DAYS.map((day) => {
                    const daySchedule = schedule[day.id];
                    return (
                      <div
                        key={day.id}
                        className="flex justify-between items-center text-sm py-1"
                      >
                        <span className="font-medium text-muted-foreground">
                          {day.short}:
                        </span>
                        <span className="font-medium">
                          {daySchedule.enabled && daySchedule.slots.length > 0 ? (
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
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            Changes will affect when your receptionist is available
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
                Save Hours
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
