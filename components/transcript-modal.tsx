// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { MessageSquare, FileText, Download } from "lucide-react";

// interface TranscriptModalProps {
//   call: any;
//   transcript: any;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function TranscriptModal({
//   call,
//   transcript,
//   isOpen,
//   onClose,
// }: TranscriptModalProps) {
//   const [activeTab, setActiveTab] = useState("summary");

//   const parseTranscript = (content: string) => {
//     return content
//       .split("\n")
//       .filter((line) => line.trim())
//       .map((line, index) => {
//         const [speaker, ...messageParts] = line.split(":");
//         const message = messageParts.join(":").trim();

//         return {
//           id: index,
//           speaker: speaker.trim(),
//           message: message,
//           isAI:
//             speaker.trim().toLowerCase().includes("ai") ||
//             speaker.trim().toLowerCase().includes("assistant"),
//         };
//       });
//   };

//   const downloadTranscript = () => {
//     if (!transcript?.content) return;

//     const element = document.createElement("a");
//     const file = new Blob([transcript.content], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = `transcript-${call.caller_phone}-${call.started_at}.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   const messageCount = transcript?.content
//     ? transcript.content.split("\n").filter((line: string) => line.trim())
//         .length
//     : 0;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <MessageSquare className="w-5 h-5" />
//             Call Transcript
//           </DialogTitle>
//           <DialogDescription>
//             Call with {call.caller_phone} on{" "}
//             {new Date(call.started_at).toLocaleString()}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Call Info */}
//           <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
//             <div className="flex items-center gap-4">
//               <Badge variant={call.ended_at ? "secondary" : "default"}>
//                 {call.ended_at ? "Completed" : "Active"}
//               </Badge>
//               <span className="text-sm">
//                 Duration:{" "}
//                 {call.minutes
//                   ? `${parseFloat(call.minutes).toFixed(1)} min`
//                   : "Ongoing"}
//               </span>
//               <span className="text-sm">Messages: {messageCount}</span>
//             </div>
//             <Button variant="outline" size="sm" onClick={downloadTranscript}>
//               <Download className="w-4 h-4 mr-2" />
//               Download
//             </Button>
//           </div>

//           {/* Tabs */}
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="summary" className="flex items-center gap-2">
//                 <FileText className="w-4 h-4" />
//                 Summary
//               </TabsTrigger>
//               <TabsTrigger value="full" className="flex items-center gap-2">
//                 <MessageSquare className="w-4 h-4" />
//                 Full Transcript
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="summary" className="space-y-4">
//               <div className="p-4 bg-muted rounded-lg">
//                 <h4 className="font-semibold mb-2">Summary</h4>
//                 <p className="text-sm leading-relaxed">
//                   {transcript?.summary || "No summary available."}
//                 </p>
//               </div>
//             </TabsContent>

//             <TabsContent value="full">
//               <ScrollArea className="h-[400px] rounded-lg border">
//                 <div className="p-4 space-y-4">
//                   {transcript?.content ? (
//                     parseTranscript(transcript.content).map((message) => (
//                       <div
//                         key={message.id}
//                         className={`flex gap-3 ${
//                           message.isAI ? "flex-row-reverse" : "flex-row"
//                         }`}
//                       >
//                         <div
//                           className={`flex-1 max-w-[80%] p-3 rounded-lg ${
//                             message.isAI
//                               ? "bg-primary text-primary-foreground"
//                               : "bg-muted"
//                           }`}
//                         >
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="text-xs font-medium opacity-70">
//                               {message.speaker}
//                             </span>
//                           </div>
//                           <p className="text-sm">{message.message}</p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No transcript available for this call.
//                     </div>
//                   )}
//                 </div>
//               </ScrollArea>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, Download, AlertCircle } from "lucide-react";

interface TranscriptModalProps {
  call: any;
  transcript: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TranscriptModal({
  call,
  transcript,
  isOpen,
  onClose,
}: TranscriptModalProps) {
  const [activeTab, setActiveTab] = useState("summary");

  const parseTranscript = (content: string) => {
    if (!content) return [];

    return content
      .split("\n")
      .filter((line) => line.trim())
      .map((line, index) => {
        const [speaker, ...messageParts] = line.split(":");
        const message = messageParts.join(":").trim();

        return {
          id: index,
          speaker: speaker?.trim() || "Unknown",
          message: message,
          isAI:
            speaker?.trim().toLowerCase().includes("ai") ||
            speaker?.trim().toLowerCase().includes("assistant"),
        };
      });
  };

  const downloadTranscript = () => {
    if (!transcript?.content) return;

    const element = document.createElement("a");
    const file = new Blob([transcript.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${call.caller_phone}-${call.started_at}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const messageCount = transcript?.content
    ? transcript.content.split("\n").filter((line: string) => line.trim())
        .length
    : 0;

  if (!transcript) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              No Transcript Available
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              No transcript was found for this call.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Call Transcript
          </DialogTitle>
          <DialogDescription>
            Call with {call.caller_phone} on{" "}
            {new Date(call.started_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Call Info */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <Badge variant={call.ended_at ? "secondary" : "default"}>
                {call.ended_at ? "Completed" : "Active"}
              </Badge>
              <span className="text-sm">
                Duration:{" "}
                {call.minutes
                  ? `${parseFloat(call.minutes).toFixed(1)} min`
                  : "Ongoing"}
              </span>
              <span className="text-sm">Messages: {messageCount}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTranscript}
              disabled={!transcript?.content}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="full" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Full Transcript
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Summary</h4>
                <p className="text-sm leading-relaxed">
                  {transcript?.summary || "No summary available."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="full">
              <ScrollArea className="h-[400px] rounded-lg border">
                <div className="p-4 space-y-4">
                  {transcript?.content ? (
                    parseTranscript(transcript.content).map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.isAI ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`flex-1 max-w-[80%] p-3 rounded-lg ${
                            message.isAI
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium opacity-70">
                              {message.speaker}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No transcript content available.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
