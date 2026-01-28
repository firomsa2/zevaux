// // import { getSupabaseServer } from "@/lib/supabase/server";
// // import { getBusinessPlan } from "@/lib/business";

// // export type UsageResource = "minutes" | "calls" | "phone_numbers" | "team_members";

// // export type UsageData = {
// //   minutesUsed: number;
// //   callsMade: number;
// //   activePhoneNumbers: number;
// //   teamMembersCount: number;
// //   periodStart: string;
// //   periodEnd: string;
// //   planId: string | null;
// // };

// // export type UsageLimitCheck = {
// //   allowed: boolean;
// //   current: number;
// //   limit: number;
// //   resource: UsageResource;
// //   message?: string;
// // };

// // /**
// //  * Get the current billing period for a business based on their subscription.
// //  * Returns the period from the subscription, or creates a default monthly period.
// //  */
// // async function getBillingPeriod(businessId: string): Promise<{
// //   periodStart: Date;
// //   periodEnd: Date;
// // }> {
// //   const supabase = await getSupabaseServer();

// //   // Get subscription to find current billing period
// //   const { data: subscription } = await supabase
// //     .from("subscriptions")
// //     .select("current_period_start, current_period_end")
// //     .eq("business_id", businessId)
// //     .maybeSingle();

// //   if (subscription?.current_period_start && subscription?.current_period_end) {
// //     return {
// //       periodStart: new Date(subscription.current_period_start),
// //       periodEnd: new Date(subscription.current_period_end),
// //     };
// //   }

// //   // If no subscription, use current month as default period
// //   const now = new Date();
// //   const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
// //   const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

// //   return { periodStart, periodEnd };
// // }

// // /**
// //  * Get or create usage tracking record for a business.
// //  * Ensures the record exists and is within the current billing period.
// //  */
// // async function getOrCreateUsageRecord(
// //   businessId: string,
// // ): Promise<UsageData | null> {
// //   const supabase = await getSupabaseServer();
// //   const { periodStart, periodEnd } = await getBillingPeriod(businessId);

// //   // Try to get existing record for current period
// //   const { data: existing } = await supabase
// //     .from("usage_tracking")
// //     .select("*")
// //     .eq("business_id", businessId)
// //     .gte("period_end", periodStart.toISOString())
// //     .lte("period_start", periodEnd.toISOString())
// //     .maybeSingle();

// //   if (existing) {
// //     return {
// //       minutesUsed: existing.minutes_used || 0,
// //       callsMade: existing.calls_made || 0,
// //       activePhoneNumbers: existing.active_phone_numbers || 0,
// //       teamMembersCount: existing.team_members_count || 0,
// //       periodStart: existing.period_start,
// //       periodEnd: existing.period_end,
// //       planId: existing.plan_id,
// //     };
// //   }

// //   // Get plan for the business
// //   const plan = await getBusinessPlan(businessId);

// //   // Create new usage record for current period
// //   const usageData = {
// //     business_id: businessId,
// //     plan_id: plan?.id || null,
// //     minutes_used: 0,
// //     calls_made: 0,
// //     active_phone_numbers: 0,
// //     team_members_count: 0,
// //     period_start: periodStart.toISOString(),
// //     period_end: periodEnd.toISOString(),
// //     metadata: {},
// //   };

// //   const { data: newRecord, error } = await supabase
// //     .from("usage_tracking")
// //     .insert(usageData)
// //     .select()
// //     .single();

// //   if (error || !newRecord) {
// //     console.error("[Usage Tracking] Error creating usage record:", error);
// //     return null;
// //   }

// //   return {
// //     minutesUsed: 0,
// //     callsMade: 0,
// //     activePhoneNumbers: 0,
// //     teamMembersCount: 0,
// //     periodStart: newRecord.period_start,
// //     periodEnd: newRecord.period_end,
// //     planId: newRecord.plan_id,
// //   };
// // }

// // /**
// //  * Track call usage (minutes and call count) for a business.
// //  * Updates the usage_tracking table in real-time.
// //  */
// // export async function trackCallUsage(
// //   businessId: string,
// //   minutes: number,
// // ): Promise<void> {
// //   const supabase = await getSupabaseServer();

// //   if (minutes <= 0) {
// //     return; // Don't track zero or negative minutes
// //   }

// //   const usage = await getOrCreateUsageRecord(businessId);
// //   if (!usage) {
// //     console.error("[Usage Tracking] Failed to get/create usage record");
// //     return;
// //   }

// //   // Update usage: increment minutes and calls
// //   const { error } = await supabase
// //     .from("usage_tracking")
// //     .update({
// //       minutes_used: (usage.minutesUsed || 0) + minutes,
// //       calls_made: (usage.callsMade || 0) + 1,
// //       updated_at: new Date().toISOString(),
// //     })
// //     .eq("business_id", businessId)
// //     .gte("period_end", usage.periodStart)
// //     .lte("period_start", usage.periodEnd);

// //   if (error) {
// //     console.error("[Usage Tracking] Error tracking call usage:", error);
// //   } else {
// //     console.log(
// //       `[Usage Tracking] Tracked ${minutes} minutes and 1 call for business ${businessId}`,
// //     );
// //   }
// // }

// // /**
// //  * Update phone number count in usage tracking.
// //  * Should be called when a phone number is added or removed.
// //  */
// // export async function updatePhoneNumberUsage(
// //   businessId: string,
// //   delta: number, // +1 for add, -1 for remove
// // ): Promise<void> {
// //   const supabase = await getSupabaseServer();

// //   const usage = await getOrCreateUsageRecord(businessId);
// //   if (!usage) {
// //     console.error("[Usage Tracking] Failed to get/create usage record");
// //     return;
// //   }

// //   const newCount = Math.max(0, (usage.activePhoneNumbers || 0) + delta);

// //   const { error } = await supabase
// //     .from("usage_tracking")
// //     .update({
// //       active_phone_numbers: newCount,
// //       updated_at: new Date().toISOString(),
// //     })
// //     .eq("business_id", businessId)
// //     .gte("period_end", usage.periodStart)
// //     .lte("period_start", usage.periodEnd);

// //   if (error) {
// //     console.error("[Usage Tracking] Error updating phone number usage:", error);
// //   }
// // }

// // /**
// //  * Update team member count in usage tracking.
// //  * Should be called when a team member is added or removed.
// //  */
// // export async function updateTeamMemberUsage(
// //   businessId: string,
// //   delta: number, // +1 for add, -1 for remove
// // ): Promise<void> {
// //   const supabase = await getSupabaseServer();

// //   const usage = await getOrCreateUsageRecord(businessId);
// //   if (!usage) {
// //     console.error("[Usage Tracking] Failed to get/create usage record");
// //     return;
// //   }

// //   const newCount = Math.max(0, (usage.teamMembersCount || 0) + delta);

// //   const { error } = await supabase
// //     .from("usage_tracking")
// //     .update({
// //       team_members_count: newCount,
// //       updated_at: new Date().toISOString(),
// //     })
// //     .eq("business_id", businessId)
// //     .gte("period_end", usage.periodStart)
// //     .lte("period_start", usage.periodEnd);

// //   if (error) {
// //     console.error("[Usage Tracking] Error updating team member usage:", error);
// //   }
// // }

// // /**
// //  * Get current usage data for a business.
// //  */
// // export async function getCurrentUsage(
// //   businessId: string,
// // ): Promise<UsageData | null> {
// //   return await getOrCreateUsageRecord(businessId);
// // }

// // /**
// //  * Check if a business has exceeded their usage limit for a specific resource.
// //  * Returns an object with allowed status, current usage, limit, and message.
// //  */
// // export async function checkUsageLimit(
// //   businessId: string,
// //   resource: UsageResource,
// // ): Promise<UsageLimitCheck> {
// //   const supabase = await getSupabaseServer();

// //   // Get current usage
// //   const usage = await getCurrentUsage(businessId);
// //   if (!usage) {
// //     return {
// //       allowed: false,
// //       current: 0,
// //       limit: 0,
// //       resource,
// //       message: "Unable to retrieve usage data",
// //     };
// //   }

// //   // Get plan limits
// //   const plan = await getBusinessPlan(businessId);
// //   if (!plan) {
// //     return {
// //       allowed: false,
// //       current: 0,
// //       limit: 0,
// //       resource,
// //       message: "No active plan found",
// //     };
// //   }

// //   let current: number;
// //   let limit: number;
// //   let resourceName: string;

// //   switch (resource) {
// //     case "minutes":
// //       current = usage.minutesUsed || 0;
// //       limit = plan.minutes_limit || 0;
// //       resourceName = "minutes";
// //       break;
// //     case "calls":
// //       current = usage.callsMade || 0;
// //       limit = plan.minutes_limit || 0; // Calls typically don't have a separate limit
// //       resourceName = "calls";
// //       break;
// //     case "phone_numbers":
// //       current = usage.activePhoneNumbers || 0;
// //       limit = plan.max_phone_numbers || 0;
// //       resourceName = "phone numbers";
// //       break;
// //     case "team_members":
// //       current = usage.teamMembersCount || 0;
// //       limit = plan.max_team_members || 0;
// //       resourceName = "team members";
// //       break;
// //     default:
// //       return {
// //         allowed: false,
// //         current: 0,
// //         limit: 0,
// //         resource,
// //         message: "Unknown resource type",
// //       };
// //   }

// //   const allowed = current < limit;
// //   const message = allowed
// //     ? undefined
// //     : `You have reached your ${resourceName} limit (${current}/${limit}). Please upgrade your plan to continue.`;

// //   return {
// //     allowed,
// //     current,
// //     limit,
// //     resource,
// //     message,
// //   };
// // }

// // /**
// //  * Sync phone number count from actual phone_endpoints table.
// //  * Useful for ensuring accuracy after manual changes or migrations.
// //  */
// // export async function syncPhoneNumberCount(businessId: string): Promise<void> {
// //   const supabase = await getSupabaseServer();

// //   // Count active phone numbers
// //   const { count, error } = await supabase
// //     .from("phone_endpoints")
// //     .select("*", { count: "exact", head: true })
// //     .eq("business_id", businessId)
// //     .eq("status", "active");

// //   if (error) {
// //     console.error("[Usage Tracking] Error counting phone numbers:", error);
// //     return;
// //   }

// //   const actualCount = count || 0;

// //   // Get current usage to compare
// //   const usage = await getCurrentUsage(businessId);
// //   if (!usage) {
// //     return;
// //   }

// //   // Only update if different
// //   if (usage.activePhoneNumbers !== actualCount) {
// //     await updatePhoneNumberUsage(businessId, actualCount - usage.activePhoneNumbers);
// //   }
// // }

// // /**
// //  * Sync team member count from users table.
// //  * Useful for ensuring accuracy after manual changes or migrations.
// //  */
// // export async function syncTeamMemberCount(businessId: string): Promise<void> {
// //   const supabase = await getSupabaseServer();

// //   // Count users for this business
// //   const { count, error } = await supabase
// //     .from("users")
// //     .select("*", { count: "exact", head: true })
// //     .eq("business_id", businessId);

// //   if (error) {
// //     console.error("[Usage Tracking] Error counting team members:", error);
// //     return;
// //   }

// //   const actualCount = count || 0;

// //   // Get current usage to compare
// //   const usage = await getCurrentUsage(businessId);
// //   if (!usage) {
// //     return;
// //   }

// //   // Only update if different
// //   if (usage.teamMembersCount !== actualCount) {
// //     await updateTeamMemberUsage(businessId, actualCount - usage.teamMembersCount);
// //   }
// // }



// import { getSupabaseServer } from "@/lib/supabase/server";
// import { getBusinessPlan } from "@/lib/business";

// export type UsageResource = "minutes" | "calls" | "phone_numbers" | "team_members";

// export type UsageData = {
//   minutesUsed: number;
//   callsMade: number;
//   activePhoneNumbers: number;
//   teamMembersCount: number;
//   periodStart: string;
//   periodEnd: string;
//   planId: string | null;
// };

// export type UsageLimitCheck = {
//   allowed: boolean;
//   current: number;
//   limit: number;
//   resource: UsageResource;
//   message?: string;
// };

// /**
//  * Get the current billing period for a business based on their subscription.
//  * Returns the period from the subscription, or creates a default monthly period.
//  */
// export async function getBillingPeriod(businessId: string): Promise<{
//   periodStart: Date;
//   periodEnd: Date;
// }> {
//   const supabase = await getSupabaseServer();

//   // Get subscription to find current billing period
//   const { data: subscription } = await supabase
//     .from("subscriptions")
//     .select("current_period_start, current_period_end")
//     .eq("business_id", businessId)
//     .maybeSingle();

//   if (subscription?.current_period_start && subscription?.current_period_end) {
//     return {
//       periodStart: new Date(subscription.current_period_start),
//       periodEnd: new Date(subscription.current_period_end),
//     };
//   }

//   // If no subscription, use current month as default period
//   const now = new Date();
//   const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
//   const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

//   return { periodStart, periodEnd };
// }

// /**
//  * Get or create usage tracking record for a business.
//  * Ensures the record exists and is within the current billing period.
//  */
// async function getOrCreateUsageRecord(
//   businessId: string,
// ): Promise<UsageData | null> {
//   const supabase = await getSupabaseServer();
//   const { periodStart, periodEnd } = await getBillingPeriod(businessId);

//   // Try to get existing record for current period
//   const { data: existing } = await supabase
//     .from("usage_tracking")
//     .select("*")
//     .eq("business_id", businessId)
//     .gte("period_end", periodStart.toISOString())
//     .lte("period_start", periodEnd.toISOString())
//     .maybeSingle();

//   if (existing) {
//     return {
//       minutesUsed: existing.minutes_used || 0,
//       callsMade: existing.calls_made || 0,
//       activePhoneNumbers: existing.active_phone_numbers || 0,
//       teamMembersCount: existing.team_members_count || 0,
//       periodStart: existing.period_start,
//       periodEnd: existing.period_end,
//       planId: existing.plan_id,
//     };
//   }

//   // Get plan for the business
//   const plan = await getBusinessPlan(businessId);

//   // Create new usage record for current period
//   const usageData = {
//     business_id: businessId,
//     plan_id: plan?.id || null,
//     minutes_used: 0,
//     calls_made: 0,
//     active_phone_numbers: 0,
//     team_members_count: 0,
//     period_start: periodStart.toISOString(),
//     period_end: periodEnd.toISOString(),
//     metadata: {},
//   };

//   const { data: newRecord, error } = await supabase
//     .from("usage_tracking")
//     .insert(usageData)
//     .select()
//     .single();

//   if (error || !newRecord) {
//     console.error("[Usage Tracking] Error creating usage record:", error);
//     return null;
//   }

//   return {
//     minutesUsed: 0,
//     callsMade: 0,
//     activePhoneNumbers: 0,
//     teamMembersCount: 0,
//     periodStart: newRecord.period_start,
//     periodEnd: newRecord.period_end,
//     planId: newRecord.plan_id,
//   };
// }

// /**
//  * Track call usage (minutes and call count) for a business.
//  * Updates the usage_tracking table in real-time.
//  */
// export async function trackCallUsage(
//   businessId: string,
//   minutes: number,
// ): Promise<void> {
//   const supabase = await getSupabaseServer();

//   if (minutes <= 0) {
//     return; // Don't track zero or negative minutes
//   }

//   const usage = await getOrCreateUsageRecord(businessId);
//   if (!usage) {
//     console.error("[Usage Tracking] Failed to get/create usage record");
//     return;
//   }

//   // Update usage: increment minutes and calls
//   const { error } = await supabase
//     .from("usage_tracking")
//     .update({
//       minutes_used: (usage.minutesUsed || 0) + minutes,
//       calls_made: (usage.callsMade || 0) + 1,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("business_id", businessId)
//     .gte("period_end", usage.periodStart)
//     .lte("period_start", usage.periodEnd);

//   if (error) {
//     console.error("[Usage Tracking] Error tracking call usage:", error);
//   } else {
//     console.log(
//       `[Usage Tracking] Tracked ${minutes} minutes and 1 call for business ${businessId}`,
//     );
//   }
// }

// /**
//  * Update phone number count in usage tracking.
//  * Should be called when a phone number is added or removed.
//  */
// export async function updatePhoneNumberUsage(
//   businessId: string,
//   delta: number, // +1 for add, -1 for remove
// ): Promise<void> {
//   const supabase = await getSupabaseServer();

//   const usage = await getOrCreateUsageRecord(businessId);
//   if (!usage) {
//     console.error("[Usage Tracking] Failed to get/create usage record");
//     return;
//   }

//   const newCount = Math.max(0, (usage.activePhoneNumbers || 0) + delta);

//   const { error } = await supabase
//     .from("usage_tracking")
//     .update({
//       active_phone_numbers: newCount,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("business_id", businessId)
//     .gte("period_end", usage.periodStart)
//     .lte("period_start", usage.periodEnd);

//   if (error) {
//     console.error("[Usage Tracking] Error updating phone number usage:", error);
//   }
// }

// /**
//  * Update team member count in usage tracking.
//  * Should be called when a team member is added or removed.
//  */
// export async function updateTeamMemberUsage(
//   businessId: string,
//   delta: number, // +1 for add, -1 for remove
// ): Promise<void> {
//   const supabase = await getSupabaseServer();

//   const usage = await getOrCreateUsageRecord(businessId);
//   if (!usage) {
//     console.error("[Usage Tracking] Failed to get/create usage record");
//     return;
//   }

//   const newCount = Math.max(0, (usage.teamMembersCount || 0) + delta);

//   const { error } = await supabase
//     .from("usage_tracking")
//     .update({
//       team_members_count: newCount,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("business_id", businessId)
//     .gte("period_end", usage.periodStart)
//     .lte("period_start", usage.periodEnd);

//   if (error) {
//     console.error("[Usage Tracking] Error updating team member usage:", error);
//   }
// }

// /**
//  * Get current usage data for a business.
//  */
// export async function getCurrentUsage(
//   businessId: string,
// ): Promise<UsageData | null> {
//   return await getOrCreateUsageRecord(businessId);
// }

// /**
//  * Check if a business has exceeded their usage limit for a specific resource.
//  * Returns an object with allowed status, current usage, limit, and message.
//  */
// export async function checkUsageLimit(
//   businessId: string,
//   resource: UsageResource,
// ): Promise<UsageLimitCheck> {
//   const supabase = await getSupabaseServer();

//   // Get current usage
//   const usage = await getCurrentUsage(businessId);
//   if (!usage) {
//     return {
//       allowed: false,
//       current: 0,
//       limit: 0,
//       resource,
//       message: "Unable to retrieve usage data",
//     };
//   }

//   // Get plan limits
//   const plan = await getBusinessPlan(businessId);
//   if (!plan) {
//     return {
//       allowed: false,
//       current: 0,
//       limit: 0,
//       resource,
//       message: "No active plan found",
//     };
//   }

//   let current: number;
//   let limit: number;
//   let resourceName: string;

//   switch (resource) {
//     case "minutes":
//       current = usage.minutesUsed || 0;
//       limit = plan.minutes_limit || 0;
//       resourceName = "minutes";
//       break;
//     case "calls":
//       current = usage.callsMade || 0;
//       limit = plan.minutes_limit || 0; // Calls typically don't have a separate limit
//       resourceName = "calls";
//       break;
//     case "phone_numbers":
//       current = usage.activePhoneNumbers || 0;
//       limit = plan.max_phone_numbers || 0;
//       resourceName = "phone numbers";
//       break;
//     case "team_members":
//       current = usage.teamMembersCount || 0;
//       limit = plan.max_team_members || 0;
//       resourceName = "team members";
//       break;
//     default:
//       return {
//         allowed: false,
//         current: 0,
//         limit: 0,
//         resource,
//         message: "Unknown resource type",
//       };
//   }

//   const allowed = current < limit;
//   const message = allowed
//     ? undefined
//     : `You have reached your ${resourceName} limit (${current}/${limit}). Please upgrade your plan to continue.`;

//   return {
//     allowed,
//     current,
//     limit,
//     resource,
//     message,
//   };
// }

// /**
//  * Sync phone number count from actual phone_endpoints table.
//  * Useful for ensuring accuracy after manual changes or migrations.
//  */
// export async function syncPhoneNumberCount(businessId: string): Promise<void> {
//   const supabase = await getSupabaseServer();

//   // Count active phone numbers
//   const { count, error } = await supabase
//     .from("phone_endpoints")
//     .select("*", { count: "exact", head: true })
//     .eq("business_id", businessId)
//     .eq("status", "active");

//   if (error) {
//     console.error("[Usage Tracking] Error counting phone numbers:", error);
//     return;
//   }

//   const actualCount = count || 0;

//   // Get current usage to compare
//   const usage = await getCurrentUsage(businessId);
//   if (!usage) {
//     return;
//   }

//   // Only update if different
//   if (usage.activePhoneNumbers !== actualCount) {
//     await updatePhoneNumberUsage(businessId, actualCount - usage.activePhoneNumbers);
//   }
// }

// /**
//  * Sync team member count from users table.
//  * Useful for ensuring accuracy after manual changes or migrations.
//  */
// export async function syncTeamMemberCount(businessId: string): Promise<void> {
//   const supabase = await getSupabaseServer();

//   // Count users for this business
//   const { count, error } = await supabase
//     .from("users")
//     .select("*", { count: "exact", head: true })
//     .eq("business_id", businessId);

//   if (error) {
//     console.error("[Usage Tracking] Error counting team members:", error);
//     return;
//   }

//   const actualCount = count || 0;

//   // Get current usage to compare
//   const usage = await getCurrentUsage(businessId);
//   if (!usage) {
//     return;
//   }

//   // Only update if different
//   if (usage.teamMembersCount !== actualCount) {
//     await updateTeamMemberUsage(businessId, actualCount - usage.teamMembersCount);
//   }
// }



import { getSupabaseServer } from "@/lib/supabase/server";
import { getBusinessPlan } from "@/lib/business";
import { checkAndNotifyIfThresholdCrossed } from "@/lib/usage-notifications";

export type UsageResource = "minutes" | "calls" | "phone_numbers" | "team_members";

export type UsageData = {
  minutesUsed: number;
  callsMade: number;
  activePhoneNumbers: number;
  teamMembersCount: number;
  periodStart: string;
  periodEnd: string;
  planId: string | null;
};

export type UsageLimitCheck = {
  allowed: boolean;
  current: number;
  limit: number;
  resource: UsageResource;
  message?: string;
};

/**
 * Get the current billing period for a business based on their subscription.
 * Returns the period from the subscription, or creates a default monthly period.
 */
export async function getBillingPeriod(businessId: string): Promise<{
  periodStart: Date;
  periodEnd: Date;
}> {
  const supabase = await getSupabaseServer();

  // Get subscription to find current billing period
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("current_period_start, current_period_end")
    .eq("business_id", businessId)
    .maybeSingle();

  if (subscription?.current_period_start && subscription?.current_period_end) {
    return {
      periodStart: new Date(subscription.current_period_start),
      periodEnd: new Date(subscription.current_period_end),
    };
  }

  // If no subscription, use current month as default period
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return { periodStart, periodEnd };
}

/**
 * Get or create usage tracking record for a business.
 * Ensures the record exists and is within the current billing period.
 */
async function getOrCreateUsageRecord(
  businessId: string,
): Promise<UsageData | null> {
  const supabase = await getSupabaseServer();
  const { periodStart, periodEnd } = await getBillingPeriod(businessId);

  // Try to get existing record for current period
  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("business_id", businessId)
    .gte("period_end", periodStart.toISOString())
    .lte("period_start", periodEnd.toISOString())
    .maybeSingle();

  if (existing) {
    return {
      minutesUsed: existing.minutes_used || 0,
      callsMade: existing.calls_made || 0,
      activePhoneNumbers: existing.active_phone_numbers || 0,
      teamMembersCount: existing.team_members_count || 0,
      periodStart: existing.period_start,
      periodEnd: existing.period_end,
      planId: existing.plan_id,
    };
  }

  // Get plan for the business
  const plan = await getBusinessPlan(businessId);

  // Create new usage record for current period
  const usageData = {
    business_id: businessId,
    plan_id: plan?.id || null,
    minutes_used: 0,
    calls_made: 0,
    active_phone_numbers: 0,
    team_members_count: 0,
    period_start: periodStart.toISOString(),
    period_end: periodEnd.toISOString(),
    metadata: {},
  };

  const { data: newRecord, error } = await supabase
    .from("usage_tracking")
    .insert(usageData)
    .select()
    .single();

  if (error || !newRecord) {
    console.error("[Usage Tracking] Error creating usage record:", error);
    return null;
  }

  return {
    minutesUsed: 0,
    callsMade: 0,
    activePhoneNumbers: 0,
    teamMembersCount: 0,
    periodStart: newRecord.period_start,
    periodEnd: newRecord.period_end,
    planId: newRecord.plan_id,
  };
}

/**
 * Track call usage (minutes and call count) for a business.
 * Updates the usage_tracking table in real-time.
 */
export async function trackCallUsage(
  businessId: string,
  minutes: number,
): Promise<void> {
  const supabase = await getSupabaseServer();

  if (minutes <= 0) {
    return; // Don't track zero or negative minutes
  }

  const usage = await getOrCreateUsageRecord(businessId);
  if (!usage) {
    console.error("[Usage Tracking] Failed to get/create usage record");
    return;
  }

  const newMinutesUsed = (usage.minutesUsed || 0) + minutes;

  // Update usage: increment minutes and calls
  const { error } = await supabase
    .from("usage_tracking")
    .update({
      minutes_used: newMinutesUsed,
      calls_made: (usage.callsMade || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessId)
    .gte("period_end", usage.periodStart)
    .lte("period_start", usage.periodEnd);

  if (error) {
    console.error("[Usage Tracking] Error tracking call usage:", error);
  } else {
    console.log(
      `[Usage Tracking] Tracked ${minutes} minutes and 1 call for business ${businessId}`,
    );

    // Check if usage threshold crossed and send notification if needed
    try {
      const plan = await getBusinessPlan(businessId);
      if (plan) {
        await checkAndNotifyIfThresholdCrossed(
          businessId,
          newMinutesUsed,
          plan.minutes_limit,
          plan
        );
      }
    } catch (notificationError) {
      // Log notification error but don't fail the call tracking
      console.error("[Usage Tracking] Error checking notifications:", notificationError);
    }
  }
}

/**
 * Update phone number count in usage tracking.
 * Should be called when a phone number is added or removed.
 */
export async function updatePhoneNumberUsage(
  businessId: string,
  delta: number, // +1 for add, -1 for remove
): Promise<void> {
  const supabase = await getSupabaseServer();

  const usage = await getOrCreateUsageRecord(businessId);
  if (!usage) {
    console.error("[Usage Tracking] Failed to get/create usage record");
    return;
  }

  const newCount = Math.max(0, (usage.activePhoneNumbers || 0) + delta);

  const { error } = await supabase
    .from("usage_tracking")
    .update({
      active_phone_numbers: newCount,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessId)
    .gte("period_end", usage.periodStart)
    .lte("period_start", usage.periodEnd);

  if (error) {
    console.error("[Usage Tracking] Error updating phone number usage:", error);
  }
}

/**
 * Update team member count in usage tracking.
 * Should be called when a team member is added or removed.
 */
export async function updateTeamMemberUsage(
  businessId: string,
  delta: number, // +1 for add, -1 for remove
): Promise<void> {
  const supabase = await getSupabaseServer();

  const usage = await getOrCreateUsageRecord(businessId);
  if (!usage) {
    console.error("[Usage Tracking] Failed to get/create usage record");
    return;
  }

  const newCount = Math.max(0, (usage.teamMembersCount || 0) + delta);

  const { error } = await supabase
    .from("usage_tracking")
    .update({
      team_members_count: newCount,
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessId)
    .gte("period_end", usage.periodStart)
    .lte("period_start", usage.periodEnd);

  if (error) {
    console.error("[Usage Tracking] Error updating team member usage:", error);
  }
}

/**
 * Get current usage data for a business.
 */
export async function getCurrentUsage(
  businessId: string,
): Promise<UsageData | null> {
  return await getOrCreateUsageRecord(businessId);
}

/**
 * Check if a business has exceeded their usage limit for a specific resource.
 * Returns an object with allowed status, current usage, limit, and message.
 */
export async function checkUsageLimit(
  businessId: string,
  resource: UsageResource,
): Promise<UsageLimitCheck> {
  const supabase = await getSupabaseServer();

  // Get current usage
  const usage = await getCurrentUsage(businessId);
  if (!usage) {
    return {
      allowed: false,
      current: 0,
      limit: 0,
      resource,
      message: "Unable to retrieve usage data",
    };
  }

  // Get plan limits
  const plan = await getBusinessPlan(businessId);
  if (!plan) {
    return {
      allowed: false,
      current: 0,
      limit: 0,
      resource,
      message: "No active plan found",
    };
  }

  let current: number;
  let limit: number;
  let resourceName: string;

  switch (resource) {
    case "minutes":
      current = usage.minutesUsed || 0;
      limit = plan.minutes_limit || 0;
      resourceName = "minutes";
      break;
    case "calls":
      current = usage.callsMade || 0;
      limit = plan.minutes_limit || 0; // Calls typically don't have a separate limit
      resourceName = "calls";
      break;
    case "phone_numbers":
      current = usage.activePhoneNumbers || 0;
      limit = plan.max_phone_numbers || 0;
      resourceName = "phone numbers";
      break;
    case "team_members":
      current = usage.teamMembersCount || 0;
      limit = plan.max_team_members || 0;
      resourceName = "team members";
      break;
    default:
      return {
        allowed: false,
        current: 0,
        limit: 0,
        resource,
        message: "Unknown resource type",
      };
  }

  const allowed = current < limit;
  const message = allowed
    ? undefined
    : `You have reached your ${resourceName} limit (${current}/${limit}). Please upgrade your plan to continue.`;

  return {
    allowed,
    current,
    limit,
    resource,
    message,
  };
}

/**
 * Sync phone number count from actual phone_endpoints table.
 * Useful for ensuring accuracy after manual changes or migrations.
 */
export async function syncPhoneNumberCount(businessId: string): Promise<void> {
  const supabase = await getSupabaseServer();

  // Count active phone numbers
  const { count, error } = await supabase
    .from("phone_endpoints")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId)
    .eq("status", "active");

  if (error) {
    console.error("[Usage Tracking] Error counting phone numbers:", error);
    return;
  }

  const actualCount = count || 0;

  // Get current usage to compare
  const usage = await getCurrentUsage(businessId);
  if (!usage) {
    return;
  }

  // Only update if different
  if (usage.activePhoneNumbers !== actualCount) {
    await updatePhoneNumberUsage(businessId, actualCount - usage.activePhoneNumbers);
  }
}

/**
 * Sync team member count from users table.
 * Useful for ensuring accuracy after manual changes or migrations.
 */
export async function syncTeamMemberCount(businessId: string): Promise<void> {
  const supabase = await getSupabaseServer();

  // Count users for this business
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  if (error) {
    console.error("[Usage Tracking] Error counting team members:", error);
    return;
  }

  const actualCount = count || 0;

  // Get current usage to compare
  const usage = await getCurrentUsage(businessId);
  if (!usage) {
    return;
  }

  // Only update if different
  if (usage.teamMembersCount !== actualCount) {
    await updateTeamMemberUsage(businessId, actualCount - usage.teamMembersCount);
  }
}
