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
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Train Zevaux with your Website
        </h2>
        <p className="text-muted-foreground">
          Enter your website URL to instantly train your AI receptionist on your
          business details.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website-url"
                  placeholder="https://example.com"
                  className="pl-9"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoaing}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-purple-700"
              disabled={isLoaing || !url}
            >
              {isLoaing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Train Zevaux
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Takes less than a minute! We'll extract your business info
              automatically.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
