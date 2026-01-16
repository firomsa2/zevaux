import { createClient } from "@/utils/supabase/client";

export async function triggerPromptWebhook(businessId: string) {
  try {
    const response = await fetch("/api/webhook/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ business_id: businessId }),
    });

    if (!response.ok) {
      console.error("Failed to trigger prompt webhook");
    }
  } catch (error) {
    console.error("Error triggering prompt webhook:", error);
  }
}

export async function triggerKnowledgeDocumentWebhook(
  businessId: string,
  documentId: string,
  filePath: string
) {
  try {
    const response = await fetch("/api/webhook/knowledge/document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_id: businessId,
        document_id: documentId,
        file_path: filePath,
      }),
    });

    if (!response.ok) {
      console.error("Failed to trigger knowledge document webhook");
    }
  } catch (error) {
    console.error("Error triggering knowledge document webhook:", error);
  }
}

export async function triggerKnowledgeWebsiteWebhook(
  businessId: string,
  sourceUrl: string,
  documentId: string
) {
  try {
    const response = await fetch("/api/webhook/knowledge/website", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_id: businessId,
        source_url: sourceUrl,
        document_id: documentId,
      }),
    });

    if (!response.ok) {
      console.error("Failed to trigger knowledge website webhook");
    }
  } catch (error) {
    console.error("Error triggering knowledge website webhook:", error);
  }
}
