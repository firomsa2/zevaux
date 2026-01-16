import { Button } from "@/components/ui/button";
import { PhoneIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const benefits = [
    "Answers every call instantly",
    "Books directly into your calendar",
    "Sounds like a real receptionist",
    // "Works with your existing phone number",
  ];

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-secondary blur-3xl animate-float-delayed"></div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div className="animate-fade-in-up">
              <div className="mb-4 inline-block rounded-full bg-secondary px-4 py-2">
                <p className="text-xs sm:text-sm font-medium text-secondary-foreground">
                  AI Voice Receptionist for Modern Businesses
                </p>
              </div>
              <h1 className="text-balance text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Never Miss Another Call.
                {/* Never Miss Another Call. Let AI Book Your Appointments 24/7. */}
              </h1>
            </div>

            <p className="text-pretty text-base sm:text-lg text-muted-foreground animate-fade-in-up animation-delay-1">
              Zevaux answers every incoming call instantly, qualifies leads, and
              books appointments directly into your calendar. Available 24/7,
              even when you're with clients.
            </p>

            <ul className="space-y-3 animate-fade-in-up animation-delay-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm sm:text-base text-foreground"
                >
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-accent" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row animate-fade-in-up animation-delay-3">
              <Link href="#pricing">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-transform duration-300 hover:scale-105"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent transition-transform duration-300 hover:scale-105"
              >
                <PhoneIcon className="mr-2 h-4 w-4" />
                Hear Live Call Demo
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in-up animation-delay-4">
              ✓ No credit card required • 7-day free trial • Cancel anytime
            </p>
          </div>

          {/* Right Column - Visual */}
          <div className="relative h-full min-h-96 flex items-center justify-center animate-fade-in-up animation-delay-2">
            <div className="relative w-full max-w-lg">
              {/* Phone Mockup */}
              <div className="mx-auto aspect-square max-w-md rounded-3xl border-8 border-muted bg-card p-4 shadow-2xl animate-bounce-slow hover:shadow-3xl transition-all duration-300">
                <div className="rounded-2xl bg-gradient-to-br from-accent to-primary p-6 h-full flex flex-col items-center justify-center text-center text-primary-foreground">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4 animate-pulse">
                    <PhoneIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Zevaux AI</h3>
                  <p className="text-xs sm:text-sm mb-6 opacity-90">
                    Incoming Call
                  </p>

                  {/* Transcript Example */}
                  <div className="w-full space-y-3 text-left text-xs">
                    <div className="bg-white/10 rounded p-2 animate-slide-in-left">
                      <p className="opacity-75">
                        Caller: Hi, I'd like to book an appointment...
                      </p>
                    </div>
                    <div className="bg-white/20 rounded p-2 animate-slide-in-right animation-delay-1">
                      <p>Zevaux: I'd be happy to help! Let me check...</p>
                    </div>
                    <div className="bg-white/10 rounded p-2 animate-slide-in-left animation-delay-2">
                      <p className="opacity-75">
                        ✓ Appointment booked for Wednesday at 2 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Card Overlay */}
              {/* <div className="absolute -bottom-8 -right-8 rounded-2xl bg-card border border-border p-4 shadow-lg max-w-48 animate-fade-in-up animation-delay-4 hover:shadow-xl transition-all duration-300">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Today's Stats
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Answer Rate</span>
                    <span className="font-bold text-accent">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Bookings</span>
                    <span className="font-bold text-accent">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Mins Saved</span>
                    <span className="font-bold text-accent">340</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
