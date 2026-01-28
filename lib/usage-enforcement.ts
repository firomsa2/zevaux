import { NextResponse } from "next/server";
import { checkUsageLimit, type UsageResource } from "@/lib/usage-tracking";

export type UsageEnforcementResult = {
  allowed: boolean;
  response?: NextResponse;
  message?: string;
};

/**
 * Check usage limit before allowing an action.
 * Returns a NextResponse with 403 status if limit is exceeded, or null if allowed.
 */
export async function enforceUsageLimit(
  businessId: string,
  resource: UsageResource,
): Promise<NextResponse | null> {
  const check = await checkUsageLimit(businessId, resource);

  if (!check.allowed) {
    return NextResponse.json(
      {
        error: "Usage limit exceeded",
        message: check.message || `You have reached your ${resource} limit.`,
        resource: check.resource,
        current: check.current,
        limit: check.limit,
        redirectTo: "/dashboard/billing",
      },
      { status: 403 },
    );
  }

  return null; // Allowed
}

/**
 * Check multiple usage limits at once.
 * Returns the first limit that is exceeded, or null if all are within limits.
 */
export async function enforceUsageLimits(
  businessId: string,
  resources: UsageResource[],
): Promise<NextResponse | null> {
  for (const resource of resources) {
    const response = await enforceUsageLimit(businessId, resource);
    if (response) {
      return response;
    }
  }
  return null; // All limits OK
}

/**
 * Get usage limit information without blocking.
 * Useful for displaying warnings in the UI.
 */
export async function getUsageLimitInfo(
  businessId: string,
  resource: UsageResource,
) {
  return await checkUsageLimit(businessId, resource);
}
