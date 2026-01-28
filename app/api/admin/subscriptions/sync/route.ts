import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getSubscription } from "@/lib/stripe-server";

/**
 * Admin endpoint to sync subscription state from Stripe.
 * This ensures database state matches Stripe's source of truth.
 * 
 * Can sync:
 * - Single subscription by businessId
 * - All active subscriptions (if businessId not provided)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // TODO: Add admin role check here
    // For now, allow any authenticated user (restrict in production)

    const body = await request.json();
    const { businessId } = body;

    const syncResults: Array<{
      businessId: string;
      subscriptionId: string;
      status: "synced" | "error" | "not_found";
      message: string;
      changes?: string[];
    }> = [];

    if (businessId) {
      // Sync single subscription
      const result = await syncSubscriptionForBusiness(supabase, businessId);
      syncResults.push(result);
    } else {
      // Sync all active subscriptions
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("business_id, stripe_subscription_id")
        .in("status", ["active", "trialing", "past_due"]);

      if (subscriptions) {
        for (const sub of subscriptions) {
          const result = await syncSubscriptionForBusiness(
            supabase,
            sub.business_id,
          );
          syncResults.push(result);
        }
      }
    }

    const successCount = syncResults.filter((r) => r.status === "synced").length;
    const errorCount = syncResults.filter((r) => r.status === "error").length;

    return NextResponse.json({
      success: true,
      message: `Synced ${successCount} subscription(s), ${errorCount} error(s)`,
      results: syncResults,
    });
  } catch (error: any) {
    console.error("[Subscription Sync] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}

async function syncSubscriptionForBusiness(
  supabase: any,
  businessId: string,
): Promise<{
  businessId: string;
  subscriptionId: string;
  status: "synced" | "error" | "not_found";
  message: string;
  changes?: string[];
}> {
  try {
    // Get subscription from database
    const { data: dbSubscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("business_id", businessId)
      .maybeSingle();

    if (subError || !dbSubscription) {
      return {
        businessId,
        subscriptionId: "",
        status: "not_found",
        message: "No subscription found in database",
      };
    }

    if (!dbSubscription.stripe_subscription_id) {
      return {
        businessId,
        subscriptionId: "",
        status: "error",
        message: "Subscription missing Stripe subscription ID",
      };
    }

    // Fetch from Stripe
    const stripeSubscription = await getSubscription(
      dbSubscription.stripe_subscription_id,
    );

    // Compare and track changes
    const changes: string[] = [];
    const updates: any = {};

    // Check status
    if (dbSubscription.status !== stripeSubscription.status) {
      changes.push(
        `status: ${dbSubscription.status} → ${stripeSubscription.status}`,
      );
      updates.status = stripeSubscription.status;
    }

    // Check period dates
    const stripePeriodStart = (stripeSubscription as any).current_period_start
      ? new Date((stripeSubscription as any).current_period_start * 1000).toISOString()
      : null;
    const stripePeriodEnd = (stripeSubscription as any).current_period_end
      ? new Date((stripeSubscription as any).current_period_end * 1000).toISOString()
      : null;

    if (dbSubscription.current_period_start !== stripePeriodStart) {
      changes.push("current_period_start updated");
      updates.current_period_start = stripePeriodStart;
    }

    if (dbSubscription.current_period_end !== stripePeriodEnd) {
      changes.push("current_period_end updated");
      updates.current_period_end = stripePeriodEnd;
    }

    // Check cancel flags
    const stripeCancelAt = stripeSubscription.cancel_at
      ? new Date(stripeSubscription.cancel_at * 1000).toISOString()
      : null;
    const dbCancelAt = dbSubscription.cancel_at
      ? new Date(dbSubscription.cancel_at).toISOString()
      : null;

    if (dbCancelAt !== stripeCancelAt) {
      changes.push("cancel_at updated");
      updates.cancel_at = stripeCancelAt;
    }

    if (
      dbSubscription.cancel_at_period_end !==
      stripeSubscription.cancel_at_period_end
    ) {
      changes.push(
        `cancel_at_period_end: ${dbSubscription.cancel_at_period_end} → ${stripeSubscription.cancel_at_period_end}`,
      );
      updates.cancel_at_period_end = stripeSubscription.cancel_at_period_end;
    }

    // Check plan (via price ID)
    const priceId = stripeSubscription.items.data[0]?.price.id;
    if (priceId) {
      const { data: plan } = await supabase
        .from("plans")
        .select("id")
        .eq("stripe_price_id", priceId)
        .maybeSingle();

      if (plan && dbSubscription.plan_id !== plan.id) {
        changes.push(`plan_id updated`);
        updates.plan_id = plan.id;

        // Also update business billing_plan
        const { data: planData } = await supabase
          .from("plans")
          .select("slug")
          .eq("id", plan.id)
          .single();

        if (planData) {
          await supabase
            .from("businesses")
            .update({ billing_plan: planData.slug })
            .eq("id", businessId);
        }
      }
    }

    // Update if there are changes
    if (Object.keys(updates).length > 0) {
      updates.updated_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("business_id", businessId);

      if (updateError) {
        return {
          businessId,
          subscriptionId: dbSubscription.stripe_subscription_id,
          status: "error",
          message: `Failed to update: ${updateError.message}`,
        };
      }

      // Update business subscription_status
      await supabase
        .from("businesses")
        .update({
          subscription_status: updates.status || dbSubscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);

      return {
        businessId,
        subscriptionId: dbSubscription.stripe_subscription_id,
        status: "synced",
        message: "Subscription synced successfully",
        changes,
      };
    }

    return {
      businessId,
      subscriptionId: dbSubscription.stripe_subscription_id,
      status: "synced",
      message: "Subscription already in sync",
      changes: [],
    };
  } catch (error: any) {
    console.error(
      `[Subscription Sync] Error syncing business ${businessId}:`,
      error,
    );
    return {
      businessId,
      subscriptionId: "",
      status: "error",
      message: error.message || "Unknown error",
    };
  }
}
