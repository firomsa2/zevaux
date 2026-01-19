export interface Business {
  id: string;
  name: string;
  industry: string | null;
  timezone: string;
  default_language: string;
  supported_languages: string[];
  tone: string;
  phone_main: string | null;
  escalation_number: string | null;
  billing_plan: "starter" | "pro" | "enterprise";
  hipaa_mode: boolean;
  created_at: string;
  updated_at: string;
  description: string | null;
  assistant_name: string | null;
  website: string | null;
  personalized_greeting?: string | null;
}

export interface Plan {
  slug: string;
  max_phone_numbers: number;
  max_team_members: number;
  id: string;
  name: string;
  monthly_price: number;
  minutes_limit: number;
  features: Record<string, unknown>;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  business_id: string;
}

export interface BusinessConfig {
  business_id: string;
  config: {
    hours: Record<string, unknown>;
    safety: {
      disallowMedicalAdvice: boolean;
      disallowFinancialAdvice: boolean;
    };
    channels: {
      sms: boolean;
      voice: boolean;
      webchat: boolean;
      whatsapp: boolean;
    };
    services: string[];
    escalation: {
      escalateWhen: string[];
      allowVoicemail: boolean;
      transferNumber: string;
    };
    bookingRules: {
      allowSameDay: boolean;
      maxDaysAhead: number;
      collectFields: string[];
      minNoticeHours: number;
    };
  };
  updated_at: string;
}

export interface BusinessPrompt {
  business_id: string;
  system_prompt: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface PhoneEndpoint {
  id: string;
  business_id: string;
  phone_number: string;
  channel_type: "voice" | "sms" | "whatsapp";
  status: string;
  created_at: string;
  name: string | null;
}

export interface CallLog {
  id: string;
  business_id: string;
  channel: string;
  twilio_sid: string | null;
  caller: string | null;
  status: string;
  outcome: string | null;
  summary: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
  minutes: number | null;
}

export interface Invoice {
  id: string;
  business_id: string;
  stripe_invoice_id: string;
  amount: number;
  status: "draft" | "open" | "paid" | "void" | "uncollectible";
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  business_id: string;
  plan_id: string | null;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "paused"
    | "trialing"
    | "unpaid";
  current_period_end: string | null;
  current_period_start: string | null;
  trial_end: string | null;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  created_at: string;
  updated_at: string;
  cancel_at_period_end?: boolean;
}
