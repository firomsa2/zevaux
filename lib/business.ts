import { getSupabaseServer } from "@/lib/supabase/server";
import type { Business } from "@/types/database";

export async function getUserBusinessWithRelations(userId: string) {
  const supabase = await getSupabaseServer();

  const { data: user } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", userId)
    .single();

  if (!user?.business_id) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", user.business_id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("business_id", user.business_id)
    .maybeSingle();

  let plan = null;
  if (subscription) {
    const { data: planData } = await supabase
      .from("plans")
      .select("*")
      .eq("id", subscription.plan_id)
      .single();
    plan = planData;
  } else if (business?.billing_plan) {
    const { data: planData } = await supabase
      .from("plans")
      .select("*")
      .eq("slug", business.billing_plan)
      .maybeSingle();
    plan = planData;
  }

  return { business: business as Business, subscription, plan };
}

export async function getBusinessPlan(businessId: string) {
  const supabase = await getSupabaseServer();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  if (subscription) {
    const { data: plan } = await supabase
      .from("plans")
      .select("*")
      .eq("id", subscription.plan_id)
      .single();
    return plan;
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("billing_plan")
    .eq("id", businessId)
    .single();

  if (business?.billing_plan) {
    const { data: plan } = await supabase
      .from("plans")
      .select("*")
      .eq("slug", business.billing_plan)
      .maybeSingle();
    return plan;
  }

  return null;
}

export async function canAccessFeature(
  businessId: string,
  feature: string
): Promise<boolean> {
  const plan = await getBusinessPlan(businessId);
  if (!plan) return false;

  const features = plan.features as Record<string, boolean>;
  return features[feature] === true;
}
