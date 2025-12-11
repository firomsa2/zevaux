"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

export function IntegrationSettings({ receptionistConfig }: any) {
  const integrations = [
    {
      name: "Vapi",
      description: "Voice AI platform for call handling",
      status: receptionistConfig?.vapi_agent_id ? "connected" : "disconnected",
      icon: "🎤",
    },
    {
      name: "Google Calendar",
      description: "Sync bookings with your calendar",
      status: "disconnected",
      icon: "📅",
    },
    {
      name: "Outlook Calendar",
      description: "Sync bookings with Outlook",
      status: "disconnected",
      icon: "📅",
    },
    {
      name: "Slack",
      description: "Receive notifications in Slack",
      status: "disconnected",
      icon: "💬",
    },
  ];

  return (
    <div className="space-y-6">
      {integrations.map((integration, idx) => (
        <Card key={idx}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <p className="font-medium">{integration.name}</p>
                  <p className="text-sm text-text-tertiary">
                    {integration.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    integration.status === "connected"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {integration.status === "connected" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  {integration.status}
                </Badge>
                <Button variant="outline" className="bg-transparent">
                  {integration.status === "connected"
                    ? "Disconnect"
                    : "Connect"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
