import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSubscription, updateSubscription } from "@/lib/stripe-server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { businessId, cancelImmediately = false } = await request.json();

    if (!businessId) {
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

    // Get existing subscription
    const { data: existingSubscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, status")
      .eq("business_id", businessId)
      .in("status", ["active", "trialing", "past_due"])
      .maybeSingle();

    if (subError || !existingSubscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Retrieve the subscription from Stripe to check current state
    const stripeSubscription = await getSubscription(
      existingSubscription.stripe_subscription_id
    );

    if (cancelImmediately) {
      // Cancel immediately - this will end the subscription right away
      const stripe = await import("@/lib/stripe-server").then(
        (m) => m.default
      );
      await stripe.subscriptions.cancel(
        existingSubscription.stripe_subscription_id
      );

      console.log(
        "[v0] Subscription canceled immediately:",
        existingSubscription.stripe_subscription_id
      );

      return NextResponse.json({
        success: true,
        message: "Subscription canceled immediately. Access will end now.",
        canceledAt: new Date().toISOString(),
      });
    } else {
      // Cancel at period end - subscription continues until current period ends
      await updateSubscription(existingSubscription.stripe_subscription_id, {
        cancel_at_period_end: true,
        metadata: {
          cancellation_requested_at: new Date().toISOString(),
          cancellation_type: "period_end",
        },
      });

      console.log(
        "[v0] Subscription scheduled for cancellation at period end:",
        existingSubscription.stripe_subscription_id
      );

      return NextResponse.json({
        success: true,
        message:
          "Subscription will be canceled at the end of the current billing period. You'll continue to have access until then.",
        cancelAtPeriodEnd: true,
        periodEnd:
          stripeSubscription && (stripeSubscription as any).current_period_end
            ? new Date((stripeSubscription as any).current_period_end * 1000).toISOString()
            : null,
      });
    }
  } catch (error) {
    console.error("[v0] Error canceling subscription:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
