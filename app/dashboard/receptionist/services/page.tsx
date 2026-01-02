import ServicesForm from "@/components/receptionist/configure/services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Zevaux",
  description: "Configure your business services and offerings",
};

export default function ServicesPage() {
  return <ServicesForm />;
}
