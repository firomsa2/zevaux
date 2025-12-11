"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function StepGreeting({ config, onChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="greeting">Greeting Message</Label>
        <Textarea
          id="greeting"
          placeholder="Hello, thank you for calling. How can I help you?"
          value={config.greeting_message}
          onChange={(e) => onChange({ greeting_message: e.target.value })}
          className="mt-2 min-h-24"
        />
        <p className="text-xs text-text-tertiary mt-2">
          This is the first message your AI receptionist will say when answering
          calls
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <strong>Preview:</strong> "{config.greeting_message}"
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-medium">Quick Templates:</p>
        <div className="grid gap-2">
          {[
            "Hello, thank you for calling. How can I help you?",
            "Hi there! Welcome to our business. What can I assist you with?",
            "Good day! Thank you for reaching out. How may I be of service?",
          ].map((template, idx) => (
            <button
              key={idx}
              onClick={() => onChange({ greeting_message: template })}
              className="text-left p-3 border border-border rounded-lg hover:bg-surface transition-colors text-sm"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
