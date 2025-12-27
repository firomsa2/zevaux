// import { redirect } from "next/navigation";
// import { CallLogsTable } from "@/components/dashboard/call-logs-table";
// import { createClient } from "@/utils/supabase/server";

// export default async function CallLogsPage() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect("/auth/login");
//   }

//   const { data: callLogs } = await supabase
//     .from("calls")
//     .select("*")
//     .eq("user_id", user.id)
//     .order("created_at", { ascending: false })
//     .limit(100);

//   return (
//     <main className="flex-1 px-4">
//       <div className="space-y-4">
//         <div>
//           <h1 className="text-3xl font-bold">Call Logs</h1>
//           <p className="text-text-secondary mt-2">
//             View and manage all your incoming calls
//           </p>
//         </div>

//         <CallLogsTable initialData={callLogs || []} userId={user.id} />
//       </div>
//     </main>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { getUserWithOrg } from "@/utils/supabase/user";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle, RefreshCw } from "lucide-react";

// export default function CallsPage() {
//   const [calls, setCalls] = useState<any[]>([]);
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [orgId, setOrgId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const supabase = createClient();

//   const fetchCalls = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Get user with organization
//       const { user, orgId, error } = await getUserWithOrg();

//       if (error || !orgId) {
//         console.error("Error fetching user org:", error);
//         setError(
//           "Failed to load organization data. Please try logging out and back in."
//         );
//         setLoading(false);
//         return;
//       }

//       setOrgId(orgId);

//       // Build query for calls with organization filter
//       let query = supabase
//         .from("calls")
//         .select("*")
//         .eq("org_id", orgId)
//         .order("created_at", { ascending: false })
//         .limit(20);

//       // Apply filters
//       if (filter === "active") query = query.is("ended_at", null);
//       if (filter === "completed") query = query.not("ended_at", "is", null);

//       const { data, error: callsError } = await query;

//       if (callsError) {
//         console.error("Error fetching calls:", callsError);
//         setError(`Failed to load calls: ${callsError.message}`);
//       } else {
//         setCalls(data || []);
//       }
//     } catch (err: any) {
//       console.error("Unexpected error:", err);
//       setError(`Unexpected error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCalls();
//   }, [filter]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p>Loading calls...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//           <Button onClick={fetchCalls} className="flex items-center gap-2">
//             <RefreshCw className="h-4 w-4" />
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold tracking-tight mb-2">Calls</h1>
//           <p className="text-muted-foreground">
//             View and manage all your organization's call history
//           </p>
//         </div>

//         {/* Filter Controls */}
//         <div className="flex gap-2 mb-6">
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="border rounded p-2 bg-background"
//           >
//             <option value="all">All Calls</option>
//             <option value="active">Active Calls</option>
//             <option value="completed">Completed Calls</option>
//           </select>
//         </div>

//         {/* Calls List */}
//         <div className="space-y-4">
//           {calls.map((call) => (
//             <div
//               key={call.id}
//               className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
//             >
//               <Link href={`/dashboard/calls/${call.id}`}>
//                 <div className="flex justify-between items-center">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <p className="font-medium text-lg">{call.caller_phone}</p>
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           call.ended_at
//                             ? "bg-green-100 text-green-800"
//                             : "bg-blue-100 text-blue-800"
//                         }`}
//                       >
//                         {call.ended_at ? "Completed" : "Active"}
//                       </span>
//                     </div>
//                     <div className="text-sm text-muted-foreground space-y-1">
//                       <p>
//                         Started:{" "}
//                         {call.started_at
//                           ? new Date(call.started_at).toLocaleString()
//                           : "—"}
//                       </p>
//                       {call.ended_at && (
//                         <p>Ended: {new Date(call.ended_at).toLocaleString()}</p>
//                       )}
//                       {call.minutes && (
//                         <p>
//                           Duration: {parseFloat(call.minutes).toFixed(2)}{" "}
//                           minutes
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-lg font-semibold text-primary">
//                       {call.minutes
//                         ? `${parseFloat(call.minutes).toFixed(1)} min`
//                         : "Live"}
//                     </div>
//                     <div className="text-xs text-muted-foreground mt-1">
//                       View details →
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {!loading && calls.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-muted-foreground">
//               <p className="text-lg mb-2">No calls found</p>
//               <p className="text-sm">
//                 {filter === "all"
//                   ? "Your organization hasn't received any calls yet."
//                   : `No ${filter} calls found.`}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { getUserWithOrg } from "@/utils/supabase/user";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle, RefreshCw } from "lucide-react";
// import { CallsTable } from "@/components/calls-table";
// import { CallWithTranscript } from "@/types/call";

// export default function CallsPage() {
//   const [calls, setCalls] = useState<CallWithTranscript[]>([]);
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [orgId, setOrgId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const supabase = createClient();

//   const fetchCallsWithTranscripts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Get user with organization
//       const { user, orgId, error } = await getUserWithOrg();

//       if (error || !orgId) {
//         console.error("Error fetching user org:", error);
//         setError(
//           "Failed to load organization data. Please try logging out and back in."
//         );
//         setLoading(false);
//         return;
//       }

//       setOrgId(orgId);

//       // Build query for calls with organization filter
//       let query = supabase
//         .from("calls")
//         .select(
//           `
//           *,
//           transcripts (*)
//         `
//         )
//         .eq("org_id", orgId)
//         .order("created_at", { ascending: false })
//         .limit(50);

//       // Apply filters
//       if (filter === "active") query = query.is("ended_at", null);
//       if (filter === "completed") query = query.not("ended_at", "is", null);

//       const { data, error: callsError } = await query;

//       if (callsError) {
//         console.error("Error fetching calls:", callsError);
//         setError(`Failed to load calls: ${callsError.message}`);
//       } else {
//         // Transform data to include transcript as a single object
//         const callsWithTranscripts: CallWithTranscript[] = (data || []).map(
//           (call) => ({
//             ...call,
//             transcript: call.transcripts?.[0] || null,
//           })
//         );
//         setCalls(callsWithTranscripts);
//       }
//     } catch (err: any) {
//       console.error("Unexpected error:", err);
//       setError(`Unexpected error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCallsWithTranscripts();
//   }, [filter]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p>Loading calls...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="max-w-4xl mx-auto">
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//           <Button
//             onClick={fetchCallsWithTranscripts}
//             className="flex items-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold tracking-tight mb-2">Call Logs</h1>
//           <p className="text-muted-foreground">
//             View and manage all your organization's call history and transcripts
//           </p>
//         </div>

//         {/* Filter Controls */}
//         <div className="flex gap-4 mb-6">
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="border rounded p-2 bg-background min-w-[150px]"
//           >
//             <option value="all">All Calls</option>
//             <option value="active">Live Calls</option>
//             <option value="completed">Completed Calls</option>
//           </select>
//         </div>

//         {/* Calls Table */}
//         <CallsTable
//           calls={calls}
//           loading={loading}
//           onRefresh={fetchCallsWithTranscripts}
//         />
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { getUserWithOrg } from "@/utils/supabase/user";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle, RefreshCw } from "lucide-react";
// import { CallsTable } from "@/components/calls-table";
// import { CallWithTranscript } from "@/types/call";

// export default function CallsPage() {
//   const [calls, setCalls] = useState<CallWithTranscript[]>([]);
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [orgId, setOrgId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const supabase = createClient();

//   const fetchCallsWithTranscripts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Get user with organization
//       const { user, orgId, error } = await getUserWithOrg();

//       if (error || !orgId) {
//         console.error("Error fetching user org:", error);
//         setError(
//           "Failed to load organization data. Please try logging out and back in."
//         );
//         setLoading(false);
//         return;
//       }

//       setOrgId(orgId);

//       // First, fetch calls with organization filter
//       let callsQuery = supabase
//         .from("calls")
//         .select("*")
//         .eq("org_id", orgId)
//         .order("created_at", { ascending: false })
//         .limit(50);

//       // Apply filters
//       if (filter === "active") callsQuery = callsQuery.is("ended_at", null);
//       if (filter === "completed")
//         callsQuery = callsQuery.not("ended_at", "is", null);

//       const { data: callsData, error: callsError } = await callsQuery;

//       if (callsError) {
//         console.error("Error fetching calls:", callsError);
//         setError(`Failed to load calls: ${callsError.message}`);
//         setLoading(false);
//         return;
//       }
//       console.log("🚀 ~ Calls data:", callsData);

//       if (!callsData || callsData.length === 0) {
//         setCalls([]);
//         setLoading(false);
//         return;
//       }

//       // Get all call IDs to fetch transcripts
//       const callIds = callsData.map((call) => call.id);
//       console.log("🚀 ~ Call IDs to fetch transcripts for:", callIds);

//       // Fetch transcripts for these calls
//       const { data: transcriptsData, error: transcriptsError } = await supabase
//         .from("transcripts")
//         .select("*")
//         .in("call_id", callIds);

//       console.log("🚀 ~ Transcripts data:", transcriptsData);

//       if (transcriptsError) {
//         console.error("Error fetching transcripts:", transcriptsError);
//         // Continue with calls even if transcripts fail
//       }

//       // Create a map of call_id to transcript for easy lookup
//       const transcriptMap = new Map();
//       transcriptsData?.forEach((transcript) => {
//         transcriptMap.set(transcript.call_id, transcript);
//       });

//       console.log("🚀 ~ Transcript map:", transcriptMap);

//       // Combine calls with their transcripts
//       const callsWithTranscripts: CallWithTranscript[] = callsData.map(
//         (call) => {
//           const transcript = transcriptMap.get(call.id);
//           console.log(`🚀 ~ Call ${call.id} has transcript:`, !!transcript);
//           return {
//             ...call,
//             transcript: transcript || null,
//           };
//         }
//       );

//       console.log("🚀 ~ Final calls with transcripts:", callsWithTranscripts);
//       setCalls(callsWithTranscripts);
//     } catch (err: any) {
//       console.error("Unexpected error:", err);
//       setError(`Unexpected error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCallsWithTranscripts();
//   }, [filter]);

"use client";

// import { useEffect, useState } from "react";
// import { getUserWithOrg } from "@/utils/supabase/user";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle, RefreshCw } from "lucide-react";
// import { CallsTable } from "@/components/calls-table";
// import { CallWithTranscript } from "@/types/call";

export default function CallsPage() {
  // const [calls, setCalls] = useState<CallWithTranscript[]>([]);
  // const [filter, setFilter] = useState("all");
  // const [loading, setLoading] = useState(true);
  // const [orgId, setOrgId] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const supabase = createClient();

  // const fetchCallsWithTranscripts = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Get user with organization
  //     const { user, orgId, error } = await getUserWithOrg();

  //     if (error || !orgId) {
  //       console.error("Error fetching user org:", error);
  //       setError(
  //         "Failed to load organization data. Please try logging out and back in."
  //       );
  //       setLoading(false);
  //       return;
  //     }

  //     setOrgId(orgId);
  //     console.log("🚀 ~ Fetching calls for org:", orgId);

  //     // First, fetch calls with organization filter
  //     let callsQuery = supabase
  //       .from("calls")
  //       .select("*")
  //       .eq("org_id", orgId)
  //       .order("created_at", { ascending: false })
  //       .limit(50);

  //     // Apply filters
  //     if (filter === "active") callsQuery = callsQuery.is("ended_at", null);
  //     if (filter === "completed")
  //       callsQuery = callsQuery.not("ended_at", "is", null);

  //     const { data: callsData, error: callsError } = await callsQuery;

  //     if (callsError) {
  //       console.error("Error fetching calls:", callsError);
  //       setError(`Failed to load calls: ${callsError.message}`);
  //       setLoading(false);
  //       return;
  //     }

  //     console.log("🚀 ~ Calls data:", callsData);

  //     if (!callsData || callsData.length === 0) {
  //       console.log("🚀 ~ No calls found");
  //       setCalls([]);
  //       setLoading(false);
  //       return;
  //     }

  //     // Get all call IDs to fetch transcripts
  //     const callIds = callsData.map((call) => call.id);
  //     console.log("🚀 ~ Call IDs to fetch transcripts for:", callIds);

  //     // Fetch transcripts for these calls
  //     const { data: transcriptsData, error: transcriptsError } = await supabase
  //       .from("transcripts")
  //       .select("*")
  //       .in("call_id", callIds);

  //     if (transcriptsError) {
  //       console.error("Error fetching transcripts:", transcriptsError);
  //     }

  //     console.log("🚀 ~ Transcripts data:", transcriptsData);

  //     // Create a map of call_id to transcript for easy lookup
  //     const transcriptMap = new Map();
  //     transcriptsData?.forEach((transcript) => {
  //       transcriptMap.set(transcript.call_id, transcript);
  //     });

  //     console.log("🚀 ~ Transcript map:", transcriptMap);

  //     // Combine calls with their transcripts
  //     const callsWithTranscripts: CallWithTranscript[] = callsData.map(
  //       (call) => {
  //         const transcript = transcriptMap.get(call.id);
  //         console.log(`🚀 ~ Call ${call.id} has transcript:`, !!transcript);
  //         return {
  //           ...call,
  //           transcript: transcript || null,
  //         };
  //       }
  //     );

  //     console.log("🚀 ~ Final calls with transcripts:", callsWithTranscripts);
  //     setCalls(callsWithTranscripts);
  //   } catch (err: any) {
  //     console.error("Unexpected error:", err);
  //     setError(`Unexpected error: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCallsWithTranscripts();
  // }, [filter]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
  //         <p>Loading calls...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="container mx-auto py-8 px-4">
  //       <div className="max-w-4xl mx-auto">
  //         <Alert variant="destructive" className="mb-6">
  //           <AlertCircle className="h-4 w-4" />
  //           <AlertDescription>{error}</AlertDescription>
  //         </Alert>
  //         <Button
  //           onClick={fetchCallsWithTranscripts}
  //           className="flex items-center gap-2"
  //         >
  //           <RefreshCw className="h-4 w-4" />
  //           Try Again
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

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
          {/* <div className="flex gap-4 mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-sm p-2 bg-background min-w-[150px]"
            >
              <option value="all">All Calls</option>
              <option value="active">Live Calls</option>
              <option value="completed">Completed Calls</option>
            </select>
          </div> */}
        </div>

        {/* Calls Table */}
        {/* <CallsTable
          calls={calls}
          loading={loading}
          onRefresh={fetchCallsWithTranscripts}
        /> */}
      </div>
    </div>
  );
}
