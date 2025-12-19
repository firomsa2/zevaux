import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Check,
  Phone,
  Calendar,
  BarChart3,
  MessageSquare,
  Zap,
  Users,
  Play,
  Star,
  ShieldCheck,
  Headphones,
  Rocket,
  LayoutDashboard,
  Globe,
  Clock,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Volume2,
  Mic,
  Settings,
  Lock,
  BadgeCheck,
  Sparkles,
  MessageCircle,
  User,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Logout from "@/components/Logout";
import { ModeToggle } from "@/components/mode-toggle";
import { Fragment } from "react";
import Image from "next/image";
import skylightlogo from "../public/Ethiopian-Skylight-hotel-logo.png";
import VoicePlayer from "@/components/voice-player";
import VoiceSamplesSection from "@/components/voice-samples-section";

function deadlineLabel() {
  const d = new Date(2025, 11, 15);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const phoneImageUrl =
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-primary/20 bg-linear-to-br from-primary via-primary/100 to-primary/100 backdrop-blur-xl supports-backdrop-filter:bg-primary/10">
        <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-bold bg-white bg-clip-text text-transparent">
                Zevaux
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-8 text-white">
                <Link
                  href="#features"
                  className="text-sm font-medium text-white/80 hover:opacity-90 transition-colors hover:scale-105"
                >
                  Features
                </Link>
                <Link
                  href="#demos"
                  className="text-sm font-medium text-white/80 hover:text-primary/90 transition-colors hover:scale-105"
                >
                  Live Demos
                </Link>
                <Link
                  href="#results"
                  className="text-sm font-medium text-white/80 hover:text-primary/90 transition-colors hover:scale-105"
                >
                  Results
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm font-medium text-white/80 hover:text-primary/90 transition-colors hover:scale-105"
                >
                  Pricing
                </Link>
              </div>
              <div className="flex items-center gap-4">
                {!user ? (
                  <Fragment>
                    <ModeToggle />
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-primary/90 text-white/80"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                      asChild
                    >
                      <Link href="/login" className="flex items-center gap-2">
                        Get 500 Free Min
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-primary/90 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <div className="text-sm text-white/80">{user?.email}</div>
                    <ModeToggle />
                    <Logout />
                  </Fragment>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center gap-3">
              <ModeToggle />
              <Button
                size="sm"
                asChild
                className="bg-gradient-to-r from-primary to-primary/90 text-white hover:opacity-90"
              >
                <Link href="/login">Start Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>

        {/* Sparkle effects */}
        <div className="absolute top-1/4 left-1/4 animate-pulse">
          <Sparkles className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-pulse delay-300">
          <Sparkles className="w-4 h-4 text-white/30" />
        </div>
        {/* Sparkle effects */}
        <div className="absolute top-1/6 left-1/2 animate-pulse">
          <Sparkles className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute bottom-1/4 right-1/2 animate-pulse delay-300">
          <Sparkles className="w-4 h-4 text-white/30" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-18 pb-20 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">
                  December Limited Offer
                </span>
                <span className="text-xs text-white/80">
                  Ends {deadlineLabel()}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                <span className="block text-white">AI Voice Receptionist</span>
                <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  That Books Appointments 24/7
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-10 max-w-xl">
                Professional AI that handles customer calls, schedules
                appointments, captures leads, and follows up—sounding perfectly
                human while working with your existing phone system.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-white hover:bg-white/90 text-primary px-8 py-6 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 group"
                  asChild
                >
                  <Link href="/checkout" className="flex items-center gap-2">
                    Start Free Trial - 500 Minutes
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-6 rounded-xl text-lg group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Hear Live Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-300 text-yellow-300"
                        />
                      ))}
                    </div>
                    <span className="font-medium">4.8/5 (2,000+ reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span>3-Minute Setup</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Phone Display */}
            <div className="relative h-[400px]">
              {/* Phone 1: Tilted Analytics Dashboard */}
              <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 w-[240px] z-5">
                <div className="relative aspect-[9/19] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-1 border-[6px] border-gray-900 shadow-2xl">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/5 h-3 bg-gray-900 rounded-b-lg z-20"></div>

                  {/* Phone Screen - Real-time Analytics Dashboard */}
                  <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-[1.8rem] overflow-hidden relative flex flex-col">
                    {/* Dashboard Header with Live Pulse */}
                    <div className="pt-5 px-3 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          Live Analytics
                        </div>
                        <div className="text-[10px] text-gray-400">Now</div>
                      </div>
                    </div>

                    {/* Performance Metrics Grid */}
                    <div className="px-3 space-y-3">
                      {/* Top Metrics Row */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Call Answer Rate */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 rounded-lg p-3 border border-blue-800/30">
                          <div className="flex items-center justify-between">
                            <div className="text-[9px] text-gray-300">
                              Answer Rate
                            </div>
                            <TrendingUp className="w-3 h-3 text-green-400" />
                          </div>
                          <div className="text-lg font-bold text-white mt-1">
                            98.7%
                          </div>
                          <div className="text-[8px] text-green-400 flex items-center gap-1 mt-1">
                            <ArrowRight className="w-2 h-2" />
                            +2.3% today
                          </div>
                        </div>

                        {/* Lead Conversion */}
                        <div className="bg-gradient-to-br from-green-900/40 to-green-800/30 rounded-lg p-3 border border-green-800/30">
                          <div className="flex items-center justify-between">
                            <div className="text-[9px] text-gray-300">
                              Conversion
                            </div>
                            <Zap className="w-3 h-3 text-yellow-400" />
                          </div>
                          <div className="text-lg font-bold text-white mt-1">
                            42%
                          </div>
                          <div className="text-[8px] text-green-400 flex items-center gap-1 mt-1">
                            <ArrowRight className="w-2 h-2" />
                            +8% this week
                          </div>
                        </div>
                      </div>

                      {/* change to another  */}
                      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 rounded-lg p-3 border border-purple-800/30">
                        <div className="text-[9px] text-gray-300 mb-2">
                          Up Time
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-xl font-bold text-white">
                              24/7
                            </div>
                            <div className="text-[8px] text-gray-400">Rate</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-400">
                              99%
                            </div>
                            <div className="text-[8px] text-gray-400"></div>
                          </div>
                        </div>

                        {/* Mini Progress Bar */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[8px] text-gray-400 mb-1">
                            <span>Monthly Goal</span>
                            <span>68%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: "68%" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Live Activity Feed */}
                      <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[9px] text-gray-300">
                            Live Activity
                          </div>
                          <div className="text-[8px] text-green-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                            4 Active
                          </div>
                        </div>

                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {/* Activity Items */}
                          <div className="flex items-center gap-2 p-1.5 bg-gray-900/30 rounded">
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Phone className="w-2 h-2 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-[9px] text-white">
                                New call: Auto Service
                              </div>
                              <div className="text-[7px] text-gray-400">
                                30s ago • Qualifying lead
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-1.5 bg-gray-900/30 rounded">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Calendar className="w-2 h-2 text-green-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-[9px] text-white">
                                Appointment booked
                              </div>
                              <div className="text-[7px] text-gray-400">
                                2m ago • Dental Clinic
                              </div>
                            </div>
                            <div className="text-[8px] px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded">
                              +$300
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-1.5 bg-gray-900/30 rounded">
                            <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                              <MessageSquare className="w-2 h-2 text-yellow-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-[9px] text-white">
                                Follow-up sent
                              </div>
                              <div className="text-[7px] text-gray-400">
                                5m ago • 3 old leads
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-1.5 bg-gray-900/30 rounded">
                            <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <Users className="w-2 h-2 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="text-[9px] text-white">
                                Lead converted
                              </div>
                              <div className="text-[7px] text-gray-400">
                                8m ago • Law Firm
                              </div>
                            </div>
                            <div className="text-[8px] px-1.5 py-0.5 bg-purple-900/30 text-purple-400 rounded">
                              Hot Lead
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="mt-auto px-3 pb-4">
                      <div className="text-[9px] text-gray-300 mb-2">
                        Performance Insights
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="text-[8px] text-white">
                            Peak Call Time
                          </div>
                          <div className="text-[8px] text-blue-400">
                            10:00 AM - 2:00 PM
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-[8px] text-white">
                            Avg. Call Duration
                          </div>
                          <div className="text-[8px] text-green-400">
                            2m 15s
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-[8px] text-white">
                            Cost Saved (vs. human)
                          </div>
                          <div className="text-[8px] text-yellow-400">
                            $1,240
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full text-[10px] font-medium shadow-lg">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-2.5 h-2.5" />
                      Insights
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 2: Straight (Foreground) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-6 w-[260px] z-10">
                {/* Professional Voice Call Phone Interface */}
                <div className="relative">
                  <div className="relative w-full max-w-[280px] mx-auto">
                    {/* Phone Frame - Compact & Professional */}
                    <div className="relative w-full aspect-[9/19] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-1 border-[6px] border-gray-900 shadow-2xl">
                      {/* Phone Notch */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-3 bg-gray-900 rounded-b-lg z-20"></div>

                      {/* Phone Screen - Professional Call Interface */}
                      <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white rounded-[1.8rem] overflow-hidden relative flex flex-col">
                        {/* Status Bar */}
                        <div className="pt-3 px-3 pb-2 flex justify-between items-center border-b border-gray-100">
                          <div className="text-xs font-semibold text-gray-900">
                            12:45 PM
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs text-gray-700 font-medium">
                              Live
                            </span>
                          </div>
                        </div>

                        {/* Call Header */}
                        <div className="text-center px-3 pt-2 pb-3">
                          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                            <Volume2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-base font-bold text-gray-900">
                            AI Receptionist
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Active • Professional Services Inc.
                          </div>

                          {/* Call Duration */}
                          <div className="mt-2">
                            <div className="text-2xl font-mono font-bold text-gray-900">
                              01:28
                            </div>
                            <div className="text-xs text-gray-500">
                              Active call duration
                            </div>
                          </div>
                        </div>

                        {/* Live Conversation Display */}
                        <div className="flex-1 px-1 py-1  overflow-hidden">
                          <div className="bg-gray-50 rounded-lg p-2 h-full border border-gray-200">
                            <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                              Live Conversation
                            </div>

                            <div className="space-y-2 max-h-52 overflow-y-auto">
                              {/* Customer Message */}
                              <div className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <User className="w-2.5 h-2.5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-gray-900">
                                    Caller
                                  </div>
                                  <div className="text-xs text-gray-700 leading-tight">
                                    "I'd like to schedule a consultation for
                                    next week."
                                  </div>
                                </div>
                              </div>

                              {/* AI Response */}
                              <div className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Volume2 className="w-2.5 h-2.5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-gray-900">
                                    AI Receptionist
                                  </div>
                                  <div className="text-xs text-gray-700 leading-tight">
                                    "Certainly! I can help with that. Are you
                                    looking for Monday or Wednesday?"
                                  </div>
                                </div>
                              </div>

                              {/* Booking Progress */}
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-1 border border-green-200">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                    <Check className="w-2 h-2 text-white" />
                                  </div>
                                  <div className="text-xs  text-green-700">
                                    Appointment booked: Wed 2:30 PM
                                  </div>
                                </div>
                                <div className="text-xs text-green-600 ">
                                  Confirmation sent • Added to calendar
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Call Controls */}
                        <div className="px-3 py-3 bg-gray-50 border-t border-gray-200">
                          <div className="flex justify-center gap-3">
                            <button className="w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                              <Volume2 className="w-4 h-4 text-gray-700" />
                            </button>
                            <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors">
                              <Phone className="w-5 h-5 text-white rotate-135" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                              <MessageCircle className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Side Buttons */}
                      <div className="absolute right-0 top-1/3 h-10 w-0.5 bg-gray-800 rounded-l"></div>
                      <div className="absolute right-0 top-2/3 h-10 w-0.5 bg-gray-800 rounded-l"></div>
                    </div>

                    {/* Floating Achievement Badges */}
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full text-[10px] font-medium shadow-lg flex items-center gap-1">
                        <Volume2 className="w-2.5 h-2.5" />
                        Active Call
                      </div>
                    </div>

                    <div className="absolute -bottom-2 -left-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-[10px] font-medium shadow-lg flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        +1 Booked
                      </div>
                    </div>

                    {/* Voice Wave Animation */}
                    <div className="absolute -top-2 -right-2 w-12 h-12 opacity-70">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="absolute inset-0 rounded-full border border-blue-400/40 animate-ping"
                          style={{
                            animationDelay: `${i * 200}ms`,
                            animationDuration: "1.5s",
                            transform: `scale(${1 + i * 0.3})`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Phone Glow Effect */}
                  <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[120%] bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-[2rem] blur-2xl"></div>
                </div>
              </div>
              {/* Phone 3: Small Floating (Top Right) */}
              <div className="absolute top-4 right-8 w-[160px] rotate-6 z-0 opacity-90">
                <div className="relative aspect-[9/19] bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl p-0.5 border-[4px] border-gray-700 shadow-lg">
                  {/* Mini Screen */}
                  <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg overflow-hidden">
                    <div className="p-2">
                      <div className="text-[8px] text-gray-400 mb-1">
                        Completed
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="text-[8px] text-white">Call #7</div>
                          <div className="text-[7px] text-green-400">✓</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-[8px] text-white">Call #8</div>
                          <div className="text-[7px] text-green-400">✓</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Waves Animation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border border-primary/20 animate-pulse"
                    style={{
                      animationDelay: `${i * 300}ms`,
                      animationDuration: "2s",
                      transform: `scale(${1 + i * 0.4})`,
                    }}
                  />
                ))}
              </div>

              {/* Stats Floating */}
              <div className="absolute bottom-50 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">
                    98% Answer Rate
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-800">
                    24/7 Active
                  </span>
                </div>
              </div>

              {/* Scrolling Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
                <div className="animate-bounce">
                  <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Process */}
      <section className="py-20 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Set Up and Start Answering Calls
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your AI Receptionist working in minutes—no IT support needed
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                icon: Settings,
                title: "Pick Your AI",
                description:
                  "Choose a professional voice & personality that matches your brand",
                color: "from-blue-500/20 to-blue-500/10",
                gradient: "from-blue-400 to-blue-600",
              },
              {
                step: "2",
                icon: Mic,
                title: "Train in Minutes",
                description:
                  "Upload your website, FAQs, or documents to customize knowledge",
                color: "from-green-500/20 to-green-500/10",
                gradient: "from-green-400 to-green-600",
              },
              {
                step: "3",
                icon: Phone,
                title: "Customize Routing",
                description:
                  "Set up rules for call routing, scheduling, and lead capture",
                color: "from-purple-500/20 to-purple-500/10",
                gradient: "from-purple-400 to-purple-600",
              },
              {
                step: "4",
                icon: Zap,
                title: "Go Live",
                description:
                  "Activate and start answering calls 24/7 automatically",
                color: "from-orange-500/20 to-orange-500/10",
                gradient: "from-orange-400 to-orange-600",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 text-center border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white/95 backdrop-blur-sm">
                  <div
                    className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${step.gradient} border-2 border-white flex items-center justify-center font-bold text-white shadow-lg`}
                  >
                    {step.step}
                  </div>
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-6`}
                  >
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </Card>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-transparent transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features - Enhanced with Gradient */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-background via-primary/5 to-background"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Always-On, Reliable Front Desk
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handle more calls with consistent, friendly service—no extra staff
              needed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "24/7 Call Answering",
                subhead: "Never miss a business opportunity",
                description:
                  "AI receptionists handle every inquiry professionally, even after hours and during peak times.",
                gradient: "from-blue-500/20 to-blue-500/10",
                iconColor: "text-blue-600",
                features: [
                  "No voicemail jail",
                  "Multilingual support",
                  "Instant response",
                ],
                cardGradient: "hover:from-blue-50/50 hover:to-transparent",
              },
              {
                icon: MessageSquare,
                title: "Automated Lead Follow-up",
                subhead: "Convert inactive contacts into revenue",
                description:
                  "Intelligent follow-up campaigns re-engage old leads and capture missed opportunities.",
                gradient: "from-green-500/20 to-green-500/10",
                iconColor: "text-green-600",
                features: [
                  "CRM integration",
                  "Personalized messages",
                  "Timed sequences",
                ],
                cardGradient: "hover:from-green-50/50 hover:to-transparent",
              },
              {
                icon: Globe,
                title: "Multilingual Support",
                subhead: "Serve customers in their language",
                description:
                  "Natural conversations in multiple languages with mid-call language switching.",
                gradient: "from-purple-500/20 to-purple-500/10",
                iconColor: "text-purple-600",
                features: [
                  "English, Spanish, French",
                  "Accent adaptation",
                  "Cultural context",
                ],
                cardGradient: "hover:from-purple-50/50 hover:to-transparent",
              },
              {
                icon: Calendar,
                title: "Smart Appointment Booking",
                subhead: "Seamless calendar integration",
                description:
                  "Syncs with your CRM and calendar to book, reschedule, and confirm appointments 24/7.",
                gradient: "from-orange-500/20 to-orange-500/10",
                iconColor: "text-orange-600",
                features: [
                  "Calendar sync",
                  "Auto-confirmations",
                  "Reminder texts",
                ],
                cardGradient: "hover:from-orange-50/50 hover:to-transparent",
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                subhead: "Data-driven insights",
                description:
                  "Track conversions, call quality, and revenue impact with detailed dashboards.",
                gradient: "from-red-500/20 to-red-500/10",
                iconColor: "text-red-600",
                features: [
                  "Call transcripts",
                  "Conversion tracking",
                  "ROI reporting",
                ],
                cardGradient: "hover:from-red-50/50 hover:to-transparent",
              },
              {
                icon: TrendingUp,
                title: "Growth Optimization",
                subhead: "Maximize customer acquisition",
                description:
                  "Identify patterns and opportunities to improve conversion rates and efficiency.",
                gradient: "from-primary/20 to-primary/10",
                iconColor: "text-primary",
                features: [
                  "Trend analysis",
                  "Optimization tips",
                  "A/B testing",
                ],
                cardGradient: "hover:from-primary/10 hover:to-transparent",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`p-8 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group bg-white/95 backdrop-blur-sm ${feature.cardGradient}`}
              >
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-primary font-medium text-sm mb-3">
                  {feature.subhead}
                </p>
                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              asChild
            >
              <Link href="/checkout" className="flex items-center gap-2">
                Begin 4-Month Free Trial
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Demos - Enhanced with Gradient */}
      <section
        id="demos"
        className="py-20 bg-gradient-to-b from-background via-primary/10 to-background"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience AI Receptionists in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear how our AI handles real-world conversations across different
              industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: "Stanley",
                role: "for Financial Services",
                description:
                  "Answers customer FAQs for banks and financial institutions",
                color:
                  "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800",
                icon: "🏦",
                gradient: "from-blue-400 to-blue-600",
              },
              {
                name: "Kirsten",
                role: "for Healthcare",
                description:
                  "Schedules appointments and triages patient concerns",
                color:
                  "bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800",
                icon: "👩⚕️",
                gradient: "from-green-400 to-green-600",
              },
              {
                name: "Naomi",
                role: "for Insurance",
                description: "Texts quote forms and captures policy inquiries",
                color:
                  "bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800",
                icon: "📋",
                gradient: "from-purple-400 to-purple-600",
              },
              {
                name: "Natalie",
                role: "for Legal Teams",
                description: "Routes incoming calls and collects case details",
                color:
                  "bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800",
                icon: "⚖️",
                gradient: "from-orange-400 to-orange-600",
              },
              {
                name: "Charlotte",
                role: "for Construction",
                description:
                  "Routes calls by location and answers project FAQs",
                color:
                  "bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900 dark:to-red-800",
                icon: "🏗️",
                gradient: "from-red-400 to-red-600",
              },
              {
                name: "Jonah",
                role: "for Real Estate",
                description: "Shares property details and books showings",
                color:
                  "bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900 dark:to-indigo-800",
                icon: "🏠",
                gradient: "from-indigo-400 to-indigo-600",
              },
            ].map((demo, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group cursor-pointer bg-white/95 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full ${demo.color} flex items-center justify-center text-xl shadow-md`}
                  >
                    {demo.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{demo.name}</h3>
                      <BadgeCheck className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {demo.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  {demo.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary/10 group-hover:text-primary border-primary/20"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Listen to Sample Call
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10"
              asChild
            >
              <Link href="#">
                View All Industry Demos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Voice Samples Section */}
      {/*  <VoiceSamplesSection />*/}

      {/* Results & Social Proof - Enhanced with Gradient */}
      <section
        id="results"
        className="py-20 bg-gradient-to-b from-background via-primary/5 to-background"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Businesses. Real Results.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses transforming their phone operations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 bg-gradient-to-br from-white to-white/95 backdrop-blur-sm border-primary/10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    HP
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      Healthcare Practice
                    </span>
                  </div>
                  <p className="text-lg italic text-muted-foreground mb-6">
                    "New patient intakes increased by 60%—translating to a
                    projected $1.7M additional revenue."
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Liesel Perez</div>
                      <div className="text-sm text-muted-foreground">
                        Cofounder & CEO
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        60%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Increase
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-white to-white/95 backdrop-blur-sm border-primary/10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    TC
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">Tech Company</span>
                  </div>
                  <p className="text-lg italic text-muted-foreground mb-6">
                    "We've tripled outbound call volumes and saved 20 hours
                    weekly per agent with AI Receptionist."
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">April Chastain</div>
                      <div className="text-sm text-muted-foreground">
                        Director of Operations
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        20 hrs
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Weekly savings
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                value: "98%",
                label: "Call Answer Rate",
                change: "+42%",
                gradient: "from-blue-400 to-blue-600",
              },
              {
                value: "60%",
                label: "Lead Recovery Rate",
                change: "+35%",
                gradient: "from-green-400 to-green-600",
              },
              {
                value: "90%",
                label: "Spam Call Reduction",
                change: "-90%",
                gradient: "from-purple-400 to-purple-600",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-white/95 backdrop-blur-sm border-primary/10"
              >
                <div
                  className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-muted-foreground mb-4">{stat.label}</div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 text-green-700 dark:text-green-300 text-sm font-medium border border-green-200 dark:border-green-700">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </Card>
            ))}
          </div> */}

          {/* Trusted Companies */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-muted-foreground mb-8">
              Trusted by Industry Leaders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl border border-primary/20 bg-gradient-to-b from-white to-white/95 flex items-center justify-center hover:shadow-lg transition-all hover:border-primary/30"
                >
                  <div className="text-muted-foreground/60 text-lg font-semibold">
                    Client {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced with Gradient */}
      <footer className="border-t border-primary/20 bg-gradient-to-b from-background via-primary/5 to-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
                  Zevaux AI
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The AI receptionist that answers calls 24/7, books appointments,
                and grows your business.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#demos"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Live Demos
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact Sales
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 JCER LLC. All rights reserved.
              </div>

              <div className="flex items-center gap-6 text-sm">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
                <ModeToggle />
              </div>
            </div>
          </div>

        </div>
      </footer>
    </main >
  );
}
