/**
 * Usage Aggregation Script
 * 
 * Aggregates usage data from call_logs table and updates usage_tracking.
 * This script should be run periodically (daily/monthly) to ensure accuracy.
 * 
 * Usage:
 *   npx tsx scripts/aggregate-usage.ts [businessId]
 * 
 * If businessId is provided, only aggregates for that business.
 * Otherwise, aggregates for all businesses with active subscriptions or trials.
 */

import { createClient } from "@supabase/supabase-js";
import { getBillingPeriod } from "../lib/usage-tracking";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function aggregateUsageForBusiness(businessId: string) {
  console.log(`\n[Usage Aggregation] Processing business: ${businessId}`);

  try {
    // Get subscription to determine billing period
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("current_period_start, current_period_end, plan_id")
      .eq("business_id", businessId)
      .maybeSingle();

    let periodStart: Date;
    let periodEnd: Date;
    let planId: string | null = null;

    if (subscription?.current_period_start && subscription?.current_period_end) {
      periodStart = new Date(subscription.current_period_start);
      periodEnd = new Date(subscription.current_period_end);
      planId = subscription.plan_id;
    } else {
      // Use current month as default
      const now = new Date();
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Aggregate calls from call_logs within the billing period
    const { data: calls, error: callsError } = await supabase
      .from("call_logs")
      .select("minutes, created_at")
      .eq("business_id", businessId)
      .gte("created_at", periodStart.toISOString())
      .lte("created_at", periodEnd.toISOString());

    if (callsError) {
      console.error(`  ❌ Error fetching calls:`, callsError);
      return { success: false, error: callsError.message };
    }

    // Calculate totals
    const totalMinutes = calls.reduce((sum, call) => {
      const minutes = parseFloat(call.minutes || "0");
      return sum + (isNaN(minutes) ? 0 : minutes);
    }, 0);

    const totalCalls = calls.length;

    // Count active phone numbers
    const { count: phoneCount, error: phoneError } = await supabase
      .from("phone_endpoints")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .eq("status", "active");

    if (phoneError) {
      console.error(`  ❌ Error counting phone numbers:`, phoneError);
      return { success: false, error: phoneError.message };
    }

    // Count team members
    const { count: teamCount, error: teamError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId);

    if (teamError) {
      console.error(`  ❌ Error counting team members:`, teamError);
      return { success: false, error: teamError.message };
    }

    // Get or create usage_tracking record
    const { data: existingUsage } = await supabase
      .from("usage_tracking")
      .select("*")
      .eq("business_id", businessId)
      .gte("period_end", periodStart.toISOString())
      .lte("period_start", periodEnd.toISOString())
      .maybeSingle();

    const usageData = {
      business_id: businessId,
      plan_id: planId,
      minutes_used: Math.round(totalMinutes),
      calls_made: totalCalls,
      active_phone_numbers: phoneCount || 0,
      team_members_count: teamCount || 0,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingUsage) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("usage_tracking")
        .update(usageData)
        .eq("id", existingUsage.id);

      if (updateError) {
        console.error(`  ❌ Error updating usage:`, updateError);
        return { success: false, error: updateError.message };
      }

      console.log(`  ✅ Updated usage tracking:`);
      console.log(`     Minutes: ${usageData.minutes_used}`);
      console.log(`     Calls: ${usageData.calls_made}`);
      console.log(`     Phone Numbers: ${usageData.active_phone_numbers}`);
      console.log(`     Team Members: ${usageData.team_members_count}`);
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from("usage_tracking")
        .insert({
          ...usageData,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error(`  ❌ Error creating usage:`, insertError);
        return { success: false, error: insertError.message };
      }

      console.log(`  ✅ Created usage tracking:`);
      console.log(`     Minutes: ${usageData.minutes_used}`);
      console.log(`     Calls: ${usageData.calls_made}`);
      console.log(`     Phone Numbers: ${usageData.active_phone_numbers}`);
      console.log(`     Team Members: ${usageData.team_members_count}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error(`  ❌ Unexpected error:`, error);
    return { success: false, error: error.message };
  }
}

async function main() {
  const businessId = process.argv[2];

  console.log("[Usage Aggregation] Starting aggregation...");
  console.log(`  Timestamp: ${new Date().toISOString()}`);

  if (businessId) {
    // Aggregate for single business
    const result = await aggregateUsageForBusiness(businessId);
    if (result.success) {
      console.log("\n✅ Aggregation completed successfully");
      process.exit(0);
    } else {
      console.error("\n❌ Aggregation failed:", result.error);
      process.exit(1);
    }
  } else {
    // Aggregate for all businesses with active subscriptions or trials
    const { data: businesses, error } = await supabase
      .from("businesses")
      .select("id")
      .or("trial_status.eq.active,subscription_status.in.(active,trialing,past_due)");

    if (error) {
      console.error("❌ Error fetching businesses:", error);
      process.exit(1);
    }

    if (!businesses || businesses.length === 0) {
      console.log("No businesses found to aggregate");
      process.exit(0);
    }

    console.log(`Found ${businesses.length} business(es) to process\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const business of businesses) {
      const result = await aggregateUsageForBusiness(business.id);
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    console.log(`\n[Usage Aggregation] Summary:`);
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ❌ Failed: ${errorCount}`);
    console.log(`  📊 Total: ${businesses.length}`);

    process.exit(errorCount > 0 ? 1 : 0);
  }
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
