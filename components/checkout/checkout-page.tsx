"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/products";
import { CheckoutForm } from "./checkout-form";

export function CheckoutPage({ user }: any) {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "pro";
  const plan = PLANS.find((p) => p.id === planId);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardHeader>
            <CardTitle>Plan Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary">
              The selected plan could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-surface p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-text-secondary">
            You're upgrading to the {plan.name} plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary">Plan</p>
                  <p className="font-semibold">{plan.name}</p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">Billing Cycle</p>
                  <p className="font-semibold">Monthly</p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Subtotal</span>
                    <span className="font-semibold">${plan.pricePerMonth}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm">Tax</span>
                    <span className="font-semibold">$0</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      ${plan.pricePerMonth}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-text-tertiary">
                  Your subscription will renew automatically each month. You can
                  cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="md:col-span-2">
            <CheckoutForm plan={plan} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
