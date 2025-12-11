"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function StepFallback({ config, onChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="email">Fallback Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="support@example.com"
          value={config.fallback_email}
          onChange={(e) => onChange({ fallback_email: e.target.value })}
          className="mt-2"
        />
        <p className="text-xs text-text-tertiary mt-2">
          Email address for escalated calls or when AI confidence is low
        </p>
      </div>

      <div>
        <Label htmlFor="phone">Fallback Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={config.fallback_phone}
          onChange={(e) => onChange({ fallback_phone: e.target.value })}
          className="mt-2"
        />
        <p className="text-xs text-text-tertiary mt-2">
          Phone number to transfer calls when human assistance is needed
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Escalation:</strong> When the AI receptionist cannot handle a
          request, it will automatically escalate to your fallback contacts.
        </p>
      </div>
    </div>
  );
}
