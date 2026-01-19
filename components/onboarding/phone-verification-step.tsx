"use client";

import { useState, useEffect } from "react";
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
  Copy,
  Check,
  Smartphone,
  Sparkles,
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
  const [copied, setCopied] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const LOADING_MESSAGES = [
    "Securing your dedicated line...",
    "Configuring voice capabilities...",
    "Registering with carrier network...",
    "Warming up AI engine...",
    "Finalizing setup...",
  ];

  useEffect(() => {
    if (
      provisioningStatus === "pending" ||
      provisioningStatus === "in_progress"
    ) {
      const interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [provisioningStatus]);

  const handleCopyPhone = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Phone number copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <div className="w-full max-w-3xl mx-auto space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      {/* Hero heading */}
      <div className="text-center space-y-2 mb-2">
        {/* {isCompleted ? (
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-green-100 mb-1 shadow-sm animate-in zoom-in spin-in-12 duration-500">
            <Smartphone className="w-5 h-5 text-green-600" />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 mb-1 shadow-sm">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )} */}
        <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {isCompleted
            ? "Your AI Receptionist is Live!"
            : "Setting Up Your Line"}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          {isCompleted
            ? "Your dedicated business line is active. Give it a call to hear your AI agent in action."
            : "We're provisioning a dedicated phone number for your business. This usually takes less than a minute."}
        </p>
      </div>

      {/* Cards: Your Zevaux Number + Try asking (when completed) */}
      <div
        className={
          isCompleted
            ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
            : "max-w-md mx-auto"
        }
      >
        {/* Your Zevaux Number card */}
        <Card className="border shadow-md overflow-hidden flex flex-col relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          <div className="bg-muted/30 p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" />
                Your Number
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isCompleted
                  ? "Ready to receive calls"
                  : "Provisioning dedicated line..."}
              </p>
            </div>
            {isCompleted && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 animate-pulse text-[10px] px-1.5 py-0.5 h-5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
                Active
              </Badge>
            )}
          </div>
          <CardContent className="p-4 md:p-5 flex-1 flex flex-col justify-center items-center space-y-4">
            {provisioningStatus === "pending" ||
            provisioningStatus === "in_progress" ? (
              <div className="py-4 text-center space-y-3 w-full">
                <div className="relative mx-auto w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-3 border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-3 border-primary border-t-transparent animate-spin" />
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm text-foreground transition-all duration-500">
                    {LOADING_MESSAGES[loadingMsgIndex]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please don't close this page
                  </p>
                </div>
              </div>
            ) : null}

            {isCompleted && phoneNumber && (
              <div className="w-full space-y-4">
                <div className="group/number relative py-3 px-3 bg-muted rounded-lg shadow-inner border border-border text-center transition-transform hover:scale-[1.01] duration-200">
                  <div className="text-xl md:text-2xl font-mono font-bold tracking-wider text-primary">
                    {formatPhoneNumber(phoneNumber)}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopyPhone}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    title="Copy number"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>

                <div className="grid gap-2">
                  <Button
                    asChild
                    className="w-full h-10 text-sm font-medium shadow transition-all hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                  >
                    <a href={`tel:${phoneNumber}`}>
                      <Phone className="w-3.5 h-3.5 mr-2 animate-pulse" />
                      Test Call Now
                    </a>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Click to open on your phone
                  </p>
                </div>
              </div>
            )}

            {provisioningStatus === "failed" && (
              <div className="py-4 text-center space-y-3 w-full">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-base text-foreground">
                    Provisioning Issue
                  </p>
                  {provisioningError && (
                    <p className="text-xs text-destructive mt-1 bg-destructive/5 p-1.5 rounded">
                      {provisioningError}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Please try again or contact support.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Try asking Zevaux... - only when completed */}
        {isCompleted && (
          <Card className="border shadow-md overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-700 delay-150">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="bg-amber-50/50 p-4 border-b">
              <h3 className="text-sm font-bold flex items-center gap-2 text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Test Script
              </h3>
              <p className="text-xs text-amber-700/80 mt-0.5">
                Try asking these questions
              </p>
            </div>
            <CardContent className="p-4 md:p-5 flex-1 bg-gradient-to-b from-amber-50/30 to-transparent">
              <ul className="space-y-2">
                {[
                  `Tell me about ${businessName || "the business"}?`,
                  "What services do you offer?",
                  "Are you open tommorow?",
                ].map((question, i) => (
                  <li
                    key={i}
                    className="flex gap-3 p-2.5 bg-white rounded-lg shadow-sm border border-amber-100 hover:border-amber-200 transition-colors text-sm"
                  >
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] mt-0.5">
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-700 text-xs md:text-sm self-center leading-tight">
                      "{question}"
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22385 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Pro Tip:
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  The AI learns from every conversation. Don't worry if the
                  first call isn't perfect—it gets smarter with time!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-4 justify-between items-center border-t mt-12">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={loading || retrying}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Business Info
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
            size="lg"
            className="flex items-center gap-2 ml-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Next: Select Plan
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {(provisioningStatus === "pending" ||
          provisioningStatus === "in_progress") && (
          <p className="text-sm text-muted-foreground ml-auto self-center animate-pulse flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Configuring agent...
          </p>
        )}
      </div>
    </div>
  );
}
