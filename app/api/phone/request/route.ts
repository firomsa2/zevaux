import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 },
      );
    }

    // Check if an active phone number already exists for this business
    // This makes the endpoint idempotent - safe to call multiple times
    const { data: existingPhone } = await supabase
      .from("phone_endpoints")
      .select("phone_number, status")
      .eq("business_id", businessId)
      .eq("status", "active")
      .maybeSingle();

    if (existingPhone?.phone_number) {
      console.log(
        `[Phone Provisioning] Business ${businessId} already has phone: ${existingPhone.phone_number}`,
      );
      return NextResponse.json({
        status: "completed",
        message: "Phone number already assigned",
        phoneNumber: existingPhone.phone_number,
        alreadyExists: true,
      });
    }

    // Provision the phone number automatically
    // This replaces the previous N8N webhook trigger
    console.log(
      `[Phone Provisioning] Request received for business ${businessId}`,
    );

    const { phoneProvisioningService } =
      await import("@/lib/services/phone-provisioning");

    // Run the provisioning
    const result =
      await phoneProvisioningService.provisionPhoneNumberForBusiness(
        businessId,
        undefined,
        supabase,
      );

    return NextResponse.json({
      status: "completed",
      message: "Phone number provisioned successfully",
      phoneNumber: result.phoneNumber,
    });
  } catch (error) {
    console.error("[v0] Phone request error:", error);
    return NextResponse.json(
      { error: "Failed to process phone request" },
      { status: 500 },
    );
  }
}
