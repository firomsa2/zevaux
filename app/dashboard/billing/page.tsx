import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getUserBusinessWithRelations } from "@/lib/business";
import { SubscriptionCard } from "@/components/billing/subscription-card";
import { BillingPlansComparison } from "@/components/billing/plans-comparison";
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

export default async function BillingPage() {
  const supabase = await getSupabaseServer();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/auth/login");
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

  // Fetch all plans
  const { data: allPlans } = await supabase
    .from("plans")
    .select("*")
    .order("monthly_price", { ascending: true });

  // Fetch invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const usageData = {
    minutesUsed: usage?.minutes_used || 0,
    callsCount: usage?.calls_count || 0,
    activePhoneNumbers: usage?.active_phone_numbers || 0,
    teamMembers: usage?.team_members_count || 0,
  };

  return (
    <main className="flex-1 p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your plan and billing information
        </p>
      </div>

      <SubscriptionCard
        subscription={subscription}
        plan={plan}
        businessId={business.id}
      />

      {/* Usage Overview */}
      {plan && <UsageOverview plan={plan} usage={usageData} />}

      {/* Plans Comparison */}
      {allPlans && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <BillingPlansComparison
            allPlans={allPlans}
            currentPlan={business.billing_plan}
            businessId={business.id}
          />
        </div>
      )}

      {/* Billing History */}
      {invoices && <BillingHistory invoices={invoices} />}

      {/* Support Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Need Help?
          </CardTitle>
          <CardDescription>
            Contact our support team for billing questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">Email Support</Button>
            <Button variant="outline">Schedule Call</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
