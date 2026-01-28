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
  billing_plan: "starter" | "basic" | "pro" | "custom" | "enterprise";
  hipaa_mode: boolean;
  created_at: string;
  updated_at: string;
  description: string | null;
  assistant_name: string | null;
  website: string | null;
  personalized_greeting?: string | null;
  billing_cycle_start?: string;
  billing_cycle_end?: string;
  minute_alert_state?: {
    sent_70?: boolean;
    sent_90?: boolean;
    sent_100?: boolean;
    sent_120?: boolean;
    last_reset?: string;
  };
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
  billable_seconds?: number;
  billable_minutes?: number;
  cost?: number; // Calculated overage cost if applicable
}

export interface UsageSnapshot {
  id: string;
  business_id: string;
  year: number;
  month: number;
  total_billable_seconds: number;
  total_minutes_used: number;
  overage_minutes: number;
  overage_cost: number;
  created_at: string;
}

export interface UsageTracking {
  id: string;
  business_id: string;
  minutes_used: number;
  calls_made: number;
  purchased_minutes: number; // Add-on packs
  period_start: string;
  period_end: string;
  updated_at: string;
}

export interface UsageNotification {
  id: string;
  business_id: string;
  threshold_percentage: number;
  current_usage_percentage: number;
  minutes_used: number;
  minutes_limit: number;
  sent_at: string;
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
