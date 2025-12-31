import { createClient } from "./client";
import {
  PhoneNumber,
  PhoneEndpoint,
  Business,
  CreatePhoneNumberData,
  UpdatePhoneNumberData,
} from "@/types/phone";

export class PhoneNumberService {
  private supabase = createClient();

  // Get phone numbers with business info to compute is_primary
  async getPhoneNumbers(businessId: string): Promise<{
    data: PhoneNumber[];
    business: Business | null;
    error: any;
  }> {
    try {
      console.log("Fetching phone numbers for business:", businessId);

      // First, get the business to know the primary phone
      const { data: businessData, error: businessError } = await this.supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .single();

      if (businessError) {
        console.error("Error fetching business:", businessError);
        return { data: [], business: null, error: businessError };
      }

      // Get all phone endpoints for this business
      const { data: endpointsData, error: endpointsError } = await this.supabase
        .from("phone_endpoints")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      console.log("numberr", endpointsData);
      if (endpointsError) {
        console.error("Error fetching phone endpoints:", endpointsError);
        return { data: [], business: businessData, error: endpointsError };
      }

      // Transform to PhoneNumber type and compute is_primary
      const phoneNumbers: PhoneNumber[] = (endpointsData || []).map(
        (endpoint: PhoneEndpoint) => ({
          ...endpoint,
          is_active: endpoint.status === "active",
          is_primary: businessData.phone_main === endpoint.phone_number,
        })
      );

      console.log("Transformed phone numbers:", phoneNumbers);
      return { data: phoneNumbers, business: businessData, error: null };
    } catch (error) {
      console.error("Unexpected error fetching phone numbers:", error);
      return { data: [], business: null, error };
    }
  }

  // Get a single phone number by ID
  async getPhoneNumberById(
    id: string,
    businessId: string
  ): Promise<{ data: PhoneNumber | null; error: any }> {
    try {
      const { data: endpointData, error } = await this.supabase
        .from("phone_endpoints")
        .select("*")
        .eq("id", id)
        .eq("business_id", businessId)
        .single();

      if (error || !endpointData) {
        return { data: null, error };
      }

      // Get business to check if primary
      const { data: businessData } = await this.supabase
        .from("businesses")
        .select("phone_main")
        .eq("id", businessId)
        .single();

      const phoneNumber: PhoneNumber = {
        ...endpointData,
        is_active: endpointData.status === "active",
        is_primary: businessData?.phone_main === endpointData.phone_number,
      };

      return { data: phoneNumber, error: null };
    } catch (error) {
      console.error("Error fetching phone endpoint:", error);
      return { data: null, error };
    }
  }

  // Create a new phone endpoint (for when n8n webhook saves to Supabase)
  async createPhoneNumber(
    phoneData: CreatePhoneNumberData,
    businessId: string
  ): Promise<{ data: PhoneNumber | null; error: any; isFirstNumber: boolean }> {
    try {
      // Check if this is the first number for the business
      const { data: existingNumbers, error: countError } = await this.supabase
        .from("phone_endpoints")
        .select("id")
        .eq("business_id", businessId);

      if (countError) {
        console.error("Error checking existing numbers:", countError);
        return { data: null, error: countError, isFirstNumber: false };
      }

      const isFirstNumber = !existingNumbers || existingNumbers.length === 0;

      // Check if business has a main phone already
      const { data: businessData, error: businessError } = await this.supabase
        .from("businesses")
        .select("phone_main")
        .eq("id", businessId)
        .single();

      if (businessError) {
        console.error("Error fetching business:", businessError);
        return { data: null, error: businessError, isFirstNumber: false };
      }

      const shouldSetAsMain = !businessData?.phone_main || isFirstNumber;

      // Prepare endpoint data
      const endpointData: any = {
        business_id: businessId,
        phone_number: phoneData.phone_number,
        channel_type: phoneData.channel_type || "voice",
        status: "active",
        name: phoneData.name || phoneData.phone_number,
      };

      // Insert the phone endpoint
      const { data: newEndpoint, error: insertError } = await this.supabase
        .from("phone_endpoints")
        .insert([endpointData])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating phone endpoint:", insertError);
        return { data: null, error: insertError, isFirstNumber: false };
      }

      // If this should be the main phone, update the business table
      if (shouldSetAsMain) {
        const { error: updateError } = await this.supabase
          .from("businesses")
          .update({
            phone_main: phoneData.phone_number,
            updated_at: new Date().toISOString(),
          })
          .eq("id", businessId);

        if (updateError) {
          console.warn("Failed to set as primary:", updateError);
          // Continue anyway - the number was created successfully
        }
      }

      // Return the created phone number
      const phoneNumber: PhoneNumber = {
        ...newEndpoint,
        is_active: true,
        is_primary: shouldSetAsMain,
      };

      return {
        data: phoneNumber,
        error: null,
        isFirstNumber,
      };
    } catch (error) {
      console.error("Unexpected error creating phone endpoint:", error);
      return { data: null, error, isFirstNumber: false };
    }
  }

  // Update a phone endpoint
  async updatePhoneNumber(
    id: string,
    updates: UpdatePhoneNumberData,
    businessId: string
  ): Promise<{ data: PhoneNumber | null; error: any }> {
    try {
      const updateData: any = {};

      // Map updates to database schema
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.phone_number !== undefined)
        updateData.phone_number = updates.phone_number;
      if (updates.channel_type !== undefined)
        updateData.channel_type = updates.channel_type;

      // Handle status/is_active
      if (updates.status !== undefined) {
        updateData.status = updates.status;
      } else if (updates.is_active !== undefined) {
        updateData.status = updates.is_active ? "active" : "inactive";
      }

      const { data, error } = await this.supabase
        .from("phone_endpoints")
        .update(updateData)
        .eq("id", id)
        .eq("business_id", businessId)
        .select()
        .single();

      if (error) {
        console.error("Error updating phone endpoint:", error);
        return { data: null, error };
      }

      // Get business to check if primary
      const { data: businessData } = await this.supabase
        .from("businesses")
        .select("phone_main")
        .eq("id", businessId)
        .single();

      const phoneNumber: PhoneNumber = {
        ...data,
        is_active: data.status === "active",
        is_primary: businessData?.phone_main === data.phone_number,
      };

      return { data: phoneNumber, error: null };
    } catch (error) {
      console.error("Unexpected error updating phone endpoint:", error);
      return { data: null, error };
    }
  }

  // Delete a phone endpoint
  async deletePhoneNumber(
    id: string,
    businessId: string
  ): Promise<{ error: any }> {
    try {
      // First, check if this is the primary number
      const { data: phoneData, error: fetchError } = await this.supabase
        .from("phone_endpoints")
        .select("phone_number")
        .eq("id", id)
        .eq("business_id", businessId)
        .single();

      if (fetchError) {
        return { error: fetchError };
      }

      // Check if this is the primary phone
      const { data: businessData } = await this.supabase
        .from("businesses")
        .select("phone_main")
        .eq("id", businessId)
        .single();

      const isPrimary = businessData?.phone_main === phoneData.phone_number;

      if (isPrimary) {
        return {
          error: new Error(
            "Cannot delete the primary phone number. Set another number as primary first."
          ),
        };
      }

      // Delete the phone endpoint
      const { error } = await this.supabase
        .from("phone_endpoints")
        .delete()
        .eq("id", id)
        .eq("business_id", businessId);

      return { error };
    } catch (error) {
      console.error("Unexpected error deleting phone endpoint:", error);
      return { error };
    }
  }

  // Set a phone number as primary for the business
  async setAsPrimary(
    phoneNumber: string,
    businessId: string
  ): Promise<{ error: any }> {
    try {
      // First, verify the phone number exists for this business
      const { data: phoneExists, error: checkError } = await this.supabase
        .from("phone_endpoints")
        .select("id")
        .eq("business_id", businessId)
        .eq("phone_number", phoneNumber)
        .eq("status", "active")
        .single();

      if (checkError || !phoneExists) {
        return {
          error: new Error(
            "Phone number not found or is not active for this business"
          ),
        };
      }

      // Update the business's primary phone
      const { error } = await this.supabase
        .from("businesses")
        .update({
          phone_main: phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);

      return { error };
    } catch (error) {
      console.error("Error setting primary phone:", error);
      return { error };
    }
  }

  // Get only active phone numbers
  async getAvailablePhoneNumbers(
    businessId: string
  ): Promise<{ data: PhoneNumber[]; error: any }> {
    try {
      const { data: businessData } = await this.supabase
        .from("businesses")
        .select("phone_main")
        .eq("id", businessId)
        .single();

      const { data, error } = await this.supabase
        .from("phone_endpoints")
        .select("*")
        .eq("business_id", businessId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        return { data: [], error };
      }

      const phoneNumbers: PhoneNumber[] = (data || []).map(
        (endpoint: PhoneEndpoint) => ({
          ...endpoint,
          is_active: true,
          is_primary: businessData?.phone_main === endpoint.phone_number,
        })
      );

      return { data: phoneNumbers, error: null };
    } catch (error) {
      console.error("Error fetching available phone endpoints:", error);
      return { data: [], error };
    }
  }

  // Helper: Check if business has any phone numbers
  async businessHasPhoneNumbers(businessId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from("phone_endpoints")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId);

      if (error) {
        console.error("Error checking phone numbers:", error);
        return false;
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error("Unexpected error:", error);
      return false;
    }
  }

  // Get business details
  async getBusiness(
    businessId: string
  ): Promise<{ data: Business | null; error: any }> {
    try {
      const { data, error } = await this.supabase
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

  // update escalation number
  async updateEscalationNumber(
    businessId: string,
    escalationNumber: string | null
  ): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from("businesses")
        .update({
          escalation_number: escalationNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);

      return { error };
    } catch (error) {
      console.error("Error updating escalation number:", error);
      return { error };
    }
  }

  // Remove escalation number
  async removeEscalationNumber(businessId: string): Promise<{ error: any }> {
    try {
      const { error } = await this.supabase
        .from("businesses")
        .update({
          escalation_number: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);

      return { error };
    } catch (error) {
      console.error("Error removing escalation number:", error);
      return { error };
    }
  }
}

export const phoneNumberService = new PhoneNumberService();
