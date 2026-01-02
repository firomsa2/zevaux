"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  MessageSquare,
  Phone,
  CreditCard,
  Settings,
  Users,
} from "lucide-react";

const FAQS = [
  {
    question: "How does the AI handle complex customer inquiries?",
    answer:
      "Our AI uses advanced natural language processing to understand context, intent, and sentiment. It can handle multi-turn conversations, ask clarifying questions, and escalate to human agents when needed.",
    category: "AI Capabilities",
    icon: MessageSquare,
  },
  {
    question: "Can I customize the AI's voice and personality?",
    answer:
      "Yes! Choose from multiple professional voices, set speaking styles, and customize responses to match your brand voice. You can also train the AI with your specific knowledge base.",
    category: "Customization",
    icon: Settings,
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses are live in under 3 minutes. Simply connect your phone system, choose your settings, and start answering calls. No IT support needed.",
    category: "Setup",
    icon: Settings,
  },
  {
    question: "Is there a minimum contract?",
    answer:
      "No contracts required. All plans are month-to-month with the option to cancel anytime. Enterprise plans with custom requirements may have annual contracts.",
    category: "Pricing",
    icon: CreditCard,
  },
  {
    question: "How does it integrate with my existing phone system?",
    answer:
      "We support SIP, VoIP, and traditional phone lines. Connect via our web interface or API. We also integrate with popular PBX systems and VoIP providers.",
    category: "Integration",
    icon: Phone,
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "24/7 customer support via chat, email, and phone. Enterprise plans include a dedicated account manager and priority support.",
    category: "Support",
    icon: Users,
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get answers to common questions about our AI receptionist platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {FAQS.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <faq.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <div className="mt-4 pl-14">
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                    <div className="mt-3">
                      <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
