import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CompleteOnboardingWizard } from "@/components/onboarding/complete-onboarding-wizard";

export default async function OnboardingSetupPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user's business
  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (!userData?.business_id) {
    redirect("/auth/login");
  }

  // Get business data
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", userData.business_id)
    .single();

  if (!business) {
    redirect("/auth/login");
  }

  // Check if onboarding already complete
  if (business.onboarding_completed) {
    redirect("/dashboard");
  }

  return <CompleteOnboardingWizard userId={user.id} business={business} />;
}
