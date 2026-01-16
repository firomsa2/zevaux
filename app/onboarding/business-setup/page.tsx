// import { redirect } from "next/navigation";
// import { createClient } from "@/utils/supabase/server";
// import { BusinessSetupWizard } from "@/components/onboarding/business-setup-wizard";

// export default async function BusinessSetupPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ plan?: string }>;
// }) {
//   const supabase = await createClient();
//   const params = await searchParams;

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect("/login");
//   }

//   const { data: userData } = await supabase
//     .from("users")
//     .select("business_id")
//     .eq("id", user.id)
//     .single();

//   if (!userData?.business_id) {
//     redirect("/login");
//   }

//   const { data: business } = await supabase
//     .from("businesses")
//     .select("*")
//     .eq("id", userData.business_id)
//     .single();

//   if (!business) {
//     redirect("/login");
//   }

//   return (
//     <BusinessSetupWizard
//       userId={user.id}
//       business={business}
//       selectedPlan={params.plan || "starter"}
//     />
//   );
// }

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { EnhancedOnboardingWizard } from "@/components/onboarding/enhanced-onboarding-wizard";

export default async function BusinessSetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/(auth)/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (!userData?.business_id) {
    redirect("/(auth)/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", userData.business_id)
    .single();

  if (!business) {
    redirect("/(auth)/login");
  }

  // Create onboarding progress record if it doesn't exist
  await supabase.from("onboarding_progress").upsert(
    {
      business_id: business.id,
      current_step: 1,
    },
    { onConflict: "business_id" }
  );

  return <EnhancedOnboardingWizard userId={user.id} business={business} />;
}
