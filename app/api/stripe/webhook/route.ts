import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1000; // 1 second

  // Helper function to retry operations
  async function retryOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
    retries = MAX_RETRIES,
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        const isRetryable = 
          error?.code === "PGRST_116" || // PostgREST connection error
          error?.message?.includes("timeout") ||
          error?.message?.includes("ECONNREFUSED") ||
          error?.message?.includes("network");

        if (isRetryable && attempt < retries) {
          console.warn(
            `[Webhook] ${operationName} failed (attempt ${attempt}/${retries}), retrying...`,
            error.message,
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
          continue;
        }

        // Not retryable or max retries reached
        throw error;
      }
    }

    throw lastError;
  }

  try {
    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await retryOperation(
          () => handleSubscriptionCreated(supabase, subscription),
          "handleSubscriptionCreated",
        );
        console.log("[Webhook] ✅ Handled subscription created event:", subscription.id);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await retryOperation(
          () => handleSubscriptionUpdate(supabase, subscription),
          "handleSubscriptionUpdate",
        );
        console.log("[Webhook] ✅ Handled subscription updated event:", subscription.id);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await retryOperation(
          () => handleSubscriptionCanceled(supabase, subscription),
          "handleSubscriptionCanceled",
        );
        console.log("[Webhook] ✅ Handled subscription canceled event:", subscription.id);
        break;
      }
      case "invoice.created": {
        const invoice = event.data.object as Stripe.Invoice;
        await retryOperation(
          () => handleInvoiceCreated(supabase, invoice),
          "handleInvoiceCreated",
        );
        console.log("[Webhook] ✅ Handled invoice created event:", invoice.id);
        break;
      }
      case "invoice.finalized": {
        const invoice = event.data.object as Stripe.Invoice;
        await retryOperation(
          () => handleInvoiceFinalized(supabase, invoice),
          "handleInvoiceFinalized",
        );
        console.log("[Webhook] ✅ Handled invoice finalized event:", invoice.id);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await retryOperation(
          () => handleInvoicePaid(supabase, invoice),
          "handleInvoicePaid",
        );
        console.log("[Webhook] ✅ Handled invoice payment succeeded event:", invoice.id);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await retryOperation(
          () => handleInvoiceFailed(supabase, invoice),
          "handleInvoiceFailed",
        );
        console.log("[Webhook] ✅ Handled invoice payment failed event:", invoice.id);
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await retryOperation(
          () => handleCheckoutComplete(supabase, session),
          "handleCheckoutComplete",
        );
        console.log("[Webhook] ✅ Handled checkout session completed event:", session.id);
        break;
      }
      default:
        console.log(`[Webhook] ⚠️ Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    // Log detailed error information
    console.error("[Webhook] ❌ Error processing webhook:", {
      eventType: event.type,
      eventId: event.id,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });

    // Return 500 to trigger Stripe's retry mechanism
    // Stripe will automatically retry failed webhooks
    return NextResponse.json(
      { 
        error: "Webhook processing failed",
        eventId: event.id,
        eventType: event.type,
        // Include error details in development
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }

  console.log("[v0] Webhook processed successfully for event:", event.type);
  return NextResponse.json({ received: true });
}

// Helper function to safely convert Stripe timestamps
function safeDateFromTimestamp(
  timestamp: number | null | undefined,
): Date | null {
  if (!timestamp || typeof timestamp !== "number" || timestamp <= 0) {
    return null;
  }
  return new Date(timestamp * 1000);
}

function safeToISOString(date: Date | null): string | null {
  if (!date || isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

// async function handleCheckoutComplete(
//   supabase: any,
//   session: Stripe.Checkout.Session
// ) {
//   if (!session.subscription || !session.customer) {
//     console.error(
//       "[v0] Checkout session missing subscription or customer:",
//       session
//     );
//     console.log("[v0] Checkout session missing subscription or customer");
//     return;
//   }
//   console.log("[v0] Handling checkout complete for session:", session.id);
//   console.log("customer:", session.customer);

//   const { data: stripeCustomer, error: customerError } = await supabase
//     .from("stripe_customers")
//     .select("business_id")
//     .eq("stripe_customer_id", session.customer)
//     .maybeSingle();

//   if (customerError || !stripeCustomer) {
//     console.log(
//       "[v0] Stripe customer not found for:",
//       session.customer,
//       customerError
//     );
//     return;
//   }

//   try {
//     const subscription = await stripe.subscriptions.retrieve(
//       session.subscription as string
//     );

//     console.log("Subscription object keys:", Object.keys(subscription));
//     console.log("Subscription object:", JSON.stringify(subscription, null, 2));

//     const priceId = subscription.items.data[0]?.price.id;

//     const { data: plan, error: planError } = await supabase
//       .from("plans")
//       .select("id, slug")
//       .eq("stripe_price_id", priceId)
//       .maybeSingle();

//     if (planError || !plan) {
//       console.error("[v0] Plan not found for price:", priceId, planError);
//       return;
//     }

//     // Use safe date conversion
//     const currentPeriodStart = safeDateFromTimestamp(
//       subscription.current_period_start
//     );
//     const currentPeriodEnd = safeDateFromTimestamp(
//       subscription.current_period_end
//     );
//     const trialEnd = safeDateFromTimestamp(subscription.trial_end);

//     const { error: subError } = await supabase.from("subscriptions").upsert(
//       {
//         business_id: stripeCustomer.business_id,
//         plan_id: plan.id,
//         stripe_subscription_id: subscription.id,
//         stripe_customer_id: session.customer as string,
//         status: subscription.status,
//         current_period_start: safeToISOString(currentPeriodStart),
//         current_period_end: safeToISOString(currentPeriodEnd),
//         trial_end: subscription.trial_end ? safeToISOString(trialEnd) : null,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       },
//       { onConflict: "business_id" }
//     );

//     if (subError) {
//       console.error("[v0] Error creating subscription:", subError);
//       return;
//     }

//     const { error: bizError } = await supabase
//       .from("businesses")
//       .update({
//         billing_plan: plan.slug,
//         subscription_status: subscription.status,
//         onboarding_completed: true,
//         onboarding_completed_at: new Date().toISOString(),
//       })
//       .eq("id", stripeCustomer.business_id);

//     if (bizError) {
//       console.error("[v0] Error updating business:", bizError);
//       return;
//     }

//     const { error: usageError } = await supabase.from("usage_tracking").upsert(
//       {
//         business_id: stripeCustomer.business_id,
//         plan_id: plan.id,
//         minutes_used: 0,
//         calls_made: 0,
//         active_phone_numbers: 0,
//         team_members_count: 0,
//         period_start: new Date().toISOString(),
//         period_end: new Date(
//           Date.now() + 30 * 24 * 60 * 60 * 1000
//         ).toISOString(),
//       },
//       { onConflict: "business_id" }
//     );

//     if (usageError) {
//       console.error("[v0] Error creating usage tracking:", usageError);
//     }

//     console.log(
//       "[v0] Subscription created for business:",
//       stripeCustomer.business_id,
//       "with plan:",
//       plan.slug
//     );
//   } catch (error) {
//     console.error("[v0] Error in handleCheckoutComplete:", error);
//   }
// }

async function handleCheckoutComplete(
  supabase: any,
  session: Stripe.Checkout.Session,
) {
  if (!session.subscription || !session.customer) {
    console.error(
      "[v0] Checkout session missing subscription or customer:",
      session,
    );
    return;
  }
  console.log("[v0] Handling checkout complete for session:", session.id);
  console.log("customer:", session.customer);

  const { data: stripeCustomer, error: customerError } = await supabase
    .from("stripe_customers")
    .select("business_id")
    .eq("stripe_customer_id", session.customer)
    .maybeSingle();

  if (customerError || !stripeCustomer) {
    console.log(
      "[v0] Stripe customer not found for:",
      session.customer,
      customerError,
    );
    return;
  }

  try {
    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription as string,
    )) as Stripe.Subscription;

    const priceId = subscription.items.data[0]?.price.id;

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id, slug")
      .eq("stripe_price_id", priceId)
      .maybeSingle();

    if (planError || !plan) {
      console.error("[v0] Plan not found for price:", priceId, planError);
      return;
    }

    // Get period dates directly from the subscription object
    // Note: current_period_start and current_period_end are on the subscription's 'Subscription' object (unix timestamps), but they may not be typed in the Stripe type. Use bracket notation to avoid TS error.
    const periodStartDate = safeDateFromTimestamp(
      (subscription as any)["current_period_start"],
    );
    const periodEndDate = safeDateFromTimestamp(
      (subscription as any)["current_period_end"],
    );
    const trialEndDate = safeDateFromTimestamp(subscription.trial_end);

    const { error: subError } = await supabase.from("subscriptions").upsert(
      {
        business_id: stripeCustomer.business_id,
        plan_id: plan.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: session.customer as string,
        status: subscription.status,
        current_period_start: safeToISOString(periodStartDate),
        current_period_end: safeToISOString(periodEndDate),
        trial_end: safeToISOString(trialEndDate),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "business_id" },
    );

    if (subError) {
      console.error("[v0] Error creating subscription:", subError);
      return;
    }

    const { error: bizError } = await supabase
      .from("businesses")
      .update({
        billing_plan: plan.slug,
        subscription_status: subscription.status,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", stripeCustomer.business_id);

    if (bizError) {
      console.error("[v0] Error updating business:", bizError);
      return;
    }

    const { error: usageError } = await supabase.from("usage_tracking").upsert(
      {
        business_id: stripeCustomer.business_id,
        plan_id: plan.id,
        minutes_used: 0,
        calls_made: 0,
        active_phone_numbers: 0,
        team_members_count: 0,
        period_start: new Date().toISOString(),
        period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      { onConflict: "business_id" },
    );

    if (usageError) {
      console.error("[v0] Error creating usage tracking:", usageError);
    }

    console.log(
      "[v0] Subscription created for business:",
      stripeCustomer.business_id,
      "with plan:",
      plan.slug,
    );
  } catch (error) {
    console.error("[v0] Error in handleCheckoutComplete:", error);
  }
}

// async function handleSubscriptionCreated(
//   supabase: any,
//   subscription: Stripe.Subscription
// ) {
//   const { data: stripeCustomer } = await supabase
//     .from("stripe_customers")
//     .select("business_id")
//     .eq("stripe_customer_id", subscription.customer)
//     .single();

//   if (!stripeCustomer) {
//     console.log("[v0] Stripe customer not found for subscription creation");
//     return;
//   }

//   const priceId = subscription.items.data[0]?.price.id;
//   const { data: plan } = await supabase
//     .from("plans")
//     .select("id, slug")
//     .eq("stripe_price_id", priceId)
//     .single();

//   // Use safe date conversion
//   const currentPeriodStart = safeDateFromTimestamp(
//     subscription.current_period_start
//   );
//   const currentPeriodEnd = safeDateFromTimestamp(
//     subscription.current_period_end
//   );
//   const trialEnd = safeDateFromTimestamp(subscription.trial_end);

//   await supabase.from("subscriptions").upsert(
//     {
//       business_id: stripeCustomer.business_id,
//       plan_id: plan?.id,
//       stripe_subscription_id: subscription.id,
//       stripe_customer_id: subscription.customer as string,
//       status: subscription.status,
//       current_period_start: safeToISOString(currentPeriodStart),
//       current_period_end: safeToISOString(currentPeriodEnd),
//       trial_end: subscription.trial_end ? safeToISOString(trialEnd) : null,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     },
//     { onConflict: "business_id" }
//   );

//   await supabase
//     .from("businesses")
//     .update({
//       billing_plan: plan?.slug,
//       subscription_status: subscription.status,
//     })
//     .eq("id", stripeCustomer.business_id);
// }

async function handleSubscriptionCreated(
  supabase: any,
  subscription: Stripe.Subscription,
) {
  const { data: stripeCustomer } = await supabase
    .from("stripe_customers")
    .select("business_id")
    .eq("stripe_customer_id", subscription.customer)
    .single();

  if (!stripeCustomer) {
    console.log("[v0] Stripe customer not found for subscription creation");
    return;
  }

  const priceId = subscription.items.data[0]?.price.id;
  const { data: plan } = await supabase
    .from("plans")
    .select("id, slug")
    .eq("stripe_price_id", priceId)
    .single();

  // Get period dates directly from the subscription object
  // Note: current_period_start and current_period_end are on the subscription, not on items
  const periodStartDate = safeDateFromTimestamp(
    (subscription as any).current_period_start,
  );
  const periodEndDate = safeDateFromTimestamp((subscription as any).current_period_end);
  const trialEndDate = safeDateFromTimestamp((subscription as any).trial_end);

  await supabase.from("subscriptions").upsert(
    {
      business_id: stripeCustomer.business_id,
      plan_id: plan?.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: subscription.status,
      current_period_start: safeToISOString(periodStartDate),
      current_period_end: safeToISOString(periodEndDate),
      trial_end: safeToISOString(trialEndDate),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "business_id" },
  );

  await supabase
    .from("businesses")
    .update({
      billing_plan: plan?.slug,
      subscription_status: subscription.status,
    })
    .eq("id", stripeCustomer.business_id);
}

// async function handleSubscriptionUpdate(
//   supabase: any,
//   subscription: Stripe.Subscription
// ) {
//   const { data: stripeCustomer } = await supabase
//     .from("stripe_customers")
//     .select("business_id")
//     .eq("stripe_customer_id", subscription.customer)
//     .single();

//   if (stripeCustomer) {
//     const currentPeriodStart = safeDateFromTimestamp(
//       subscription.current_period_start
//     );
//     const currentPeriodEnd = safeDateFromTimestamp(
//       subscription.current_period_end
//     );
//     const trialEnd = safeDateFromTimestamp(subscription.trial_end);
//     await supabase
//       .from("subscriptions")
//       .update({
//         stripe_subscription_id: subscription.id,
//         status: subscription.status,
//         current_period_start: safeToISOString(currentPeriodStart),
//         current_period_end: safeToISOString(currentPeriodEnd),
//         trial_end: subscription.trial_end ? safeToISOString(trialEnd) : null,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("business_id", stripeCustomer.business_id);

//     await supabase
//       .from("businesses")
//       .update({
//         subscription_status: subscription.status,
//       })
//       .eq("id", stripeCustomer.business_id);
//   }
// }

async function handleSubscriptionUpdate(
  supabase: any,
  subscription: Stripe.Subscription,
) {
  const { data: stripeCustomer } = await supabase
    .from("stripe_customers")
    .select("business_id")
    .eq("stripe_customer_id", subscription.customer)
    .single();

  if (stripeCustomer) {
    // Get the plan from the subscription's price
    const priceId = subscription.items.data[0]?.price.id;
    const { data: plan } = await supabase
      .from("plans")
      .select("id, slug")
      .eq("stripe_price_id", priceId)
      .single();

    // Get period dates directly from the subscription object
    // Note: current_period_start and current_period_end are on the subscription, not on items
    const periodStartDate = safeDateFromTimestamp(
      (subscription as any).current_period_start,
    );
    const periodEndDate = safeDateFromTimestamp(
      (subscription as any).current_period_end,
    );
    const trialEndDate = safeDateFromTimestamp(subscription.trial_end);

    await supabase
      .from("subscriptions")
      .update({
        stripe_subscription_id: subscription.id,
        plan_id: plan?.id, // Update plan_id when subscription changes
        status: subscription.status,
        current_period_start: safeToISOString(periodStartDate),
        current_period_end: safeToISOString(periodEndDate),
        trial_end: safeToISOString(trialEndDate),
        cancel_at: subscription.cancel_at
          ? safeToISOString(safeDateFromTimestamp(subscription.cancel_at))
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        updated_at: new Date().toISOString(),
      })
      .eq("business_id", stripeCustomer.business_id);

    await supabase
      .from("businesses")
      .update({
        billing_plan: plan?.slug, // Update billing_plan when subscription changes
        subscription_status: subscription.status,
      })
      .eq("id", stripeCustomer.business_id);
  }
}

async function handleSubscriptionCanceled(
  supabase: any,
  subscription: Stripe.Subscription,
) {
  const { data: stripeCustomer } = await supabase
    .from("stripe_customers")
    .select("business_id")
    .eq("stripe_customer_id", subscription.customer)
    .single();

  if (stripeCustomer) {
    await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("business_id", stripeCustomer.business_id);

    await supabase
      .from("businesses")
      .update({
        subscription_status: "canceled",
      })
      .eq("id", stripeCustomer.business_id);
  }
}

// async function handleInvoicePaid(supabase: any, invoice: Stripe.Invoice) {
//   const { data: stripeCustomer } = await supabase
//     .from("stripe_customers")
//     .select("business_id")
//     .eq("stripe_customer_id", invoice.customer)
//     .single();

//   if (stripeCustomer) {
//     const paidAt = invoice.status_transitions?.paid_at
//       ? safeDateFromTimestamp(invoice.status_transitions.paid_at)
//       : null;
//     await supabase.from("invoices").upsert(
//       {
//         business_id: stripeCustomer.business_id,
//         stripe_invoice_id: invoice.id,
//         status: "paid",
//         amount: invoice.amount_paid,
//         paid_at: safeToISOString(paidAt) || new Date().toISOString(),
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       },
//       { onConflict: "stripe_invoice_id" }
//     );
//   }
// }

// Invoice event handlers
async function handleInvoiceCreated(supabase: any, invoice: Stripe.Invoice) {
  // Add this to debug what properties exist
  console.log("Invoice properties:", Object.keys(invoice));
  console.log("Invoice subscription:", (invoice as any).subscription);
  const { data: stripeCustomer } = await supabase
    .from("stripe_customers")
    .select("business_id")
    .eq("stripe_customer_id", invoice.customer)
    .single();

  if (stripeCustomer) {
    const periodStart = safeDateFromTimestamp(invoice.period_start);
    const periodEnd = safeDateFromTimestamp(invoice.period_end);
    const dueDate = safeDateFromTimestamp(invoice.due_date);
    // Create the invoice data object
    const invoiceData: any = {
      business_id: stripeCustomer.business_id,
      stripe_invoice_id: invoice.id,
      status: invoice.status || "draft",
      amount: invoice.amount_due,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add optional fields
    if (invoice.number) invoiceData.invoice_number = invoice.number;
    if (invoice.currency) invoiceData.currency = invoice.currency;
    if (periodStart) invoiceData.period_start = safeToISOString(periodStart);
    if (periodEnd) invoiceData.period_end = safeToISOString(periodEnd);
    if (dueDate) invoiceData.due_date = safeToISOString(dueDate);

    // Handle subscription reference
    const invoiceAny = invoice as any;
    if (invoiceAny.subscription) {
      invoiceData.subscription_id = invoiceAny.subscription;
    }

    await supabase
      .from("invoices")
      .upsert(invoiceData, { onConflict: "stripe_invoice_id" });
  }
}

async function handleInvoiceFinalized(supabase: any, invoice: Stripe.Invoice) {
  const { data: stripeCustomer } = await supabase
    .from("stripe_customers")
    .select("business_id")
    .eq("stripe_customer_id", invoice.customer)
    .single();

  if (stripeCustomer) {
    const periodStart = safeDateFromTimestamp(invoice.period_start);
    const periodEnd = safeDateFromTimestamp(invoice.period_end);
    const dueDate = safeDateFromTimestamp(invoice.due_date);
    // Create the invoice data object
    const invoiceData: any = {
      business_id: stripeCustomer.business_id,
      stripe_invoice_id: invoice.id,
      status: invoice.status || "open",
      amount: invoice.amount_due,
      updated_at: new Date().toISOString(),
    };

    // Add optional fields
    if (invoice.number) invoiceData.invoice_number = invoice.number;
    if (invoice.currency) invoiceData.currency = invoice.currency;
    if (periodStart) invoiceData.period_start = safeToISOString(periodStart);
    if (periodEnd) invoiceData.period_end = safeToISOString(periodEnd);
    if (dueDate) invoiceData.due_date = safeToISOString(dueDate);

    // Handle subscription reference
    const invoiceAny = invoice as any;
    if (invoiceAny.subscription) {
      invoiceData.subscription_id = invoiceAny.subscription;
    }

    await supabase
      .from("invoices")
      .upsert(invoiceData, { onConflict: "stripe_invoice_id" });
  }
}

async function handleInvoicePaid(supabase: any, invoice: Stripe.Invoice) {
  const { data: stripeCustomer } = await supabase
    .from("stripe_customers")
    .select("business_id")
    .eq("stripe_customer_id", invoice.customer)
    .single();

  if (stripeCustomer) {
    const paidAt = invoice.status_transitions?.paid_at
      ? safeDateFromTimestamp(invoice.status_transitions.paid_at)
      : null;
    const periodStart = safeDateFromTimestamp(invoice.period_start);
    const periodEnd = safeDateFromTimestamp(invoice.period_end);
    // Create the invoice data object
    const invoiceData: any = {
      business_id: stripeCustomer.business_id,
      stripe_invoice_id: invoice.id,
      status: invoice.status || "paid",
      amount: invoice.amount_paid || invoice.amount_due,
      paid_at: safeToISOString(paidAt) || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add optional fields if they exist and your table has them
    if (invoice.number) invoiceData.invoice_number = invoice.number;
    if (invoice.currency) invoiceData.currency = invoice.currency;
    if (invoice.hosted_invoice_url)
      invoiceData.invoice_url = invoice.hosted_invoice_url;
    if (invoice.invoice_pdf) invoiceData.invoice_pdf = invoice.invoice_pdf;

    // Safe period dates
    if (periodStart) invoiceData.period_start = safeToISOString(periodStart);
    if (periodEnd) invoiceData.period_end = safeToISOString(periodEnd);

    // Handle subscription reference - use type assertion
    const invoiceAny = invoice as any;
    if (invoiceAny.subscription) {
      invoiceData.subscription_id = invoiceAny.subscription;
    }

    await supabase
      .from("invoices")
      .upsert(invoiceData, { onConflict: "stripe_invoice_id" });

    // If payment succeeded, clear payment failure metadata and restore subscription
    if (invoiceAny.subscription) {
      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("metadata, status")
        .eq("stripe_subscription_id", invoiceAny.subscription)
        .maybeSingle();

      if (existingSub) {
        const existingMetadata = (existingSub.metadata as any) || {};
        // Remove payment failure tracking when payment succeeds
        const { payment_failed_at, payment_failure_count, ...cleanedMetadata } =
          existingMetadata;

        await supabase
          .from("subscriptions")
          .update({
            status: "active", // Restore to active when payment succeeds
            metadata: cleanedMetadata,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", invoiceAny.subscription);

        // Update business subscription status
        await supabase
          .from("businesses")
          .update({
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("id", stripeCustomer.business_id);

        console.log(
          "[v0] Payment succeeded, subscription restored for business:",
          stripeCustomer.business_id,
        );
      }
    }
  }
}

async function handleInvoiceFailed(supabase: any, invoice: Stripe.Invoice) {
  const { data: stripeCustomer } = await supabase
    .from("stripe_customers")
    .select("business_id")
    .eq("stripe_customer_id", invoice.customer)
    .single();

  if (stripeCustomer) {
    const periodStart = safeDateFromTimestamp(invoice.period_start);
    const periodEnd = safeDateFromTimestamp(invoice.period_end);
    // Create the invoice data object
    const invoiceData: any = {
      business_id: stripeCustomer.business_id,
      stripe_invoice_id: invoice.id,
      status: invoice.status || "uncollectible",
      amount: invoice.amount_due,
      updated_at: new Date().toISOString(),
    };

    // Add optional fields
    if (invoice.number) invoiceData.invoice_number = invoice.number;
    if (invoice.currency) invoiceData.currency = invoice.currency;
    if (periodStart) invoiceData.period_start = safeToISOString(periodStart);
    if (periodEnd) invoiceData.period_end = safeToISOString(periodEnd);

    // Handle subscription reference
    const invoiceAny = invoice as any;
    if (invoiceAny.subscription) {
      invoiceData.subscription_id = invoiceAny.subscription;
    }

    // Update invoice record
    await supabase
      .from("invoices")
      .upsert(invoiceData, { onConflict: "stripe_invoice_id" });

    // Get existing subscription to read current metadata
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("metadata")
      .eq("business_id", stripeCustomer.business_id)
      .maybeSingle();

    const existingMetadata = (existingSub?.metadata as any) || {};
    const failureCount = (existingMetadata.payment_failure_count || 0) + 1;

    // Update subscription status to past_due and track payment failure date
    const now = new Date().toISOString();
    await supabase
      .from("subscriptions")
      .update({
        status: "past_due",
        updated_at: now,
        metadata: {
          ...existingMetadata,
          payment_failed_at: now,
          payment_failure_count: failureCount,
        },
      })
      .eq("business_id", stripeCustomer.business_id);

    // Update business subscription status
    await supabase
      .from("businesses")
      .update({
        subscription_status: "past_due",
        updated_at: now,
      })
      .eq("id", stripeCustomer.business_id);

    console.log(
      "[v0] Payment failed for business:",
      stripeCustomer.business_id,
      "Invoice:",
      invoice.id,
      "Failure count:",
      failureCount,
    );

    await supabase
      .from("invoices")
      .upsert(invoiceData, { onConflict: "stripe_invoice_id" });

    // Also update business subscription status
    await supabase
      .from("businesses")
      .update({
        subscription_status: "past_due",
      })
      .eq("id", stripeCustomer.business_id);
  }
}
