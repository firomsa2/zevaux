import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Legacy helper endpoint used by SubscriptionManager.
// Now reads from the canonical `subscriptions` + `plans` tables instead of `stripe_subscriptions`.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "Missing businessId" },
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

    // Get the active subscription for this business from the canonical table
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        plans:plan_id(*)
      `
      )
      .eq("business_id", businessId)
      .in("status", ["trialing", "active"])
      .maybeSingle();

    if (error || !subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Shape response to match what SubscriptionManager expects while using canonical tables.
    const plan = (subscription as any).plans;

    const shapedSubscription = {
      ...subscription,
      billing_plan: plan?.slug ?? null,
      stripe_prices: {
        minutes_limit: plan?.minutes_limit ?? null,
        amount_cents:
          typeof plan?.monthly_price === "number"
            ? Math.round(plan.monthly_price * 100)
            : null,
      },
    };

    return NextResponse.json({ subscription: shapedSubscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
