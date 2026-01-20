// This is what your Supabase phone_endpoints table returns
export interface PhoneEndpoint {
  id: string;
  business_id: string;
  phone_number: string;
  channel_type: "voice" | "sms" | "whatsapp" | null;
  status: string | null;
  created_at: string;
  name: string | null;
}

// This is what your Supabase businesses table returns
export interface Business {
  id: string;
  name: string;
  industry: string | null;
  timezone: string | null;
  default_language: string | null;
  supported_languages: string[] | null;
  tone: string | null;
  phone_main: string | null; // This is what we need to check for primary
  escalation_number: string | null;
  billing_plan: string | null;
  hipaa_mode: boolean | null;
  created_at: string;
  updated_at: string;
  description: string | null;
  assistant_name: string | null;
}

// Frontend Phone Number Type (extends endpoint with computed fields)
export interface PhoneNumber extends PhoneEndpoint {
  is_active: boolean; // computed from status === 'active'
  is_primary?: boolean; // computed from phone_main comparison
}

// For creating new phone numbers
export interface CreatePhoneNumberData {
  phone_number: string;
  name?: string;
  channel_type?: "voice" | "sms" | "whatsapp";
}

// For updating phone numbers
export interface UpdatePhoneNumberData extends Partial<CreatePhoneNumberData> {
  status?: "active" | "inactive";
  is_active?: boolean; // frontend convenience
}

// For your purchase workflow
export interface PurchasePhoneNumberData {
  phone_number: string;
  name: string;
  businessId: string;
  countryCode?: string;
}
export interface UpdateBusinessData {
  escalation_number?: string | null;
}
