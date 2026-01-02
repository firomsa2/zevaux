import BusinessHoursForm from "@/components/receptionist/configure/business-hours";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Hours | Zevaux",
  description: "Configure your business hours and availability",
};

export default function HoursPage() {
  return <BusinessHoursForm />;
}
