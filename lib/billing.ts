import { getSupabaseServer } from "@/lib/supabase/server";
import { TRIAL_PERIOD_DAYS } from "@/lib/constants";

export type TrialStatus = "not_started" | "active" | "expired" | "converted";

export type BillingState = {
  businessId: string;
  trialStatus: TrialStatus;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  hasActiveSubscription: boolean;
  subscriptionStatus:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "paused"
    | "trialing"
    | "unpaid"
    | null;
  planSlug: "starter" | "pro" | "enterprise" | null;
  paymentFailedAt: string | null;
  gracePeriodEndsAt: string | null;
  isInGracePeriod: boolean;
  shouldRestrictFeatures: boolean;
};

/**
 * Start a internal trial for a business if it hasn't started yet.
 * Idempotent: calling multiple times after the trial has started/ended does nothing.
 */
export async function maybeStartTrialForBusiness(
  businessId: string,
): Promise<void> {
  const supabase = await getSupabaseServer();

  const { data: business } = await supabase
    .from("businesses")
    .select("id, trial_status, trial_started_at, trial_ends_at")
    .eq("id", businessId)
    .maybeSingle();

  if (!business) return;

  const status = (business.trial_status as TrialStatus | null) ?? "not_started";

  if (status !== "not_started") {
    // Trial already started, expired, or converted – do nothing.
    return;
  }

  const now = new Date();
  const trialStartedAt = now.toISOString();
  const trialEndsAt = new Date(
    now.getTime() + TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  await supabase
    .from("businesses")
    .update({
      trial_status: "active",
      trial_started_at: trialStartedAt,
      trial_ends_at: trialEndsAt,
    })
    .eq("id", businessId);
}

/**
 * Resolve the current billing state for a user (business-level).
 * This combines internal trial state with Stripe subscription state.
 */
export async function getBillingStateForUser(
  userId: string,
): Promise<BillingState | null> {
  const supabase = await getSupabaseServer();

  // 1) Resolve business for user
  const { data: user } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", userId)
    .maybeSingle();

  if (!user?.business_id) return null;
  const businessId = user.business_id;

  return getBillingStateForBusiness(businessId);
}

export async function getBillingStateForBusiness(
  businessId: string,
): Promise<BillingState | null> {
  const supabase = await getSupabaseServer();

  // 2) Fetch business + trial fields
  const { data: business } = await supabase
    .from("businesses")
    .select(
      "id, billing_plan, subscription_status, trial_status, trial_started_at, trial_ends_at",
    )
    .eq("id", businessId)
    .maybeSingle();

  if (!business) return null;

  // 3) Fetch subscription (if any)
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  const hasActiveSubscription =
    !!subscription && ["trialing", "active"].includes(subscription.status);

  // 4) Determine trialStatus respecting time and subscription
  const now = new Date();
  let trialStatus: TrialStatus =
    (business.trial_status as TrialStatus | null) ?? "not_started";
  const trialStartedAt = (business.trial_started_at as string | null) ?? null;
  const trialEndsAt = (business.trial_ends_at as string | null) ?? null;

  if (trialStatus === "active" && trialEndsAt) {
    const trialEndDate = new Date(trialEndsAt);
    if (now > trialEndDate) {
      trialStatus = "expired";
    }
  }

  if (hasActiveSubscription) {
    trialStatus = "converted";
  }

  // Calculate payment failure and grace period information
  const paymentFailedAt =
    (subscription?.metadata as any)?.payment_failed_at || null;
  const GRACE_PERIOD_DAYS = 3; // 3-day grace period before restricting features
  let gracePeriodEndsAt: string | null = null;
  let isInGracePeriod = false;
  let shouldRestrictFeatures = false;

  if (
    paymentFailedAt &&
    (subscription?.status === "past_due" || subscription?.status === "unpaid")
  ) {
    const failedDate = new Date(paymentFailedAt);
    gracePeriodEndsAt = new Date(
      failedDate.getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString();
    const now = new Date();
    isInGracePeriod = now < new Date(gracePeriodEndsAt);
    shouldRestrictFeatures = !isInGracePeriod; // Restrict after grace period
  }

  return {
    businessId,
    trialStatus,
    trialStartedAt,
    trialEndsAt,
    hasActiveSubscription,
    subscriptionStatus:
      (subscription?.status as BillingState["subscriptionStatus"]) ?? null,
    planSlug: (business.billing_plan as BillingState["planSlug"]) ?? null,
    paymentFailedAt,
    gracePeriodEndsAt,
    isInGracePeriod,
    shouldRestrictFeatures,
  };
}

/**
 * Utility to compute trial days remaining from a BillingState.
 * Returns null if no active trial window.
 */
export function getTrialDaysRemaining(billing: BillingState): number | null {
  if (!billing.trialEndsAt || billing.trialStatus !== "active") {
    return null;
  }

  const now = new Date();
  const end = new Date(billing.trialEndsAt);
  if (end <= now) return 0;

  const diffMs = end.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return days;
}

/**
 * Check if a business should have access to features based on billing state.
 * Returns true if access should be granted, false if restricted.
 */
export function hasFeatureAccess(billing: BillingState | null): boolean {
  if (!billing) return false;

  // If trial is active, grant access
  if (billing.trialStatus === "active") return true;

  // If has active subscription and not in restricted state, grant access
  if (
    billing.hasActiveSubscription &&
    billing.subscriptionStatus === "active"
  ) {
    return true;
  }

  // If in grace period after payment failure, grant access
  if (billing.isInGracePeriod) return true;

  // If should restrict features (past grace period), deny access
  if (billing.shouldRestrictFeatures) return false;

  // Default: deny access if no active subscription or trial
  return false;
}

/**
 * Get grace period days remaining from a BillingState.
 * Returns null if not in grace period.
 */
export function getGracePeriodDaysRemaining(
  billing: BillingState,
): number | null {
  if (!billing.gracePeriodEndsAt || !billing.isInGracePeriod) {
    return null;
  }

  const now = new Date();
  const end = new Date(billing.gracePeriodEndsAt);
  if (end <= now) return 0;

  const diffMs = end.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return days;
}
