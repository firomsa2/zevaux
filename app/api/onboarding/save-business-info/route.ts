import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, formData } = await request.json();

    if (!businessId || !formData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If "other" is selected, use industryOther value
    const industryValue =
      formData.industry === "other"
        ? formData.industryOther || "Other"
        : formData.industry;

    const { error: updateError } = await supabase
      .from("businesses")
      .update({
        name: formData.businessName,
        industry: industryValue,
        timezone: formData.timezone || "UTC", // Default to UTC if not provided
        description: formData.businessDescription,
        assistant_name: formData.agentName,
        personalized_greeting: formData.personalizedGreeting,
      })
      .eq("id", businessId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Save FAQs to business_configs
    if (formData.faqs && formData.faqs.length > 0) {
      // Get existing config
      const { data: existingConfig } = await supabase
        .from("business_configs")
        .select("*")
        .eq("business_id", businessId)
        .single();

      // Format FAQs for storage
      const faqsForStorage = formData.faqs.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer,
      }));

      const configData = {
        business_id: businessId,
        config: {
          ...(existingConfig?.config || {}),
          faqs: faqsForStorage,
        },
        updated_at: new Date().toISOString(),
      };

      const { error: configError } = await supabase
        .from("business_configs")
        .upsert(configData, {
          onConflict: "business_id",
        });

      if (configError) {
        console.error("[v0] Config update error:", configError);
        // Don't fail the whole request, just log the error
      }
    }

    // Create or update onboarding progress
    const { error: progressError } = await supabase
      .from("onboarding_progress")
      .upsert(
        {
          business_id: businessId,
          step_1_business_details: true,
          step_1_agent_setup: true,
          step_1_greeting_tone: true,
          step_1_review: true,
          current_step: 2,
        },
        { onConflict: "business_id" }
      );

    if (progressError) {
      console.error("[v0] Progress update error:", progressError);
    }

    return NextResponse.json({
      success: true,
      message: "Business information saved successfully",
    });
  } catch (error) {
    console.error("[v0] Save business info error:", error);
    return NextResponse.json(
      { error: "Failed to save business information" },
      { status: 500 }
    );
  }
}
