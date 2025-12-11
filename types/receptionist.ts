export interface Receptionist {
  id: string;
  org_id: string;
  name: string;
  greeting: string;
  voice_profile: any;
  business_hours: any;
  fallback_contact: any;
  assigned_phone_number_id: string | null;
  created_at: string;
  assigned_phone_number?: {
    id: string;
    name: string;
    phone_number: string;
  } | null;
}

export interface CreateReceptionistData {
  name: string;
  greeting: string;
  voice_profile: any;
  business_hours: any;
  fallback_contact: any;
  assigned_phone_number_id?: string | null;
  website_url?: string;
}
