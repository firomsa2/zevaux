"use client";

import { useEffect, useState } from "react";
import { getUserWithBusiness } from "@/utils/supabase/user";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { CallsTable } from "@/components/calls-table";
import { CallWithTranscript } from "@/types/call";

export default function CallsPage() {
  const [calls, setCalls] = useState<CallWithTranscript[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchCallsWithTranscripts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user with organization
      const { user, businessId, error } = await getUserWithBusiness();

      if (error || !businessId) {
        console.error("Error fetching user org:", error);
        setError(
          "Failed to load organization data. Please try logging out and back in."
        );
        setLoading(false);
        return;
      }

      setOrgId(businessId);
      console.log("🚀 ~ Fetching calls for org:", businessId);

      // First, fetch calls with organization filter
      let callsQuery = supabase
        .from("call_logs")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false })
        .limit(50);

      console.log("🚀 ~ Calls query before filters:", callsQuery);
      // Apply filters
      if (filter === "active") callsQuery = callsQuery.is("end_time", null);
      if (filter === "completed")
        callsQuery = callsQuery.not("end_time", "is", null);

      const { data: callsData, error: callsError } = await callsQuery;
      console.log("🚀 ~ Fetched calls data:", callsData, callsError);

      if (callsError) {
        console.error("Error fetching calls:", callsError);
        setError(`Failed to load calls: ${callsError.message}`);
        setLoading(false);
        return;
      }

      console.log("🚀 ~ Calls data:", callsData);

      if (!callsData || callsData.length === 0) {
        console.log("🚀 ~ No calls found");
        setCalls([]);
        setLoading(false);
        return;
      }

      // Get all call IDs to fetch transcripts
      const callIds = callsData.map((call) => call.id);
      console.log("🚀 ~ Call IDs to fetch transcripts for:", callIds);

      // Fetch transcripts for these calls
      const { data: transcriptsData, error: transcriptsError } = await supabase
        .from("transcripts")
        .select("*")
        .in("call_id", callIds);

      if (transcriptsError) {
        console.error("Error fetching transcripts:", transcriptsError);
      }

      console.log("🚀 ~ Transcripts data:", transcriptsData);

      // Create a map of call_id to transcript for easy lookup
      const transcriptMap = new Map();
      transcriptsData?.forEach((transcript) => {
        transcriptMap.set(transcript.call_id, transcript);
      });

      console.log("🚀 ~ Transcript map:", transcriptMap);

      // Combine calls with their transcripts
      const callsWithTranscripts: CallWithTranscript[] = callsData.map(
        (call) => {
          const transcript = transcriptMap.get(call.id);
          console.log(`🚀 ~ Call ${call.id} has transcript:`, !!transcript);
          return {
            ...call,
            transcript: transcript || null,
          };
        }
      );

      console.log("🚀 ~ Final calls with transcripts:", callsWithTranscripts);
      setCalls(callsWithTranscripts);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallsWithTranscripts();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading calls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={fetchCallsWithTranscripts}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="">
            <h1 className="text-2xl font-bold tracking-tight">Call Logs</h1>
            <p className="text-muted-foreground">
              View and manage all your organization's call history and
              transcripts
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex gap-4 mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-sm p-2 bg-background min-w-[150px]"
            >
              <option value="all">All Calls</option>
              <option value="active">Live Calls</option>
              <option value="completed">Completed Calls</option>
            </select>
          </div>
        </div>

        {/* Calls Table */}
        <CallsTable
          calls={calls}
          loading={loading}
          onRefresh={fetchCallsWithTranscripts}
        />
      </div>
    </div>
  );
}
