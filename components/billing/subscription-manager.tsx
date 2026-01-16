"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Clock } from "lucide-react";

export function SubscriptionManager({ businessId }: { businessId: string }) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, [businessId]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch(
        `/api/stripe/subscriptions/active?businessId=${businessId}`
      );
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-text-secondary">Loading subscription...</div>;

  if (!subscription) {
    return (
      <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-900">
              No Active Subscription
            </h3>
            <p className="text-yellow-800 text-sm mt-1">
              Choose a plan above to get started with Zevaux.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const currentPeriodEnd = new Date(subscription.current_period_end);
  const daysLeft = Math.ceil(
    (currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold capitalize mb-2">
            {subscription.billing_plan} Plan
          </h3>
          <div className="space-y-2 text-sm text-text-secondary">
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              {subscription.stripe_prices?.minutes_limit} minutes/month
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Renews in {daysLeft} days
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold mb-4">
            ${(subscription.stripe_prices?.amount_cents / 100).toFixed(2)}
            <span className="text-sm text-text-secondary">/month</span>
          </div>
          <Button className="btn-secondary text-sm">Manage Billing</Button>
        </div>
      </div>
    </Card>
  );
}
