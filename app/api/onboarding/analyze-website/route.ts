import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ensureOnboardingProgressExists } from "@/utils/onboarding";

export async function POST(req: Request) {
  try {
    console.log("Received request to analyze website", req);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, url } = await req.json();

    if (!businessId || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call the external webhook to process the website
    // Using the same env var as in the knowledge webhook route
    const webhookUrl = process.env.KNOWLEDGE_WEBHOOK_WEBSITE_URL;

    if (webhookUrl) {
      // Create a document record first to get a valid UUID
      const { data: document, error: docError } = await supabase
        .from("knowledge_base_documents")
        .insert({
          business_id: businessId,
          title: "Website Import",
          source_type: "url",
          source_url: url,
          status: "pending",
        })
        .select()
        .single();

      if (docError) {
        console.error("Error creating document record:", docError);
        // We can continue but the webhook might fail if it relies on DB record
      }

      // Ensure onboarding_progress record exists so webhook can update it
      await ensureOnboardingProgressExists(businessId);

      const documentId = document?.id;

      if (documentId) {
        // Fire off the analysis request
        // We're passing 'website_onboarding' as source or similar context if supported
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business_id: businessId,
            source_url: url,
            document_id: documentId,
            action: "onboarding_analysis", // Context for the webhook
          }),
        });
      }
    }

    // Update business website field
    await supabase
      .from("businesses")
      .update({ website: url })
      .eq("id", businessId);

    // We return success immediately. Frontend will handle polling/waiting for data.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in website analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
