"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function StepReview({ config }: any) {
  const reviewItems = [
    { label: "Phone Number", value: config.phone_number || "To be assigned" },
    { label: "Voice Tone", value: config.voice_tone },
    { label: "Language", value: config.language },
    { label: "Voice Gender", value: config.voice_gender },
    {
      label: "Business Hours",
      value: `${config.business_hours_start} - ${config.business_hours_end}`,
    },
    { label: "Timezone", value: config.timezone },
    { label: "Fallback Email", value: config.fallback_email || "Not set" },
    { label: "Fallback Phone", value: config.fallback_phone || "Not set" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Configuration Summary
          </CardTitle>
          <CardDescription>
            Review your settings before activation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center pb-4 border-b border-border last:border-0"
              >
                <span className="text-sm font-medium text-text-secondary">
                  {item.label}
                </span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <p className="text-sm text-green-900">
            <strong>Ready to go live!</strong> Click "Activate Receptionist" to
            start receiving calls. Your AI receptionist will be live within
            minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
