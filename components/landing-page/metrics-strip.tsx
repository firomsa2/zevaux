export function MetricsStrip() {
  const metrics = [
    { label: "98%+ Answer Rate", value: "Every call answered" },
    { label: "Up to 30% More Bookings", value: "With automated scheduling" },
    { label: "24/7 Coverage", value: "No missed calls ever" },
    { label: "40+ Hours Saved Monthly", value: "Per average business" },
  ];

  return (
    <section className="border-y border-border bg-primary text-primary-foreground px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-3xl font-bold mb-2">{metric.label}</p>
              <p className="text-sm opacity-90">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
