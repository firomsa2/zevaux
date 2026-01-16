import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createStripeCustomer } from "@/lib/stripe-server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { businessId, email, businessName } = await request.json();

    if (!businessId || !email || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Stripe customer
    const customer = await createStripeCustomer(email, businessName);

    // Save to Supabase
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

    const { error: insertError } = await supabase
      .from("stripe_customers")
      .insert({
        business_id: businessId,
        stripe_customer_id: customer.id,
        email: customer.email,
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save customer" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stripe_customer_id: customer.id,
    });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
