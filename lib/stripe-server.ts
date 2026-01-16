import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export const createStripeClient = () => stripe;

export async function createStripeCustomer(
  email: string,
  businessName: string
) {
  return await stripe.customers.create({
    email,
    metadata: {
      business_name: businessName,
    },
  });
}

export async function getStripeCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function updateSubscription(subscriptionId: string, items: any) {
  return await stripe.subscriptions.update(subscriptionId, items);
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function listInvoices(customerId: string) {
  return await stripe.invoices.list({ customer: customerId });
}

export async function getPrice(priceId: string) {
  return await stripe.prices.retrieve(priceId);
}

export default stripe;
