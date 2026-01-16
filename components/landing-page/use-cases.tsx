import { Briefcase } from "lucide-react";

export function UseCases() {
  const useCases = [
    {
      title: "Dental & Medical Clinics",
      description:
        "Reduce no-shows and missed appointments with automated scheduling and reminders.",
    },
    {
      title: "Law Firms",
      description:
        "Capture client inquiries 24/7 and route them to the right attorney instantly.",
    },
    {
      title: "Home Services",
      description:
        "Answer calls from plumbers, electricians, and HVAC technicians around the clock.",
    },
    {
      title: "Beauty & Wellness Studios",
      description:
        "Handle booking requests automatically, reducing wait times for clients.",
    },
    {
      title: "Consulting Agencies",
      description:
        "Qualify leads and schedule consultations without tying up your team.",
    },
    {
      title: "E-commerce & Retail",
      description: "Answer customer questions and support inquiries 24/7/365.",
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Built for every business type
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Zevaux adapts to your industry and business model.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-3">
                <Briefcase className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
