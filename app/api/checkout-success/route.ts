import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session ID provided" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(
      sessionId as string
    );

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get business from stripe customer
    const { data: stripeCustomer } = await supabase
      .from("stripe_customers")
      .select("business_id")
      .eq("stripe_customer_id", session.customer)
      .single();

    if (!stripeCustomer) {
      console.error("[v0] Stripe customer not found:", session.customer);
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Mark onboarding as completed
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("business_id", stripeCustomer.business_id)
      .single();

    if (user) {
      const steps = [
        "welcome",
        "plan_selection",
        "business_info",
        "receptionist_config",
        "payment_setup",
      ];

      for (const step of steps) {
        await supabase.from("onboarding_state").upsert(
          {
            user_id: user.id,
            business_id: stripeCustomer.business_id,
            step_key: step,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,step_key",
          }
        );
      }

      // Mark business onboarding as complete
      await supabase
        .from("businesses")
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq("id", stripeCustomer.business_id);
    }

    console.log(
      "[v0] Checkout success processed for business:",
      stripeCustomer.business_id
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Checkout success error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
