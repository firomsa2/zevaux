import { Metadata } from "next";
import DocumentsManager from "@/components/receptionist/documents-manager";

export const metadata: Metadata = {
  title: "Documents | Zevaux",
  description: "Upload and manage documents for AI training",
};

export default function DocumentsPage() {
  return <DocumentsManager />;
}
