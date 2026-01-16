"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Zap, Clock } from "lucide-react";

interface PhoneSetupStepProps {
  businessId: string;
  onPhoneProvisioned: (phoneNumber: string) => void;
}

type ProvisioningStep =
  | "idle"
  | "requesting"
  | "provisioning"
  | "completed"
  | "failed";

export function PhoneSetupStep({
  businessId,
  onPhoneProvisioned,
}: PhoneSetupStepProps) {
  const [step, setStep] = useState<ProvisioningStep>("idle");
  const [provisioningPhoneNumber, setProvisioningPhoneNumber] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const router = useRouter();

  // CHANGED: Auto-request phone number on component mount for seamless UX
  useEffect(() => {
    const requestPhoneNumber = async () => {
      if (step !== "idle") return;

      setStep("requesting");
      setError(null);

      try {
        // Call API to request phone number provisioning
        const response = await fetch("/api/phone/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to request phone number");
        }

        const { phoneNumber } = await response.json();
        setProvisioningPhoneNumber(phoneNumber);
        setStep("provisioning");

        // Start polling for completion
        pollForCompletion(phoneNumber);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to request phone number"
        );
        setStep("failed");
      }
    };

    requestPhoneNumber();
  }, [businessId, step]);

  // CHANGED: Poll for phone provisioning completion with exponential backoff
  const pollForCompletion = async (phoneNumber: string) => {
    let pollAttempts = 0;
    const maxAttempts = 20; // Poll for up to 2 minutes (6 seconds * 20)

    const poll = async () => {
      pollAttempts++;
      setPollCount(pollAttempts);

      try {
        const response = await fetch(`/api/phone/status/${businessId}`);

        if (!response.ok) {
          throw new Error("Failed to check phone status");
        }

        const { status, phoneNumber: assignedNumber } = await response.json();

        if (status === "active" && assignedNumber) {
          setProvisioningPhoneNumber(assignedNumber);
          setStep("completed");
          onPhoneProvisioned(assignedNumber);
          return;
        }

        if (pollAttempts < maxAttempts) {
          // Exponential backoff: wait longer as attempts increase
          const waitTime = Math.min(1000 + pollAttempts * 500, 6000);
          setTimeout(poll, waitTime);
        } else {
          setError("Phone provisioning timed out. Please try again.");
          setStep("failed");
        }
      } catch (err) {
        if (pollAttempts < maxAttempts) {
          const waitTime = Math.min(1000 + pollAttempts * 500, 6000);
          setTimeout(poll, waitTime);
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to provision phone"
          );
          setStep("failed");
        }
      }
    };

    poll();
  };

  const handleRetry = () => {
    setStep("idle");
    setError(null);
    setPollCount(0);
    setProvisioningPhoneNumber(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
          Phone Number Setup
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Your customers will call this number to reach your AI receptionist.
          We're provisioning a dedicated number for you automatically.
        </p>
      </div>

      {/* Provisioning Status Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {step === "idle" && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            )}
            {step === "requesting" && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            )}
            {step === "provisioning" && (
              <Zap className="h-5 w-5 text-amber-600" />
            )}
            {step === "completed" && (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}
            {step === "failed" && (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span>
              {step === "idle" && "Requesting phone number..."}
              {step === "requesting" && "Requesting phone number..."}
              {step === "provisioning" && "Provisioning in progress"}
              {step === "completed" && "Phone number ready!"}
              {step === "failed" && "Provisioning failed"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "requesting" && (
            <div className="space-y-2">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                We're requesting a phone number for your business...
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full animate-pulse"
                  style={{ width: "30%" }}
                ></div>
              </div>
            </div>
          )}

          {step === "provisioning" && provisioningPhoneNumber && (
            <div className="space-y-3">
              <div className="rounded-lg bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  Phone Number
                </p>
                <p className="text-lg font-mono font-semibold text-slate-900 dark:text-white">
                  {provisioningPhoneNumber}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                  Activating your number... (attempt {pollCount}/20)
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full transition-all duration-500"
                    style={{ width: `${(pollCount / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                This typically takes 30-60 seconds. We're checking every few
                seconds for activation.
              </p>
            </div>
          )}

          {step === "completed" && provisioningPhoneNumber && (
            <div className="space-y-4">
              <div className="rounded-lg bg-white dark:bg-slate-900/50 p-4 border-2 border-green-200 dark:border-green-900">
                <p className="text-xs text-green-700 dark:text-green-400 mb-1">
                  Your Dedicated Phone Number
                </p>
                <p className="text-2xl font-mono font-bold text-green-700 dark:text-green-400">
                  {provisioningPhoneNumber}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                  ✓ Active and ready to receive calls
                </p>
              </div>
              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4">
                <p className="text-sm text-green-900 dark:text-green-200 font-medium">
                  What happens next?
                </p>
                <ul className="text-sm text-green-800 dark:text-green-300 mt-2 space-y-1">
                  <li>✓ Your AI receptionist is ready to answer calls</li>
                  <li>✓ Calls will be routed based on your configuration</li>
                  <li>✓ You can update settings anytime from your dashboard</li>
                </ul>
              </div>
            </div>
          )}

          {step === "failed" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4">
                <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-2">
                  Provisioning Failed
                </p>
                <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                  {error}
                </p>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Cards */}
      {step !== "completed" && (
        <>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              How Phone Provisioning Works
            </h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex gap-2">
                <span className="font-bold text-blue-600 dark:text-blue-400 min-w-fit">
                  1.
                </span>
                <span>
                  We request a dedicated phone number for your business
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600 dark:text-blue-400 min-w-fit">
                  2.
                </span>
                <span>
                  The number is provisioned through our telecom partners
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600 dark:text-blue-400 min-w-fit">
                  3.
                </span>
                <span>Once active, it's linked to your AI receptionist</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Expected Timeline
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                  Most phone numbers are activated within 30-60 seconds. We'll
                  continue checking in the background.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
