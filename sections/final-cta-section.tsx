"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Shield, Zap, Clock, Users, ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              🎁 Limited Time Offer
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Start Your Free Trial Today
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join 5,000+ businesses that trust Zevaux to handle their calls. No
            credit card required. No setup fees. No long-term contracts.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Shield, text: "14-day free trial" },
              { icon: Clock, text: "3-minute setup" },
              { icon: Users, text: "24/7 support included" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 justify-center text-white/90"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4">Get Started Now</h3>
                <div className="space-y-3 mb-6">
                  {[
                    "500 free minutes",
                    "All premium features",
                    "24/7 support",
                    "No credit card needed",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <Input placeholder="Your business email" className="py-6" />
                  <Input placeholder="Your phone number" className="py-6" />
                  <Button className="w-full py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold text-lg">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/70 mt-8 text-sm">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
