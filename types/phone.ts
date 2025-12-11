export interface PhoneNumber {
  id: string;
  org_id: string;
  name: string;
  phone_number: string;
  twilio_account_sid: string;
  twilio_auth_token: string;
  fallback_number: string;
  receptionist_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  receptionist?: {
    id: string;
    name: string;
    assistant_vapi_id: string | null;
  } | null;
}

export interface CreatePhoneNumberData {
  name: string;
  phone_number: string;
  twilio_account_sid: string;
  twilio_auth_token: string;
  fallback_number: string;
}

export interface UpdatePhoneNumberData extends Partial<CreatePhoneNumberData> {
  is_active?: boolean;
  receptionist_id?: string | null;
}
