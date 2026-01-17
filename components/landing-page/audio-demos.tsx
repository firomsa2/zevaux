"use client";

import { useState } from "react";
import { Play, Pause, Volume2, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioDemo {
  id: string;
  title: string;
  description: string;
  industry: string;
  duration: string;
  transcript?: string[];
}

export function AudioDemos() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const demos: AudioDemo[] = [
    {
      id: "dental",
      title: "Booking a Dental Appointment",
      description:
        "Listen to Zevaux schedule a teeth cleaning and answer insurance questions.",
      industry: "Healthcare",
      duration: "1:24",
      transcript: [
        "Hi, thanks for calling Smile Dental Clinic. This is Zevaux, how can I help you today?",
        "I'd like to schedule a teeth cleaning please.",
        "I'd be happy to help you with that! Do you have a preferred day and time?",
        "How about Thursday afternoon if possible?",
        "Let me check our availability... We have openings at 2 PM and 4 PM on Thursday. Which works better for you?",
        "2 PM would be perfect.",
        "Great! I've booked you for Thursday at 2 PM for a teeth cleaning. You'll receive a confirmation text shortly. Is there anything else I can help you with?",
      ],
    },
    {
      id: "plumbing",
      title: "Emergency Plumbing Service",
      description:
        "Hear how Zevaux handles an urgent service request after hours.",
      industry: "Home Services",
      duration: "1:18",
      transcript: [
        "Thank you for calling Premier Plumbing. This is Zevaux, how can I assist you?",
        "I have a pipe that's leaking badly in my basement!",
        "I understand this is urgent. Let me get some information to dispatch a technician right away. What's your address?",
        "It's 123 Oak Street.",
        "Got it. And can you describe the leak - is it a small drip or a significant flow of water?",
        "It's spraying water everywhere!",
        "I'm marking this as an emergency. A technician will be at your location within 45 minutes. In the meantime, can you locate your main water shutoff valve?",
      ],
    },
    {
      id: "law",
      title: "Legal Consultation Inquiry",
      description:
        "See how Zevaux qualifies a potential client for a law firm.",
      industry: "Legal",
      duration: "1:42",
      transcript: [
        "Rodriguez & Associates, this is Zevaux speaking. How may I direct your call?",
        "I need to speak with someone about a car accident case.",
        "I'm sorry to hear about your accident. I can help gather some initial information. When did the accident occur?",
        "It was about two weeks ago.",
        "And were you the driver or a passenger?",
        "I was driving, and someone ran a red light and hit me.",
        "I understand. Based on what you've described, this sounds like something our personal injury team handles. Would you like me to schedule a free consultation with one of our attorneys?",
      ],
    },
    {
      id: "spa",
      title: "Spa Booking & Questions",
      description:
        "Listen to Zevaux handle a spa appointment with service questions.",
      industry: "Beauty & Wellness",
      duration: "1:36",
      transcript: [
        "Welcome to Luxe Spa & Wellness. This is Zevaux, how can I help you relax today?",
        "Hi, I'm interested in booking a massage, but I'm not sure which type would be best.",
        "I'd be happy to help you choose! Are you looking for something more relaxing and gentle, or do you have specific muscle tension or pain you'd like addressed?",
        "I have a lot of tension in my shoulders and neck from desk work.",
        "For that, I'd recommend our Deep Tissue massage. It's 60 or 90 minutes and specifically targets those problem areas. Would you like to book one?",
        "Yes, the 60-minute option please. Do you have anything this Saturday?",
        "Let me check... We have 10 AM and 3 PM available on Saturday. Which would you prefer?",
      ],
    },
  ];

  const togglePlay = (demoId: string) => {
    if (activeDemo === demoId && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveDemo(demoId);
      setIsPlaying(true);
    }
  };

  return (
    <section
      id="demos"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <Headphones className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Hear Zevaux in Action
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            Experience the Zevaux Difference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Forget robotic IVR menus. Zevaux delivers natural, human-like
            conversations that callers love. Listen to real examples below.
          </p>
        </div>

        {/* Audio Demo Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {demos.map((demo) => (
            <div
              key={demo.id}
              className={`relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                activeDemo === demo.id
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "border-border"
              }`}
            >
              {/* Industry Badge */}
              <div className="absolute top-4 right-4">
                <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded-full">
                  {demo.industry}
                </span>
              </div>

              <div className="flex items-start gap-4">
                {/* Play Button */}
                <button
                  onClick={() => togglePlay(demo.id)}
                  className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    activeDemo === demo.id && isPlaying
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {activeDemo === demo.id && isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </button>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {demo.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {demo.description}
                  </p>

                  {/* Duration & Volume */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {demo.duration}
                    </span>
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-primary rounded-full transition-all duration-300 ${
                          activeDemo === demo.id && isPlaying
                            ? "w-1/3 animate-pulse"
                            : "w-0"
                        }`}
                      />
                    </div>
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Transcript Preview */}
              {activeDemo === demo.id && demo.transcript && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Live Transcript
                    </span>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {demo.transcript.map((line, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          index % 2 === 0
                            ? "bg-primary/5 border-l-2 border-primary"
                            : "bg-muted/50"
                        }`}
                      >
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            index % 2 === 0
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index % 2 === 0 ? "Zevaux" : "Caller"}
                        </span>
                        <p className="text-sm text-foreground flex-1">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Want to hear how Zevaux sounds for{" "}
            <span className="text-foreground font-medium">your</span> business?
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Headphones className="h-5 w-5 mr-2" />
            Get a Custom Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
