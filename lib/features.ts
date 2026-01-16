import { getSupabaseServer } from "@/lib/supabase/server";

// Feature matrix based on plans
export const FEATURE_MATRIX = {
  starter: {
    voicemail: true,
    sms: false,
    webChat: false,
    whatsApp: false,
    analytics: false,
    apiAccess: false,
    priority_support: false,
    multipleNumbers: false,
    largeTeam: false,
  },
  pro: {
    voicemail: true,
    sms: true,
    webChat: true,
    whatsApp: false,
    analytics: true,
    apiAccess: true,
    priority_support: true,
    multipleNumbers: true,
    largeTeam: true,
  },
  enterprise: {
    voicemail: true,
    sms: true,
    webChat: true,
    whatsApp: true,
    analytics: true,
    apiAccess: true,
    priority_support: true,
    multipleNumbers: true,
    largeTeam: true,
  },
};

export type Feature =
  keyof (typeof FEATURE_MATRIX)[keyof typeof FEATURE_MATRIX];

export async function getUserPlan(userId: string) {
  const supabase = await getSupabaseServer();

  const { data: user } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", userId)
    .single();

  if (!user?.business_id) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("billing_plan")
    .eq("id", user.business_id)
    .single();

  return business?.billing_plan || "starter";
}

export async function hasFeature(
  userId: string,
  feature: Feature
): Promise<boolean> {
  const plan = (await getUserPlan(userId)) as keyof typeof FEATURE_MATRIX;

  if (!plan || !FEATURE_MATRIX[plan]) return false;

  return FEATURE_MATRIX[plan][feature] === true;
}

export async function checkFeatureAccess(
  businessId: string,
  feature: Feature
): Promise<boolean> {
  const supabase = await getSupabaseServer();

  const { data: business } = await supabase
    .from("businesses")
    .select("billing_plan")
    .eq("id", businessId)
    .single();

  if (!business) return false;

  const plan = business.billing_plan as keyof typeof FEATURE_MATRIX;
  return FEATURE_MATRIX[plan]?.[feature] === true;
}

export function getFeatureDescription(feature: Feature): string {
  const descriptions: Record<Feature, string> = {
    voicemail: "Voicemail transcription and storage",
    sms: "SMS message handling",
    webChat: "Web chat integration",
    whatsApp: "WhatsApp business integration",
    analytics: "Advanced analytics and reporting",
    apiAccess: "API access for integrations",
    priority_support: "Priority email and chat support",
    multipleNumbers: "Multiple phone numbers",
    largeTeam: "Large team support",
  };

  return descriptions[feature] || feature;
}
