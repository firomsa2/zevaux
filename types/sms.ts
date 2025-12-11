export type SMSMode = "fully_ai" | "hybrid" | "manual";
export type SMSStatus =
  | "draft"
  | "pending"
  | "approved"
  | "sent"
  | "failed"
  | "retry";

export interface SMS {
  id: string;
  org_id: string;
  body: string;
  mobile_number: string;
  status: SMSStatus;
  mode: SMSMode;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  approved_by?: string | null;
  approved_at?: string | null;
  retry_count?: number;
  error_message?: string | null;
}

export interface CreateSMSData {
  body: string;
  mobile_number: string;
  mode?: SMSMode;
  status?: SMSStatus;
}

export interface UpdateSMSData {
  body?: string;
  mobile_number?: string;
  status?: SMSStatus;
  error_message?: string | null;
  retry_count?: number;
}

export interface SMSStats {
  total: number;
  draft: number;
  pending: number;
  approved: number;
  sent: number;
  failed: number;
}

export interface SMSFilters {
  status?: SMSStatus | "all";
  mode?: SMSMode | "all";
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
}
