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
    <section className="relative overflow-hidden bg-[var(--rich-bg)] text-white">
      {/* Deep Aurora Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Top Left Glow (Cyan) - Increased Opacity */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,var(--neon-cyan)_0%,transparent_70%)] blur-[120px] opacity-30 animate-pulse-slow" />

        {/* Bottom Right Glow (Violet) - Increased Opacity */}
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,var(--neon-violet)_0%,transparent_70%)] blur-[120px] opacity-35 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />

        {/* Center/Accent Glow (Rose) - Increased Opacity */}
        <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,var(--neon-rose)_0%,transparent_70%)] blur-[150px] opacity-25 animate-float" />

        {/* Noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-16 pt-16 md:pt-24 pb-16 md:pb-32">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center relative">
          {/* Left Column - Text Content */}
          <div className="space-y-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--neon-violet)]/30 bg-[var(--neon-violet)]/10 px-3 py-1.5 backdrop-blur-md shadow-[0_0_15px_-5px_var(--neon-violet)] animate-fade-in group hover:bg-[var(--neon-violet)]/20 transition-colors">
              <Sparkles className="h-4 w-4 text-[var(--neon-violet)] fill-[var(--neon-violet)]/20" />
              <span className="text-sm font-medium text-[var(--neon-violet)] tracking-wide">
                AI-Powered • Available 24/7
              </span>
              <span className="rounded-full bg-[var(--neon-violet)] px-2 py-0.5 text-[10px] uppercase font-bold text-white shadow-sm">
                New
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.1]">
                <span className="block">Never Miss Another</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-cyan)] via-white to-[var(--neon-violet)] animate-gradient-x pb-2">
                  Business Call
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-xl leading-relaxed">
                Zevaux is your AI voice receptionist that answers every call,
                qualifies leads, and books appointments—
                <span className="text-white font-semibold relative inline-block">
                  sounding perfectly human
                  <svg
                    className="absolute w-full h-2 bottom-0 left-0 text-[var(--neon-cyan)] opacity-40 -z-10"
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 10 Q 50 20 100 10"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                </span>
                .
              </p>
            </div>

            {/* Benefits List */}
            <ul
              className="space-y-4 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              {benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-white/90"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20 shadow-[0_0_10px_-4px_var(--neon-cyan)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--neon-cyan)]" />
                  </div>
                  <span className="text-lg font-light">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-white text-[var(--rich-bg)] hover:bg-white/90 px-8 py-7 text-lg font-bold shadow-[0_0_20px_-5px_var(--neon-cyan)] hover:shadow-[0_0_30px_-5px_var(--neon-cyan)] transition-all duration-300 hover:-translate-y-1 rounded-2xl"
                asChild
              >
                <Link href="/signup" className="flex items-center gap-2">
                  <span className="relative z-10">Start Free Trial</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-cyan)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group glass bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-8 py-7 text-lg rounded-2xl backdrop-blur-md transition-all duration-300"
              >
                <Play className="h-5 w-5 mr-3 fill-white/20 group-hover:fill-white/100 transition-all" />
                Hear Live Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-wrap items-center gap-8 text-sm text-white/50 pt-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#FCD34D] text-[#FCD34D]"
                    />
                  ))}
                </div>
                <span className="font-medium text-white/80">4.9/5 Rating</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--neon-cyan)]" />
                <span>Enterprise Security</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--neon-cyan)]" />
                <span>5-Minute Setup</span>
              </div>
            </div>

            <p className="text-xs text-white/30 pt-2">
              ✓ No credit card required • 7-day free trial • Cancel anytime
            </p>
          </div>

          {/* Right Column - Interactive Demo & Visuals */}
          <div
            className="relative perspective-1000 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Abstract connecting lines behind phone - Subtle Tech feel */}
            <svg
              className="absolute inset-0 w-full h-full -z-10 opacity-30 pointer-events-none"
              viewBox="0 0 400 600"
            >
              <path
                d="M 200 100 C 300 100 350 300 350 300"
                stroke="url(#lineGrad1)"
                fill="none"
                strokeWidth="2"
                strokeDasharray="10 10"
                className="animate-pulse-slow"
              />
              <path
                d="M 200 100 C 100 100 50 300 50 300"
                stroke="url(#lineGrad2)"
                fill="none"
                strokeWidth="2"
                strokeDasharray="10 10"
                className="animate-pulse-slow"
                style={{ animationDelay: "1s" }}
              />
              <defs>
                <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--neon-cyan)"
                    stopOpacity="0"
                  />
                  <stop
                    offset="50%"
                    stopColor="var(--neon-cyan)"
                    stopOpacity="1"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--neon-cyan)"
                    stopOpacity="0"
                  />
                </linearGradient>
                <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--neon-violet)"
                    stopOpacity="0"
                  />
                  <stop
                    offset="50%"
                    stopColor="var(--neon-violet)"
                    stopOpacity="1"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--neon-violet)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative mx-auto max-w-[340px] transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out-expo">
              {/* Glow behind phone */}
              <div className="absolute inset-4 bg-[var(--neon-violet)] opacity-40 blur-3xl animate-pulse" />

              {/* Phone Frame */}
              <div className="relative rounded-[3rem] border border-white/10 bg-[var(--rich-surface)] p-2 shadow-2xl ring-1 ring-white/20 backdrop-blur-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-1/3 bg-black/50 rounded-b-2xl z-10 backdrop-blur-md" />

                {/* Screen */}
                <div className="rounded-[2.5rem] bg-[var(--rich-bg)] overflow-hidden aspect-[9/18] relative">
                  {/* Screen Gradient Mesh */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/20 via-transparent to-[var(--neon-cyan)]/20" />

                  {/* Content Container */}
                  <div className="h-full flex flex-col p-6 pt-10 relative z-10">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center text-[10px] font-medium text-white/60 mb-8">
                      <span>Zevaux v2.0</span>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      </div>
                    </div>

                    {/* Main Call UI */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative mb-6 group cursor-pointer">
                        <div className="absolute inset-0 bg-[var(--neon-cyan)] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative h-24 w-24 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shadow-inner">
                          <Phone className="h-10 w-10 text-white fill-white/20 animate-pulse" />
                        </div>
                        <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center border-2 border-[var(--rich-bg)] animate-bounce-slow">
                          <Sparkles className="h-4 w-4 text-[var(--rich-bg)]" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-1">
                        Incoming Call
                      </h3>
                      <p className="text-sm text-[var(--neon-cyan)] mb-8 font-mono">
                        +1 (555) 123-4567
                      </p>

                      {/* Transcription Bubble */}
                      <div className="space-y-3 w-full">
                        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-4 backdrop-blur-sm self-start animate-slide-in-right">
                          <p className="text-xs text-white/80 leading-relaxed">
                            <span className="text-[var(--neon-rose)] font-bold text-[10px] block mb-1 tracking-wider uppercase">
                              User
                            </span>
                            "Hi, I need to book a consultation."
                          </p>
                        </div>

                        <div className="bg-[var(--neon-violet)]/10 border border-[var(--neon-violet)]/20 rounded-2xl rounded-tr-sm p-4 backdrop-blur-sm self-end animate-slide-in-left shadow-[0_0_15px_-5px_var(--neon-violet)]">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-3 w-3 text-[var(--neon-cyan)]" />
                            <span className="text-[var(--neon-cyan)] font-bold text-[10px] tracking-wider uppercase">
                              AI Agent
                            </span>
                          </div>
                          <p className="text-xs text-white leading-relaxed">
                            "I can help with that! Is Thursday at 2 PM good for
                            you?"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex justify-center items-center hover:bg-red-500/30 transition-colors cursor-pointer">
                        <Phone className="h-5 w-5 text-red-400 rotate-[135deg]" />
                      </div>
                      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 flex justify-center items-center hover:bg-green-500/30 transition-colors cursor-pointer">
                        <Phone className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card - Glassmorphism */}
              <div
                className="absolute top-[20%] -right-12 bg-[var(--rich-surface)]/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl animate-float max-w-[160px]"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 font-medium">
                      Conversion
                    </p>
                    <p className="text-lg font-bold text-white">+240%</p>
                  </div>
                </div>
              </div>

              {/* Floating Notification - Glassmorphism */}
              <div
                className="absolute bottom-[25%] -left-12 bg-[var(--rich-surface)]/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--neon-violet)] to-[var(--neon-cyan)] p-[1px]">
                      <div className="w-full h-full rounded-full bg-[var(--rich-bg)] flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[var(--rich-bg)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Lead Qualified
                    </p>
                    <p className="text-[10px] text-white/50">
                      Just now • Auto-booked
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Gradient Bar */}
      <div className="relative border-t border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-16 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`transition-all duration-500 ${
                  currentStat === index
                    ? "scale-105 opacity-100"
                    : "opacity-50 blur-[0.5px] scale-100 placeholder-opacity-50"
                } hover:opacity-100 hover:blur-0 hover:scale-105 cursor-default`}
              >
                <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-[var(--neon-cyan)]/80 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
