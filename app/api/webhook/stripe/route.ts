import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import Stripe from "stripe";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !endpointSecret) {
      return NextResponse.json(
        { error: "Missing signature or endpoint secret" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
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

    // Log event
    const { data: customer } = await supabase
      .from("stripe_customers")
      .select("business_id")
      .eq("stripe_customer_id", (event.data.object as any).customer as string)
      .single();

    await supabase.from("billing_events").insert({
      business_id: customer?.business_id,
      event_type: event.type,
      stripe_event_id: event.id,
      event_data: event.data,
    });

    // Handle specific events
    switch (event.type) {
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
          supabase,
          customer?.business_id
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          supabase,
          customer?.business_id
        );
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice,
          supabase,
          customer?.business_id
        );
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: any,
  businessId: string
) {
  await supabase.from("stripe_subscriptions").upsert({
    business_id: businessId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    stripe_price_id: subscription.items.data[0]?.price.id as string,
    status: subscription.status,
    current_period_start: new Date(
      (subscription as any).current_period_start * 1000
    ),
    current_period_end: new Date(
      (subscription as any).current_period_end * 1000
    ),
  });
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any,
  businessId: string
) {
  await supabase
    .from("stripe_subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date(),
    })
    .eq("stripe_subscription_id", subscription.id);
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any,
  businessId: string
) {
  const { data: subscription } = await supabase
    .from("stripe_subscriptions")
    .select("stripe_subscription_id")
    .eq("stripe_subscription_id", (invoice as any).subscription as string)
    .single();

  await supabase.from("stripe_invoices").insert({
    business_id: businessId,
    stripe_invoice_id: invoice.id,
    stripe_subscription_id: (invoice as any).subscription as string,
    amount_cents: invoice.amount_paid,
    status: invoice.status,
    paid_at: new Date((invoice as any).paid_at! * 1000),
    invoice_url: invoice.hosted_invoice_url,
    pdf_url: invoice.invoice_pdf,
  });
}
