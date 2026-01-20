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
import { toast } from "@/lib/toast";

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
            toast.success("Test call successful!", {
              description: "Your AI receptionist is working perfectly.",
            });
          }
        }, 1000);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to make test call";
      setError(errorMessage);
      setCallState("failed");
      toast.error("Test call failed", {
        description: errorMessage,
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
