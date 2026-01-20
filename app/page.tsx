import { FAQ } from "@/components/landing-page/faq";
import { Features } from "@/components/landing-page/features";
import { FinalCTA } from "@/components/landing-page/final-cta";
import { Footer } from "@/components/landing-page/footer";
import { Hero } from "@/components/landing-page/hero";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { MetricsStrip } from "@/components/landing-page/metrics-strip";
import { Navigation } from "@/components/landing-page/navigation";
import { Pricing } from "@/components/landing-page/pricing";
import { TrustBar } from "@/components/landing-page/trust-bar";
import { UseCases } from "@/components/landing-page/use-cases";
import { ProblemSolution } from "@/components/landing-page/problem-solution";
import { AudioDemos } from "@/components/landing-page/audio-demos";
import { Testimonials } from "@/components/landing-page/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      {/* <TrustBar /> */}
      <ProblemSolution />
      <Features />
      <AudioDemos />
      <HowItWorks />
      <UseCases />
      <MetricsStrip />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
