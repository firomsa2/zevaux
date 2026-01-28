"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Loader2,
  Sparkles,
  Search,
  Zap,
  Clock,
  CheckCircle2,
  BrainCircuit,
  Bot,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface WebsiteTrainingStepProps {
  businessId: string;
  userId?: string; // Optional for embedded context
  onComplete?: (url: string) => Promise<void>; // Optional callback for wizard context
  embedded?: boolean; // If true, adjust styling for wizard context
}

type TrainingStep = "idle" | "analyzing" | "training" | "completed";

export function WebsiteTrainingStep({
  businessId,
  userId,
  onComplete,
  embedded = false,
}: WebsiteTrainingStepProps) {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<TrainingStep>("idle");
  const [loading, setLoading] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Training checklist items state
  const [checklist, setChecklist] = useState({
    analyzing: false,
    processing: false,
    optimizing: false,
    generating: false,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "training") {
      let progress = 0;

      interval = setInterval(() => {
        progress += 1; // slower progress for better effect
        setTrainingProgress(Math.min(progress, 100));

        // Update checklist based on progress
        if (progress > 10)
          setChecklist((prev) => ({ ...prev, analyzing: true }));
        if (progress > 40)
          setChecklist((prev) => ({ ...prev, processing: true }));
        if (progress > 70)
          setChecklist((prev) => ({ ...prev, optimizing: true }));
        if (progress >= 100) {
          setChecklist((prev) => ({ ...prev, generating: true }));
          clearInterval(interval);
          setTimeout(() => setStep("completed"), 500);
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let formattedUrl = url;
    if (!formattedUrl.startsWith("http")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setLoading(true);
    setError(null);

    try {
      // Show success toast when analysis starts
      toast.success("Website analysis started", {
        description: "We're analyzing your website structure...",
      });

      // Call API to start analysis
      const response = await fetch("/api/onboarding/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, url: formattedUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Failed to start website analysis",
        );
      }

      // Mark progress immediately after successful API call
      try {
        const markResponse = await fetch("/api/onboarding/mark-website-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId }),
        });

        if (!markResponse.ok) {
          console.warn("Failed to mark progress immediately, webhook will update it");
        }
      } catch (markError) {
        console.warn("Error marking progress:", markError);
        // Continue anyway - webhook will update it
      }

      // Simulate API call delay for effect, then show training animation
      setTimeout(() => {
        setLoading(false);
        setStep("training");
      }, 1500);
    } catch (err) {
      console.error("Error analyzing website:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze website";
      setError(errorMessage);
      toast.error("Analysis failed", {
        description: errorMessage,
      });
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    // Only allow continue if training is actually completed
    if (step !== "completed") {
      toast.info("Training in progress", {
        description: "Please wait for training to complete.",
      });
      return;
    }

    setContinueLoading(true);

    try {
      // If onComplete callback is provided (wizard context), use it
      if (onComplete) {
        toast.success("Website training complete!", {
          description: "Your business information has been analyzed.",
        });
        await onComplete(url);
        return;
      }

      // Otherwise, mark progress and redirect (standalone context)
      const response = await fetch("/api/onboarding/mark-website-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });

      if (response.ok) {
        toast.success("Training complete!", {
          description: "Redirecting to next step...",
        });
        router.push("/dashboard/onboarding");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to mark website training complete:", errorData);

        // If column doesn't exist, show user-friendly message but continue
        if (
          errorData.error?.includes("website_training_completed") ||
          errorData.error?.includes("column") ||
          errorData.error?.includes("schema cache")
        ) {
          toast.info("Progress will be tracked via document status", {
            description: "You can continue.",
          });
        } else {
          toast.warning("Progress may not be saved", {
            description: "But you can continue.",
          });
        }
        // Still allow navigation - we have fallback tracking
        router.push("/dashboard/onboarding");
      }
    } catch (error) {
      console.error("Failed to mark website training complete:", error);
      toast.info("Progress will be tracked via document status", {
        description: "You can continue.",
      });
      // Still allow navigation - we have fallback tracking
      if (!onComplete) {
        router.push("/dashboard/onboarding");
      }
    } finally {
      setContinueLoading(false);
    }
  };

  // Adjust container styling based on embedded prop
  const containerClass = embedded
    ? "w-full"
    : "flex justify-center items-center min-h-[90vh] p-4 bg-slate-50 dark:bg-slate-950";

  const cardClass = embedded
    ? "w-full shadow-md border overflow-hidden"
    : "w-full max-w-5xl shadow-xl border-0 overflow-hidden min-h-[500px] flex flex-col md:flex-row";

  // Adjust left side styling for embedded mode
  const leftSideClass = embedded
    ? "w-full p-6 bg-white dark:bg-slate-900 flex flex-col justify-center"
    : "w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-slate-900 flex flex-col justify-center border-r border-slate-100 dark:border-slate-800";

  // Adjust right side styling for embedded mode
  const rightSideClass = embedded
    ? "w-full p-6 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center"
    : "w-full md:w-1/2 p-8 md:p-12 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center";

  return (
    <div className={containerClass}>
      <Card className={cardClass}>
        {/* Left Side - Info/Visuals */}
        <div className={leftSideClass}>
          <div className="mb-8">
            {/* <div className="flex items-center gap-2 mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="pl-0 hover:bg-transparent"
                onClick={() => router.back()}
              >
                ←
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                1/5
              </span>
              <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/5 rounded-full" />
              </div>
            </div> */}

            <h1 className={cn(
              "font-bold tracking-tight",
              embedded ? "text-lg md:text-xl" : "text-xl md:text-2xl"
            )}>
              {step === "idle" || step === "analyzing" ? (
                <>
                  Train Zevaux with your Website
                </>
              ) : (
                <>
                  Building your Zevaux Agent
                </>
              )}
            </h1>
          </div>

          <div className="space-y-6">
            {step === "idle" || step === "analyzing" ? (
              <>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-purple-100 p-2 rounded-lg text-purple-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Enter your website URL to start.
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We'll scan your site to understand your business.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Your AI agent will be trained instantly.
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      It learns your services, pricing, and FAQs automagically.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-green-100 p-2 rounded-lg text-green-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Takes less than a minute!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Skip the manual data entry and get started fast.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700">
                      Scan & Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Zevaux is reading your website pages.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700">
                      Knowledge Extraction
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Identifying key business details.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-slate-100 p-2 rounded-lg text-slate-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700">
                      Agent Generation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Creating your custom voice assistant.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Action/Form */}
        <div className={rightSideClass}>
          {step === "idle" || step === "analyzing" ? (
            <div className="w-full max-w-sm space-y-6">
              <div className="text-center md:text-left mb-4">
                <h3 className="text-lg font-semibold">
                  Enter Your Website Address
                </h3>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="https://example.com"
                    className="pl-4 h-12 text-lg bg-white shadow-sm"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError(null);
                    }}
                    required
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-medium shadow-md transition-all hover:scale-[1.02]"
                  disabled={loading || !url.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Train Zevaux <Sparkles className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {!embedded && (
                <div className="text-center mt-6">
                  <Button
                    variant="link"
                    className="text-muted-foreground text-sm"
                    onClick={() => router.push("/dashboard/onboarding")}
                  >
                    I don't have a website yet
                  </Button>
                </div>
              )}
            </div>
          ) : step === "training" ? (
            <div className="w-full max-w-sm space-y-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm border flex items-center justify-center">
                    <Globe className="w-6 h-6 text-slate-400" />
                  </div>
                  <ArrowRight className="text-muted-foreground" />
                  <div className="w-12 h-12 bg-primary rounded-lg shadow-lg shadow-primary/30 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Zevaux is training on your data</span>
                  <span>{trainingProgress}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <CheckItem
                  label="Analyzing your website for data"
                  active={checklist.analyzing}
                />
                <CheckItem
                  label="Processing your business information"
                  active={checklist.processing}
                />
                <CheckItem
                  label="Optimizing your data for AI"
                  active={checklist.optimizing}
                />
                <CheckItem
                  label="Generating your custom Zevaux agent"
                  active={checklist.generating}
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm text-center space-y-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Training Complete!</h2>
                <p className="text-muted-foreground">
                  Your agent is ready to be customized.
                </p>
              </div>

              <div className="space-y-3 w-full">
                <Button
                  onClick={handleContinue}
                  className="w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  disabled={continueLoading}
                >
                  {continueLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Preparing your agent...
                    </>
                  ) : (
                    <>
                      Claim Your Agent <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
                {!embedded && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep("idle");
                      setUrl("");
                      setError(null);
                    }}
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Back / Retrain
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function CheckItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 transition-opacity duration-500",
        active ? "opacity-100" : "opacity-40",
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center border",
          active ? "bg-primary border-primary" : "border-slate-300",
        )}
      >
        {active && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
