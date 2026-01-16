"use server";

import { createClient } from "@/utils/supabase/server";
import {
  createStripeCustomer,
  createCheckoutSession,
} from "@/lib/stripe-server";

export async function initializeStripeCustomer(
  userId: string,
  email: string,
  businessName: string
) {
  const supabase = await createClient();

  try {
    // Get user's business
    const { data: user } = await supabase
      .from("users")
      .select("business_id")
      .eq("id", userId)
      .single();

    if (!user?.business_id) {
      return { success: false, error: "No business found" };
    }

    // Check if already has stripe customer
    const { data: existing } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("business_id", user.business_id)
      .single();

    if (existing?.stripe_customer_id) {
      return { success: true, customerId: existing.stripe_customer_id };
    }

    // Create new stripe customer
    const customer = await createStripeCustomer(email, businessName);

    await supabase.from("stripe_customers").insert({
      business_id: user.business_id,
      stripe_customer_id: customer.id,
      email,
    });

    return { success: true, customerId: customer.id };
  } catch (error) {
    console.error("Error initializing Stripe customer:", error);
    return { success: false, error: String(error) };
  }
}

export async function createStripeCheckout(userId: string, planSlug: string) {
  const supabase = await createClient();

  try {
    // Get user and business
    const { data: user } = await supabase
      .from("users")
      .select("business_id")
      .eq("id", userId)
      .single();

    if (!user?.business_id) {
      return { success: false, error: "No business found" };
    }

    // Get plan
    const { data: plan } = await supabase
      .from("plans")
      .select("id, stripe_price_id")
      .eq("slug", planSlug)
      .single();

    if (!plan?.stripe_price_id) {
      return { success: false, error: "Plan not found" };
    }

    // Get stripe customer
    const { data: stripeCustomer } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("business_id", user.business_id)
      .single();

    if (!stripeCustomer?.stripe_customer_id) {
      return { success: false, error: "Stripe customer not found" };
    }

    // Create checkout session
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await createCheckoutSession(
      stripeCustomer.stripe_customer_id,
      plan.stripe_price_id,
      `${origin}/billing?session_id={CHECKOUT_SESSION_ID}`,
      `${origin}/onboarding/business-setup`
    );

    return { success: true, sessionUrl: session.url };
  } catch (error) {
    console.error("Error creating checkout:", error);
    return { success: false, error: String(error) };
  }
}
