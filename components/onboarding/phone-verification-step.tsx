"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

interface PhoneVerificationStepProps {
  businessId: string;
  phoneNumber: string | null;
  provisioningStatus: "pending" | "in_progress" | "completed" | "failed";
  provisioningError?: string | null;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
  onRetrySuccess?: (phoneNumber: string) => void;
  businessName?: string;
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
  businessName,
}: PhoneVerificationStepProps) {
  const { toast } = useToast();
  const [retrying, setRetrying] = useState(false);
  const [testCallInput, setTestCallInput] = useState("");
  const [allowedTestNumbers, setAllowedTestNumbers] = useState<string[]>([]);

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
        if (onRetrySuccess && data.phoneNumber) {
          onRetrySuccess(data.phoneNumber);
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to retry phone provisioning",
        variant: "destructive",
      });
    } finally {
      setRetrying(false);
    }
  };

  const handleAddTestNumber = () => {
    const trimmed = testCallInput.trim();
    if (!trimmed) {
      toast({
        title: "Enter a number",
        description: "Please enter a phone number to allow test calls from.",
        variant: "destructive",
      });
      return;
    }
    setAllowedTestNumbers((prev) => [...prev, trimmed]);
    setTestCallInput("");
  };

  const removeTestNumber = (index: number) => {
    setAllowedTestNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  const isCompleted = provisioningStatus === "completed" && phoneNumber;

  return (
    <div className="w-full space-y-6">
      {/* Hero heading */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Your agent is ready. Make your first test call.
        </h2>
        <p className="text-muted-foreground">
          Know what your callers will hear when they call.
        </p>
      </div>

      {/* Info text - only when we have a number */}
      {/* {isCompleted && (
        <p className="text-sm text-muted-foreground text-center max-w-xl mx-auto">
          Only you can call your Zevaux agent. No external callers will be able
          to reach the agent until you go live.
        </p>
      )} */}

      {/* Cards: Your Zevaux Number + Try asking (when completed) */}
      <div
        className={
          isCompleted
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : "space-y-6"
        }
      >
        {/* Your Zevaux Number card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Your Zevaux Number</CardTitle>
            <CardDescription>
              {isCompleted
                ? "Call this number to test your AI receptionist"
                : "Your dedicated AI receptionist phone number"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {provisioningStatus === "pending" && (
              <div className="py-8 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Setting up your number</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This usually takes 30–60 seconds…
                  </p>
                </div>
              </div>
            )}

            {provisioningStatus === "in_progress" && (
              <div className="py-8 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Provisioning in progress</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your dedicated phone number is being configured…
                  </p>
                </div>
              </div>
            )}

            {isCompleted && phoneNumber && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <a href={`tel:${phoneNumber}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                  <span className="font-mono text-lg font-semibold">
                    {formatPhoneNumber(phoneNumber)}
                  </span>
                </div>

                {/* <Link
                  href="/dashboard/phone-numbers"
                  className="text-sm text-primary hover:underline block"
                >
                  Request local area code
                </Link> */}

                {/* <div className="space-y-2">
                  <label className="text-sm font-medium">Allow test calls from:</label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={testCallInput}
                      onChange={(e) => setTestCallInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), handleAddTestNumber())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddTestNumber}
                      title="Add number"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {allowedTestNumbers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {allowedTestNumbers.map((num, i) => (
                        <Badge
                          key={`${num}-${i}`}
                          variant="secondary"
                          className="pl-2 pr-1 py-1 gap-1"
                        >
                          {formatPhoneNumber(num)}
                          <button
                            type="button"
                            onClick={() => removeTestNumber(i)}
                            className="rounded-full hover:bg-muted p-0.5"
                            aria-label="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div> */}
              </div>
            )}

            {provisioningStatus === "failed" && (
              <div className="py-6 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                <div>
                  <p className="font-semibold text-lg">Provisioning failed</p>
                  {provisioningError && (
                    <p className="text-sm text-destructive mt-2">
                      {provisioningError}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-3">
                    Please try again or contact support.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Try asking Zevaux... - only when completed */}
        {isCompleted && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Try asking Zevaux…</CardTitle>
              <CardDescription>
                Example questions to test your AI receptionist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm">
                  <span className="text-muted-foreground font-medium">Q</span>
                  <span>Tell me about {businessName || "your business"}?</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-muted-foreground font-medium">Q</span>
                  <span>What services do you offer?</span>
                </li>
                <li className="flex gap-2 text-sm">
                  <span className="text-muted-foreground font-medium">Q</span>
                  <span>Are you open tomorrow?</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA when completed */}
      {/* {isCompleted && (
        <p className="text-center text-sm text-muted-foreground">
          Choose a live plan to accept customer calls.
        </p>
      )} */}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading || retrying}
          className="flex items-center gap-2"
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
                <Loader2 className="w-4 h-4 animate-spin" />
                Retrying…
              </>
            ) : (
              "Retry"
            )}
          </Button>
        )}

        {isCompleted && (
          <Button
            onClick={onNext}
            disabled={loading}
            className="flex items-center gap-2 ml-auto"
          >
            Next: Select Plan
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {(provisioningStatus === "pending" ||
          provisioningStatus === "in_progress") && (
          <p className="text-sm text-muted-foreground ml-auto self-center">
            Checking status… don&apos;t close this window
          </p>
        )}
      </div>
    </div>
  );
}
