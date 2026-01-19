import {
  Stethoscope,
  Scale,
  Wrench,
  Scissors,
  Building2,
  Car,
  GraduationCap,
  Home,
  Briefcase,
  Store,
  UtensilsCrossed,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function UseCases() {
  const industries = [
    {
      icon: Stethoscope,
      title: "Healthcare & Dental",
      description:
        "Book patient appointments, answer insurance questions, and handle scheduling 24/7.",
      benefits: [
        "Reduce no-shows",
        "Handle after-hours calls",
        "HIPAA compliant",
      ],
      image: "/modern-dental-clinic-reception-room.jpg",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Scale,
      title: "Law Firms",
      description:
        "Capture client inquiries, qualify leads, and schedule consultations around the clock.",
      benefits: [
        "24/7 intake",
        "Lead qualification",
        "Professional representation",
      ],
      image: "/professional-law-office-lobby.jpg",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Wrench,
      title: "Home Services",
      description:
        "Never miss an emergency call. Handle plumbing, HVAC, and electrical inquiries instantly.",
      benefits: ["Emergency dispatch", "Quote requests", "Service scheduling"],
      image: "/home-services-plumber-van.jpg",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Scissors,
      title: "Salons & Spas",
      description:
        "Book appointments, answer service questions, and manage your schedule effortlessly.",
      benefits: [
        "Online booking",
        "Service info",
        "Reduce phone interruptions",
      ],
      image: "/luxury-spa-reception-area.jpg",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Building2,
      title: "Property Management",
      description:
        "Handle tenant inquiries, maintenance requests, and showing appointments automatically.",
      benefits: ["Maintenance routing", "Showing scheduling", "Tenant support"],
      image: "/propertyy.png",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Car,
      title: "Automotive",
      description:
        "Schedule service appointments, answer parts questions, and handle customer inquiries.",
      benefits: ["Service booking", "Parts availability", "Recall handling"],
      image: "/servicesss.png",
      color: "from-red-500 to-orange-500",
    },
  ];

  const moreIndustries = [
    { icon: Briefcase, name: "Consulting" },
    { icon: Store, name: "Retail" },
    { icon: GraduationCap, name: "Education" },
    { icon: Home, name: "Real Estate" },
    { icon: UtensilsCrossed, name: "Restaurants" },
    { icon: Heart, name: "Nonprofits" },
  ];

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Built for Every Industry
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            Businesses in Every Industry{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Rely on Zevaux
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From solo professionals to growing companies, Zevaux adapts to your
            industry and handles calls with expertise.
          </p>
        </div>

        {/* Featured Industries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <div
                key={industry.title}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Header */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={industry.image}
                    alt={industry.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  {/* Icon Badge */}
                  <div
                    className={`absolute bottom-4 left-4 h-12 w-12 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {industry.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {industry.description}
                  </p>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2">
                    {industry.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* More Industries */}
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-6">
            Plus many more industries...
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {moreIndustries.map((industry) => {
              const Icon = industry.icon;
              return (
                <div
                  key={industry.name}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full hover:border-primary/30 transition-colors"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {industry.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/industries" className="flex items-center gap-2">
              View All Industries
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
