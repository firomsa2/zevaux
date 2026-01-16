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
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
