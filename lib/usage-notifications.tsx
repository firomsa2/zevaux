/**
 * Usage Notification System
 * Sends alerts when users reach usage thresholds (70%, 90%, 100%, 120%)
 * Includes deduplication to prevent notification spam
 */

import { createClient } from "@/utils/supabase/server";
import type { Plan } from "@/types/database";

export interface UsageNotificationThreshold {
  percentage: number;
  subject: string;
  template: "warning" | "danger" | "critical";
}

const NOTIFICATION_THRESHOLDS: UsageNotificationThreshold[] = [
  {
    percentage: 70,
    subject: "You're using 70% of your monthly minutes",
    template: "warning",
  },
  {
    percentage: 90,
    subject: "You're approaching your monthly limit",
    template: "danger",
  },
  {
    percentage: 100,
    subject: "You've reached your monthly minute limit",
    template: "critical",
  },
  {
    percentage: 120,
    subject: "You're 20% over your monthly limit",
    template: "critical",
  },
];

/**
 * Check if a notification should be sent based on usage percentage
 * Returns the threshold that was crossed, or null if no threshold was crossed
 */
export function getApplicableThreshold(
  currentPercentage: number,
  previousPercentage: number
): UsageNotificationThreshold | null {
  // Find thresholds that were crossed (previous was below, current is at or above)
  const crossedThreshold = NOTIFICATION_THRESHOLDS.find(
    (t) => previousPercentage < t.percentage && currentPercentage >= t.percentage
  );

  return crossedThreshold || null;
}

/**
 * Check if a notification has already been sent for this threshold
 * Prevents duplicate notifications within a 24-hour window
 */
export async function hasNotificationBeenSent(
  businessId: string,
  thresholdPercentage: number,
  hoursWindow: number = 24
): Promise<boolean> {
  const supabase = await createClient();

  const { data: notification } = await supabase
    .from("usage_notifications")
    .select("id")
    .eq("business_id", businessId)
    .eq("threshold_percentage", thresholdPercentage)
    .gt("sent_at", new Date(Date.now() - hoursWindow * 60 * 60 * 1000).toISOString())
    .order("sent_at", { ascending: false })
    .limit(1)
    .single();

  return !!notification;
}

/**
 * Record that a notification was sent (for deduplication)
 */
export async function recordNotificationSent(
  businessId: string,
  thresholdPercentage: number,
  usagePercentage: number,
  minutesUsed: number,
  minutesLimit: number
): Promise<void> {
  const supabase = await createClient();

  await supabase.from("usage_notifications").insert([
    {
      business_id: businessId,
      threshold_percentage: thresholdPercentage,
      current_usage_percentage: usagePercentage,
      minutes_used: minutesUsed,
      minutes_limit: minutesLimit,
      sent_at: new Date().toISOString(),
    },
  ]);
}

/**
 * Get notification email content based on threshold
 */
export function getNotificationEmailContent(
  businessName: string,
  minutesUsed: number,
  minutesLimit: number,
  plan: Plan,
  threshold: UsageNotificationThreshold
): { subject: string; html: string } {
  const percentage = Math.round((minutesUsed / minutesLimit) * 100);
  const remaining = Math.max(0, minutesLimit - minutesUsed);
  const overage = Math.max(0, minutesUsed - minutesLimit);
  const overageRate = (plan as any).overage_rate ?? 0.2;

  const subjectLine =
    threshold.percentage < 100
      ? `${businessName}: You're using ${percentage}% of your monthly minutes`
      : threshold.percentage === 100
        ? `${businessName}: You've reached your monthly minute limit`
        : `${businessName}: You're ${percentage - 100}% over your monthly limit`;

  let callToAction = "";
  let urgency = "";
  let details = "";

  if (threshold.percentage === 70) {
    callToAction =
      "Consider upgrading to a higher plan to get more minutes included.";
    urgency =
      "This is a friendly reminder that you're using a significant portion of your monthly minutes.";
    details = `You have ${remaining} minutes remaining in your current billing period.`;
  } else if (threshold.percentage === 90) {
    callToAction =
      "Upgrade now to avoid service interruption when you reach your limit.";
    urgency =
      "You're approaching your monthly limit and should take action soon.";
    details = `You have only ${remaining} minutes remaining before your service is restricted.`;
  } else if (threshold.percentage === 100) {
    callToAction = "Upgrade immediately to continue using our service.";
    urgency =
      "You have exceeded your monthly limit. Additional minutes will be charged at our overage rate.";
    details = `Any additional calls will be charged at $${overageRate}/minute. Upgrade to reduce your overage rate.`;
  } else {
    callToAction =
      "Upgrade to a higher plan to reduce your overage charges and avoid interruption.";
    urgency =
      "You are significantly over your monthly limit and accruing overage charges.";
    details = `You have used ${overage} overage minutes. At $${overageRate}/minute, this is costing you $${(overage * overageRate).toFixed(2)} in additional charges.`;
  }

  const html = `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; margin-bottom: 8px;">Hi ${businessName}!</h1>
          
          <div style="background-color: #f5f5f5; border-left: 4px solid ${threshold.template === "warning" ? "#f59e0b" : threshold.template === "danger" ? "#ef4444" : "#dc2626"}; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px; font-weight: 600;">
              ${urgency}
            </p>
          </div>

          <div style="margin: 24px 0;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 12px;">Your Current Usage</h2>
            <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-weight: 600;">Minutes Used:</span>
                <span>${minutesUsed} / ${minutesLimit}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-weight: 600;">Usage Percentage:</span>
                <span>${percentage}%</span>
              </div>
              <div style="background-color: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background-color: ${threshold.template === "warning" ? "#f59e0b" : threshold.template === "danger" ? "#ef4444" : "#dc2626"}; height: 100%; width: ${Math.min(percentage, 100)}%;"></div>
              </div>
            </div>
          </div>

          <p style="margin: 20px 0; font-size: 14px;">${details}</p>

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 0 0 12px 0; font-weight: 600; color: #1e40af;">What to do next:</p>
            <p style="margin: 0; color: #1e40af;">${callToAction}</p>
          </div>

          <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <a href="https://zevaux.com/dashboard/billing" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
              View My Plan
            </a>
          </div>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666;">
            <p style="margin: 0;">You received this email because you're a Zevaux customer. If you have any questions, please reply to this email or contact support.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject: subjectLine, html };
}

/**
 * Send usage notification email
 * In production, this would integrate with a real email service like SendGrid, Resend, etc.
 */
export async function sendUsageNotificationEmail(
  businessId: string,
  businessName: string,
  businessEmail: string,
  minutesUsed: number,
  minutesLimit: number,
  plan: Plan,
  threshold: UsageNotificationThreshold
): Promise<boolean> {
  try {
    // Check deduplication
    const alreadySent = await hasNotificationBeenSent(businessId, threshold.percentage);
    if (alreadySent) {
      console.log(
        `[Usage Notifications] Notification already sent for ${businessId} at ${threshold.percentage}%`
      );
      return false;
    }

    // Get email content
    const { subject, html } = getNotificationEmailContent(
      businessName,
      minutesUsed,
      minutesLimit,
      plan,
      threshold
    );

    // TODO: Integrate with real email service
    // For now, log the notification
    console.log(`[Usage Notifications] Would send email to ${businessEmail}:`, {
      subject,
      threshold: threshold.percentage,
      minutesUsed,
      minutesLimit,
    });

    // Record that notification was sent
    const percentage = Math.round((minutesUsed / minutesLimit) * 100);
    await recordNotificationSent(
      businessId,
      threshold.percentage,
      percentage,
      minutesUsed,
      minutesLimit
    );

    return true;
  } catch (error) {
    console.error("[Usage Notifications] Error sending email:", error);
    return false;
  }
}

/**
 * Check usage and send notifications if thresholds are crossed
 * This should be called after each call is logged
 */
export async function checkAndNotifyIfThresholdCrossed(
  businessId: string,
  minutesUsed: number,
  minutesLimit: number,
  plan: Plan
): Promise<void> {
  try {
    const currentPercentage = Math.round((minutesUsed / minutesLimit) * 100);

    // Get the previous usage from the last 24 hours to determine if threshold was crossed
    const supabase = await createClient();
    const { data: previousNotification } = await supabase
      .from("usage_notifications")
      .select("current_usage_percentage")
      .eq("business_id", businessId)
      .order("sent_at", { ascending: false })
      .limit(1)
      .single();

    const previousPercentage = previousNotification?.current_usage_percentage || 0;

    // Find applicable threshold
    const threshold = getApplicableThreshold(currentPercentage, previousPercentage);

    if (threshold) {
      // Fetch business info
      const { data: business } = await supabase
        .from("businesses")
        .select("name, email")
        .eq("id", businessId)
        .single();

      if (business && business.email) {
        await sendUsageNotificationEmail(
          businessId,
          business.name || "Business",
          business.email,
          minutesUsed,
          minutesLimit,
          plan,
          threshold
        );
      }
    }
  } catch (error) {
    console.error("[Usage Notifications] Error checking thresholds:", error);
  }
}
