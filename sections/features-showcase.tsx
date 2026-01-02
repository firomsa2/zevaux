"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Calendar,
  BarChart3,
  MessageSquare,
  Zap,
  Users,
  Globe,
  Clock,
  TrendingUp,
  ShieldCheck,
  Headphones,
  Brain,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";

const FEATURE_CATEGORIES = [
  { id: "core", label: "Core Features" },
  { id: "advanced", label: "Advanced Capabilities" },
  { id: "integration", label: "Integrations" },
  { id: "security", label: "Security & Compliance" },
];

const FEATURES = {
  core: [
    {
      icon: Phone,
      title: "24/7 Call Answering",
      description: "Never miss a call with AI that works around the clock",
      benefits: ["No voicemail", "Instant response", "Holiday coverage"],
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Calendar,
      title: "Smart Appointment Booking",
      description:
        "Syncs with your calendar and books appointments automatically",
      benefits: ["Calendar sync", "Auto-confirmations", "Reminders"],
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: MessageSquare,
      title: "Lead Capture & Qualification",
      description:
        "Ask qualifying questions and capture leads directly to your CRM",
      benefits: ["CRM integration", "Lead scoring", "Follow-up"],
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Handle calls in multiple languages with native fluency",
      benefits: ["20+ languages", "Accent adaptation", "Cultural context"],
      gradient: "from-orange-500 to-orange-600",
    },
  ],
  advanced: [
    {
      icon: Brain,
      title: "Context-Aware Conversations",
      description: "AI remembers context and provides personalized responses",
      benefits: ["Context retention", "Personalization", "Industry-specific"],
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Monitor performance and get insights on every call",
      benefits: ["Live dashboard", "Performance metrics", "ROI tracking"],
      gradient: "from-pink-500 to-pink-600",
    },
    {
      icon: Zap,
      title: "Instant Setup & Training",
      description: "Train your AI with your knowledge base in minutes",
      benefits: ["Quick setup", "Custom training", "Continuous learning"],
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      icon: Headphones,
      title: "Seamless Human Handoff",
      description: "Transfer complex calls to human agents when needed",
      benefits: ["Smart routing", "Context transfer", "Priority queuing"],
      gradient: "from-emerald-500 to-emerald-600",
    },
  ],
};

export default function FeaturesShowcase() {
  const [activeCategory, setActiveCategory] = useState("core");

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI Superpowers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            More Than Just an Answering Service
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Enterprise-grade AI capabilities that transform your phone system
            into a revenue-generating machine.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {FEATURE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
                  : "border-gray-300 dark:border-gray-700 hover:border-primary"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {FEATURES[activeCategory as keyof typeof FEATURES]?.map(
            (feature, index) => (
              <Card
                key={index}
                className="p-8 border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl group relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
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
                </div>
              </Card>
            )
          )}
        </div>

        {/* Comparison Table */}
        {/* <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-50 dark:bg-gray-800">
            <div className="p-6 font-semibold">Feature</div>
            <div className="p-6 text-center font-semibold text-gray-500">
              Traditional IVR
            </div>
            <div className="p-6 text-center font-semibold text-gray-500">
              Human Receptionist
            </div>
            <div className="p-6 text-center font-semibold bg-gradient-to-r from-primary to-primary/90 text-white">
              Zevaux AI
            </div>
          </div>

          {[
            ["24/7 Availability", "❌ Limited", "❌ Limited", "✅ Always"],
            ["Multilingual", "❌ Basic", "✅ Limited", "✅ 20+ Languages"],
            ["Cost/Month", "$100-$500", "$3,000-$5,000", "$99-$299"],
            ["Lead Capture", "❌ Basic", "✅ Manual", "✅ Automated"],
            ["Setup Time", "Weeks", "Days", "3 Minutes"],
            ["Scalability", "❌ Fixed", "❌ Limited", "✅ Unlimited"],
            ["Analytics", "❌ Basic", "❌ Manual", "✅ Real-time"],
            ["Compliance", "✅ Basic", "❌ Risky", "✅ Enterprise"],
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 font-medium">{row[0]}</div>
              <div className="p-6 text-center">{row[1]}</div>
              <div className="p-6 text-center">{row[2]}</div>
              <div className="p-6 text-center bg-gradient-to-r from-primary/10 to-primary/5 font-semibold text-primary">
                {row[3]}
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
