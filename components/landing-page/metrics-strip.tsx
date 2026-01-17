"use client";

import { useEffect, useState, useRef } from "react";
import { Phone, Calendar, Clock, TrendingUp } from "lucide-react";

export function MetricsStrip() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const metrics = [
    {
      icon: Phone,
      value: "1.4M+",
      label: "Calls Handled",
      description: "And counting...",
    },
    {
      icon: Clock,
      value: "1.2M+",
      label: "Minutes Saved",
      description: "For busy businesses",
    },
    {
      icon: Calendar,
      value: "23K+",
      label: "Appointments Booked",
      description: "Automatically scheduled",
    },
    {
      icon: TrendingUp,
      value: "37K+",
      label: "Texts Sent",
      description: "Follow-ups & confirmations",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Trusted by Thousands of Businesses
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={`text-center transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">
                  {metric.value}
                </p>
                <p className="text-sm font-medium opacity-90">{metric.label}</p>
                <p className="text-xs opacity-70 mt-1">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
