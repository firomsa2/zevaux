import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { WebsiteTrainingStep } from "@/components/onboarding/website-training-step";

export default async function WebsiteOnboardingPage() {
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
        timezone: "America/New_York",
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
      // Fallback
      return <div>Error creating business profile</div>;
    }

    business = newBusiness;

    // Update user with new business ID
    await supabase
      .from("users")
      .update({ business_id: business.id })
      .eq("id", user.id);
  }

  // If already has website url, maybe redirect to dashboard?
  // But user might want to re-train or see the step.
  // We'll let them do it again or skip if they want (though skip isn't in UI yet).
  // For now, just render the step.

  return <WebsiteTrainingStep businessId={business.id} userId={user.id} />;
}
