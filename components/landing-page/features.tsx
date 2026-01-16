import { PhoneOff, Calendar, Zap, Clock, Mic, LinkIcon } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: PhoneOff,
      title: "Never Miss a Call",
      description:
        "Zevaux answers every inbound call instantly, 24/7/365, so you never lose a customer.",
    },
    {
      icon: Calendar,
      title: "Instant Appointment Booking",
      description:
        "Books directly into your calendar or scheduling tool with automatic confirmations.",
    },
    {
      icon: Zap,
      title: "Smart Lead Qualification",
      description:
        "Captures intent, priority, contact info, and custom questions in seconds.",
    },
    {
      icon: Clock,
      title: "24/7 Coverage",
      description:
        "Handles calls after hours, weekends, and holidays without additional staffing costs.",
    },
    {
      icon: Mic,
      title: "Natural Human Voice",
      description:
        "Sounds professional and friendly—callers rarely know they're talking to an AI.",
    },
    {
      icon: LinkIcon,
      title: "Easy Phone Integration",
      description:
        "Works seamlessly with your existing phone number and system. Setup in minutes.",
    },
  ];

  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Powerful features for modern businesses
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to answer calls and book appointments
            automatically.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-8 hover:border-accent/50 transition-colors"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
