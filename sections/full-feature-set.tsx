"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Phone,
  Calendar,
  Users,
  MessageSquare,
  HelpCircle,
  Clock,
  Bell,
  PhoneOutgoing,
  Link as LinkIcon,
  BarChart3,
  Play,
  Check,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Answer calls and messages",
    description:
      "Zevaux answers every call, text, and chat instantly with a natural, human-like voice. It ensures no customer interaction is missed, even during high call volume.",
    icon: Phone,
    color: "from-blue-500 to-cyan-500",
    benefits: [
      "Instant response",
      "Natural voice",
      "24/7 availability",
      "Multi-channel",
    ],
  },
  {
    title: "Schedule and manage appointments",
    description:
      "Zevaux books, confirms, and reschedules appointments in real time. It also sends reminders and updates to reduce no-shows.",
    icon: Calendar,
    color: "from-green-500 to-emerald-500",
    benefits: [
      "Real-time booking",
      "Auto-confirmations",
      "Reminder system",
      "Calendar sync",
    ],
  },
  {
    title: "Route and escalate calls",
    description:
      "When a caller needs a specialist or live agent, Zevaux transfers the call to the right person with full context. Customers never have to deal with complex menus or long hold times.",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    benefits: [
      "Smart routing",
      "Context transfer",
      "No hold times",
      "Priority handling",
    ],
  },
  {
    title: "Capture leads and follow up",
    description:
      "Zevaux collects contact information, qualifies leads, and triggers automatic follow-up workflows through your CRM or messaging apps.",
    icon: MessageSquare,
    color: "from-orange-500 to-amber-500",
    benefits: [
      "Lead qualification",
      "Auto follow-up",
      "CRM integration",
      "Pipeline management",
    ],
  },
  {
    title: "Answer common questions",
    description:
      "Zevaux uses your knowledge base and business information to handle FAQs such as hours, services, pricing, and directions. This frees your team from repetitive calls.",
    icon: HelpCircle,
    color: "from-red-500 to-rose-500",
    benefits: [
      "FAQ handling",
      "Knowledge base",
      "Instant answers",
      "Team efficiency",
    ],
  },
  {
    title: "Handle after-hours and voicemail",
    description:
      "Zevaux provides round-the-clock coverage, turning missed calls into opportunities. It replaces traditional voicemail with real-time transcripts and instant alerts.",
    icon: Clock,
    color: "from-indigo-500 to-violet-500",
    benefits: [
      "24/7 coverage",
      "Live transcripts",
      "Instant alerts",
      "No voicemail jail",
    ],
  },
  {
    title: "Send reminders and notifications",
    description:
      "Zevaux automatically sends booking confirmations, payment reminders, or SMS follow-ups to keep customers informed and engaged.",
    icon: Bell,
    color: "from-yellow-500 to-amber-500",
    benefits: [
      "Auto reminders",
      "SMS notifications",
      "Confirmations",
      "Engagement tools",
    ],
  },
  {
    title: "Manage outbound calls",
    description:
      "Zevaux can place outbound calls to confirm appointments or deliver important updates, ensuring proactive customer communication.",
    icon: PhoneOutgoing,
    color: "from-teal-500 to-cyan-500",
    benefits: [
      "Outbound calls",
      "Appointment confirmations",
      "Updates delivery",
      "Proactive service",
    ],
  },
  {
    title: "Integrate with your systems",
    description:
      "Zevaux connects with your CRM, phone system, and calendar via API to log conversations, update records, and keep every detail organized.",
    icon: LinkIcon,
    color: "from-gray-500 to-gray-700",
    benefits: [
      "API access",
      "CRM integration",
      "Calendar sync",
      "Data organization",
    ],
  },
];

const STATS = [
  { label: "Calls Handled", value: "500k+" },
  { label: "Appointments Booked", value: "150k+" },
  { label: "Leads Captured", value: "85k+" },
  { label: "Businesses Served", value: "5k+" },
];

export default function FullFeatureSet() {
  const [activeFeature, setActiveFeature] = useState(0);
  const ActiveIcon = FEATURES[activeFeature].icon;

  return (
    <section
      id="features"
      className="py-2 lg:py-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/20 dark:to-primary/10 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                Full Feature Set
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Zevaux AI assistant can do for you
            </h2>

            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Zevaux takes care of the everyday front-desk tasks that keep your
              business running, so you can focus on what matters most.
            </p>
          </div>

          {/* Stats Bar */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-blue-400 dark:via-primary dark:to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {FEATURES.map((feature, index) => (
              <Card
                key={index}
                onClick={() => setActiveFeature(index)}
                className={cn(
                  "p-4 border-2 cursor-pointer transition-all duration-300 hover:shadow-xl group flex flex-col justify-between",
                  activeFeature === index
                    ? "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/30"
                )}
              >
                {/* Feature Header */}
                <div className="flex items-start gap-4 mb-0">
                  <div
                    className={cn(
                      "p-3 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110",
                      `bg-gradient-to-br ${feature.color}`
                    )}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-2 mt-0">
                  {feature.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <Check className="w-4 h-4 text-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Indicator */}
                <div className="mt-0 pt-0 border-t border-gray-100 dark:border-gray-700/50 align-bottom">
                  <div className="flex items-center justify-between">
                    <span className=" text-xs text-gray-500 dark:text-gray-400">
                      {/* Click to learn more */}
                    </span>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        activeFeature === index
                          ? `bg-gradient-to-r ${feature.color}`
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Active Feature Detail Panel */}
          {/* <Card className="mb-16 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent">
            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div> */}
          {/* <div className="flex items-center gap-3 mb-6">
                    <div
                      className={cn(
                        "p-3 rounded-xl",
                        `bg-gradient-to-br ${FEATURES[activeFeature].color}`
                      )}
                    >
                      <ActiveIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {FEATURES[activeFeature].title}
                      </h3>
                      <div className="text-sm text-primary font-medium">
                        Featured capability
                      </div>
                    </div>
                  </div> */}

          {/* <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {FEATURES[activeFeature].description}
                  </p> */}

          {/* <div className="grid grid-cols-2 gap-4 mb-8">
                    {FEATURES[activeFeature].benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div> */}
          {/* 
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-5 rounded-xl font-semibold">
                    <Play className="w-5 h-5 mr-2" />
                    See this feature in action
                  </Button> */}
          {/* </div> */}

          {/* Demo Visual */}
          {/* <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700"> */}
          {/* <div className="flex items-center justify-between mb-6">
                    <div className="text-white font-semibold">
                      Live Demo Preview
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-green-400">Active</span>
                    </div>
                  </div> */}

          {/* <div className="space-y-4"> */}
          {/* Customer Message */}
          {/* <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">👤</span>
                      </div>
                      <div className="bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                        <p className="text-white text-sm">
                          {FEATURES[activeFeature].title.includes(
                            "Answer calls"
                          )
                            ? "Hi, I need help with my account."
                            : FEATURES[activeFeature].title.includes("Schedule")
                            ? "Can I book an appointment for tomorrow?"
                            : FEATURES[activeFeature].title.includes("Route")
                            ? "I need to speak with the billing department."
                            : "I have a question about your services."}
                        </p>
                      </div>
                    </div> */}

          {/* AI Response */}
          {/* <div className="flex gap-3"> */}
          {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">AI</span>
                      </div> */}
          {/* <div className="bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                        <p className="text-white text-sm">
                          {FEATURES[activeFeature].title.includes(
                            "Answer calls"
                          )
                            ? "I'd be happy to help with your account. Can you tell me your account email?"
                            : FEATURES[activeFeature].title.includes("Schedule")
                            ? "Absolutely! I have openings at 10 AM, 2 PM, or 4 PM tomorrow."
                            : FEATURES[activeFeature].title.includes("Route")
                            ? "I'll connect you with our billing specialist right away."
                            : "I can help answer that! What specific service are you interested in?"}
                        </p>
                      </div> */}
          {/* </div> */}

          {/* Success Indicator */}
          {/* <div className="bg-gradient-to-r from-green-900/50 to-green-800/30 border border-green-800/30 rounded-xl p-4 mt-4">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="font-semibold text-green-400">
                            {FEATURES[activeFeature].title.includes(
                              "Answer calls"
                            )
                              ? "Call answered in 1.2s"
                              : FEATURES[activeFeature].title.includes(
                                  "Schedule"
                                )
                              ? "Appointment booked successfully"
                              : FEATURES[activeFeature].title.includes("Route")
                              ? "Call transferred with full context"
                              : "Query resolved efficiently"}
                          </div>
                          <div className="text-sm text-green-500/70">
                            {FEATURES[activeFeature].title.includes(
                              "Answer calls"
                            )
                              ? "Customer satisfaction: 98%"
                              : FEATURES[activeFeature].title.includes(
                                  "Schedule"
                                )
                              ? "Confirmation sent • Calendar updated"
                              : FEATURES[activeFeature].title.includes("Route")
                              ? "Wait time saved: 3m 45s"
                              : "Time saved: 2 minutes"}
                          </div>
                        </div>
                      </div>
                    </div> */}
          {/* </div>
                </div>
              </div>
            </div>
          </Card> */}

          {/* Final CTA */}
          {/* <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to transform your customer communication?
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                See Zevaux in action
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                className="border-2 border-gray-300 dark:border-gray-700 hover:border-primary text-gray-800 dark:text-white px-8 py-6 rounded-xl text-lg"
              >
                Book a personalized demo
              </Button>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Join 5,000+ businesses that trust Zevaux with their front desk
              operations
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}
