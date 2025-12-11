"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function StepPhoneNumber({ config, onChange }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Phone Number Options</CardTitle>
          <CardDescription>Choose how to set up your phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="new">
            <div className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="cursor-pointer">
                Get a new Zevaux phone number
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="cursor-pointer">
                Connect existing Twilio number
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="phone">Your Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={config.phone_number}
          onChange={(e) => onChange({ phone_number: e.target.value })}
          className="mt-2"
        />
        <p className="text-xs text-text-tertiary mt-2">
          This is the number your customers will call to reach your AI receptionist
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Phone number assignment is handled through Vapi integration. You'll receive your number
          after activation.
        </p>
      </div>
    </div>
  )
}
