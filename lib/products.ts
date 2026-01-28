export interface Plan {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  pricePerMonth: number;
  features: string[];
  voiceMinutes: number;
  phoneNumbers: number;
  overageRate: number;
  popular?: boolean;
  ctaText?: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description:
      "Perfect for solo owners and very small teams who need calls answered professionally.",
    priceInCents: 4900,
    pricePerMonth: 49,
    voiceMinutes: 200,
    phoneNumbers: 1,
    overageRate: 0.25,
    ctaText: "Start Free — Be Live Today",
    features: [
      "200 AI-handled minutes / month",
      "24/7 call answering",
      "Custom greeting & agent name",
      "Message taking with your questions",
      "Instant email & SMS summaries",
      "Call recordings & transcripts",
      "English & Spanish support",
      "Spam & robocall filtering",
      "Custom FAQs & business info",
      "Choose your local area code",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    description: "Designed for small businesses getting steady call volume.",
    priceInCents: 7900,
    pricePerMonth: 79,
    voiceMinutes: 300,
    phoneNumbers: 1,
    overageRate: 0.22,
    ctaText: "Start Free — Upgrade When Ready",
    features: [
      "Everything in Starter, plus:",
      "300 AI-handled minutes / month",
      "Smart call routing",
      "Lead qualification questions",
      "SMS follow-ups after calls",
      "Call tagging & simple analytics",
      "Missed-call recovery logic",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description:
      "For growing businesses that want Zevaux to take action, not just messages.",
    priceInCents: 12900,
    pricePerMonth: 129,
    voiceMinutes: 500,
    phoneNumbers: 3,
    overageRate: 0.2,
    popular: true,
    ctaText: "Start Free — Grow Faster",
    features: [
      "Everything in Starter, plus:",
      "500 AI-handled minutes / month",
      "Appointment booking automation",
      "Google Calendar, Calendly & Acuity",
      "Call transfers to your team",
      "Warm transfers",
      "SMS during live calls",
      "Training file uploads",
      "Advanced call routing",
      "Detailed analytics dashboard",
      "Priority support",
    ],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Built for high-volume and multi-location businesses.",
    priceInCents: 0,
    pricePerMonth: 0,
    voiceMinutes: 1000,
    phoneNumbers: 10,
    overageRate: 0.0,
    ctaText: "Contact Sales",
    features: [
      "Custom minute bundles (1,000+)",
      "Multiple locations & numbers",
      "Franchise support",
      "Fully custom AI prompts",
      "Advanced agent training",
      "Training file uploads",
      "Dedicated account manager",
      "Custom SLAs",
      "White-label options",
      "Enterprise security & SSO",
    ],
  },
];
