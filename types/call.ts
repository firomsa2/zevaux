export interface Call {
  id: string;
  org_id: string;
  receptionist_id: string;
  caller_phone: string;
  caller: string;
  started_at: string;
  start_time: string;
  ended_at: string | null;
  end_time: string | null;
  minutes: string | null;
  metadata: any;
  created_at: string;
  vapi_call_id: string;
}

export interface Transcript {
  id: string;
  call_id: string;
  content: string;
  summary: string;
  Vapi_call_id: string;
  created_at: string;
  recording_URL?: string;
}

export interface CallWithTranscript extends Call {
  transcript?: Transcript | null;
}
