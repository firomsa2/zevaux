import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createStripeClient } from "@/lib/stripe-server";

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    const supabase = await createClient();

    // Get Stripe customer ID for business
    const { data: stripeCustomer } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("business_id", businessId)
      .single();

    if (!stripeCustomer?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    const stripe = createStripeClient();

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.stripe_customer_id,
      return_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Portal Error]", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
