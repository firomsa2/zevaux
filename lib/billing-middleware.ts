import { NextResponse } from "next/server";
import { getBillingStateForUser, hasFeatureAccess, getTrialDaysRemaining, getGracePeriodDaysRemaining } from "@/lib/billing";
import { createClient } from "@/utils/supabase/server";
import { enforceUsageLimit } from "@/lib/usage-enforcement";
import { UsageResource } from "./usage-tracking";

export type BillingAccessError = {
  code: "trial_expired" | "payment_failed" | "subscription_canceled" | "usage_limit_exceeded" | "no_subscription" | "unknown";
  message: string;
  redirectTo: string;
};

/**
 * Middleware helper to protect API routes based on billing state.
 * Returns null if access is granted, or a NextResponse with error if access should be denied.
 */
export async function checkBillingAccess(
  userId: string,
): Promise<NextResponse | null> {
  const billingState = await getBillingStateForUser(userId);

  if (!billingState) {
    return NextResponse.json(
      { 
        error: "Unable to verify billing status",
        code: "unknown",
      },
      { status: 500 },
    );
  }

  // Check trial status
  if (billingState.trialStatus === "expired" && !billingState.hasActiveSubscription) {
    const trialDays = getTrialDaysRemaining(billingState);
    return NextResponse.json(
      {
        error: "Trial expired",
        code: "trial_expired" as BillingAccessError["code"],
        message: trialDays === 0 
          ? "Your free trial has ended. Please subscribe to continue using the service."
          : "Your trial has expired. Please subscribe to continue.",
        redirectTo: "/dashboard/billing",
      },
      { status: 403 },
    );
  }

  // Check subscription status
  if (!hasFeatureAccess(billingState)) {
    // Check if in grace period
    if (billingState.isInGracePeriod) {
      const graceDays = getGracePeriodDaysRemaining(billingState);
      // Allow access but could log for monitoring
      console.warn(
        `[Billing] User in grace period (${graceDays} days remaining) - allowing access`,
      );
      return null;
    }

    // Determine specific error
    let errorCode: BillingAccessError["code"] = "no_subscription";
    let errorMessage = "Your subscription is inactive. Please update your billing information to continue.";

    if (billingState.subscriptionStatus === "past_due" || billingState.subscriptionStatus === "unpaid") {
      errorCode = "payment_failed";
      errorMessage = "Your payment failed. Please update your payment method to continue using the service.";
    } else if (billingState.subscriptionStatus === "canceled") {
      errorCode = "subscription_canceled";
      errorMessage = "Your subscription has been canceled. Please reactivate your subscription to continue.";
    } else if (billingState.shouldRestrictFeatures) {
      errorCode = "payment_failed";
      errorMessage = "Your payment failed and grace period has ended. Please update your payment method to continue.";
    }

    // Access denied - redirect to billing page
    return NextResponse.json(
      {
        error: "Subscription required",
        code: errorCode,
        message: errorMessage,
        redirectTo: "/dashboard/billing",
      },
      { status: 403 },
    );
  }

  return null; // Access granted
}

/**
 * Check billing access and usage limits for a specific resource.
 * Combines billing state check with usage limit enforcement.
 */
export async function checkBillingAccessWithUsage(
  userId: string,
  resource?: UsageResource,
): Promise<NextResponse | null> {
  // First check billing access
  const billingCheck = await checkBillingAccess(userId);
  if (billingCheck) {
    return billingCheck;
  }

  // If resource is specified, check usage limits
  if (resource) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data: userData } = await supabase
      .from("users")
      .select("business_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!userData?.business_id) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    const usageCheck = await enforceUsageLimit(userData.business_id, resource);
    if (usageCheck) {
      return usageCheck;
    }
  }

  return null; // All checks passed
}

/**
 * Get billing state for a user from request (extracts user from Supabase auth).
 * Useful for API routes that need billing information.
 */
export async function getBillingStateFromRequest(): Promise<{
  billingState: Awaited<ReturnType<typeof getBillingStateForUser>>;
  userId: string;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const billingState = await getBillingStateForUser(user.id);
  return { billingState, userId: user.id };
}
