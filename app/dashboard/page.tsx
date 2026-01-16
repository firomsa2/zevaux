import { DashboardContent } from "@/components/dashboard/content";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getOnboardingProgress } from "@/utils/onboarding";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get user's business_id
  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  const businessId = userData?.business_id;

  const dashboardData = {
    totalCalls: 0,
    avgDuration: "0m",
    successRate: "0%",
    recentCalls: [] as any[],
    isSetupComplete: false,
    businessName: "",
  };

  if (businessId) {
    // Fetch Business Name
    const { data: business } = await supabase
      .from("businesses")
      .select("name")
      .eq("id", businessId)
      .single();
    dashboardData.businessName = business?.name || "";

    // Check Setup (Phone Number)
    const { count: phoneCount } = await supabase
      .from("phone_endpoints")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId);

    dashboardData.isSetupComplete = (phoneCount || 0) > 0;

    // Fetch Calls
    const { data: calls } = await supabase
      .from("call_logs")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (calls && calls.length > 0) {
      dashboardData.totalCalls = calls.length;

      // Calculate Avg Duration
      const totalMinutes = calls.reduce(
        (acc, call) => acc + (parseFloat(call.minutes) || 0),
        0
      );
      const avg = totalMinutes / calls.length;
      dashboardData.avgDuration = `${avg.toFixed(1)}m`;

      // Recent Calls (Top 5)
      dashboardData.recentCalls = calls.slice(0, 5);

      // Success Rate (Calls > 0.2 min / Total Calls) - Heuristic
      const successfulCalls = calls.filter(
        (c) => (parseFloat(c.minutes) || 0) > 0.2
      ).length;
      dashboardData.successRate = `${Math.round(
        (successfulCalls / calls.length) * 100
      )}%`;
    }
  }

  // Get onboarding progress
  const onboardingProgress = await getOnboardingProgress(user.id);

  return (
    <DashboardContent
      user={user}
      data={dashboardData}
      onboardingProgress={onboardingProgress}
    />
  );
}
