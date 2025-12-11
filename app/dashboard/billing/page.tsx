import { redirect } from "next/navigation";
import { BillingTabs } from "@/components/billing/billing-tabs";
import { createClient } from "@/utils/supabase/server";

export default async function BillingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <main className="flex-1 p-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-text-secondary mt-2">
            Manage your plan and billing information
          </p>
        </div>

        <BillingTabs user={user} subscription={subscription} />
      </div>
    </main>
  );
}
