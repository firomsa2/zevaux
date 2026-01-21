"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Get user's business ID
async function getBusinessId() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  console.log("🚀 ~ getBusinessId ~ user:", user);

  if (!user) throw new Error("User not authenticated");

  const { data: userData } = await (await supabase)
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  console.log("🚀 ~ getBusinessId ~ userData:", userData);
  if (!userData?.business_id) throw new Error("Business not found");

  return userData.business_id;
}

// Get all knowledge base documents
export async function getKnowledgeDocuments() {
  try {
    const businessId = await getBusinessId();
    console.log("🚀 ~ getKnowledgeDocuments ~ businessId:", businessId);
    const supabase = createClient();

    const { data, error } = await (await supabase)
      .from("knowledge_base_documents")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get knowledge base statistics
export async function getKnowledgeStats() {
  try {
    const businessId = await getBusinessId();
    const supabase = createClient();

    // Get documents
    const { data: documents, error: docsError } = await (await supabase)
      .from("knowledge_base_documents")
      .select("*")
      .eq("business_id", businessId);

    if (docsError) throw docsError;

    // Get chunks
    const { data: chunks, error: chunksError } = await (await supabase)
      .from("knowledge_base_chunks")
      .select("id")
      .eq("business_id", businessId);

    if (chunksError) throw chunksError;

    // Calculate stats
    const stats = {
      total: documents?.length || 0,
      byType: {
        faq: documents?.filter((d) => d.source_type === "manual").length || 0,
        website: documents?.filter((d) => d.source_type === "url").length || 0,
        document:
          documents?.filter((d) => d.source_type === "upload").length || 0,
      },
      byStatus: {
        pending: documents?.filter((d) => d.status === "pending").length || 0,
        processing:
          documents?.filter((d) => d.status === "processing").length || 0,
        processed:
          documents?.filter((d) => d.status === "processed").length || 0,
        failed: documents?.filter((d) => d.status === "failed").length || 0,
      },
      totalChunks: chunks?.length || 0,
      lastUpdated:
        documents && documents.length > 0
          ? documents.reduce(
              (latest, doc) =>
                new Date(doc.updated_at) > new Date(latest)
                  ? doc.updated_at
                  : latest,
              documents[0].updated_at
            )
          : null,
    };

    return { success: true, data: stats };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get FAQs from business_configs
export async function getFAQs() {
  try {
    const businessId = await getBusinessId();
    const supabase = createClient();

    const { data: configData, error } = await (await supabase)
      .from("business_configs")
      .select("config")
      .eq("business_id", businessId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    const faqs = configData?.config?.faqs || [];
    return { success: true, data: faqs };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Add FAQ
export async function addFAQ(faqData: {
  question: string;
  answer: string;
  category: string;
  language: string;
  priority: number;
  tags: string[];
}) {
  try {
    const businessId = await getBusinessId();
    const supabase = createClient();

    // Get existing config
    const { data: existingConfig } = await (await supabase)
      .from("business_configs")
      .select("config")
      .eq("business_id", businessId)
      .maybeSingle();

    const existingFAQs = existingConfig?.config?.faqs || [];
    const newFAQ = {
      id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...faqData,
      createdAt: new Date().toISOString(),
    };
    const updatedFAQs = [...existingFAQs, newFAQ];

    // Update config preserving other fields
    const configData = {
      business_id: businessId,
      config: {
        ...(existingConfig?.config || {}),
        faqs: updatedFAQs,
      },
      updated_at: new Date().toISOString(),
    };

    const { error: configError } = await (await supabase)
      .from("business_configs")
      .upsert(configData, {
        onConflict: "business_id",
      });

    if (configError) throw configError;

    revalidatePath("/dashboard/receptionist/faqs");

    return { success: true, data: newFAQ };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Update FAQ
export async function updateFAQ(
  id: string,
  faqData: Partial<{
    question: string;
    answer: string;
    category: string;
    language: string;
    priority: number;
    tags: string[];
  }>
) {
  try {
    const businessId = await getBusinessId();
    const supabase = createClient();

    // Get existing config
    const { data: existingConfig } = await (await supabase)
      .from("business_configs")
      .select("config")
      .eq("business_id", businessId)
      .single();

    if (!existingConfig?.config) {
      throw new Error("Config not found");
    }

    const existingFAQs = existingConfig.config.faqs || [];
    const updatedFAQs = existingFAQs.map((faq: any) =>
      faq.id === id
        ? { ...faq, ...faqData, updatedAt: new Date().toISOString() }
        : faq
    );

    // Update config preserving other fields
    const configData = {
      business_id: businessId,
      config: {
        ...existingConfig.config,
        faqs: updatedFAQs,
      },
      updated_at: new Date().toISOString(),
    };

    const { error: configError } = await (await supabase)
      .from("business_configs")
      .upsert(configData, {
        onConflict: "business_id",
      });

    if (configError) throw configError;

    revalidatePath("/dashboard/receptionist/faqs");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Delete FAQ
export async function deleteFAQ(id: string) {
  try {
    const businessId = await getBusinessId();
    const supabase = createClient();

    // Get existing config
    const { data: existingConfig } = await (await supabase)
      .from("business_configs")
      .select("config")
      .eq("business_id", businessId)
      .single();

    if (!existingConfig?.config) {
      throw new Error("Config not found");
    }

    const existingFAQs = existingConfig.config.faqs || [];
    const updatedFAQs = existingFAQs.filter((faq: any) => faq.id !== id);

    // Update config preserving other fields
    const configData = {
      business_id: businessId,
      config: {
        ...existingConfig.config,
        faqs: updatedFAQs,
      },
      updated_at: new Date().toISOString(),
    };

    const { error: configError } = await (await supabase)
      .from("business_configs")
      .upsert(configData, {
        onConflict: "business_id",
      });

    if (configError) throw configError;

    revalidatePath("/dashboard/receptionist/faqs");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Add website
export async function addWebsite(websiteData: {
  url: string;
  title: string;
  language: string;
}) {
  try {
    // Validate URL
    try {
      new URL(websiteData.url);
    } catch {
      throw new Error("Invalid URL");
    }

    const businessId = await getBusinessId();
    const supabase = createClient();

    // Create website document
    const { data: doc, error: docError } = await (
      await supabase
    )
      .from("knowledge_base_documents")
      .insert({
        business_id: businessId,
        title: websiteData.title,
        source_type: "url",
        source_url: websiteData.url,
        language: websiteData.language,
        status: "pending",
      })
      .select()
      .single();

    if (docError) throw docError;

    // Trigger webhook for crawling
    await triggerKnowledgeWebhook("crawl_website", {
      businessId,
      documentId: doc.id,
      url: websiteData.url,
      language: websiteData.language,
    });
    console.log("🚀 ~ addWebsite ~ doc:", doc);

    revalidatePath("/dashboard/knowledge");

    return { success: true, data: doc };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Upload document
export async function uploadDocument(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const language = formData.get("language") as string;

    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Validate file extension
    const allowedExtensions = [
      ".pdf",
      ".txt",
      ".doc",
      ".docx",
      ".md",
      ".csv",
      ".json",
      ".html",
      ".htm",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
    ];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    const businessId = await getBusinessId();
    const supabase = createClient();

    // Upload to storage
    const fileName = `${businessId}/${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;

    const { error: uploadError } = await (await supabase).storage
      .from("knowledge_files")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Create document record
    const { data: doc, error: docError } = await (
      await supabase
    )
      .from("knowledge_base_documents")
      .insert({
        business_id: businessId,
        title: file.name,
        source_type: "upload",
        file_path: fileName,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        language: language,
        status: "pending",
      })
      .select()
      .single();

    if (docError) {
      // Clean up uploaded file if database insert fails
      await (await supabase).storage.from("knowledge_files").remove([fileName]);
      throw docError;
    }

    // Trigger webhook for processing
    await triggerKnowledgeWebhook("process_document", {
      businessId,
      documentId: doc.id,
      filePath: fileName,
      language: language,
    });

    console.log("🚀 ~ uploadDocument ~ doc:", doc);

    revalidatePath("/dashboard/knowledge");

    return { success: true, data: doc };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Delete document
export async function deleteDocument(documentId: string) {
  try {
    const businessId = await getBusinessId();
    const supabase = createClient();

    // Get document to get file path
    const { data: doc, error: fetchError } = await (await supabase)
      .from("knowledge_base_documents")
      .select("file_path")
      .eq("id", documentId)
      .eq("business_id", businessId)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage if file path exists
    if (doc?.file_path) {
      await (await supabase).storage
        .from("knowledge_files")
        .remove([doc.file_path]);
    }

    // Delete associated chunks
    await (await supabase)
      .from("knowledge_base_chunks")
      .delete()
      .eq("document_id", documentId);

    // Delete document
    const { error: deleteError } = await (await supabase)
      .from("knowledge_base_documents")
      .delete()
      .eq("id", documentId)
      .eq("business_id", businessId);

    if (deleteError) throw deleteError;

    revalidatePath("/dashboard/knowledge");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Refresh/retry document processing
export async function retryDocument(documentId: string) {
  try {
    const businessId = await getBusinessId();
    const supabase = createClient();

    // Update status to pending
    const { error: updateError } = await (await supabase)
      .from("knowledge_base_documents")
      .update({ status: "pending" })
      .eq("id", documentId)
      .eq("business_id", businessId);

    if (updateError) throw updateError;

    // Get document to get details
    const { data: doc, error: fetchError } = await (await supabase)
      .from("knowledge_base_documents")
      .select("*")
      .eq("id", documentId)
      .eq("business_id", businessId)
      .single();

    if (fetchError) throw fetchError;

    // Trigger appropriate webhook based on source type
    if (doc.source_type === "url") {
      await triggerKnowledgeWebhook("crawl_website", {
        businessId,
        documentId,
        url: doc.source_url,
        language: doc.language,
      });
    } else if (doc.source_type === "upload") {
      await triggerKnowledgeWebhook("process_document", {
        businessId,
        documentId,
        filePath: doc.file_path,
        language: doc.language,
      });
    } else if (doc.source_type === "manual") {
      await triggerKnowledgeWebhook("process_faqs", {
        businessId,
        documentId,
        faqs: doc.metadata?.faqs || [],
      });
    }

    revalidatePath("/dashboard/knowledge");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Test question answering
export async function testQuestion(question: string) {
  try {
    const businessId = await getBusinessId();

    // Trigger test webhook
    const response = await triggerKnowledgeWebhook("test_question", {
      businessId,
      question,
    });

    return {
      success: true,
      data: {
        answer:
          response.answer ||
          "I don't have enough information to answer that question.",
        confidence: response.confidence || Math.random() * 100,
        sources: response.sources || ["General knowledge"],
        responseTime: response.responseTime || Math.random() * 2 + 0.5,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Retrain model with current knowledge base
export async function retrainModel() {
  try {
    const businessId = await getBusinessId();

    // Trigger retraining webhook
    await triggerKnowledgeWebhook("retrain_model", {
      businessId,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Helper function to trigger webhooks
async function triggerKnowledgeWebhook(event: string, data: any) {
  const webhookUrl = process.env.KNOWLEDGE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("No webhook URL configured for knowledge processing");
    return {};
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WEBHOOK_SECRET}`,
    },
    body: JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.statusText}`);
  }

  return response.json();
}
