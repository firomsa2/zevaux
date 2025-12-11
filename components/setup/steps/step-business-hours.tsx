"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIMEZONES = [
  "UTC",
  "EST",
  "CST",
  "MST",
  "PST",
  "GMT",
  "CET",
  "IST",
  "JST",
  "AEST",
];

export function StepBusinessHours({ config, onChange }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start">Start Time</Label>
          <Input
            id="start"
            type="time"
            value={config.business_hours_start}
            onChange={(e) => onChange({ business_hours_start: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="end">End Time</Label>
          <Input
            id="end"
            type="time"
            value={config.business_hours_end}
            onChange={(e) => onChange({ business_hours_end: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <Select
          value={config.timezone}
          onValueChange={(value) => onChange({ timezone: value })}
        >
          <SelectTrigger id="timezone" className="mt-2">
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

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Operating Hours:</strong> {config.business_hours_start} -{" "}
          {config.business_hours_end} {config.timezone}
        </p>
        <p className="text-xs text-blue-800 mt-2">
          Your AI receptionist will handle calls during these hours. After-hours
          calls will be routed to voicemail.
        </p>
      </div>
    </div>
  );
}
