import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getUserBusinessWithRelations } from "@/lib/business";
import { getBillingStateForUser, getTrialDaysRemaining } from "@/lib/billing";
import { SubscriptionCard } from "@/components/billing/subscription-card";
// import { BillingPlansComparison } from "@/components/billing/plans-comparison"; // Switching to PlansOverview
import { PlansOverview } from "@/components/billing/plans-overview";
import { UsageOverview } from "@/components/billing/usage-overview";
import { BillingHistory } from "@/components/billing/billing-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import type { Plan } from "@/types/database";

export default async function BillingPage() {
  const supabase = await getSupabaseServer();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const businessData = await getUserBusinessWithRelations(authUser.id);

  if (!businessData) {
    redirect("/onboarding/welcome");
  }

  const { business, subscription, plan } = businessData;

  // Fetch usage data
  const { data: usage } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("business_id", business.id)
    .order("period_start", { ascending: false })
    .limit(1)
    .single();

  // Fetch all plans ordered by price
  const { data: allPlans } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price", { ascending: true });

  // Filter plans to display (exclude enterprise if not wanted or filter by custom logic)
  const displayPlans = (allPlans as Plan[])?.filter(p => ["starter", "basic", "pro", "custom"].includes(p.slug || p.id)) || [];

  // Fetch invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const usageData = {
    minutesUsed: usage?.minutes_used || 0,
    purchasedMinutes: usage?.purchased_minutes || 0,
    callsCount: usage?.calls_made || 0,
    activePhoneNumbers: usage?.active_phone_numbers || 0,
    teamMembers: usage?.team_members_count || 0,
  };

  // Billing state / trial days remaining
  const billingState = await getBillingStateForUser(authUser.id);
  const trialDaysLeft = billingState
    ? getTrialDaysRemaining(billingState)
    : null;

  return (
    <main className="flex-1 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your plan and billing information
        </p>

        {typeof trialDaysLeft === "number" && trialDaysLeft >= 0 && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/20 dark:text-amber-200">
            {trialDaysLeft === 0
              ? "Your free trial ends today. Choose a plan below to avoid any interruption in service."
              : `Free trial: ${trialDaysLeft} day${
                  trialDaysLeft === 1 ? "" : "s"
                } remaining. Select a plan below to continue after your trial.`}
          </div>
        )}
      </div>

      <SubscriptionCard
        subscription={subscription}
        plan={plan}
        businessId={business.id}
      />

      {/* Usage Overview */}
      {plan && <UsageOverview plan={plan} usage={usageData} />}
      
      {/* Plans Overview */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <PlansOverview 
            business={business}
            currentPlan={plan}
            plans={displayPlans}
        />
      </div>

       {/* Billing History (Invoices) */}
       {/* <BillingHistory invoices={invoices || []} /> */}
    </main>
  );
}
