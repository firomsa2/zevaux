import Stripe from "stripe";

// Initialize Stripe server-side client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

/**
 * Get or create a Stripe customer for a business
 */
export async function getOrCreateStripeCustomer(
  businessId: string,
  email: string,
  businessName: string,
  supabase: any
) {
  // Check if customer already exists in database
  const { data: existingCustomer } = await supabase
    .from("user_integrations")
    .select("metadata")
    .eq("business_id", businessId)
    .eq("provider", "stripe")
    .single();

  if (existingCustomer?.metadata?.stripe_customer_id) {
    return existingCustomer.metadata.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: businessName,
    metadata: {
      business_id: businessId,
    },
  });

  // Store in user_integrations
  await supabase.from("user_integrations").insert({
    business_id: businessId,
    user_id: businessId, // Use business_id as placeholder - should be updated with actual user_id
    provider: "stripe",
    access_token: customer.id,
    metadata: {
      stripe_customer_id: customer.id,
    },
  });

  return customer.id;
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: 14,
    },
  });

  return session;
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
  });

  return subscriptions.data[0] || null;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Update subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  if (!subscription.items.data[0]) {
    throw new Error("No subscription items found");
  }

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
  });
}
