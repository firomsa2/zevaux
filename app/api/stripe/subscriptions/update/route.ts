import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSubscription, getSubscription } from "@/lib/stripe-server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { businessId, planSlug } = await request.json();

    if (!businessId || !planSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Authenticate user
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user?.email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Verify business ownership
    const { data: businessData } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("id", businessId)
      .single();

    if (!businessData) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Get the new plan
    const { data: newPlan, error: planError } = await supabase
      .from("plans")
      .select("id, stripe_price_id, slug, name")
      .eq("slug", planSlug)
      .single();

    if (planError || !newPlan?.stripe_price_id) {
      console.error("[v0] Plan error:", planError);
      return NextResponse.json(
        { error: "Plan not found or missing Stripe price ID" },
        { status: 404 }
      );
    }

    // Get existing subscription
    const { data: existingSubscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, plan_id, status")
      .eq("business_id", businessId)
      .in("status", ["active", "trialing", "past_due"])
      .maybeSingle();

    if (subError || !existingSubscription) {
      return NextResponse.json(
        {
          error: "No active subscription found. Please create a new subscription first.",
          redirectToCheckout: true,
        },
        { status: 400 }
      );
    }

    // Check if already on this plan
    const { data: currentPlan } = await supabase
      .from("plans")
      .select("slug")
      .eq("id", existingSubscription.plan_id)
      .single();

    if (currentPlan?.slug === planSlug) {
      return NextResponse.json(
        { error: "You are already on this plan" },
        { status: 400 }
      );
    }

    // Retrieve the full subscription from Stripe to get the subscription item ID
    const stripeSubscription = await getSubscription(
      existingSubscription.stripe_subscription_id
    );

    if (!stripeSubscription.items.data[0]) {
      return NextResponse.json(
        { error: "Subscription has no items" },
        { status: 400 }
      );
    }

    const subscriptionItemId = stripeSubscription.items.data[0].id;

    // Update the subscription with the new price
    // Stripe will automatically handle proration
    const updatedSubscription = await updateSubscription(
      existingSubscription.stripe_subscription_id,
      {
        items: [
          {
            id: subscriptionItemId,
            price: newPlan.stripe_price_id,
          },
        ],
        proration_behavior: "always_invoice", // Charge immediately for proration
        metadata: {
          previous_plan: currentPlan?.slug || "unknown",
          new_plan: planSlug,
          updated_at: new Date().toISOString(),
        },
      }
    );

    console.log(
      "[v0] Subscription updated:",
      existingSubscription.stripe_subscription_id,
      "from",
      currentPlan?.slug,
      "to",
      planSlug
    );

    // The webhook will handle updating the database
    // But we can return success immediately
    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully. Changes will be reflected shortly.",
      subscriptionId: updatedSubscription.id,
    });
  } catch (error) {
    console.error("[v0] Error updating subscription:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
