"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlansOverview } from "./plans-overview";
import { SubscriptionDetails } from "./subscription-details";
import { BillingHistory } from "./billing-history";
import { UsageOverview } from "./usage-overview";
import type { Business, Plan } from "@/types/database";

interface BillingPageContentProps {
  business: Business;
  currentPlan: Plan | null;
  allPlans: Plan[];
  usage?: {
    minutesUsed: number;
    callsCount: number;
    activePhoneNumbers: number;
    teamMembers: number;
  };
}

export function BillingPageContent({
  business,
  currentPlan,
  allPlans,
  usage = {
    minutesUsed: 0,
    callsCount: 0,
    activePhoneNumbers: 0,
    teamMembers: 0,
  },
}: BillingPageContentProps) {
  return (
    <Tabs defaultValue="plans" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="plans">Available Plans</TabsTrigger>
        <TabsTrigger value="subscription">Current Subscription</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="billing">Billing History</TabsTrigger>
      </TabsList>

      <TabsContent value="plans" className="mt-8">
        <PlansOverview
          business={business}
          currentPlan={currentPlan}
          plans={allPlans}
        />
      </TabsContent>

      <TabsContent value="subscription" className="mt-8">
        <SubscriptionDetails business={business} currentPlan={currentPlan} />
      </TabsContent>

      <TabsContent value="usage" className="mt-8">
        {currentPlan ? (
          <UsageOverview plan={currentPlan} usage={usage} />
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            No current plan. Usage details are unavailable.
          </div>
        )}
      </TabsContent>

      <TabsContent value="billing" className="mt-8">
        <BillingHistory business={business} />
      </TabsContent>
    </Tabs>
  );
}
