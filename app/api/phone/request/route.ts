import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  maybeStartTrialForBusiness,
  getBillingStateForBusiness,
  hasFeatureAccess,
} from "@/lib/billing";
import { enforceUsageLimit } from "@/lib/usage-enforcement";
import { updatePhoneNumberUsage, syncPhoneNumberCount } from "@/lib/usage-tracking";

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

    // Check if business is in onboarding and start trial if needed
    // This allows phone provisioning during onboarding before trial starts
    const { data: onboardingProgress } = await supabase
      .from("onboarding_progress")
      .select("step_4_go_live")
      .eq("business_id", businessId)
      .maybeSingle();

    const { data: business } = await supabase
      .from("businesses")
      .select("trial_status")
      .eq("id", businessId)
      .maybeSingle();

    // If in onboarding (step_4_go_live is false) and trial hasn't started, start it now
    const isInOnboarding = onboardingProgress?.step_4_go_live !== true;
    if (isInOnboarding && !business?.trial_status) {
      console.log(
        `[Phone Provisioning] Starting trial for business ${businessId} during onboarding`,
      );
      await maybeStartTrialForBusiness(businessId);
    }

    // Check billing access before allowing phone provisioning
    const billingState = await getBillingStateForBusiness(businessId);
    if (!billingState || !hasFeatureAccess(billingState)) {
      return NextResponse.json(
        {
          error: "Subscription required",
          message:
            "Your trial has expired or subscription is inactive. Please subscribe to continue using phone services.",
          redirectTo: "/dashboard/billing",
        },
        { status: 403 },
      );
    }

    // Check phone number usage limit before provisioning
    const limitCheck = await enforceUsageLimit(businessId, "phone_numbers");
    if (limitCheck) {
      return limitCheck;
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

      // Ensure trial is started once the business has an active number
      await maybeStartTrialForBusiness(businessId);

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

    // Start 7-day trial once the business has an operational phone number
    await maybeStartTrialForBusiness(businessId);

    // Update usage tracking - increment phone number count
    // Use sync to ensure accuracy in case phone was added via another method
    await syncPhoneNumberCount(businessId);

    return NextResponse.json({
      status: "completed",
      message: "Phone number provisioned successfully",
      phoneNumber: result.phoneNumber,
    });
  } catch (error: any) {
    console.error("[v0] Phone request error:", error);
    
    // Provide more specific error messages
    const errorMessage =
      error?.message || "Failed to process phone request";
    
    // Check if it's a timeout or connection error
    const isTimeoutError =
      errorMessage.includes("timeout") ||
      errorMessage.includes("Connection timeout") ||
      error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT";
    
    const isNetworkError =
      errorMessage.includes("fetch failed") ||
      errorMessage.includes("network") ||
      errorMessage.includes("ECONNREFUSED");

    return NextResponse.json(
      {
        error: isTimeoutError
          ? "Phone provisioning service timeout. Please try again or contact support if the issue persists."
          : isNetworkError
            ? "Unable to connect to phone provisioning service. Please check your network connection."
            : errorMessage,
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}
