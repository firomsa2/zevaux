import { createClient } from "@/utils/supabase/server";
import { getPlanDetails } from "@/lib/billing-calculation";
import { getBillingStateForBusiness } from "@/lib/billing";
import { NextResponse } from "next/server";

/**
 * Billing Cycle Reset Job
 *
 * This should be scheduled to run daily (e.g. at 00:00 UTC).
 * It checks for businesses whose billing cycle has ended and:
 * 1. Snapshots their usage
 * 2. Resets their current usage counters
 * 3. Updates the billing cycle dates
 */
export async function runBillingCycleReset() {
  const supabase = await createClient(); // Use service role key ideally for cron jobs

  // 1. Find businesses whose cycle ended yesterday (or is strictly < NOW)
  // And haven't been reset yet (check snapshot existence or updated_at on usage_tracking)

  // For simplicity implementation in this context, we'll iterate active subscriptions
  // In production, use efficient SQL queries or a dedicated job queue

  const now = new Date();

  // Fetch usage records where period_end is in the past
  const { data: usageRecords, error } = await supabase
    .from("usage_tracking")
    .select("*, businesses!inner(id, billing_plan)") // Join to get plan
    .lt("period_end", now.toISOString());

  if (error) {
    console.error("[Cron] Failed to fetch expired cycles", error);
    return;
  }

  console.log(`[Cron] Found ${usageRecords.length} records to process`);

  for (const usage of usageRecords) {
    try {
      const businessId = usage.business_id;

      // Double check if we already have a snapshot for this period to avoid double-reset
      const periodEnd = new Date(usage.period_end);
      const snapshotMonth = periodEnd.getMonth() + 1; // 1-12
      const snapshotYear = periodEnd.getFullYear();

      const { data: existingSnapshot } = await supabase
        .from("usage_snapshots")
        .select("id")
        .eq("business_id", businessId)
        .eq("month", snapshotMonth)
        .eq("year", snapshotYear)
        .maybeSingle();

      if (existingSnapshot) {
        console.log(
          `[Cron] Snapshot already exists for ${businessId} ${snapshotMonth}/${snapshotYear}, skipping.`,
        );
        // Only update the period_start/end if they are stuck?
        // If snapshot exists, it means we processed it, so we should have updated the tracking record too.
        // If the tracking record is still "old", we need to bump it to current.
        await bumpUsagePeriod(supabase, usage.id, periodEnd);
        continue;
      }

      // 2. Create Snapshot
      const billingState = await getBillingStateForBusiness(businessId);
      const planSlug = billingState?.planSlug || "starter";
      const planDetails = getPlanDetails(planSlug);

      const totalIncluded =
        planDetails.minutesIncluded + (usage.purchased_minutes || 0);
      const overageMinutes = Math.max(0, usage.minutes_used - totalIncluded);
      const overageCost = overageMinutes * planDetails.overageRate;

      await supabase.from("usage_snapshots").insert({
        business_id: businessId,
        year: snapshotYear,
        month: snapshotMonth,
        total_minutes_used: usage.minutes_used,
        overage_minutes: overageMinutes,
        overage_cost: overageCost,
      });

      // 3. Reset Usage Record for NEW cycle
      // New cycle starts immediately after old one ended
      const newStart = periodEnd;
      const newEnd = new Date(newStart);
      newEnd.setMonth(newEnd.getMonth() + 1);

      await supabase
        .from("usage_tracking")
        .update({
          minutes_used: 0,
          calls_made: 0,
          purchased_minutes: 0, // Reset add-ons for new cycle
          period_start: newStart.toISOString(),
          period_end: newEnd.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", usage.id);

      // 4. Reset Notification State on Business
      await supabase
        .from("businesses")
        .update({
          minute_alert_state: {
            sent_70: false,
            sent_90: false,
            sent_100: false,
            sent_120: false,
            last_reset: new Date().toISOString(),
          },
        })
        .eq("id", businessId);

      console.log(`[Cron] Reset successful for ${businessId}`);
    } catch (err) {
      console.error(
        `[Cron] Error processing business ${usage.business_id}`,
        err,
      );
    }
  }
}

async function bumpUsagePeriod(supabase: any, recordId: string, oldEnd: Date) {
  // Safety fallback: if we found a snapshot but the usage record is still pointing to the past,
  // we just reset it to NOW -> +1 Month to recover.
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await supabase
    .from("usage_tracking")
    .update({
      minutes_used: 0, // Assume reset if snapshot exists
      period_start: now.toISOString(),
      period_end: nextMonth.toISOString(),
    })
    .eq("id", recordId);
}
