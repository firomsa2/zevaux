// sections/simple-setup.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Zap,
  Settings,
  Users,
  BarChart3,
  Check,
  Link as LinkIcon,
  Calendar,
  Phone,
  MessageSquare,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SETUP_STEPS = [
  {
    step: 1,
    title: "Set up in minutes",
    description:
      "Zevaux learns from your website, FAQs, and business details automatically. Just turn it on and start answering calls.",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Upload website or documents",
      "Automatic knowledge extraction",
      "No coding required",
      "Instant training",
    ],
    image: "📚",
  },
  {
    step: 2,
    title: "Personalize your assistant",
    description:
      "Pick your AI voice, set hours, and define call-routing rules. Update responses anytime at no extra cost.",
    icon: Settings,
    color: "from-purple-500 to-pink-500",
    features: [
      "10+ professional voices",
      "Custom business hours",
      "Smart call routing",
      "Real-time updates",
    ],
    image: "🎭",
  },
  {
    step: 3,
    title: "Go live & track results",
    description:
      "Zevaux starts handling calls, texts, and chats instantly. View real-time transcripts and insights from your dashboard.",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
    features: [
      "Live call monitoring",
      "Performance analytics",
      "Revenue tracking",
      "24/7 uptime",
    ],
    image: "📊",
  },
];

const INTEGRATIONS = [
  {
    name: "Google Calendar",
    icon: Calendar,
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Salesforce",
    icon: Users,
    color: "bg-green-100 dark:bg-green-900/30",
  },
  { name: "Twilio", icon: Phone, color: "bg-red-100 dark:bg-red-900/30" },
  {
    name: "Slack",
    icon: MessageSquare,
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    name: "HubSpot",
    icon: Globe,
    color: "bg-orange-100 dark:bg-orange-900/30",
  },
  { name: "Zapier", icon: LinkIcon, color: "bg-cyan-100 dark:bg-cyan-900/30" },
];

export default function SimpleSetup() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % SETUP_STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-2 lg:py-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/20 dark:to-primary/10 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              Simple Setup
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your AI-powered front desk,
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-blue-400 dark:via-primary dark:to-purple-400 bg-clip-text text-transparent">
              ready in 3 steps
            </span>
          </h2>

          <p className="text-xl text-gray-700 dark:text-gray-300">
            Getting started with Zevaux takes minutes – no IT setup or complex
            integrations required.
          </p>
        </div>

        {/* Setup Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {SETUP_STEPS.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connecting Line */}
              {index < 2 && (
                <div className="hidden lg:block absolute top-12 right-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent transform translate-x-1/2 z-0" />
              )}

              <Card
                className={cn(
                  "h-full p-4 border-2 transition-all duration-300 hover:shadow-xl group relative overflow-hidden",
                  activeStep === index
                    ? "border-primary/50 shadow-lg"
                    : "border-gray-200 dark:border-gray-700"
                )}
              >
                {/* Step Number Badge */}
                <div
                  className={cn(
                    "absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg",
                    `bg-gradient-to-br ${step.color}`
                  )}
                >
                  {step.step}
                </div>

                {/* Step Icon */}
                <div className="flex justify-center ">
                  <div
                    className={cn(
                      "p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900",
                      "group-hover:scale-110 transition-transform duration-300"
                    )}
                  >
                    <div className="text-5xl">{step.image}</div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {step.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 text-left">
                    {step.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <Check className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Step Indicator */}
                {/* {activeStep === index && (
                  <div className="absolute -top-1 -right-1">
                    <div
                      className={cn(
                        "text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
                        `bg-gradient-to-r ${step.color}`
                      )}
                    >
                      Active Demo
                    </div>
                  </div>
                )} */}
              </Card>
            </div>
          ))}
        </div>

        {/* Integrations Section */}
        <div className="bg-gradient-to-br from-primary/5 via-primary/5 to-primary/10 dark:from-primary/10 dark:via-primary/5 dark:to-primary/15 rounded-2xl p-8 md:p-12 border border-primary/20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Works with your existing systems
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Integrates seamlessly with your CRM, calendar, help desk tools,
                and phone system.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">
                    Already use Nextiva? Setup is even faster with automatic
                    sync.
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    "No API keys needed",
                    "Plug & play",
                    "Auto-discovery",
                    "Real-time sync",
                  ].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-4">
                {INTEGRATIONS.map((integration, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center mb-3 mx-auto`}
                    >
                      <integration.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center text-sm font-medium text-gray-900 dark:text-white">
                      {integration.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-10">
            <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              Start your free setup
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
