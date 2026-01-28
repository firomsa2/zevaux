import { getSupabaseServer } from "@/lib/supabase/server";
import { availableMinutePacks, type MinutePack } from "@/lib/minute-packs";

/**
 * Calculate overage charges for a business based on usage
 */
export async function calculateOverageCharges(
  businessId: string,
): Promise<{ overageMinutes: number; overageAmount: number }> {
  const supabase = await getSupabaseServer();

  // Get current plan and usage
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("business_id", businessId)
    .single();

  if (!subscription?.plan_id) {
    return { overageMinutes: 0, overageAmount: 0 };
  }

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", subscription.plan_id)
    .single();

  const { data: usage } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("business_id", businessId)
    .order("period_start", { ascending: false })
    .limit(1)
    .single();

  if (!plan || !usage) {
    return { overageMinutes: 0, overageAmount: 0 };
  }

  const minutesLimit = plan.minutes_limit || 200;
  const minutesUsed = usage.minutes_used || 0;
  const overageRate = plan.overage_rate || 0.25;

  if (minutesUsed <= minutesLimit) {
    return { overageMinutes: 0, overageAmount: 0 };
  }

  const overageMinutes = minutesUsed - minutesLimit;
  const overageAmount = overageMinutes * overageRate;

  return { overageMinutes, overageAmount };
}

/**
 * Create an invoice for overage charges
 */
export async function createOverageInvoice(
  businessId: string,
  overageMinutes: number,
  overageAmount: number,
): Promise<string | null> {
  const supabase = await getSupabaseServer();

  // Get user email for invoice
  const { data: userData } = await supabase
    .from("users")
    .select("email")
    .eq("business_id", businessId)
    .single();

  if (!userData?.email) {
    console.error("[Billing] No email found for business", businessId);
    return null;
  }

  // Create invoice record
  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      business_id: businessId,
      type: "overage",
      amount: overageAmount,
      status: "pending",
      description: `Overage charges: ${overageMinutes.toFixed(0)} minutes @ $${(overageAmount / overageMinutes).toFixed(2)}/min`,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Billing] Error creating invoice:", error);
    return null;
  }

  console.log(
    `[Billing] Created overage invoice for business ${businessId}: $${overageAmount.toFixed(2)}`
  );

  return invoice?.id || null;
}

/**
 * Charge overage at end of billing period if applicable
 */
export async function chargeOverageAtPeriodEnd(
  businessId: string,
): Promise<boolean> {
  const supabase = await getSupabaseServer();

  try {
    const { overageMinutes, overageAmount } =
      await calculateOverageCharges(businessId);

    if (overageAmount <= 0) {
      return false; // No charges
    }

    // Create invoice
    await createOverageInvoice(businessId, overageMinutes, overageAmount);

    // Record overage charge in database
    const { error: chargeError } = await supabase
      .from("overage_charges")
      .insert({
        business_id: businessId,
        minutes: overageMinutes,
        amount: overageAmount,
        billing_period_end: new Date().toISOString(),
      });

    if (chargeError) {
      console.error("[Billing] Error recording overage charge:", chargeError);
      return false;
    }

    console.log(
      `[Billing] Charged $${overageAmount.toFixed(2)} overage for business ${businessId}`
    );
    return true;
  } catch (error) {
    console.error("[Billing] Error in chargeOverageAtPeriodEnd:", error);
    return false;
  }
}

/**
 * Purchase additional minute pack
 */
export async function purchaseMinutePack(
  businessId: string,
  packId: string,
): Promise<{ success: boolean; minutesAdded?: number; cost?: number }> {
  const supabase = await getSupabaseServer();

  const pack = availableMinutePacks.find((p) => p.id === packId);
  if (!pack) {
    return { success: false };
  }

  try {
    // Add bonus minutes to current usage period
    const { data: usage } = await supabase
      .from("usage_tracking")
      .select("*")
      .eq("business_id", businessId)
      .order("period_start", { ascending: false })
      .limit(1)
      .single();

    if (usage) {
      const { error } = await supabase
        .from("usage_tracking")
        .update({
          bonus_minutes: (usage.bonus_minutes || 0) + pack.minutes,
        })
        .eq("id", usage.id);

      if (error) throw error;
    }

    // Record purchase
    const { error: purchaseError } = await supabase
      .from("minute_pack_purchases")
      .insert({
        business_id: businessId,
        pack_id: packId,
        minutes: pack.minutes,
        cost: pack.price,
      });

    if (purchaseError) throw purchaseError;

    console.log(
      `[Billing] Business ${businessId} purchased ${packId} (${pack.minutes} minutes for $${pack.price})`
    );

    return {
      success: true,
      minutesAdded: pack.minutes,
      cost: pack.price,
    };
  } catch (error) {
    console.error("[Billing] Error purchasing minute pack:", error);
    return { success: false };
  }
}
