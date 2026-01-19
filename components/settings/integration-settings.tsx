"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Zap, Clock, CalendarDays } from "lucide-react";
import { UserIntegration } from "@/types/integrations";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IntegrationSettingsProps {
  receptionistConfig: any;
  integrations: UserIntegration[];
}

export function IntegrationSettings({
  receptionistConfig,
  integrations,
}: IntegrationSettingsProps) {
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const isGoogleConnected = integrations?.some(
    (i) => i.provider === "google_calendar",
  );
  // const isOutlookConnected = integrations?.some(
  //   (i) => i.provider === "microsoft_outlook"
  // );

  const handleConnect = (provider: string) => {
    if (provider === "google_calendar") {
      window.location.href = "/api/integrations/google/auth";
    }
  };

  const handleDisconnect = async () => {
    if (!disconnectingId) return;

    try {
      const response = await fetch("/api/integrations/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider: disconnectingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect");
      }

      toast({
        title: "Disconnected",
        description: "Integration has been disconnected successfully.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDisconnectingId(null);
    }
  };

  const handleIntegrationClick = (integration: any) => {
    if (integration.comingSoon) return;

    if (integration.status === "connected") {
      setDisconnectingId(integration.provider);
      return;
    }

    handleConnect(integration.provider);
  };

  const integrationsList = [
    // {
    //   id: "acuity",
    //   name: "Acuity Scheduling",
    //   description:
    //     "Let Zevaux book appointments directly to your Acuity calendar.",
    //   status: "disconnected",
    //   icon: (
    //     <span className="text-xl font-bold tracking-tight text-black">
    //       acuity:scheduling
    //     </span>
    //   ),
    //   provider: "acuity",
    //   comingSoon: true,
    // },
    // {
    //   id: "appointlet",
    //   name: "Appointlet",
    //   description:
    //     "Let Zevaux book appointments directly to your Appointlet calendar.",
    //   status: "disconnected",
    //   icon: (
    //     <div className="flex items-center gap-2 text-[#2D8CFF]">
    //       <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
    //         A
    //       </div>
    //       <span className="text-xl font-semibold text-slate-700">
    //         Appointlet
    //       </span>
    //     </div>
    //   ),
    //   provider: "appointlet",
    //   comingSoon: true,
    // },
    {
      id: "calendly",
      name: "Calendly",
      description:
        "Let Zevaux book appointments through your Calendly account.",
      status: "disconnected",
      icon: (
        <div className="flex flex-col items-center">
          <div className="text-[#006BFF] text-4xl mb-1">C</div>
          <span className="text-lg font-semibold text-[#006BFF]">Calendly</span>
        </div>
      ),
      provider: "calendly",
      comingSoon: true,
    },
    {
      id: "google_calendar",
      name: "Google Calendar",
      description:
        "Let Zevaux book appointments directly to your Google Calendar.",
      status: isGoogleConnected ? "connected" : "disconnected",
      icon: (
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/icons8-google-calendar-480.png"
            alt="Google Calendar"
            width={48}
            height={48}
            className="object-contain"
          />
          <span className="text-sm font-medium text-slate-600">
            Google Calendar
          </span>
        </div>
      ),
      provider: "google_calendar",
      comingSoon: false,
    },
    {
      id: "zapier",
      name: "Zapier",
      description:
        "Send events and call information to thousands of apps via Zapier.",
      status: "disconnected",
      icon: (
        <div className="relative">
          <span className="font-bold text-3xl tracking-tighter">
            <span className="text-[#FF4F00]">_</span>zapier
          </span>
        </div>
      ),
      provider: "zapier",
      comingSoon: true,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {integrationsList.map((integration) => (
          <div key={integration.id} className="group flex flex-col">
            {/* Logo Container */}
            <div
              className={`
              w-full aspect-[4/3] bg-white rounded-xl border flex items-center justify-center p-6
              transition-all duration-200 shadow-sm relative overflow-hidden
              ${
                integration.comingSoon
                  ? "opacity-60 cursor-not-allowed bg-gray-50/50"
                  : integration.status === "connected"
                    ? "cursor-default ring-2 ring-primary ring-offset-2 shadow-sm"
                    : "cursor-pointer group-hover:shadow-md hover:border-primary/50"
              }
              ${
                integration.status !== "connected" && !integration.comingSoon
                  ? "hover:border-primary/50"
                  : ""
              }
            `}
              onClick={() => handleIntegrationClick(integration)}
            >
              {/* Badges / Status Indicators */}
              <div className="absolute top-3 right-3 flex gap-2">
                {integration.comingSoon && (
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground font-normal text-xs pointer-events-none"
                  >
                    Coming Soon
                  </Badge>
                )}
                {integration.status === "connected" && (
                  <CheckCircle className="w-5 h-5 text-green-500 fill-green-50" />
                )}
              </div>

              {/* Logo */}
              <div
                className={`transform transition-transform duration-300 ${
                  !integration.comingSoon ? "group-hover:scale-105" : ""
                }`}
              >
                {integration.icon}
              </div>
            </div>

            {/* Text Content Below */}
            <div className="mt-4 space-y-2">
              <h3
                className={`font-bold text-lg text-foreground flex items-center gap-2 ${
                  integration.comingSoon ? "text-muted-foreground" : ""
                }`}
              >
                {integration.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed pr-2">
                {integration.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!disconnectingId}
        onOpenChange={() => setDisconnectingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Integration?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect? This will stop Zevaux from
              syncing with this service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
