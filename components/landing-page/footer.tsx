import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Pricing", href: "#pricing" },
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/" },
        { label: "Terms of Service", href: "/" },
        { label: "Security", href: "/" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/" },
        { label: "Blog", href: "/" },
        { label: "Contact", href: "/" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-secondary/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                Z
              </div>
              <span className="font-semibold text-foreground">Zevaux</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI voice receptionist for modern businesses.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
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
          ))}
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Zevaux. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
