// Create: sections/integrations-section.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Zap,
  Globe,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";

const INTEGRATIONS = [
  {
    category: "CRM",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    items: ["Salesforce", "HubSpot", "Zoho", "Pipedrive"],
  },
  {
    category: "Calendar",
    icon: Calendar,
    color: "from-green-500 to-green-600",
    items: [
      "Google Calendar",
      "Microsoft Outlook",
      "Calendly",
      "Apple Calendar",
    ],
  },
  {
    category: "Communication",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600",
    items: ["Slack", "Microsoft Teams", "Zoom", "Twilio"],
  },
  {
    category: "Productivity",
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    items: ["Notion", "Asana", "Trello", "Monday.com"],
  },
  {
    category: "Documentation",
    icon: FileText,
    color: "from-red-500 to-red-600",
    items: ["Google Drive", "Dropbox", "OneDrive", "Confluence"],
  },
  {
    category: "Phone Systems",
    icon: Globe,
    color: "from-cyan-500 to-cyan-600",
    items: ["RingCentral", "Twilio", "Vonage", "Zoom Phone"],
  },
];

export default function IntegrationsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full mb-4">
            <LinkIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">Seamless Integration</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Works With Your Existing Stack
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect Zevaux with your favorite tools in minutes. No complex setup
            required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {INTEGRATIONS.map((integration, index) => (
            <Card
              key={index}
              className="p-6 border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all duration-300 group"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${integration.color} mb-4`}
              >
                <integration.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-4">
                {integration.category}
              </h3>
              <div className="space-y-2">
                {integration.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* API Section */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Developer-Friendly API
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Build custom integrations, automate workflows, and extend
                functionality with our comprehensive REST API.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Endpoints", value: "50+" },
                  { label: "Response Time", value: "<100ms" },
                  { label: "Uptime", value: "99.9%" },
                  { label: "SDKs", value: "5" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg"
                  >
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="gap-2">
                View API Documentation
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm">
              <div className="text-gray-400 mb-4">
                {" "}
                Example: Create AI Receptionist
              </div>
              <div className="space-y-2">
                <div className="text-blue-400">POST</div>
                <div className="text-gray-300">/v1/ai-receptionists</div>
                <div className="text-gray-400">{"{"}</div>
                <div className="text-gray-300 ml-4">{`"name": "Medical AI",`}</div>
                <div className="text-gray-300 ml-4">{`"voice": "professional",`}</div>
                <div className="text-gray-300 ml-4">{`"language": "english",`}</div>
                <div className="text-gray-300 ml-4">{`"calendar_id": "cal_123"`}</div>
                <div className="text-gray-400">{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
