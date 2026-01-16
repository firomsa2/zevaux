import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-accent opacity-20"></div>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
          Ready to stop missing calls?
        </h2>

        <p className="text-xl text-muted-foreground mb-8">
          Join hundreds of businesses that are booking more appointments and
          serving customers better with Zevaux.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="#pricing">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Hear a Live Demo</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          No credit card required • 7-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
