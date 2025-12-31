// utils/supabase/business.ts
import { createClient } from "./client";

export async function updateBusinessEscalationNumber(
  businessId: string,
  escalationNumber: string | null
): Promise<{ error: any }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("businesses")
      .update({
        escalation_number: escalationNumber,
        updated_at: new Date().toISOString(),
      })
      .eq("id", businessId);

    return { error };
  } catch (error) {
    console.error("Error updating business escalation number:", error);
    return { error };
  }
}

// Optional: Add other business-related functions
export async function getBusinessById(
  businessId: string
): Promise<{ data: any; error: any }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    return { data, error };
  } catch (error) {
    console.error("Error fetching business:", error);
    return { data: null, error };
  }
}
