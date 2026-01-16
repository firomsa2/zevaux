import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const businessId = request.nextUrl.searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json(
      { error: "Business ID required" },
      { status: 400 }
    );
  }

  // Verify user has access to this business
  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (userData?.business_id !== businessId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { data: invoices } = await supabase
      .from("invoices")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    const formattedInvoices = invoices?.map((inv) => ({
      id: inv.stripe_invoice_id,
      date: new Date(inv.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      amount: inv.amount,
      status: inv.status,
      description: "Monthly subscription",
    }));

    return NextResponse.json({ invoices: formattedInvoices || [] });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
