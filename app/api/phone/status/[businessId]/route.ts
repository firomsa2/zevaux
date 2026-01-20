import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await params;

    const { data: phoneEndpoint, error } = await supabase
      .from("phone_endpoints")
      .select("phone_number, status")
      .eq("business_id", businessId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[v0] Phone endpoint query error:", error);
      return NextResponse.json({
        status: "pending",
        phoneNumber: null,
        message: "Checking provisioning status...",
      });
    }

    if (!phoneEndpoint) {
      return NextResponse.json({
        status: "pending",
        phoneNumber: null,
        message: "Phone number is still being provisioned",
      });
    }

    // Check if business has phone_main set, if not, set it to this phone number
    const { data: businessData } = await supabase
      .from("businesses")
      .select("phone_main")
      .eq("id", businessId)
      .single();

    // If phone_main is not set, set it to the first active phone number
    if (!businessData?.phone_main) {
      const { error: updateError } = await supabase
        .from("businesses")
        .update({
          phone_main: phoneEndpoint.phone_number,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);

      if (updateError) {
        console.error("[v0] Failed to set phone_main:", updateError);
      } else {
        console.log("[v0] Set phone_main to:", phoneEndpoint.phone_number);
      }
    }

    // Update onboarding progress
    await supabase
      .from("onboarding_progress")
      .update({
        phone_provisioning_status: "completed",
        step_2_phone_verified: true,
      })
      .eq("business_id", businessId);

    return NextResponse.json({
      status: "completed",
      phoneNumber: phoneEndpoint.phone_number,
      message: "Phone number is active and ready to receive calls",
    });
  } catch (error) {
    console.error("[v0] Phone status error:", error);
    return NextResponse.json(
      { error: "Failed to check phone status" },
      { status: 500 }
    );
  }
}
