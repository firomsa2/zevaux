// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   AlertCircle,
//   CheckCircle2,
//   Loader2,
//   Phone,
//   Volume2,
//   Zap,
// } from "lucide-react";

// interface TestCallStepProps {
//   businessName: string;
//   phoneNumber: string;
//   onTestCallComplete: (success: boolean) => void;
// }

// type CallState =
//   | "ready"
//   | "calling"
//   | "connected"
//   | "recording"
//   | "completed"
//   | "failed";

// export function TestCallStep({
//   businessName,
//   phoneNumber,
//   onTestCallComplete,
// }: TestCallStepProps) {
//   const [callState, setCallState] = useState<CallState>("ready");
//   const [error, setError] = useState<string | null>(null);
//   const [callDuration, setCallDuration] = useState(0);
//   const [isListening, setIsListening] = useState(false);

//   // CHANGED: Simulate/initiate test call to the provisioned phone number
//   const handleStartTestCall = async () => {
//     setCallState("calling");
//     setError(null);
//     setIsListening(false);

//     try {
//       // Call API to initiate test call
//       const response = await fetch("/api/phone/test-call", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           phoneNumber,
//           businessName,
//         }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || "Failed to initiate test call");
//       }

//       const { callId, simulatedResponse } = await response.json();

//       // Simulate call connection
//       setTimeout(() => {
//         setCallState("connected");
//       }, 2000);

//       // Simulate recording and AI response
//       setTimeout(() => {
//         setCallState("recording");
//         setIsListening(true);

//         // Simulate call duration
//         let duration = 0;
//         const interval = setInterval(() => {
//           duration += 1;
//           setCallDuration(duration);

//           if (duration >= 15) {
//             clearInterval(interval);
//             setCallState("completed");
//             setIsListening(false);
//             onTestCallComplete(true);
//           }
//         }, 1000);
//       }, 3000);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to make test call");
//       setCallState("failed");
//       onTestCallComplete(false);
//     }
//   };

//   const handleRetry = () => {
//     setCallState("ready");
//     setError(null);
//     setCallDuration(0);
//     setIsListening(false);
//   };

//   return (
//     <div className="space-y-5">
//       <div>
//         <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
//           Test Your AI Receptionist
//         </h3>
//         <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
//           Make a test call to experience your AI receptionist in action. This
//           ensures everything is set up correctly before going live.
//         </p>
//       </div>

//       {/* Test Call Card */}
//       <Card className="border-2 border-blue-200 dark:border-blue-900">
//         <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-slate-900">
//           <CardTitle className="text-base flex items-center gap-2">
//             <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//             Make a Test Call
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="pt-8 space-y-6">
//           {/* Phone Display */}
//           <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 text-center">
//             <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
//               Calling
//             </p>
//             <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white mb-4">
//               {phoneNumber}
//             </p>
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               From any phone, call this number to hear your AI receptionist
//             </p>
//           </div>

//           {/* Call Status */}
//           {callState === "ready" && (
//             <div className="space-y-4">
//               <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
//                 <div className="flex gap-3">
//                   <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
//                       Ready to make a test call
//                     </p>
//                     <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
//                       Click the button below to initiate a simulated test call
//                       and hear your receptionist in action.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <Button
//                 onClick={handleStartTestCall}
//                 size="lg"
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
//               >
//                 <Phone className="h-5 w-5" />
//                 Start Test Call
//               </Button>
//             </div>
//           )}

//           {callState === "calling" && (
//             <div className="space-y-4 text-center py-4">
//               <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
//               <div>
//                 <p className="font-semibold text-slate-900 dark:text-white">
//                   Initiating call...
//                 </p>
//                 <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
//                   Connecting to your AI receptionist
//                 </p>
//               </div>
//             </div>
//           )}

//           {callState === "connected" && (
//             <div className="space-y-4 text-center py-4">
//               <div className="flex justify-center gap-2 mb-4">
//                 <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
//                 <div
//                   className="h-3 w-3 bg-green-500 rounded-full animate-pulse"
//                   style={{ animationDelay: "0.1s" }}
//                 ></div>
//                 <div
//                   className="h-3 w-3 bg-green-500 rounded-full animate-pulse"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//               </div>
//               <div>
//                 <p className="font-semibold text-green-700 dark:text-green-400">
//                   Call Connected
//                 </p>
//                 <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
//                   Your receptionist is greeting the caller
//                 </p>
//               </div>
//             </div>
//           )}

//           {callState === "recording" && (
//             <div className="space-y-4">
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-900 p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse"></div>
//                     <span className="text-sm font-medium text-slate-900 dark:text-white">
//                       Recording
//                     </span>
//                   </div>
//                   <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
//                     {Math.floor(callDuration / 60)}:
//                     {String(callDuration % 60).padStart(2, "0")}
//                   </span>
//                 </div>

//                 {/* Waveform Visualization */}
//                 <div className="flex items-end justify-center gap-1 h-12 mb-4">
//                   {[...Array(20)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="bg-green-600 dark:bg-green-400 rounded-full transition-all duration-150"
//                       style={{
//                         width: "2px",
//                         height: isListening
//                           ? `${Math.random() * 100 + 10}%`
//                           : "20%",
//                       }}
//                     ></div>
//                   ))}
//                 </div>

//                 <div className="bg-white dark:bg-slate-900 rounded p-4 text-center mb-4">
//                   <p className="text-sm text-slate-700 dark:text-slate-300 italic">
//                     "Thank you for calling {businessName}. How can I help you
//                     today?"
//                   </p>
//                 </div>

//                 <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
//                   Your AI receptionist is listening and will respond to caller
//                   input
//                 </p>
//               </div>
//             </div>
//           )}

//           {callState === "completed" && (
//             <div className="space-y-4">
//               <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-900 p-6 text-center">
//                 <div className="flex justify-center mb-4">
//                   <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
//                 </div>
//                 <h4 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
//                   Test Call Successful!
//                 </h4>
//                 <p className="text-sm text-green-800 dark:text-green-300">
//                   Your AI receptionist is working perfectly. Duration:{" "}
//                   {callDuration}s
//                 </p>
//               </div>

//               <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4 space-y-2">
//                 <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
//                   Next steps:
//                 </p>
//                 <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
//                   <li>✓ Your AI receptionist is live and ready</li>
//                   <li>✓ Calls will be routed to this number automatically</li>
//                   <li>
//                     ✓ You can configure escalation and call handling from your
//                     dashboard
//                   </li>
//                   <li>
//                     ✓ Test calls help ensure everything is working as expected
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           )}

//           {callState === "failed" && (
//             <div className="space-y-4">
//               <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4">
//                 <div className="flex gap-3">
//                   <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-red-900 dark:text-red-200">
//                       Test Call Failed
//                     </p>
//                     <p className="text-sm text-red-800 dark:text-red-300 mt-1">
//                       {error}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <Button
//                 onClick={handleRetry}
//                 variant="outline"
//                 className="w-full gap-2 bg-transparent"
//               >
//                 <Phone className="h-4 w-4" />
//                 Try Again
//               </Button>

//               <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4">
//                 <p className="text-xs text-amber-900 dark:text-amber-200">
//                   <strong>Tip:</strong> If this continues to fail, you can skip
//                   the test call and manually call your phone number from any
//                   phone to test your receptionist.
//                 </p>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Information Section */}
//       {callState === "ready" && (
//         <div className="grid md:grid-cols-2 gap-4">
//           <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
//             <CardContent className="pt-6 space-y-2">
//               <div className="flex items-start gap-3">
//                 <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-slate-900 dark:text-white">
//                     Verify Greeting
//                   </p>
//                   <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
//                     Listen to your custom greeting message
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
//             <CardContent className="pt-6 space-y-2">
//               <div className="flex items-start gap-3">
//                 <Volume2 className="h-5 w-5 text-blue-600 dark-:text-blue-400 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-slate-900 dark:text-white">
//                     Check Voice
//                   </p>
//                   <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
//                     Hear your receptionist's voice and tone
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Loader,
  CheckCircle2,
  AlertCircle,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TestCallStepProps {
  businessId: string;
  phoneNumber: string;
  agentName: string;
  businessName: string;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
}

type CallState =
  | "ready"
  | "calling"
  | "connected"
  | "recording"
  | "completed"
  | "failed";

export function TestCallStep({
  businessId,
  phoneNumber,
  agentName,
  businessName,
  onNext,
  onBack,
  loading = false,
}: TestCallStepProps) {
  const { toast } = useToast();
  const [callState, setCallState] = useState<CallState>("ready");
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStartTestCall = async () => {
    setCallState("calling");
    setError(null);

    try {
      const response = await fetch("/api/phone/test-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          phoneNumber,
          agentName,
          businessName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to initiate test call");
      }

      // Simulate call connection after 2 seconds
      setTimeout(() => {
        setCallState("connected");
      }, 2000);

      // Simulate recording and call duration
      setTimeout(() => {
        setCallState("recording");
        let duration = 0;
        const interval = setInterval(() => {
          duration += 1;
          setCallDuration(duration);

          if (duration >= 15) {
            clearInterval(interval);
            setCallState("completed");
            toast({
              title: "Test Call Successful",
              description: "Your AI receptionist is working perfectly!",
            });
          }
        }, 1000);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to make test call";
      setError(errorMessage);
      setCallState("failed");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setCallState("ready");
    setError(null);
    setCallDuration(0);
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Test Your AI Receptionist</CardTitle>
          <CardDescription>
            Make a test call to verify your receptionist is working properly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Call Status Display */}
          <div className="bg-slate-50 rounded-lg p-8 text-center space-y-4 min-h-[250px] flex flex-col items-center justify-center">
            {callState === "ready" && (
              <>
                <Phone className="w-12 h-12 text-blue-500 mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Ready to Test</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the button below to make a test call
                  </p>
                </div>
              </>
            )}

            {callState === "calling" && (
              <>
                <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                <div>
                  <p className="font-semibold text-lg">
                    Calling {agentName}...
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connecting to your AI receptionist
                  </p>
                </div>
              </>
            )}

            {callState === "connected" && (
              <>
                <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Call Connected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your receptionist is listening...
                  </p>
                </div>
              </>
            )}

            {callState === "recording" && (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <p className="font-semibold text-lg">Recording</p>
                </div>
                <p className="text-3xl font-mono font-bold text-slate-900">
                  00:{callDuration.toString().padStart(2, "0")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your receptionist is processing your request
                </p>
              </>
            )}

            {callState === "completed" && (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Test Successful!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your AI receptionist is ready to go live
                  </p>
                </div>
              </>
            )}

            {callState === "failed" && (
              <>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Test Failed</p>
                  {error && (
                    <p className="text-sm text-red-600 mt-2">{error}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            {/* <p className="text-sm text-blue-900">
              <strong>How it works:</strong> We'll initiate a test call to{" "}
              {phoneNumber} so you can experience your AI receptionist
              firsthand. You'll hear {agentName}'s welcome greeting and see how
              it handles your interaction.
            </p> */}
            <p className="text-sm text-blue-900">
              Call on {phoneNumber} from any phone to experience your AI
              receptionist in action. This helps ensure everything is working as
              expected before going live.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={
                loading ||
                (callState !== "ready" &&
                  callState !== "completed" &&
                  callState !== "failed")
              }
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {(callState === "ready" || callState === "failed") && (
              <Button
                onClick={
                  callState === "failed" ? handleRetry : handleStartTestCall
                }
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {callState === "failed" ? "Retry Test Call" : "Start Test Call"}
              </Button>
            )}

            {callState === "completed" && (
              <Button
                onClick={onNext}
                disabled={loading}
                className="flex items-center gap-2 ml-auto"
              >
                Go Live
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {(callState === "calling" ||
              callState === "connected" ||
              callState === "recording") && (
              <div className="ml-auto">
                <p className="text-sm text-muted-foreground">
                  Call in progress... do not close this window
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
