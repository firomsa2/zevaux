import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  // User is authenticated and trying to access an auth route
  // Decide where to send them based on onboarding state
  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (!userData?.business_id) {
    redirect("/onboarding/website");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("website, onboarding_completed")
    .eq("id", userData.business_id)
    .single();

  if (!business?.website) {
    redirect("/onboarding/website");
  }

  if (!business.onboarding_completed) {
    redirect("/dashboard/onboarding");
  }

  redirect("/dashboard");
}
