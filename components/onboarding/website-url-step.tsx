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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, ArrowRight, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebsiteUrlStepProps {
  businessId: string;
  onComplete: (url: string) => Promise<void>;
  loading?: boolean;
}

export function WebsiteUrlStep({
  businessId,
  onComplete,
  loading: parentLoading,
}: WebsiteUrlStepProps) {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    console.log("Submitting URL for analysis:", url);

    // Basic URL validation/formatting
    let formattedUrl = url;
    if (!formattedUrl.startsWith("http")) {
      formattedUrl = `https://${formattedUrl}`;
    }
    console.log("Formatted URL:", formattedUrl);

    setAnalyzing(true);
    try {
      // Call API to start analysis
      const response = await fetch("/api/onboarding/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, url: formattedUrl }),
      });
      console.log("API response:", response);

      if (!response.ok) {
        throw new Error("Failed to start analysis");
      }

      // We proceed immediately, letting the parent handle the transition and potential polling
      // or we could poll here. For now, let's just assume trigger success.
      await onComplete(formattedUrl);
    } catch (error) {
      console.error("Error analyzing website:", error);
      toast({
        title: "Error",
        description: "Failed to analyze website. Please try again or skip.",
        variant: "destructive",
      });
      // Allow user to proceed even if analysis fails?
      // Maybe not if this is the "Train" step.
    } finally {
      setAnalyzing(false);
    }
  };

  const isLoaing = analyzing || parentLoading;

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 max-w-2xl mx-auto">
      <div className="text-center space-y-2 mb-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Train Your AI Receptionist
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Enter your website URL to instantly learn your services, prices, and
          policies.
        </p>
      </div>

      <Card className="border shadow-md overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        <CardContent className="pt-8 pb-8 px-6 sm:px-10 space-y-6">
          <div className="text-center pb-2">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/20">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Auto-Configuration
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              We'll scan your site and set everything up for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="website-url" className="text-sm font-medium">
                Website URL
              </Label>
              <div className="relative group/input">
                <div className="absolute left-4 top-3.5 flex items-center gap-2 border-r pr-3 border-border">
                  <Globe className="h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                </div>
                <Input
                  id="website-url"
                  placeholder="example.com"
                  className="pl-16 h-12 text-lg border-input focus:border-primary focus:ring-primary/20 transition-all font-medium"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoaing}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
              disabled={isLoaing || !url}
            >
              {isLoaing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Site Structure...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate My Agent
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p>Takes about 30 seconds</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
