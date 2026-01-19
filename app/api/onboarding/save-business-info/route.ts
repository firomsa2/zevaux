import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { saveOnboardingProgress } from "@/utils/onboarding";

// Default business hours (Mon-Fri 9am-5pm, Sat-Sun closed)
const DEFAULT_BUSINESS_HOURS = {
  monday: [{ open: "09:00", close: "17:00" }],
  tuesday: [{ open: "09:00", close: "17:00" }],
  wednesday: [{ open: "09:00", close: "17:00" }],
  thursday: [{ open: "09:00", close: "17:00" }],
  friday: [{ open: "09:00", close: "17:00" }],
  saturday: [], // Closed
  sunday: [], // Closed
};

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
        { status: 400 },
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
        escalation_number: formData.transferCallsEnabled
          ? formData.escalationNumber
          : null,
      })
      .eq("id", businessId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Save FAQs and default business hours to business_configs
    // Get existing config
    const { data: existingConfig } = await supabase
      .from("business_configs")
      .select("*")
      .eq("business_id", businessId)
      .single();

    // Format FAQs for storage
    const faqsForStorage = formData.faqs?.length
      ? formData.faqs.map((faq: any) => ({
          question: faq.question,
          answer: faq.answer,
        }))
      : [];

    // Format Services for storage
    const servicesForStorage = formData.services?.length
      ? formData.services.map((svc: any) => ({
          name: svc.name,
          description: svc.description,
          price: svc.price,
          duration: svc.duration,
        }))
      : [];

    // Ensure config is always a plain object (not string or array)
    let mergedConfig = {
      ...(typeof existingConfig?.config === "object" &&
      !Array.isArray(existingConfig.config)
        ? existingConfig.config
        : {}),
      faqs: faqsForStorage,
      services: servicesForStorage,
      hours: existingConfig?.config?.hours || DEFAULT_BUSINESS_HOURS,
    };
    // If somehow config is a stringified JSON, parse it
    if (typeof existingConfig?.config === "string") {
      try {
        const parsed = JSON.parse(existingConfig.config);
        if (typeof parsed === "object" && !Array.isArray(parsed)) {
          mergedConfig = {
            ...parsed,
            faqs: faqsForStorage,
            hours: parsed.hours || DEFAULT_BUSINESS_HOURS,
          };
        }
      } catch (e) {
        // ignore parse error, fallback to above
      }
    }
    const configData = {
      business_id: businessId,
      config: mergedConfig,
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

    // Create or update onboarding progress (step 2)
    const { error: progressError } = await saveOnboardingProgress(businessId, {
      step_2_business_info: true,
      step_1_review: true, // legacy flag for backward compatibility
    });

    if (progressError) {
      console.error("[v0] Progress update error:", progressError);
    }

    // Trigger prompt webhook to generate AI prompt
    try {
      const webhookUrl = process.env.PROMPT_WEBHOOK_URL;
      if (webhookUrl) {
        // Fire and forget - don't wait for response
        fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ business_id: businessId }),
        }).catch((err) => console.error("Error calling prompt webhook:", err));
      }
    } catch (webhookError) {
      console.error("[v0] Prompt webhook error:", webhookError);
      // Don't fail the whole request, just log the error
    }

    return NextResponse.json({
      success: true,
      message: "Business information saved successfully",
    });
  } catch (error) {
    console.error("[v0] Save business info error:", error);
    return NextResponse.json(
      { error: "Failed to save business information" },
      { status: 500 },
    );
  }
}
