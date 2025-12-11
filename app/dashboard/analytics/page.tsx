import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { createClient } from "@/utils/supabase/server";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: callLogs } = await supabase
    .from("call_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 px-4">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-text-secondary mt-2">
            Track your AI receptionist performance
          </p>
        </div>

        <AnalyticsDashboard callLogs={callLogs || []} />
      </div>
    </main>
  );
}
