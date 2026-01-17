"use client";

import { useEffect, useState } from "react";
import { Star, Shield, Award, Users } from "lucide-react";

export function TrustBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const trustItems = [
    {
      icon: Star,
      value: "4.9/5",
      label: "Customer Rating",
      highlight: true,
    },
    {
      icon: Users,
      value: "2,000+",
      label: "Active Businesses",
    },
    {
      icon: Shield,
      value: "SOC 2",
      label: "Compliant",
    },
    {
      icon: Award,
      value: "99.9%",
      label: "Uptime SLA",
    },
  ];

  return (
    <section className="relative border-y border-border bg-muted/30 px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-center gap-3"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    item.highlight ? "bg-yellow-500/10" : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      item.highlight
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-primary"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
