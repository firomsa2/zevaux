import { Upload, Settings, Phone } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: Upload,
      title: "Connect Your Number",
      description:
        "Point your existing phone number to Zevaux in minutes. No phone system changes needed.",
    },
    {
      number: "2",
      icon: Settings,
      title: "Configure Your Script & Schedule",
      description:
        "Set your business hours, add FAQs, custom questions, and booking rules. Fully customizable.",
    },
    {
      number: "3",
      icon: Phone,
      title: "Zevaux Answers & Books",
      description:
        "Zevaux handles all incoming calls, books appointments, and sends you instant notifications.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-secondary/20 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Get started in 3 simple steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From setup to answering calls, it's simple and straightforward.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                <div className="rounded-xl bg-card border border-border p-8 h-full">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {step.number}
                  </div>
                  <Icon className="mb-4 h-8 w-8 text-accent" />
                  <h3 className="mb-3 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {Number.parseInt(step.number) < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
