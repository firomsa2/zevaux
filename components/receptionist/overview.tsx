"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Bot,
  Clock,
  Phone,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";
import Link from "next/link";

export default function ReceptionistOverview() {
  const [business, setBusiness] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Get business data
      const { data: userData } = await supabase
        .from("users")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (!userData?.business_id) throw new Error("No business found");

      // Fetch business and config
      const [businessRes, configRes] = await Promise.all([
        supabase
          .from("businesses")
          .select("*")
          .eq("id", userData.business_id)
          .maybeSingle(),
        supabase
          .from("business_configs")
          .select("*")
          .eq("business_id", userData.business_id)
          .maybeSingle(),
      ]);
      console.log(businessRes, configRes);

      if (businessRes.error) throw businessRes.error;
      if (configRes.error) throw configRes.error;

      setBusiness(businessRes.data);
      setConfig(configRes.data?.config || {});
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const getCompletionStatus = () => {
  //   console.log("🚀 ~ getCompletionStatus ~ config:", config);
  //   if (!config) return 0;

  //   const requiredFields = [
  //     config?.businessName,
  //     config?.industry,
  //     config?.hours && Object.keys(config.hours).length > 0,
  //     config?.services && config.services.length > 0,
  //   ];

  //   const completed = requiredFields.filter(Boolean).length;
  //   return Math.round((completed / requiredFields.length) * 100);
  // };

  const getCompletionStatus = () => {
    if (!business || !config) return 0;

    // Check business table fields
    const businessFields = [
      business?.name,
      business?.industry,
      business?.timezone,
      business?.default_language,
      business?.tone,
    ];

    // Check config fields
    const configFields = [
      config?.hours && Object.keys(config.hours).length > 0,
      config?.services && config.services.length > 0,
      config?.escalation?.transferNumber || business?.escalation_number,
      config?.introScript,
      config?.closingScript,
    ];

    const allFields = [...businessFields, ...configFields];
    const completed = allFields.filter(Boolean).length;

    return Math.round((completed / allFields.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading receptionist overview...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Receptionist</h1>
          <p className="text-muted-foreground">
            Configure your virtual receptionist to handle calls, SMS, and more
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/receptionist/configure">
            Configure Receptionist
          </Link>
        </Button>
      </div>

      {/* Setup Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Setup Progress
          </CardTitle>
          <CardDescription>
            Complete your receptionist configuration to start receiving calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Configuration Complete: {getCompletionStatus()}%
                </span>
                <Badge
                  variant={
                    getCompletionStatus() === 100 ? "default" : "secondary"
                  }
                >
                  {getCompletionStatus() === 100 ? "Ready" : "In Progress"}
                </Badge>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${getCompletionStatus()}%` }}
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        config?.businessName
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Business Info</p>
                      <p className="text-xs text-muted-foreground">
                        {config?.businessName ? "Complete" : "Required"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        config?.hours
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Business Hours</p>
                      <p className="text-xs text-muted-foreground">
                        {config?.hours ? "Complete" : "Required"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        config?.services
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Services</p>
                      <p className="text-xs text-muted-foreground">
                        {config?.services ? "Complete" : "Required"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        config?.escalation?.transferNumber
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Escalation</p>
                      <p className="text-xs text-muted-foreground">
                        {config?.escalation?.transferNumber
                          ? "Complete"
                          : "Optional"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        business?.name
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Business Info</p>
                      <p className="text-xs text-muted-foreground">
                        {business?.name && business?.industry
                          ? "Complete"
                          : "Required"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        config?.hours
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Business Hours</p>
                      <p className="text-xs text-muted-foreground">
                        {config?.hours ? "Complete" : "Required"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        config?.services
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Services</p>
                      <p className="text-xs text-muted-foreground">
                        {config?.services ? "Complete" : "Required"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        config?.escalation?.transferNumber ||
                        business?.escalation_number
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Escalation</p>
                      <p className="text-xs text-muted-foreground">
                        {config?.escalation?.transferNumber ||
                        business?.escalation_number
                          ? "Complete"
                          : "Optional"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Settings
            </CardTitle>
            <CardDescription>
              Configure personality, tone, and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/receptionist/ai">Configure AI</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Voice & Language
            </CardTitle>
            <CardDescription>
              Set voice profile and language preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/receptionist/voice">Voice Settings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Business Hours
            </CardTitle>
            <CardDescription>
              Configure opening hours and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/receptionist/hours">Set Hours</Link>
            </Button>
          </CardContent>
        </Card>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Settings
            </CardTitle>
            <CardDescription>
              Configure personality, tone, and behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/receptionist/ai">Configure AI</Link>
            </Button>
          </CardContent>
        </Card> */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Voice & Language
            </CardTitle>
            <CardDescription>
              Set voice profile and language preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/receptionist/voice">Voice Settings</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Services
            </CardTitle>
            <CardDescription>
              Configure your business services and offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/receptionist/services">
                Configure Services
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Business Hours
            </CardTitle>
            <CardDescription>
              Configure opening hours and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/receptionist/hours">Set Hours</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
