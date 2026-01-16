"use server";

import { createClient } from "@/utils/supabase/server";
import type { Business } from "@/types/database";

export async function createBusinessForUser(
  userId: string,
  businessName: string,
  industry?: string
) {
  const supabase = await createClient();

  try {
    // Create business with starter plan by default
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        name: businessName,
        industry: industry || null,
        timezone: "UTC",
        default_language: "en",
        supported_languages: ["en"],
        tone: "professional",
        billing_plan: "starter",
        subscription_status: "active",
      })
      .select()
      .single();

    if (businessError) throw businessError;

    // Link user to business
    const { error: userError } = await supabase
      .from("users")
      .update({ business_id: business.id })
      .eq("id", userId);

    if (userError) throw userError;

    // Create default subscription record
    const { data: starterPlan } = await supabase
      .from("plans")
      .select("id")
      .eq("slug", "starter")
      .single();

    if (starterPlan) {
      await supabase.from("subscriptions").insert({
        business_id: business.id,
        plan_id: starterPlan.id,
        status: "trialing",
        trial_end: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(), // 14 day trial
      });
    }

    return { success: true, business };
  } catch (error) {
    console.error("Error creating business:", error);
    return { success: false, error: String(error) };
  }
}

export async function getUserBusiness(userId: string) {
  const supabase = await createClient();

  try {
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

    return business as Business;
  } catch (error) {
    console.error("Error fetching business:", error);
    return null;
  }
}
