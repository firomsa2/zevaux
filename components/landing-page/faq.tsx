"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes! We offer a 7-day free trial with all features included and unlimited minutes. No credit card required to start. You can cancel anytime during the trial with no charges.",
    },
    {
      question: "How much does Zevaux cost?",
      answer:
        "Our Professional plan starts at $49/month (or $39/month when billed annually). The Scale plan with appointment booking and call transfers is $149/month. We also offer custom Enterprise pricing for larger organizations. All plans include unlimited minutes.",
    },
    {
      question: "How long does it take to set up?",
      answer:
        "Most businesses are up and running in under 10 minutes. Simply add your website or Google Business Profile, customize your greeting and FAQs, and forward your calls to Zevaux. We provide step-by-step guidance throughout.",
    },
    {
      question: "Can you help us get set up?",
      answer:
        "Absolutely! Our team is available to help with setup, configuration, and optimization. Scale and Enterprise customers receive priority support with dedicated onboarding assistance. We also have comprehensive documentation and video tutorials.",
    },
    {
      question: "How do I connect to my phone system?",
      answer:
        "Zevaux works with call forwarding, so you don't need to change your phone system. Simply forward calls from your existing business number to your unique Zevaux number. Works with landlines, VoIP, and mobile phones.",
    },
    {
      question: "Does Zevaux work with Google Voice?",
      answer:
        "Yes! Zevaux integrates seamlessly with Google Voice. You can forward calls from your Google Voice number directly to Zevaux. It also works with RingCentral, Grasshopper, and most other phone providers.",
    },
    {
      question: "Can Zevaux handle complex customer inquiries?",
      answer:
        "Yes. Zevaux is trained on your specific business information, FAQs, and services. For questions it can't answer, it gracefully takes a detailed message and ensures you get all the information needed to follow up.",
    },
    {
      question: "Will callers know they're talking to AI?",
      answer:
        "Most callers cannot tell the difference. Zevaux uses advanced AI with natural human-sounding voices and conversational patterns. You can customize the voice, personality, and greeting to match your brand.",
    },
    {
      question: "Can I access call recordings and transcripts?",
      answer:
        "Yes! Every call is automatically recorded and transcribed. You can access recordings, transcripts, and summaries from your dashboard. All data is stored securely and available for download.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use enterprise-grade security with end-to-end encryption. We're SOC 2 compliant and HIPAA ready. All data is stored securely in the US and you own your data. We never sell or share your information.",
    },
  ];

  return (
    <section
      id="faq"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Got Questions?
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Zevaux. Can't find what you're
            looking for?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-200 ${
                openIndex === index
                  ? "border-primary/30 bg-card shadow-lg"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <h3 className="font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    openIndex === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-5 pb-5 pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        {/* <div className="mt-12 text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/10">
          <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our team is here to help. Get in touch and we'll respond within 24
            hours.
          </p>
          <Button
            asChild
            variant="outline"
            className="border-primary/30 hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div> */}
      </div>
    </section>
  );
}
