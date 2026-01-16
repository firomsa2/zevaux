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
        { status: 400 }
      );
    }

    // Provision the phone number automatically
    // This replaces the previous N8N webhook trigger
    console.log(
      `[Phone Provisioning] Request received for business ${businessId}`
    );

    const { phoneProvisioningService } = await import(
      "@/lib/services/phone-provisioning"
    );

    // Run the provisioning
    const result =
      await phoneProvisioningService.provisionPhoneNumberForBusiness(
        businessId
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
      { status: 500 }
    );
  }
}
