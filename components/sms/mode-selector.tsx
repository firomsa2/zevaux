"use client";

import { SMSMode } from "@/types/sms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bot, Users, CheckCircle, Clock } from "lucide-react";

interface ModeSelectorProps {
  currentMode: SMSMode;
  onModeChange: (mode: SMSMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modes = [
    {
      value: 'fully_ai' as SMSMode,
      label: 'Fully AI',
      description: 'AI processes and sends SMS automatically',
      icon: Bot,
      features: ['Auto-processing', 'Instant sending', 'No approval needed']
    },
    {
      value: 'hybrid' as SMSMode,
      label: 'Hybrid',
      description: 'AI processes SMS, human approval required',
      icon: Users,
      features: ['AI generation', 'Human review', 'Manual approval']
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Processing Mode</CardTitle>
        <CardDescription>
          Choose how SMS messages are processed and sent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={currentMode} onValueChange={onModeChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modes.map((mode) => (
            <div key={mode.value}>
              <RadioGroupItem
                value={mode.value}
                id={mode.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={mode.value}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <mode.icon className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">{mode.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {mode.description}
                    </div>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}