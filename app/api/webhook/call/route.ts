import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { trackCallUsage } from "@/lib/usage-tracking";
import {
  calculateBillableSeconds,
  billableSecondsToMinutes,
  getPlanDetails,
} from "@/lib/billing-calculation";
import { getBillingStateForBusiness } from "@/lib/billing";
import {
  sendUsageNotificationEmail,
  getApplicableThreshold,
} from "@/lib/usage-notifications";

/**
 * Webhook endpoint for call completion events.
 * This should be called when a call ends to track usage.
 *
 * Expected payload:
 * {
 *   businessId: string,
 *   callId: string,
 *   duration: number, // Duration in seconds from Twilio
 *   status: string,
 *   minutes?: number // Legacy support
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, callId, duration, status, minutes } = body;

    if (!businessId || !callId) {
      return NextResponse.json(
        { error: "Missing required fields: businessId, callId are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // 1. Calculate Billable Metrics
    // Use duration if available, else fallback to minutes * 60, else 0
    let rawSeconds = 0;
    if (typeof duration === "number") {
      rawSeconds = duration;
    } else if (typeof minutes === "number" || typeof minutes === "string") {
      rawSeconds = parseFloat(String(minutes)) * 60;
    }

    const billableSeconds = calculateBillableSeconds(rawSeconds);
    const billableMinutes = billableSecondsToMinutes(billableSeconds);

    // Verify the call exists and belongs to the business
    const { data: call, error: callError } = await supabase
      .from("calls")
      .select("id, business_id, minutes, billable_seconds")
      .eq("id", callId)
      .maybeSingle();

    if (callError || !call) {
      console.error("[Call Webhook] Call not found:", callError);
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    if (call.business_id !== businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if already processed
    // If billable_seconds is set, we assume it's processed.
    if (call.billable_seconds && call.billable_seconds > 0) {
      console.log(`[Call Webhook] Call ${callId} already processed.`);
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // 2. Update Call Record
    // Update both detailed billable fields and legacy 'minutes' field
    const { error: updateError } = await supabase
      .from("calls")
      .update({
        duration: rawSeconds,
        billable_seconds: billableSeconds,
        billable_minutes: billableMinutes,
        minutes: String(billableMinutes), // Update legacy field
        status: status || "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", callId);

    if (updateError) {
      console.error("[Call Webhook] Update failed:", updateError);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    // 3. Track Usage
    if (billableMinutes > 0) {
      await trackCallUsage(businessId, billableMinutes);
    }

    // 4. Trigger Notifications
    try {
      // Fetch specific usage record for current period
      const { data: usageData } = await supabase
        .from("usage_tracking")
        .select("minutes_used, purchased_minutes")
        .eq("business_id", businessId)
        // Should properly filter by current period, but assuming order by period_end desc gives latest active
        .order("period_end", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (usageData) {
        const billingState = await getBillingStateForBusiness(businessId);
        const planSlug = billingState?.planSlug || "starter";
        const planDetails = getPlanDetails(planSlug);

        // Effective Limit = Plan Limits + Purchased Add-ons
        const purchasedMinutes = usageData.purchased_minutes || 0;
        const minutesUsed = usageData.minutes_used;
        const minutesLimit = planDetails.minutesIncluded + purchasedMinutes;

        const percentage =
          minutesLimit > 0 ? (minutesUsed / minutesLimit) * 100 : 0;
        const previousUsed = Math.max(0, minutesUsed - billableMinutes);
        const previousPercentage =
          minutesLimit > 0 ? (previousUsed / minutesLimit) * 100 : 0;

        const threshold = getApplicableThreshold(
          percentage,
          previousPercentage,
        );

        if (threshold) {
          // Get business info for email
          const { data: business } = await supabase
            .from("businesses")
            .select("name")
            .eq("id", businessId)
            .single();

          const { data: user } = await supabase
            .from("users")
            .select("email")
            .eq("business_id", businessId)
            .limit(1)
            .maybeSingle();

          if (user?.email) {
            await sendUsageNotificationEmail(
              businessId,
              business?.name || "Your Business",
              user.email,
              minutesUsed,
              minutesLimit,
              { ...planDetails, id: planSlug } as any,
              threshold,
            );
          }
        }
      }
    } catch (notifError) {
      console.error("[Call Webhook] Notification Logic Error:", notifError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      data: {
        billableSeconds,
        billableMinutes,
      },
    });
  } catch (error: any) {
    console.error("[Call Webhook] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
