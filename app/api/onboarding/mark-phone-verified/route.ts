import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { saveOnboardingProgress } from "@/utils/onboarding";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, phoneNumber } = await request.json();

    if (!businessId) {
      return NextResponse.json(
        { error: "Missing businessId" },
        { status: 400 },
      );
    }

    // Get the phone endpoint to ensure it exists
    const { data: phoneEndpoint } = await supabase
      .from("phone_endpoints")
      .select("phone_number")
      .eq("business_id", businessId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const finalPhoneNumber = phoneNumber || phoneEndpoint?.phone_number;

    if (!finalPhoneNumber) {
      return NextResponse.json(
        { error: "No active phone number found" },
        { status: 400 },
      );
    }

    // Set phone_main if not already set
    const { data: businessData } = await supabase
      .from("businesses")
      .select("phone_main")
      .eq("id", businessId)
      .single();

    const needsMainUpdate =
      !businessData?.phone_main || businessData.phone_main !== finalPhoneNumber;

    if (needsMainUpdate) {
      const { error: updateError } = await supabase
        .from("businesses")
        .update({
          phone_main: finalPhoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);

      if (updateError) {
        console.error("[v0] Failed to set phone_main:", updateError);
        return NextResponse.json(
          { error: "Failed to set phone_main" },
          { status: 500 },
        );
      }
    }

    // Update onboarding progress (step 3)
    const result = await saveOnboardingProgress(businessId, {
      phone_provisioning_status: "completed",
      phone_provisioning_error: null,
      step_3_phone_setup: true,
      step_2_phone_verified: true, // legacy flag for backward compatibility
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Phone verified and saved successfully",
      phoneNumber: finalPhoneNumber,
    });
  } catch (error) {
    console.error("[v0] Mark phone verified error:", error);
    return NextResponse.json(
      { error: "Failed to mark phone as verified" },
      { status: 500 },
    );
  }
}
