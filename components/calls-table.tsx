// "use client";

// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Search, RefreshCw, Phone, PhoneOff, Play } from "lucide-react";
// import { TranscriptModal } from "./transcript-modal";
// import { AudioPlayerModal } from "./audio-player-modal";
// import { CallWithTranscript } from "@/types/call";

// interface CallsTableProps {
//   calls: CallWithTranscript[];
//   loading: boolean;
//   onRefresh: () => void;
// }

// export function CallsTable({ calls, loading, onRefresh }: CallsTableProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCall, setSelectedCall] = useState<CallWithTranscript | null>(null);
//   const [transcriptModalOpen, setTranscriptModalOpen] = useState(false);
//   const [audioModalOpen, setAudioModalOpen] = useState(false);
//   const [filteredCalls, setFilteredCalls] = useState<CallWithTranscript[]>(calls);

//   useEffect(() => {
//     const filtered = calls.filter(call =>
//       call.caller_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       call.transcript?.summary.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredCalls(filtered);
//   }, [searchTerm, calls]);

//   const handleViewTranscript = (call: CallWithTranscript) => {
//     setSelectedCall(call);
//     setTranscriptModalOpen(true);
//   };

//   const handlePlayRecording = (call: CallWithTranscript) => {
//     setSelectedCall(call);
//     setAudioModalOpen(true);
//   };

//   const getStatusBadge = (call: CallWithTranscript) => {
//     if (!call.ended_at) {
//       return <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>;
//     }
//     return <Badge variant="secondary">Completed</Badge>;
//   };

//   const formatDuration = (minutes: string | null) => {
//     if (!minutes) return "-";
//     const mins = parseFloat(minutes);
//     if (mins < 1) return "< 1 min";
//     return `${mins.toFixed(1)} min`;
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString();
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Call Logs</CardTitle>
//               <CardDescription>
//                 {filteredCalls.length} calls found
//                 {searchTerm && ` matching "${searchTerm}"`}
//               </CardDescription>
//             </div>
//             <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
//               <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Search Bar */}
//           <div className="mb-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by phone number or summary..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Caller</TableHead>
//                   <TableHead>Date & Time</TableHead>
//                   <TableHead>Duration</TableHead>
//                   <TableHead>Summary</TableHead>
//                   <TableHead>Recording</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredCalls.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-8">
//                       <div className="flex flex-col items-center gap-2 text-muted-foreground">
//                         <PhoneOff className="w-8 h-8" />
//                         <p>No calls found</p>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredCalls.map((call) => (
//                     <TableRow key={call.id} className="hover:bg-muted/50">
//                       <TableCell>
//                         {getStatusBadge(call)}
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         {call.caller_phone}
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           {formatDate(call.started_at)}
//                         </div>
//                         {call.ended_at && (
//                           <div className="text-xs text-muted-foreground">
//                             Ended: {formatDate(call.ended_at)}
//                           </div>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {formatDuration(call.minutes)}
//                       </TableCell>
//                       <TableCell>
//                         {call.transcript?.summary ? (
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleViewTranscript(call)}
//                             className="h-8 text-xs"
//                           >
//                             View Summary
//                           </Button>
//                         ) : (
//                           <span className="text-muted-foreground text-sm">No transcript</span>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => handlePlayRecording(call)}
//                           className="h-8 gap-1"
//                         >
//                           <Play className="w-3 h-3" />
//                           Play
//                         </Button>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleViewTranscript(call)}
//                             disabled={!call.transcript}
//                           >
//                             Transcript
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Modals */}
//       {selectedCall && (
//         <>
//           <TranscriptModal
//             call={selectedCall}
//             transcript={selectedCall.transcript}
//             isOpen={transcriptModalOpen}
//             onClose={() => setTranscriptModalOpen(false)}
//           />
//           <AudioPlayerModal
//             call={selectedCall}
//             isOpen={audioModalOpen}
//             onClose={() => setAudioModalOpen(false)}
//           />
//         </>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Phone, PhoneOff, Play } from "lucide-react";
import { TranscriptModal } from "./transcript-modal";
import { AudioPlayerModal } from "./audio-player-modal";
import { CallWithTranscript } from "@/types/call";

interface CallsTableProps {
  calls: CallWithTranscript[];
  loading: boolean;
  onRefresh: () => void;
}

export function CallsTable({ calls, loading, onRefresh }: CallsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallWithTranscript | null>(
    null
  );
  const [transcriptModalOpen, setTranscriptModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [filteredCalls, setFilteredCalls] =
    useState<CallWithTranscript[]>(calls);

  useEffect(() => {
    const filtered = calls.filter(
      (call) =>
        call.caller?.includes(searchTerm.toLowerCase()) ||
        // call.caller_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.transcript?.summary
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        call.transcript?.content
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredCalls(filtered);
  }, [searchTerm, calls]);

  const handleViewTranscript = (call: CallWithTranscript) => {
    setSelectedCall(call);
    setTranscriptModalOpen(true);
  };

  const handlePlayRecording = (call: CallWithTranscript) => {
    setSelectedCall(call);
    setAudioModalOpen(true);
  };

  const getStatusBadge = (call: CallWithTranscript) => {
    if (!call.end_time) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Live
        </Badge>
      );
    }
    return <Badge variant="secondary">Completed</Badge>;
  };

  const formatDuration = (minutes: string | null) => {
    if (!minutes) return "-";
    const mins = parseFloat(minutes);
    if (mins < 1) return "< 1 min";
    return `${mins.toFixed(1)} min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const hasTranscript = (call: CallWithTranscript) => {
    return (
      call.transcript && (call.transcript.summary || call.transcript.content)
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Call Logs</CardTitle>
              <CardDescription>
                {filteredCalls.length} calls found •{" "}
                {filteredCalls.filter((call) => hasTranscript(call)).length}{" "}
                with transcripts
                {searchTerm && ` matching "${searchTerm}"`}
              </CardDescription>
            </div>
            <Button
              onClick={onRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by phone number or transcript content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border border-accent focus:ring-0"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Caller</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Recording</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <PhoneOff className="w-8 h-8" />
                        <p>No calls found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCalls.map((call) => (
                    <TableRow key={call.id} className="hover:bg-muted/50">
                      <TableCell>{getStatusBadge(call)}</TableCell>
                      <TableCell className="font-medium">
                        {call.caller}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(call.start_time)}
                        </div>
                        {call.end_time && (
                          <div className="text-xs text-muted-foreground">
                            Ended: {formatDate(call.end_time)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDuration(call.minutes)}</TableCell>
                      <TableCell>
                        {hasTranscript(call) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTranscript(call)}
                            className="h-8 text-xs"
                          >
                            View Summary
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No transcript
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlayRecording(call)}
                          className="h-8 gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Play
                        </Button>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTranscript(call)}
                            disabled={!hasTranscript(call)}
                          >
                            Transcript
                          </Button>
                        </div>
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedCall && (
        <>
          <TranscriptModal
            call={selectedCall}
            transcript={selectedCall.transcript}
            isOpen={transcriptModalOpen}
            onClose={() => setTranscriptModalOpen(false)}
          />
          <AudioPlayerModal
            call={selectedCall}
            isOpen={audioModalOpen}
            onClose={() => setAudioModalOpen(false)}
          />
        </>
      )}
    </>
  );
}
