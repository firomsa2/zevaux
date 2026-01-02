"use client";

import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  Clock,
  PhoneMissed,
  DollarSign,
  Users,
  Brain,
} from "lucide-react";

const PROBLEMS = [
  {
    icon: PhoneMissed,
    title: "Missed Opportunities",
    description:
      "30% of calls go unanswered after hours, losing potential revenue",
    stat: "30%",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Clock,
    title: "High Labor Costs",
    description: "Human receptionists cost $40k+/year with limited hours",
    stat: "$40k+",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Inconsistent Service",
    description: "Quality varies between staff, shifts, and busy periods",
    stat: "24/7",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Brain,
    title: "Human Limitations",
    description: "Can't handle multiple languages or complex routing 24/7",
    stat: "1x",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: DollarSign,
    title: "Lost Revenue",
    description:
      "Poor lead qualification and follow-up costs businesses thousands",
    stat: "$1.2k",
    color: "from-green-500 to-green-600",
  },
  {
    icon: AlertCircle,
    title: "Compliance Risks",
    description: "HIPAA, GDPR compliance difficult with human operators",
    stat: "High Risk",
    color: "from-yellow-500 to-yellow-600",
  },
];

export default function ProblemStatement() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">The Problem</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Traditional Receptionists Are Costly & Limited
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Businesses lose revenue, miss opportunities, and struggle with
            consistency when relying on human-only receptionists.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS.map((problem, index) => (
            <Card
              key={index}
              className="p-6 border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${problem.color}`}
                >
                  <problem.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{problem.title}</h3>
                    <div
                      className={`text-sm font-bold bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}
                    >
                      {problem.stat}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {problem.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Solution Highlight */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                The AI-Powered Solution
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Zevaux AI Receptionist solves these problems by providing
                consistent, 24/7 professional call handling that improves with
                every conversation.
              </p>
              <ul className="space-y-3">
                {[
                  "✓ Never miss a call, even at 3 AM",
                  "✓ Handle unlimited concurrent calls",
                  "✓ Multilingual support out of the box",
                  "✓ Enterprise-grade security & compliance",
                  "✓ Detailed analytics & insights",
                  "✓ Seamless human handoff when needed",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-primary/70 p-1 rounded-2xl shadow-2xl">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                      98.7%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Customer satisfaction rate
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Cost Reduction", value: "60%" },
                      { label: "Call Answer Rate", value: "99.9%" },
                      { label: "Lead Conversion", value: "+42%" },
                      { label: "Setup Time", value: "3 min" },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
