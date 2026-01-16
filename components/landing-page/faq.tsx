"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does Zevaux connect to my existing phone number?",
      answer:
        "We use call forwarding with your current phone number. Simply update your phone settings to route calls through Zevaux, and your existing number remains unchanged. It takes about 5 minutes to set up.",
    },
    {
      question: "Will callers know they are talking to AI?",
      answer:
        "No. Zevaux uses advanced AI with a natural human-sounding voice. Most callers cannot tell the difference. You can customize the greeting and personality to match your brand.",
    },
    {
      question: "Can Zevaux book appointments into my calendar?",
      answer:
        "Yes! Zevaux integrates with Google Calendar, Calendly, Acuity, Appointlet, and many other scheduling tools. Appointments are booked automatically with instant confirmations sent to your clients.",
    },
    {
      question: "What happens if I go over my minutes?",
      answer:
        "On the Starter plan, overage minutes are available at $0.50/min. The Pro plan includes soft caps with alerts to prevent surprises. Enterprise customers have custom limits and SLAs.",
    },
    {
      question: "Is my call data secure and compliant?",
      answer:
        "Absolutely. All calls are encrypted end-to-end, stored securely, and we comply with GDPR, CCPA, HIPAA, and other privacy regulations. You own your data.",
    },
    {
      question: "How quickly can I get started?",
      answer:
        "Setup takes less than 15 minutes. Connect your phone number, configure your greeting and FAQs, and Zevaux will start answering calls immediately.",
    },
    {
      question: "Can I try Zevaux before committing?",
      answer:
        "Yes! We offer a free 7-day trial with all features included. No credit card required. You can cancel anytime.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide email support on all plans, with priority support on Pro and Enterprise. Our team is available during business hours to help with setup and troubleshooting.",
    },
  ];

  return (
    <section id="faq" className="bg-secondary/20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about Zevaux.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="border-t border-border px-6 py-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
