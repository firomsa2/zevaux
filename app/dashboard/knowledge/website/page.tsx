import { Metadata } from "next";
import WebsiteForm from "@/components/knowledge/website";

export const metadata: Metadata = {
  title: "Website Content | Zevaux",
  description: "Import content from your website for AI training",
};

export default function WebsitePage() {
  return <WebsiteForm />;
}