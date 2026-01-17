import {
  Globe,
  Settings,
  Phone,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Globe,
      title: "Train Zevaux on Your Business",
      description:
        "Add your website URL or Google Business Profile. Zevaux automatically learns your services, hours, and business information in seconds.",
      details: [
        "Import from website or Google",
        "Add custom FAQs and answers",
        "Set your business personality",
      ],
      color: "from-primary to-secondary",
    },
    {
      number: "02",
      icon: Settings,
      title: "Customize Your Experience",
      description:
        "Review and personalize Zevaux's responses. Set up greetings, define message-taking questions, and configure call handling rules.",
      details: [
        "Custom greeting scripts",
        "Define key questions to ask",
        "Set up spam filtering",
      ],
      color: "from-secondary to-primary",
    },
    {
      number: "03",
      icon: Phone,
      title: "Forward Your Calls",
      description:
        "Simply forward your existing business number to Zevaux. No phone system changes needed. Your customers call the same number they always have.",
      details: [
        "Keep your existing number",
        "Simple call forwarding setup",
        "Works with any phone provider",
      ],
      color: "from-primary to-secondary",
    },
    {
      number: "04",
      icon: Bell,
      title: "Zevaux Answers & Books",
      description:
        "Zevaux answers calls, responds to questions, books appointments, and sends you instant notifications. Every call is recorded and transcribed.",
      details: [
        "Instant email/SMS alerts",
        "Full call recordings",
        "Complete transcripts saved",
      ],
      color: "from-primary to-secondary",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        {/* Connecting line */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Simple Setup
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From setup to answering calls in under 10 minutes. No technical
            expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative group">
                {/* Connector Arrow (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-16 -right-3 z-10 items-center justify-center w-6 h-6 rounded-full bg-background border border-border">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}

                <div className="h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${step.color} text-white font-bold text-lg mb-4 shadow-lg`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mb-4">
                      <Icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 text-xs text-foreground"
                      >
                        <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Visual (Mobile Alternative) */}
        <div className="lg:hidden mb-16">
          <div className="flex justify-center gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full bg-gradient-to-br ${step.color}`}
                />
                {index < steps.length - 1 && (
                  <div className="h-0.5 w-8 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {/* <div className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-12 border border-primary/10">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of businesses that have simplified their phone
            operations with Zevaux.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Start Your Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            No credit card required • Setup takes 5 minutes
          </p>
        </div> */}
      </div>
    </section>
  );
}
