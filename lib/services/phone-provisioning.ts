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

      // Helper function to create a fetch with timeout
      const fetchWithTimeout = async (
        url: string,
        options: RequestInit,
        timeoutMs: number = 30000, // 30 seconds default
      ): Promise<Response> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error: any) {
          clearTimeout(timeoutId);
          if (error.name === "AbortError") {
            throw new Error(
              `Request timeout: The webhook did not respond within ${timeoutMs}ms. Please check your network connection and webhook configuration.`,
            );
          }
          if (error.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
            throw new Error(
              `Connection timeout: Unable to connect to the webhook service. Please check your network connection and ensure the webhook URL is accessible.`,
            );
          }
          throw error;
        }
      };

      // 1. Search for available numbers via N8N Webhook
      console.log("Calling search webhook...");
      const searchResponse = await fetchWithTimeout(
        SEARCH_WEBHOOK_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            countryCode: "US",
            areaCode,
          }),
        },
        30000, // 30 second timeout
      );

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text().catch(() => "");
        throw new Error(
          `Search webhook failed (${searchResponse.status}): ${errorText || searchResponse.statusText}`,
        );
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
      const buyResponse = await fetchWithTimeout(
        BUY_WEBHOOK_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId,
            phoneNumber,
            friendlyName,
          }),
        },
        30000, // 30 second timeout
      );
      console.log("🚀 ~ PhoneProvisioningService ~ buyResponse:", buyResponse);

      if (!buyResponse.ok) {
        const errorText = await buyResponse.text();
        throw new Error(`Buy webhook failed: ${errorText}`);
      }

      const buyData = await buyResponse.json().catch(() => ({}));
      console.log("🚀 ~ PhoneProvisioningService ~ buyData:", buyData);
      const purchasedNumber = buyData.phone_number as string | undefined;
      console.log("🚀 ~ PhoneProvisioningService ~ purchasedNumber:", purchasedNumber);
      const purchasedFriendly = (buyData as any).friendlyName || friendlyName;
      console.log("🚀 ~ PhoneProvisioningService ~ purchasedFriendly:", purchasedFriendly);
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
    } catch (error: any) {
      console.error("Provisioning failed:", error);
      // Re-throw with more context if it's not already a descriptive error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Phone provisioning failed: ${error?.message || String(error)}`,
      );
    }
  }
}

export const phoneProvisioningService = new PhoneProvisioningService();
