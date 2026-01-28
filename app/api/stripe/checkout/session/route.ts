import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createCheckoutSession } from "@/lib/stripe-server";
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

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id, stripe_price_id, slug")
      .eq("slug", planSlug)
      .single();

    if (planError || !plan?.stripe_price_id) {
      console.error("[v0] Plan error:", planError);
      return NextResponse.json(
        { error: "Plan not found or missing Stripe price ID" },
        { status: 404 }
      );
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user?.email) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { data: businessData } = await supabase
      .from("businesses")
      .select("name")
      .eq("id", businessId)
      .single();

    if (!businessData?.name) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Check for existing active subscription to prevent duplicates
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, status")
      .eq("business_id", businessId)
      .in("status", ["active", "trialing", "past_due"])
      .maybeSingle();

    if (existingSubscription) {
      // User already has an active subscription - redirect to Billing Portal
      // where they can change plans, update payment method, or cancel
      console.log(
        "[v0] Existing subscription found, redirecting to Billing Portal",
      );
      return NextResponse.json(
        {
          error:
            "You already have an active subscription. Please use the Billing Portal to change your plan.",
          redirectToPortal: true,
          businessId,
        },
        { status: 400 },
      );
    }

    let { data: customer, error: customerError } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("business_id", businessId)
      .single();

    if (customerError || !customer?.stripe_customer_id) {
      console.log(
        "[v0] Creating new Stripe customer for business:",
        businessId
      );
      const { createStripeCustomer } = await import("@/lib/stripe-server");
      const newCustomer = await createStripeCustomer(
        userData.user.email,
        businessData.name
      );

      // Save the customer to database
      const { error: insertError } = await supabase
        .from("stripe_customers")
        .insert({
          business_id: businessId,
          stripe_customer_id: newCustomer.id,
          email: userData.user.email,
        });

      if (insertError) {
        console.error("[v0] Error saving Stripe customer:", insertError);
      }

      customer = { stripe_customer_id: newCustomer.id };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await createCheckoutSession(
      customer.stripe_customer_id,
      plan.stripe_price_id,
      `${baseUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      `${baseUrl}/onboarding/business-setup`
    );

    console.log("[v0] Checkout session created:", session.id);
    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error: any) {
    // Enhanced error logging
    const errorDetails = {
      message: error?.message || "Unknown error",
      code: error?.code,
      type: error?.type,
      // businessId: typeof businessId !== "undefined" ? businessId : null,
      // planSlug: typeof planSlug !== "undefined" ? planSlug : null,
      timestamp: new Date().toISOString(),
    };

    console.error("[Checkout] Error creating checkout session:", errorDetails);

    // Handle specific Stripe errors
    if (error?.type === "StripeCardError") {
      return NextResponse.json(
        {
          error: "Payment method error",
          message: error.message || "Your card was declined. Please try a different payment method.",
        },
        { status: 400 },
      );
    }

    if (error?.type === "StripeRateLimitError") {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again in a moment.",
        },
        { status: 429 },
      );
    }

    if (error?.type === "StripeAPIError") {
      return NextResponse.json(
        {
          error: "Payment service error",
          message: "Unable to process payment. Please try again or contact support.",
        },
        { status: 503 },
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create checkout session. Please try again.",
        // Include details in development only
        details: process.env.NODE_ENV === "development" ? errorDetails : undefined,
      },
      { status: 500 },
    );
  }
}
