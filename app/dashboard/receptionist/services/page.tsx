import { Metadata } from "next";
import ServicesForm from "@/components/receptionist/configure/services";

export const metadata: Metadata = {
  title: "Services | Zevaux",
  description: "Configure your business services and offerings",
};

export default function ServicesPage() {
  return <ServicesForm />;
}