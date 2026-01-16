import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { EnhancedOnboardingWizard } from "@/components/onboarding/enhanced-onboarding-wizard";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's business
  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  let business = null;

  if (userData?.business_id) {
    const { data: existingBusiness } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", userData.business_id)
      .single();
    business = existingBusiness;
  }

  // If no business exists (either no ID or invalid ID), create one
  if (!business) {
    const businessName = user.user_metadata?.business_name || "New Business";

    const { data: newBusiness, error: createError } = await supabase
      .from("businesses")
      .insert({
        name: businessName,
        timezone: "America/New_York", // Default to US/Eastern
        default_language: "en-US",
        supported_languages: ["en-US"],
        tone: "professional",
        billing_plan: "starter",
        hipaa_mode: false,
      })
      .select()
      .single();

    if (createError || !newBusiness) {
      console.error(
        "Failed to create business during onboarding:",
        createError?.message
      );
      // If creation fails, fallback to the old flow which handles creation
      redirect("/onboarding/business-setup");
    }

    business = newBusiness;

    // Update user with new business ID
    await supabase
      .from("users")
      .update({ business_id: business.id })
      .eq("id", user.id);
  }

  return <EnhancedOnboardingWizard userId={user.id} business={business} />;
}
