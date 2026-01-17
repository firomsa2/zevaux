import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles, CheckCircle2, Star } from "lucide-react";

export function FinalCTA() {
  const benefits = [
    "7-day free trial with all features",
    "No credit card required",
    "Setup in under 5 minutes",
    "Cancel anytime",
  ];

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 mb-8 shadow-lg">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Join 2,000+ businesses using Zevaux
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl mb-6">
          <span className="block">Never Miss Another Call</span>
          <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Starting Today
          </span>
        </h2>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join hundreds of businesses that have transformed their customer
          communication. Start answering every call professionally, 24/7.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <Link href="/signup" className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="px-10 py-7 text-lg border-2"
          >
            <Link href="/contact">Talk to Sales</Link>
          </Button>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">4.9/5</span> from
              2,000+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
