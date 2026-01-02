import AISettingsForm from "@/components/receptionist/configure/ai-settings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Settings | Zevaux",
  description: "Configure AI behavior and personality settings",
};

export default function AIPage() {
  return <AISettingsForm />;
}
