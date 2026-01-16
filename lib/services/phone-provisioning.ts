import { phoneNumberService } from "@/utils/supabase/phone-numbers";

export class PhoneProvisioningService {
  async provisionPhoneNumberForBusiness(businessId: string, areaCode?: string) {
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
          "No available phone numbers returned from search webhook"
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

      // 4. Return success (The UI will poll the DB to see the new number)
      console.log("Phone number purchase request sent successfully");
      return { success: true, phoneNumber };
    } catch (error) {
      console.error("Provisioning failed:", error);
      throw error;
    }
  }
}

export const phoneProvisioningService = new PhoneProvisioningService();
