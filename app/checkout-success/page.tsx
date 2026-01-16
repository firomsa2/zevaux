"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const completeCheckout = async () => {
      if (!sessionId) {
        setStatus("error");
        setMessage("No session ID found. Please contact support.");
        return;
      }

      try {
        const response = await fetch("/api/checkout-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Failed to process checkout");
          return;
        }

        setStatus("success");
        setMessage("Payment successful! Setting up your account...");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("[v0] Checkout completion error:", error);
        setStatus("error");
        setMessage("An error occurred. Please try again.");
      }
    };

    completeCheckout();
  }, [sessionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Processing</CardTitle>
          <CardDescription className="text-center">
            Please wait while we complete your setup
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">
                Processing your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Redirecting to your dashboard...
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center space-y-4">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {message}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="flex-1"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => router.push("/onboarding/business-setup")}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
