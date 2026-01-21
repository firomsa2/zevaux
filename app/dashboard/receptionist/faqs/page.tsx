import { Metadata } from "next";
import FAQsForm from "@/components/knowledge/faqs";

export const metadata: Metadata = {
  title: "FAQs | Zevaux",
  description: "Manage frequently asked questions for your AI receptionist",
};

export default function FAQsPage() {
  return <FAQsForm />;
}
