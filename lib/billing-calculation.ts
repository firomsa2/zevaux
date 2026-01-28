/**
 * Billing Calculation Utilities
 * Handles minute/second conversions and billable duration calculations
 */

/**
 * Calculate billable seconds from actual call duration
 * Rounded to nearest 6 seconds (10-second billing in 60-second units)
 * Examples:
 * - 0-5s → 0s (free tier minimum)
 * - 6-11s → 6s
 * - 12-17s → 12s
 * - etc.
 */
export function calculateBillableSeconds(durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;

  // Round UP to nearest 6 seconds
  return Math.ceil(durationSeconds / 6) * 6;
}

/**
 * Convert seconds to minutes for display/storage
 */
export function secondsToMinutes(seconds: number): number {
  return Math.ceil(seconds / 60);
}

/**
 * Convert billable seconds to minutes for usage tracking
 */
export function billableSecondsToMinutes(billableSeconds: number): number {
  return Math.ceil(billableSeconds / 60);
}

/**
 * Get overage cost for a business plan
 */
export function getOverageRateForPlan(planName: string): number {
  const rates: Record<string, number> = {
    starter: 0.25,
    basic: 0.22,
    pro: 0.2,
    enterprise: 0.0, // Custom rate
  };
  return rates[planName.toLowerCase()] || 0.2;
}

/**
 * Calculate overage cost for minutes over limit
 */
export function calculateOverageCost(
  planName: string,
  minutesUsed: number,
  minutesIncluded: number,
): number {
  const overageMinutes = Math.max(0, minutesUsed - minutesIncluded);
  const overageRate = getOverageRateForPlan(planName);
  return overageMinutes * overageRate;
}

/**
 * Get plan details including included minutes
 */
export function getPlanDetails(planName: string): {
  name: string;
  monthlyPrice: number;
  minutesIncluded: number;
  overageRate: number;
} {
  const plans: Record<
    string,
    {
      name: string;
      monthlyPrice: number;
      minutesIncluded: number;
      overageRate: number;
    }
  > = {
    starter: {
      name: "Starter",
      monthlyPrice: 49,
      minutesIncluded: 200,
      overageRate: 0.25,
    },
    basic: {
      name: "Basic",
      monthlyPrice: 79,
      minutesIncluded: 300,
      overageRate: 0.22,
    },
    pro: {
      name: "Pro",
      monthlyPrice: 129,
      minutesIncluded: 500,
      overageRate: 0.2,
    },
    custom: {
      name: "Custom",
      monthlyPrice: 0,
      minutesIncluded: 1000, // Custom
      overageRate: 0.0,
    },
    enterprise: {
      name: "Custom",
      monthlyPrice: 0,
      minutesIncluded: 1000,
      overageRate: 0.0,
    },
  };
  return plans[planName.toLowerCase()] || plans.starter;
}
