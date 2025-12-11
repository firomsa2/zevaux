"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlansOverview } from "./plans-overview";
import { SubscriptionDetails } from "./subscription-details";
import { BillingHistory } from "./billing-history";

export function BillingTabs({ user, subscription }: any) {
  return (
    <Tabs defaultValue="plans" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="plans">Plans</TabsTrigger>
        <TabsTrigger value="subscription">Current Subscription</TabsTrigger>
        <TabsTrigger value="history">Billing History</TabsTrigger>
      </TabsList>

      <TabsContent value="plans" className="space-y-4">
        <PlansOverview currentPlan={subscription?.plan_id} />
      </TabsContent>

      <TabsContent value="subscription" className="space-y-4">
        <SubscriptionDetails subscription={subscription} userId={user.id} />
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <BillingHistory subscription={subscription} />
      </TabsContent>
    </Tabs>
  );
}
