import { phoneNumberService } from "@/utils/supabase/phone-numbers";

export class PhoneProvisioningService {
  async provisionPhoneNumberForBusiness(
    businessId: string,
    areaCode?: string,
    supabase?: any,
  ) {
    const SEARCH_WEBHOOK_URL = process.env.N8N_PHONE_SEARCH_WEBHOOK_URL;
    const BUY_WEBHOOK_URL = process.env.N8N_PHONE_BUY_WEBHOOK_URL;

    if (!SEARCH_WEBHOOK_URL || !BUY_WEBHOOK_URL) {
      throw new Error("Phone provisioning webhooks not configured");
    }

    try {
      console.log(`Starting provisioning for business ${businessId}...`);

      // 1. Search for available numbers via N8N Webhook
      console.log("Calling search webhook...");
      const searchResponse = await fetch(SEARCH_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: "US",
          areaCode,
        }),
      });

      if (!searchResponse.ok) {
        throw new Error(`Search webhook failed: ${searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      const availableNumbers = searchData.available_phone_numbers || searchData; // specific path depends on n8n output

      if (!Array.isArray(availableNumbers) || availableNumbers.length === 0) {
        throw new Error(
          "No available phone numbers returned from search webhook",
        );
      }

      // 2. Pick the first one
      const selectedNumber = availableNumbers[0];
      const phoneNumber =
        typeof selectedNumber === "string"
          ? selectedNumber
          : selectedNumber.phone_number;
      const friendlyName =
        typeof selectedNumber === "object"
          ? selectedNumber.friendly_name
          : phoneNumber;

      console.log(`Selected number: ${phoneNumber}`);

      // 3. Buy and Assign via N8N Webhook
      // The webhook is expected to handle the purchase and the DB assignment
      console.log("Calling buy/assign webhook...");
      const buyResponse = await fetch(BUY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          phoneNumber,
          friendlyName,
        }),
      });

      if (!buyResponse.ok) {
        const errorText = await buyResponse.text();
        throw new Error(`Buy webhook failed: ${errorText}`);
      }

      const buyData = await buyResponse.json().catch(() => ({}));
      const purchasedNumber = buyData.phoneNumber as string | undefined;
      const purchasedFriendly = (buyData as any).friendlyName || friendlyName;
      const channelType = (buyData as any).channelType || "voice";

      console.log(
        "[phone-provisioning] Buy webhook response number:",
        purchasedNumber,
      );

      // Persist the purchased phone number so business and phone_endpoints stay in sync
      if (supabase && purchasedNumber) {
        try {
          // Upsert phone_endpoints
          const { data: existingEndpoint } = await supabase
            .from("phone_endpoints")
            .select("id, status")
            .eq("business_id", businessId)
            .eq("phone_number", purchasedNumber)
            .maybeSingle();

          if (!existingEndpoint) {
            await supabase.from("phone_endpoints").insert({
              business_id: businessId,
              phone_number: purchasedNumber,
              name: purchasedFriendly || purchasedNumber,
              channel_type: channelType,
              status: "active",
            });
          } else if (existingEndpoint.status !== "active") {
            await supabase
              .from("phone_endpoints")
              .update({ status: "active" })
              .eq("id", existingEndpoint.id);
          }

          // Set business phone_main if missing
          const { data: businessData } = await supabase
            .from("businesses")
            .select("phone_main")
            .eq("id", businessId)
            .single();

          if (!businessData?.phone_main) {
            await supabase
              .from("businesses")
              .update({
                phone_main: purchasedNumber,
                updated_at: new Date().toISOString(),
              })
              .eq("id", businessId);
          }

          // Mark onboarding phone step completed
          await supabase
            .from("onboarding_progress")
            .update({
              phone_provisioning_status: "completed",
              step_3_phone_setup: true,
              step_2_phone_verified: true,
            })
            .eq("business_id", businessId);
        } catch (persistError) {
          console.error(
            "[phone-provisioning] Failed to persist purchased number:",
            persistError,
          );
        }
      }

      // 4. Return success and only include phoneNumber if purchased webhook returned it
      console.log("Phone number purchase request sent successfully");
      return { success: true, phoneNumber: purchasedNumber };
    } catch (error) {
      console.error("Provisioning failed:", error);
      throw error;
    }
  }
}

export const phoneProvisioningService = new PhoneProvisioningService();
