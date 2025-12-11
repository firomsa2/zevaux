import { Metadata } from "next";
import VoiceSettingsForm from "@/components/receptionist/configure/voice-settings";

export const metadata: Metadata = {
  title: "Voice & Language | Zevaux",
  description: "Configure voice profiles and language settings",
};

export default function VoicePage() {
  return <VoiceSettingsForm />;
}
