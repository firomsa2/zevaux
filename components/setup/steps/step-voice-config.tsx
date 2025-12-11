"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

const VOICE_TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
]

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
]

const VOICE_GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "neutral", label: "Neutral" },
]

export function StepVoiceConfig({ config, onChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="tone">Voice Tone</Label>
        <Select value={config.voice_tone} onValueChange={(value) => onChange({ voice_tone: value })}>
          <SelectTrigger id="tone" className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOICE_TONES.map((tone) => (
              <SelectItem key={tone.value} value={tone.value}>
                {tone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-text-tertiary mt-2">Choose the personality of your AI receptionist</p>
      </div>

      <div>
        <Label htmlFor="language">Language</Label>
        <Select value={config.language} onValueChange={(value) => onChange({ language: value })}>
          <SelectTrigger id="language" className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-text-tertiary mt-2">Select the primary language for conversations</p>
      </div>

      <div>
        <Label htmlFor="gender">Voice Gender</Label>
        <Select value={config.voice_gender} onValueChange={(value) => onChange({ voice_gender: value })}>
          <SelectTrigger id="gender" className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOICE_GENDERS.map((gender) => (
              <SelectItem key={gender.value} value={gender.value}>
                {gender.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-text-tertiary mt-2">Choose the voice gender for your receptionist</p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <strong>Preview:</strong> Your receptionist will speak with a {config.voice_tone} {config.voice_gender}{" "}
            voice in {LANGUAGES.find((l) => l.value === config.language)?.label}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
