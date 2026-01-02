import BusinessConfigForm from "@/components/receptionist/configure/business-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Configuration | Zevaux",
  description: "Configure your business details and receptionist settings",
};

export default function ConfigurePage() {
  return <BusinessConfigForm />;
}
