"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto"; // Import crypto module

export async function handleKnowledgeWebhook(payload: {
  event: string;
  data: any;
  signature?: string;
}) {
  try {
    // Verify webhook signature (optional but recommended)
    if (process.env.WEBHOOK_SECRET) {
      const expectedSignature = createSignature(
        payload,
        process.env.WEBHOOK_SECRET
      );
      if (payload.signature !== expectedSignature) {
        throw new Error("Invalid webhook signature");
      }
    }

    const supabase = createClient();
    const { event, data } = payload;

    switch (event) {
      case "document_processed":
        // Update document status
        await (
          await supabase
        )
          .from("knowledge_base_documents")
          .update({
            status: data.status,
            error_message: data.error_message,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.documentId);
        break;

      case "chunks_created":
        // Update chunk count
        await (
          await supabase
        )
          .from("knowledge_base_documents")
          .update({
            chunk_count: data.chunkCount,
            status: "processed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.documentId);
        break;

      case "website_crawled":
        // Update website crawl info
        await (
          await supabase
        )
          .from("knowledge_base_documents")
          .update({
            status: "processed",
            page_count: data.pageCount,
            chunk_count: data.chunkCount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.documentId);
        break;

      case "faq_processed":
        // Update FAQ document
        await (
          await supabase
        )
          .from("knowledge_base_documents")
          .update({
            status: "processed",
            chunk_count: data.chunkCount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.documentId);
        break;

      case "training_completed":
        // Log training completion
        await (await supabase).from("knowledge_training_logs").insert({
          business_id: data.businessId,
          model_version: data.modelVersion,
          documents_used: data.documentsUsed,
          chunks_used: data.chunksUsed,
          training_time: data.trainingTime,
          status: "completed",
        });
        break;

      default:
        console.warn(`Unknown webhook event: ${event}`);
    }

    // Revalidate knowledge pages
    revalidatePath("/dashboard/knowledge");

    return { success: true };
  } catch (error: any) {
    console.error("Webhook handling error:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to create signature (optional)
function createSignature(payload: any, secret: string): string {
  const payloadString = JSON.stringify(payload);
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payloadString);
  return hmac.digest("hex");
}
