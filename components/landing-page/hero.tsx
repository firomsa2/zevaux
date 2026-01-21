"use client";

import { Button } from "@/components/ui/button";
import {
  Phone,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  Shield,
  Clock,
  Sparkles,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Hero() {
  const [currentStat, setCurrentStat] = useState(0);

  const benefits = [
    "Answers every call instantly—24/7/365",
    "Books appointments directly into your calendar",
    "Sounds like a real receptionist",
    "Works with your existing phone number",
  ];

  const stats = [
    { value: "1.2M+", label: "Calls Handled" },
    { value: "98.7%", label: "Answer Rate" },
    { value: "2,000+", label: "Happy Businesses" },
    { value: "40hrs", label: "Saved Monthly" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and animated elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute top-20 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 left-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-16 pt-12 md:pt-12 pb-10 md:pb-22">
        <div className="grid gap-12 lg:gap-10 lg:grid-cols-[3fr_2fr] items-center relative">
          {/* Decorative Middle Section - Only visible on large screens */}
          <div className="hidden lg:block absolute left-[calc(60%-1.25rem)] top-0 bottom-0 w-10 pointer-events-none">
            {/* Elegant Vertical Gradient Divider */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 via-secondary/20 via-primary/30 to-transparent opacity-60" />
            
            {/* Professional Connecting Curves - Main Flow */}
            <svg
              className="absolute left-1/2 top-0 bottom-0 w-full h-full -translate-x-1/2"
              viewBox="0 0 40 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {/* Primary Elegant Curve - Flowing from top to bottom */}
              <path
                d="M20 0 C 28 120, 28 200, 20 320 C 12 440, 12 520, 20 640 C 28 720, 28 760, 20 800"
                stroke="url(#gradient-primary)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                className="hero-line-primary"
                opacity="0.6"
              />
              
              {/* Secondary Subtle Curve - Adds depth */}
              <path
                d="M20 0 C 24 100, 24 180, 20 280 C 16 380, 16 460, 20 560 C 24 660, 24 720, 20 800"
                stroke="url(#gradient-secondary)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                className="hero-line-secondary"
                opacity="0.4"
              />
              
              {/* Accent Curve - Subtle highlight */}
              <path
                d="M20 50 C 26 150, 26 250, 20 350 C 14 450, 14 550, 20 650 C 26 700, 26 750, 20 800"
                stroke="url(#gradient-accent)"
                strokeWidth="0.75"
                fill="none"
                strokeLinecap="round"
                className="hero-line-accent"
                opacity="0.3"
              />
              
              <defs>
                {/* Primary Gradient - Rich and vibrant */}
                <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  <stop offset="20%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                  <stop offset="40%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                  <stop offset="80%" stopColor="hsl(var(--secondary))" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
                
                {/* Secondary Gradient - Softer complement */}
                <linearGradient id="gradient-secondary" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
                  <stop offset="30%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0" />
                </linearGradient>
                
                {/* Accent Gradient - Subtle highlight */}
                <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  <stop offset="25%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
                  <stop offset="75%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
                
                {/* Glow filter for depth */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* Floating Icons with Staggered Animations */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[15%] text-primary/30"
              style={{
                animation: "hero-float 6s ease-in-out infinite",
                animationDelay: "0s",
              }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[35%] text-primary/25"
              style={{
                animation: "hero-float 8s ease-in-out infinite",
                animationDelay: "1.5s",
              }}
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[55%] text-secondary/30"
              style={{
                animation: "hero-float 7s ease-in-out infinite",
                animationDelay: "3s",
              }}
            >
              <Phone className="h-4 w-4" />
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[75%] text-primary/20"
              style={{
                animation: "hero-float 9s ease-in-out infinite",
                animationDelay: "4.5s",
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </div>

            {/* Animated Particles/Dots */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[25%]">
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
                style={{
                  animation: "particle-float 4s ease-in-out infinite",
                  animationDelay: "0s",
                }}
              />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[45%]">
              <div
                className="absolute w-1 h-1 rounded-full bg-secondary/50"
                style={{
                  animation: "particle-float 5s ease-in-out infinite",
                  animationDelay: "1s",
                }}
              />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[65%]">
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
                style={{
                  animation: "particle-float 6s ease-in-out infinite",
                  animationDelay: "2s",
                }}
              />
            </div>

            {/* Soft Glow Effect */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-primary/5 blur-2xl animate-pulse" />
          </div>

          {/* Left Column - Text Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-1 backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered • Available 24/7
              </span>
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                NEW
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2 animate-fade-in-up">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                <span className="block">Never Miss Another</span>
                <span className="block bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                  Business Call
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Zevaux is your AI voice receptionist that answers every call,
                qualifies leads, and books appointments—
                <span className="text-foreground font-medium">
                  sounding perfectly human
                </span>
                .
              </p>
            </div>

            {/* Benefits List */}
            <ul
              className="space-y-2 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              {benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-foreground"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div
              className="flex flex-col gap-2 sm:flex-row animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                asChild
              >
                <Link href="/signup" className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group bg-background/50 backdrop-blur-sm border-border hover:bg-background hover:border-primary/30 px-8 py-6 text-lg transition-all duration-300"
              >
                <Play className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                Hear Live Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="font-medium text-foreground">
                  4.9/5 Rating
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>5-Minute Setup</span>
              </div>
            </div>

            <p
              className="text-xs text-muted-foreground animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              ✓ No credit card required • 7-day free trial • Cancel anytime
            </p>
          </div>

          {/* Right Column - Interactive Demo */}
          <div
            className="relative animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative mx-auto max-w-sm">
              {/* Main Phone Mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl scale-110 animate-pulse" />

                {/* Phone Frame */}
                <div className="relative rounded-[3rem] border-6 border-gray-900 bg-gray-900 p-2 shadow-2xl dark:border-gray-700">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-1/3 bg-gray-900 dark:bg-gray-700 rounded-b-2xl z-10" />

                  {/* Screen */}
                  <div className="rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden aspect-[9/15]">
                    <div className="h-full flex flex-col p-6 pt-6">
                      {/* Status Bar */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-white/40 animate-pulse" />
                          <span className="text-xs text-white/80">
                            Zevaux AI
                          </span>
                        </div>
                        <span className="text-xs text-white/80">Now</span>
                      </div>

                      {/* Active Call Display */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="relative mb-4">
                          <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                            <Phone className="h-10 w-10 text-white" />
                          </div>
                          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          Incoming Call
                        </h3>
                        <p className="text-sm text-white/80 mb-6">
                          +1 (555) 123-4567
                        </p>

                        {/* Live Transcript */}
                        <div className="w-full space-y-3 text-left bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                          <div className="flex items-start gap-2">
                            <Users className="h-4 w-4 text-white/70 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-white/90">
                              &ldquo;Hi, I&apos;d like to book an appointment
                              for Thursday...&rdquo;
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-white font-medium">
                              &ldquo;I&apos;d be happy to help! Let me check
                              Thursday&apos;s availability for you...&rdquo;
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-white/20">
                            <Calendar className="h-4 w-4 text-green-300" />
                            <p className="text-xs text-green-300 font-medium">
                              ✓ Appointment booked: Thu 2:00 PM
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Stats */}
                      <div className="mt-auto pt-4">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white/10 rounded-lg p-2">
                            <p className="text-lg font-bold text-white">12</p>
                            <p className="text-[10px] text-white/70">
                              Calls Today
                            </p>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2">
                            <p className="text-lg font-bold text-white">8</p>
                            <p className="text-[10px] text-white/70">Booked</p>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2">
                            <p className="text-lg font-bold text-white">98%</p>
                            <p className="text-[10px] text-white/70">
                              Answered
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Analytics Card */}
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-xl max-w-[200px] animate-bounce-slow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">This Week</p>
                    <p className="font-bold text-foreground">+32% Bookings</p>
                  </div>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: "78%" }}
                  />
                </div>
              </div>

              {/* Floating Notification Card */}
              <div className="absolute -top-4 -right-10 bg-card border border-border rounded-xl p-3 shadow-lg max-w-[180px] animate-float">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      New Lead Captured
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Just now
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="border-t border-border bg-muted/30 backdrop-blur-sm">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-16 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`transition-all duration-500 ${
                  currentStat === index ? "scale-105" : "opacity-70"
                }`}
              >
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
