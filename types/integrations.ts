export interface UserIntegration {
  id: string;
  business_id: string;
  user_id: string;
  provider: "google_calendar" | "microsoft_outlook" | "zoom" | "stripe";
  access_token: string;
  refresh_token?: string | null;
  expires_at?: number | null;
  scope?: string | null;
  token_type?: string | null;
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
