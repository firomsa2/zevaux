import { Metadata } from "next";
import DocumentsForm from "@/components/knowledge/documents";

export const metadata: Metadata = {
  title: "Documents | Zevaux",
  description: "Upload and manage documents for AI training",
};

export default function DocumentsPage() {
  return <DocumentsForm />;
}