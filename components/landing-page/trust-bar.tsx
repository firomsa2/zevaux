export function TrustBar() {
  const clients = [
    "Dental Clinics",
    "Law Firms",
    "Home Services",
    "Beauty Studios",
    "Medical Practices",
    "Consulting Firms",
  ];

  return (
    <section className="border-y border-border bg-secondary/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted by growing service businesses across industries
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {clients.map((client) => (
            <div
              key={client}
              className="flex items-center justify-center rounded-lg border border-border bg-card px-4 py-3 text-center"
            >
              <p className="text-sm font-medium text-foreground">{client}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
