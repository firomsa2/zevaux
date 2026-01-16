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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhoneVerificationStepProps {
  businessId: string;
  phoneNumber: string | null;
  provisioningStatus: "pending" | "in_progress" | "completed" | "failed";
  provisioningError?: string | null;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
  onRetrySuccess?: (phoneNumber: string) => void;
}

export function PhoneVerificationStep({
  businessId,
  phoneNumber,
  provisioningStatus,
  provisioningError,
  onNext,
  onBack,
  loading = false,
  onRetrySuccess,
}: PhoneVerificationStepProps) {
  const { toast } = useToast();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const response = await fetch("/api/phone/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to retry phone provisioning",
          variant: "destructive",
        });
      } else {
        const data = await response.json();

        toast({
          title: "Success",
          description: "Phone provisioning request submitted",
        });

        // Use the callback if provided and phone number exists
        if (onRetrySuccess && data.phoneNumber) {
          onRetrySuccess(data.phoneNumber);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry phone provisioning",
        variant: "destructive",
      });
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Your Phone Number</CardTitle>
          <CardDescription>
            This is your zevaux AI receptionist phone number
          </CardDescription>
          {/* <CardDescription>
            We're provisioning a dedicated phone number for your AI receptionist
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Display */}
          <div className="bg-slate-50 rounded-lg p-6 text-center space-y-4">
            {provisioningStatus === "pending" && (
              <>
                <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                <div>
                  <p className="font-semibold text-lg">
                    Setting up your number
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This usually takes 30-60 seconds...
                  </p>
                </div>
              </>
            )}

            {provisioningStatus === "in_progress" && (
              <>
                <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                <div>
                  <p className="font-semibold text-lg">
                    Provisioning in progress
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your dedicated phone number is being configured...
                  </p>
                </div>
              </>
            )}

            {provisioningStatus === "completed" && phoneNumber && (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Number Ready!</p>
                  <p className="text-4xl font-bold text-green-600 mt-3">
                    {phoneNumber}
                  </p>
                  <p className="text-sm text-muted-foreground mt-3">
                    Your dedicated AI receptionist number is ready to use
                  </p>
                </div>
              </>
            )}

            {provisioningStatus === "failed" && (
              <>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Provisioning Failed</p>
                  {provisioningError && (
                    <p className="text-sm text-red-600 mt-2">
                      {provisioningError}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-3">
                    Please try again or contact support
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            {/* <p className="text-sm text-blue-900">
              <strong>What happens next:</strong> After you verify this number,
              you'll be able to test calling your AI receptionist to make sure
              everything works perfectly before going live.
            </p> */}
            <p className="text-sm text-blue-900">
              You can forward your existing business phone number to this new
              zevaux AI receptionist number. This way, all calls to your
              business number will be answered by your AI receptionist.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={loading || retrying}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {provisioningStatus === "failed" && (
              <Button
                onClick={handleRetry}
                disabled={loading || retrying}
                className="flex items-center gap-2"
              >
                {retrying ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  "Retry"
                )}
              </Button>
            )}

            {provisioningStatus === "completed" && (
              <Button
                onClick={onNext}
                disabled={loading}
                className="flex items-center gap-2 ml-auto"
              >
                Next: Test Call
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {(provisioningStatus === "pending" ||
              provisioningStatus === "in_progress") && (
              <div className="ml-auto">
                <p className="text-sm text-muted-foreground">
                  Checking status... don't close this window
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
