"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  industry: string;
  image: string;
  quote: string;
  rating: number;
  metric?: {
    value: string;
    label: string;
  };
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      role: "Practice Owner",
      company: "Smile Dental Clinic",
      industry: "Healthcare",
      image: "/placeholder-user.jpg",
      quote:
        "Zevaux has transformed our front desk operations. We used to miss 30% of calls during busy hours. Now every single call is answered, and our appointment bookings have increased by 45%. It's like having the perfect receptionist who never takes a break.",
      rating: 5,
      metric: {
        value: "45%",
        label: "More Bookings",
      },
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Managing Partner",
      company: "Rodriguez & Associates Law",
      industry: "Legal",
      image: "/placeholder-user.jpg",
      quote:
        "As a busy law firm, we can't afford to miss potential client calls. Zevaux qualifies leads professionally and schedules consultations 24/7. Our intake rate improved dramatically, and clients love the immediate response.",
      rating: 5,
      metric: {
        value: "60%",
        label: "Faster Response",
      },
    },
    {
      id: 3,
      name: "Jennifer Wong",
      role: "Owner",
      company: "Premier Plumbing Services",
      industry: "Home Services",
      image: "/placeholder-user.jpg",
      quote:
        "I was skeptical about AI answering my business calls. But Zevaux sounds so natural that customers don't even realize it's not a person. We've saved over 40 hours a month and haven't missed a single emergency call.",
      rating: 5,
      metric: {
        value: "40hrs",
        label: "Saved Monthly",
      },
    },
    {
      id: 4,
      name: "David Chen",
      role: "Founder",
      company: "Luxe Spa & Wellness",
      industry: "Beauty & Wellness",
      image: "/placeholder-user.jpg",
      quote:
        "Our clients expect premium service. Zevaux delivers exactly that - elegant, professional responses every time. The seamless calendar integration means no more double bookings or scheduling conflicts.",
      rating: 5,
      metric: {
        value: "99%",
        label: "Client Satisfaction",
      },
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-primary">
              Loved by 2,000+ Businesses
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            What Our Customers Are Saying
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses that have transformed their customer
            communication with Zevaux.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="relative">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Left - Quote */}
              <div className="md:col-span-2 space-y-6">
                <Quote className="h-12 w-12 text-primary/20" />
                <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed">
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </blockquote>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={activeTestimonial.image}
                      alt={activeTestimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {activeTestimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activeTestimonial.role} at {activeTestimonial.company}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {activeTestimonial.industry}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right - Metric Card */}
              {activeTestimonial.metric && (
                <div className="flex justify-center md:justify-end">
                  <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 rounded-2xl p-8 text-center w-full max-w-[200px]">
                    <p className="text-5xl font-bold text-primary mb-2">
                      {activeTestimonial.metric.value}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {activeTestimonial.metric.label}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setActiveIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Company Logos */}
        <div className="mt-16">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">
            Trusted by businesses of all sizes
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60">
            {[
              "Dental Clinics",
              "Law Firms",
              "Home Services",
              "Spas & Wellness",
              "Real Estate",
              "Consulting",
            ].map((industry) => (
              <div
                key={industry}
                className="flex items-center justify-center p-4 rounded-lg border border-border bg-card/50"
              >
                <span className="text-sm font-medium text-muted-foreground text-center">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
