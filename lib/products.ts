export interface Plan {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  pricePerMonth: number;
  features: string[];
  voiceMinutes: number;
  phoneNumbers: number;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses just getting started",
    priceInCents: 4900, // $49/month
    pricePerMonth: 49,
    voiceMinutes: 500,
    phoneNumbers: 1,
    features: [
      "AI call answering (voice + SMS)",
      "Custom greeting message",
      "Calendar booking (Google/Outlook)",
      "Basic call routing & voicemail",
      "English + Spanish voice support",
      "Summary transcripts",
      "Searchable call log",
      "1 knowledge upload (FAQ/docs)",
      "Email notifications",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing businesses with advanced needs",
    priceInCents: 14900, // $149/month
    pricePerMonth: 149,
    voiceMinutes: 1500,
    phoneNumbers: 3,
    popular: true,
    features: [
      "Everything in Starter +",
      "WhatsApp & SMS channels",
      "Searchable memory across calls/texts",
      "5 knowledge file uploads",
      "Daily AI recaps & to-do summaries",
      "Advanced analytics dashboard",
      "Role-based access (multi-user)",
      "After-hours intelligent routing",
      "HIPAA/GDPR Safe Mode toggle",
      "Custom integrations (via API)",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom requirements",
    priceInCents: 0, // Custom pricing
    pricePerMonth: 0,
    voiceMinutes: 5000,
    phoneNumbers: 10,
    features: [
      "Everything in Pro +",
      "Unlimited voice minutes",
      "Unlimited phone numbers",
      "Dedicated account manager",
      "Custom SLA & support",
      "Advanced security features",
      "On-premise deployment option",
      "Custom integrations & workflows",
      "Priority support",
    ],
  },
];
