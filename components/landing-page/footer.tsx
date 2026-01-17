import Link from "next/link";
import { Phone, Mail, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const solutions = [
    { label: "AI Receptionist", href: "/solutions/ai-receptionist" },
    { label: "24/7 Call Answering", href: "/solutions/24-7-answering" },
    { label: "Appointment Booking", href: "/solutions/appointment-booking" },
    { label: "Lead Qualification", href: "/solutions/lead-qualification" },
    { label: "Virtual Receptionist", href: "/solutions/virtual-receptionist" },
    { label: "Overflow Answering", href: "/solutions/overflow-answering" },
  ];

  const industries = [
    { label: "Healthcare & Dental", href: "/industries/healthcare" },
    { label: "Law Firms", href: "/industries/legal" },
    { label: "Home Services", href: "/industries/home-services" },
    { label: "Salons & Spas", href: "/industries/beauty-wellness" },
    { label: "Real Estate", href: "/industries/real-estate" },
    { label: "All Industries", href: "/industries" },
  ];

  const resources = [
    { label: "Blog", href: "/blog" },
    { label: "Help Center", href: "/help" },
    { label: "API Documentation", href: "/docs" },
    { label: "Integrations", href: "/integrations" },
    { label: "Case Studies", href: "/case-studies" },
  ];

  const company = [
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Wall of Love", href: "/reviews" },
    { label: "Affiliates", href: "/affiliates" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "HIPAA Compliance", href: "/hipaa" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/30">
      {/* CTA Section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Ready to never miss another call?
              </h2>
              <p className="text-muted-foreground">
                Start your 7-day free trial today. No credit card required.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              <Link href="/signup" className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Zevaux</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              AI voice receptionist that answers calls, books appointments, and
              never misses a lead.
            </p>

            {/* Newsletter */}
            <div className="mb-6 flex flex-col">
              <p className="text-sm font-medium text-foreground mb-2">
                Get updates on Zevaux
              </p>
              <div className="flex sm:flex-row flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <Link
                href="https://twitter.com/zevaux"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com/company/zevaux"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:hello@zevaux.com"
                className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Solutions</h4>
            <ul className="space-y-3">
              {solutions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Industries</h4>
            <ul className="space-y-3">
              {industries.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Zevaux. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              {legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
