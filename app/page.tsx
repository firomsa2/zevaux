// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import {
//   Check,
//   Phone,
//   Calendar,
//   BarChart3,
//   MessageSquare,
//   Zap,
//   Users,
//   Play,
//   Star,
//   ShieldCheck,
//   Headphones,
//   Rocket,
//   LayoutDashboard,
// } from "lucide-react";
// import { createClient } from "@/utils/supabase/server";
// import Logout from "@/components/Logout";
// import { ModeToggle } from "@/components/mode-toggle";
// import { Fragment } from "react";

// // Small client form for lead capture
// function deadlineLabel() {
//   const d = new Date(2025, 11, 15); // Dec 15, 2025
//   return d.toLocaleDateString(undefined, {
//     month: "short",
//     day: "numeric",
//   });
// }

// export default async function Home() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   return (
//     <main className="min-h-screen bg-background">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-14 lg:h-16">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="h-8 w-8 rounded-full bg-primary" />
//               <div className="text-xl sm:text-2xl font-bold bg-primary bg-clip-text text-transparent">
//                 Zevaux
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center gap-6">
//               <Link
//                 href="#what-you-get"
//                 className="text-muted-foreground hover:text-accent-foreground transition-colors font-medium"
//               >
//                 What You Get
//               </Link>
//               <Link
//                 href="#industries"
//                 className="text-muted-foreground hover:text-accent-foreground transition-colors font-medium"
//               >
//                 Industries
//               </Link>
//               <Link
//                 href="#trusted"
//                 className="text-muted-foreground hover:text-accent-foreground transition-colors font-medium"
//               >
//                 Trusted By
//               </Link>
//               <div className="flex items-center gap-x-4">
//                 {!user ? (
//                   <Fragment>
//                     <ModeToggle />
//                     <Button variant="outline">
//                       <Link href="/login">Login</Link>
//                     </Button>
//                     <Link href="/checkout">
//                       <Button className="bg-primary hover:opacity-90 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
//                         Start My Free 4-Month Trial
//                       </Button>
//                     </Link>
//                   </Fragment>
//                 ) : (
//                   <Fragment>
//                     <Link
//                       href="/dashboard"
//                       className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground transition-colors font-medium"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       <span>Dashboard</span>
//                     </Link>
//                     <div className="flex items-center gap-x-2 text-sm">
//                       {user?.email}
//                     </div>
//                     <ModeToggle />
//                     <Logout />
//                   </Fragment>
//                 )}
//               </div>
//             </div>

//             {/* Mobile CTA */}
//             <div className="lg:hidden flex items-center gap-2">
//               <Link href="/checkout">
//                 <Button size="sm" className="bg-primary text-white">
//                   Start Trial
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-linear-to-br from-pink-100/50 via-background to-purple-100/50" />
//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
//           <div className="text-center max-w-5xl mx-auto">
//             <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/30 mb-4">
//               <span className="text-sm font-semibold text-primary">
//                 December Exclusive Deal
//               </span>
//             </div>

//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
//               AI Receptionist.
//               <span className="bg-primary bg-clip-text text-transparent">
//                 {" "}
//                 Get 500 Min for free.
//               </span>
//             </h1>
//             <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
//               Answers calls 24/7 • Books appointments • Follows up with old
//               leads • No setup cost, no hidden fees
//             </p>

//             <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <Link href="/checkout">
//                 <Button className="bg-primary hover:opacity-90 text-white text-lg px-7 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
//                   Get 500 Min for free
//                 </Button>
//               </Link>
//               <Button
//                 variant="outline"
//                 className="text-lg px-7 py-3 rounded-lg border-2"
//               >
//                 <Play className="w-5 h-5 mr-2" />
//                 Watch Demo
//               </Button>
//             </div>

//             <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                   />
//                 ))}
//               </div>
//               <span>Rated 4.8/5</span>
//             </div>

//             <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
//               <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
//                 Claim by {deadlineLabel()}
//               </div>
//               <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
//                 No credit charge — just card verification
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* What You Get */}
//       <section id="what-you-get" className="py-16">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
//             What You Get
//           </h2>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[
//               {
//                 icon: Phone,
//                 title: "Never Miss a Client Call",
//                 desc: "AI answers every call and books appointments.",
//               },
//               {
//                 icon: MessageSquare,
//                 title: "Bring Back Old Leads Automatically",
//                 desc: "Outbound AI follow-ups that convert dormant contacts into revenue.",
//               },
//               {
//                 icon: Users,
//                 title: "Serve Customers in Their Language",
//                 desc: "Multilingual AI that sounds native and professional.",
//               },
//               {
//                 icon: Calendar,
//                 title: "Automatically Book Into Your CRM",
//                 desc: "Appointments go directly into your existing system.",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Know Exactly What’s Working",
//                 desc: "Recordings, transcripts, revenue tracking and insights.",
//               },
//               {
//                 icon: Zap,
//                 title: "Free Setup",
//                 desc: "We configure everything for you.",
//               },
//             ].map((f, i) => (
//               <Card
//                 key={i}
//                 className="p-6 border-border/50 hover:border-accent-foreground/30 transition-colors"
//               >
//                 <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
//                   <f.icon className="w-5 h-5 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
//                 <p className="text-muted-foreground">{f.desc}</p>
//               </Card>
//             ))}
//           </div>
//           <div className="mt-10 flex justify-center">
//             <Link href="/checkout">
//               <Button className="bg-primary text-white">
//                 Claim Your 4-Months Free Offer
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Industries + sample copy */}
//       <section id="industries" className="py-16 bg-muted/20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
//             Listen to live calls with our AI Receptionist
//           </h2>
//           <div className="grid md:grid-cols-2 gap-10">
//             {[
//               {
//                 emoji: "❄️",
//                 title: "HVAC & Plumbing",
//                 text: "When every call could be a service visit, responsiveness is everything. Zevaux captures emergency calls, books same-day appointments, and dispatches high-priority jobs so technicians stay on the road.",
//               },
//               {
//                 emoji: "🍽️",
//                 title: "Restaurant & Hospitality",
//                 text: "From reservations to take-away orders, our AI answers instantly, books tables, confirms orders and manages reminders — freeing your team to focus on hospitality.",
//               },
//               {
//                 emoji: "🦷",
//                 title: "Dental & Orthodontics",
//                 text: "Never lose a patient to voicemail again. Our AI books appointments, handles inbound/outbound calls, sends reminders, collects new-patient data, and integrates with your PMS/CRM.",
//               },
//               {
//                 emoji: "🧼",
//                 title: "Cleaning Services",
//                 text: "Answer calls, send quotes, book jobs, confirm details and handle reschedules automatically. Typical clients recover missed calls and add new revenue quickly.",
//               },
//             ].map((it, i) => (
//               <Card key={i} className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="text-2xl font-semibold mb-2">
//                       <span className="mr-2">{it.emoji}</span>
//                       {it.title}
//                     </h3>
//                     <p className="text-muted-foreground mb-4">{it.text}</p>
//                   </div>
//                 </div>
//                 {/* Placeholder player row */}
//                 <div className="flex items-center gap-4 rounded-lg bg-muted p-3">
//                   <Button variant="outline" size="icon">
//                     <Play className="w-4 h-4" />
//                   </Button>
//                   <div className="text-sm text-muted-foreground">
//                     Sample recording preview — coming soon
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Trusted logos */}
//       <section id="trusted" className="py-16">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
//             Trusted by top COMPANIES
//           </h2>
//         </div>
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
//             {Array.from({ length: 12 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-14 rounded-lg border border-border/40 bg-card flex items-center justify-center text-muted-foreground"
//               >
//                 Logo
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Fast start + mini lead form */}
//       <section className="py-20 bg-linear-to-b from-primary/10 to-background">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto mb-8">
//             <h2 className="text-3xl md:text-5xl font-bold mb-3">
//               Start in 3 Minutes — No Risk, All Reward
//             </h2>
//             <p className="text-muted-foreground">
//               Connect your card (no charge) to activate your free 4-month plan
//               before {deadlineLabel()}.
//             </p>
//           </div>

//           <div className="max-w-2xl mx-auto">
//             <Card className="p-6">
//               <form className="space-y-4" action="/checkout" method="get">
//                 <div>
//                   <label className="text-sm font-medium">
//                     What’s the name of your company? *
//                   </label>
//                   <Input
//                     name="company"
//                     placeholder="Company Name"
//                     required
//                     className="mt-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium">Company Website</label>
//                   <Input
//                     name="website"
//                     placeholder="samplecompany.com"
//                     className="mt-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium">Full Name *</label>
//                   <Input
//                     name="fullName"
//                     placeholder="Full Name"
//                     required
//                     className="mt-2"
//                   />
//                 </div>
//                 <Button type="submit" className="w-full bg-primary text-white">
//                   Next
//                 </Button>
//               </form>
//             </Card>

//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
//               <div className="flex items-center gap-2">
//                 <ShieldCheck className="w-4 h-4" />
//                 Secure checkout
//               </div>
//               <div className="flex items-center gap-2">
//                 <Headphones className="w-4 h-4" />
//                 24/7 Support
//               </div>
//               <div className="flex items-center gap-2">
//                 <Check className="w-4 h-4" />
//                 No hidden fees
//               </div>
//               <div className="flex items-center gap-2">
//                 <Rocket className="w-4 h-4" />
//                 Instant Activation
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-border/40 bg-background py-10">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-2">
//               <div className="h-7 w-7 rounded-full bg-primary" />
//               <div className="font-semibold">Zevaux</div>
//             </div>
//             <div className="text-xs text-muted-foreground text-center sm:text-left">
//               This site is not a part of the Facebook website or Facebook, Inc.
//               This site is NOT endorsed by Facebook in any way. FACEBOOK is a
//               trademark of FACEBOOK, Inc.
//             </div>
//           </div>

//           <div className="mt-6 text-center text-muted-foreground text-sm">
//             <p>&copy; 2025 Zevaux Inc. All rights reserved.</p>
//             <div className="mt-2 flex items-center justify-center gap-3">
//               <Link href="#" className="hover:text-foreground">
//                 Privacy Policy
//               </Link>
//               <span>•</span>
//               <Link href="#" className="hover:text-foreground">
//                 Terms of Service
//               </Link>
//               <span>•</span>
//               <Link href="/" className="hover:text-foreground">
//                 Zevaux Website
//               </Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </main>
//   );
// }

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
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Logout from "@/components/Logout";
import { ModeToggle } from "@/components/mode-toggle";
import { Fragment } from "react";
import Image from "next/image";
import skylightlogo from "../public/Ethiopian-Skylight-hotel-logo.png";

function deadlineLabel() {
  const d = new Date(2025, 11, 15);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70" />
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Zevaux
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#industries"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Industries
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Results
              </Link>
              <div className="flex items-center gap-4">
                {!user ? (
                  <Fragment>
                    <ModeToggle />
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      asChild
                    >
                      <Link href="/checkout">Start Free Trial</Link>
                    </Button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {user?.email}
                    </div>
                    <ModeToggle />
                    <Logout />
                  </Fragment>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center gap-2">
              <Button size="sm" asChild className="bg-primary text-white">
                <Link href="/checkout">Start Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">
                December Limited Offer
              </span>
              <span className="text-xs text-muted-foreground">
                Ends {deadlineLabel()}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="block">AI-Powered Receptionist</span>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                500 Free Minutes Included
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Answers calls 24/7, books appointments for you, and automatically
              follows up with existing leads without additional costs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/checkout">Claim 500 Free Minutes</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 px-8 py-3 rounded-lg text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span>4.8/5 Customer Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>2,000+ Active Businesses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Availability</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Zero Setup Fees</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                  <Check className="w-4 h-4" />
                  <span>Card Verification Only</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                  <Zap className="w-4 h-4" />
                  <span>3-Minute Activation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Here’s What You Get
            </h2>
            {/* <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to transform phone operations into a
              revenue-generating asset
            </p> */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "24/7 Call Answering",
                description:
                  "Never miss important client calls with AI receptionists that handle every inquiry professionally.",
                gradient: "from-blue-500/10 to-blue-500/5",
                iconColor: "text-blue-600",
              },
              {
                icon: MessageSquare,
                title: "Automatically Follows Up with Old Leads",
                description:
                  "Convert inactive contacts into active opportunities with intelligent follow-up campaigns.",
                gradient: "from-green-500/10 to-green-500/5",
                iconColor: "text-green-600",
              },
              {
                icon: Globe,
                title: "Multilingual Support",
                description:
                  "Serve customers in their preferred language with natural-sounding AI conversations.",
                gradient: "from-purple-500/10 to-purple-500/5",
                iconColor: "text-purple-600",
              },
              {
                icon: Calendar,
                title: "Automatically Book Into Your CRM",
                description:
                  "Seamlessly sync appointments and contacts with your existing business systems.",
                gradient: "from-orange-500/10 to-orange-500/5",
                iconColor: "text-orange-600",
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                description:
                  "Track conversions, call quality, and revenue impact through detailed insights.",
                gradient: "from-red-500/10 to-red-500/5",
                iconColor: "text-red-600",
              },
              {
                icon: TrendingUp,
                title: "Growth Optimization",
                description:
                  "Identify patterns and opportunities to maximize customer acquisition efficiency.",
                gradient: "from-primary/10 to-primary/5",
                iconColor: "text-primary",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-8 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-3"
              asChild
            >
              <Link href="/checkout">Begin 4-Month Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Applications */}
      <section id="industries" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {/* Listen to real-time calls managed by our AI Receptionist */}
              Listen to live calls with our AI Receptionist
            </h2>
            {/* <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Listen in on real-time calls managed by our AI Receptionist
            </p> */}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                icon: "❄️",
                title: "HVAC & Home Services",
                description:
                  "Capture emergency service calls, schedule urgent appointments, and dispatch technicians efficiently with AI that understands your business priorities.",
                highlights: [
                  "Same-day booking",
                  "Priority dispatch",
                  "Emergency response",
                ],
              },
              {
                icon: "🦷",
                title: "Healthcare Practices",
                description:
                  "Handle patient inquiries, appointment scheduling, and follow-up reminders while maintaining compliance and patient confidentiality standards.",
                highlights: [
                  "HIPAA compliant",
                  "Patient intake",
                  "Reminder system",
                ],
              },
              {
                icon: "🍽️",
                title: "Resturant & Dining",
                description:
                  "Manage reservations, take orders, and handle customer inquiries without additional staff, enhancing guest experience and operational efficiency.",
                highlights: [
                  "Reservation management",
                  "Order taking",
                  "Waitlist handling",
                ],
              },
              {
                icon: "🧼",
                title: "Professional Services",
                description:
                  "Convert inquiries into booked appointments, qualify leads automatically, and ensure consistent customer communication across all touchpoints.",
                highlights: [
                  "Lead qualification",
                  "Appointment booking",
                  "Follow-up automation",
                ],
              },
            ].map((industry, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-3xl">{industry.icon}</span>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {industry.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {industry.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {industry.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Listen to Sample Conversation
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results & Social Proof */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Proven Business Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses already transforming their operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { value: "98%", label: "Call Answer Rate" },
              { value: "40%", label: "Lead Recovery Improvement" },
              { value: "3 min", label: "Average Setup Time" },
            ].map((stat, index) => (
              <Card key={index} className="p-8 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Trusted Companies */}
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-muted-foreground mb-6">
              Trusted by Industry Leaders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 space-y-6">
              {Array.from({ length: 8 }).map((_, i) => (
                // <div
                //   key={i}
                //   className="h-32 rounded-xl border border-border/40 bg-card/50 flex items-center justify-center text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                // >
                <Image
                  src={skylightlogo}
                  width={300}
                  height={50}
                  alt="Partner Logo"
                />
                // </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">
                Limited Time Offer
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your 4-Month Free Trial Today
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Experience full platform capabilities with 500 included minutes.
              No charges until your trial period ends.
            </p>

            <Card className="p-8 mb-10">
              <form className="space-y-6" action="/checkout" method="get">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Business Name *
                    </label>
                    <Input
                      name="company"
                      placeholder="Enter business name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website URL</label>
                    <Input
                      name="website"
                      placeholder="yourbusiness.com"
                      type="url"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Primary Contact *
                  </label>
                  <Input name="fullName" placeholder="Full name" required />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-3"
                >
                  Activate Free Trial
                </Button>
              </form>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
                <Headphones className="w-5 h-5 text-primary" />
                <span>Dedicated Support</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
                <Check className="w-5 h-5 text-primary" />
                <span>Transparent Pricing</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
                <Rocket className="w-5 h-5 text-primary" />
                <span>Rapid Deployment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70" />
              <div className="text-xl font-bold">Zevaux</div>
            </div>

            <div className="text-center md:text-left">
              <p className="text-xs text-muted-foreground max-w-md">
                This platform operates independently and is not affiliated with
                Facebook, Inc. Facebook is a registered trademark of Facebook,
                Inc.
              </p>
            </div>
          </div> */}

          <div className="pt-8 border-t border-border/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Zevaux Technologies. All rights
                reserved.
              </div>

              <div className="flex items-center gap-6 text-sm">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Company Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Check,
//   Phone,
//   Calendar,
//   BarChart3,
//   MessageSquare,
//   Zap,
//   Users,
//   Play,
//   Star,
//   ChevronRight,
//   LayoutDashboard,
// } from "lucide-react";
// import { createClient } from "@/utils/supabase/server";
// import Logout from "@/components/Logout";
// import { ModeToggle } from "@/components/mode-toggle";

// export default async function Home() {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   return (
//     <main className="min-h-screen bg-background">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-14 lg:h-16">
//             <div className="text-2xl font-bold bg-primary bg-clip-text text-transparent">
//               Zevaux
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center gap-8">
//               <Link
//                 href="#features"
//                 className="text-muted-foreground hover:text-accent-foreground transition-colors duration-200 font-medium"
//               >
//                 Features
//               </Link>
//               <Link
//                 href="#pricing"
//                 className="text-muted-foreground hover:text-accent-foreground transition-colors duration-200 font-medium"
//               >
//                 Pricing
//               </Link>
//               <div className="flex items-center gap-x-5">
//                 {!user ? (
//                   <>
//                     <ModeToggle />
//                     <Button variant="outline">
//                       <Link href="/login">Login</Link>
//                     </Button>
//                     <Link href="/signup">
//                       <Button className="bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
//                         Get Started
//                       </Button>
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link
//                       href="/dashboard"
//                       className="flex items-center gap-2 text-muted-foreground hover:text-accent-foreground transition-colors duration-200 font-medium"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       <span>Dashboard</span>
//                     </Link>
//                     <div className="flex items-center gap-x-2 text-sm">
//                       {user?.email}
//                     </div>
//                     <ModeToggle />
//                     <Logout />
//                   </>
//                 )}
//               </div>
//             </div>
//             {/* Mobile Menu Button */}
//             <div className="lg:hidden">
//               <Button variant="ghost" size="icon" className="lg:hidden">
//                 <div className="space-y-1">
//                   <div className="w-6 h-0.5 bg-foreground"></div>
//                   <div className="w-6 h-0.5 bg-foreground"></div>
//                   <div className="w-4 h-0.5 bg-foreground"></div>
//                 </div>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-background to-purple-50/50"></div>
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
//           <div className="text-center max-w-4xl mx-auto">
//             <div className="mb-6 inline-flex items-center gap-2 bg-accent-foreground/10 px-4 py-2 rounded-full border border-accent-foreground/20">
//               <Zap className="w-4 h-4 text-accent-foreground" />
//               <span className="text-sm font-semibold text-accent-foreground">
//                 Powered by Zevaux
//               </span>
//             </div>

//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground text-balance leading-tight">
//               Your AI Receptionist,
//               <span className="bg-primary bg-clip-text text-transparent">
//                 {" "}
//                 Ready in 5 Minutes
//               </span>
//             </h1>

//             <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
//               Stop missing calls. Automate inbound calls, schedule appointments,
//               and manage customer inquiries with an intelligent AI receptionist
//               that sounds and acts like a real person.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
//               <Link href="/signup">
//                 <Button className="bg-primary hover:opacity-90 text-white text-lg px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
//                   Start Free Trial
//                 </Button>
//               </Link>

//               <Button
//                 variant="outline"
//                 className="text-lg px-8 py-3 rounded-lg border-2 hover:bg-accent hover:scale-105 transition-all duration-200 group"
//               >
//                 <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
//                 Watch Demo
//               </Button>
//             </div>

//             <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-1">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                   />
//                 ))}
//               </div>
//               <span>Rated 4.9/5 by 500+ businesses</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Social Proof */}
//       <section className="bg-muted/30 py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <p className="text-center text-muted-foreground text-sm mb-8 font-medium">
//             Trusted by leading businesses worldwide
//           </p>
//           <div className="flex items-center justify-center gap-8 md:gap-12 lg:gap-16 flex-wrap opacity-70">
//             {[
//               "TechCorp",
//               "HealthPlus",
//               "RetailCo",
//               "ServicePro",
//               "FinanceHub",
//               "InnovateLabs",
//             ].map((company) => (
//               <div
//                 key={company}
//                 className="font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm md:text-base"
//               >
//                 {company}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-24 bg-background">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
//               Powerful Features
//             </h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Everything you need to automate customer interactions and grow
//               your business efficiently
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
//             {[
//               {
//                 icon: Phone,
//                 title: "Natural Voice AI",
//                 description:
//                   "Powered by GPT-4o, our AI sounds and acts like a real receptionist. Handles complex conversations, understands context, and provides personalized responses.",
//               },
//               {
//                 icon: Calendar,
//                 title: "Smart Scheduling",
//                 description:
//                   "Automatically sync with Google Calendar, Outlook, or your custom calendar. Book appointments, check availability, and send confirmations instantly.",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Real-time Analytics",
//                 description:
//                   "Track call duration, transcripts, customer sentiment, and conversion rates. Get actionable insights to improve your business performance.",
//               },
//               {
//                 icon: MessageSquare,
//                 title: "Multi-channel Support",
//                 description:
//                   "Handle calls, SMS, WhatsApp, and email from a single dashboard. Provide consistent customer experience across all channels.",
//               },
//               {
//                 icon: Zap,
//                 title: "Instant Setup",
//                 description:
//                   "Get your AI receptionist running in minutes. No coding required. Customize voice, personality, and responses through our intuitive dashboard.",
//               },
//               {
//                 icon: Users,
//                 title: "Team Collaboration",
//                 description:
//                   "Invite team members, set permissions, and collaborate seamlessly. Share call recordings, notes, and customer information securely.",
//               },
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 className="group bg-card border border-border/50 rounded-xl p-6 hover:border-accent-foreground/30 hover:shadow-lg transition-all duration-300 hover:scale-105"
//               >
//                 <div className="mb-4 inline-flex p-3 bg-linear-to-br from-accent-foreground/10 to-blue-600/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
//                   <feature.icon className="w-6 h-6 text-accent-foreground" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent-foreground transition-colors">
//                   {feature.title}
//                 </h3>
//                 <p className="text-muted-foreground leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section id="pricing" className="py-24 bg-muted/20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
//               Simple, Transparent Pricing
//             </h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Choose the plan that fits your business.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//             {[
//               {
//                 name: "Starter",
//                 description: "Perfect for small businesses",
//                 price: "$99",
//                 popular: false,
//                 features: [
//                   "500 minutes/month",
//                   "1 phone number",
//                   "Basic analytics",
//                   "Email support",
//                 ],
//                 buttonText: "Get Started",
//                 buttonVariant: "outline" as const,
//               },
//               {
//                 name: "Pro",
//                 description: "For growing teams",
//                 price: "$299",
//                 popular: true,
//                 features: [
//                   "1,500 minutes/month",
//                   "3 phone numbers",
//                   "Advanced analytics",
//                   "WhatsApp & SMS",
//                   "Priority support",
//                 ],
//                 buttonText: "Get Started",
//                 buttonVariant: "default" as const,
//               },
//             ].map((plan, index) => (
//               <div
//                 key={index}
//                 className={`relative bg-card border rounded-2xl p-8 flex flex-col ${
//                   plan.popular
//                     ? "border-accent-foreground shadow-xl scale-100"
//                     : "border-border hover:border-accent-foreground/30 hover:shadow-lg transition-all duration-300"
//                 }`}
//               >
//                 {plan.popular && (
//                   <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                     <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
//                       Most Popular
//                     </span>
//                   </div>
//                 )}

//                 <h3 className="text-2xl font-bold mb-2 text-foreground">
//                   {plan.name}
//                 </h3>
//                 <p className="text-muted-foreground mb-6">{plan.description}</p>

//                 <div className="mb-6">
//                   <span className="text-4xl font-bold text-foreground">
//                     {plan.price}
//                   </span>
//                   {plan.price !== "Custom" && (
//                     <span className="text-muted-foreground">/month</span>
//                   )}
//                 </div>

//                 <ul className="space-y-3 mb-8 flex-1">
//                   {plan.features.map((feature, featureIndex) => (
//                     <li key={featureIndex} className="flex items-center gap-3">
//                       <Check className="w-5 h-5 text-accent-foreground shrink-0" />
//                       <span className="text-muted-foreground">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <Button
//                   variant={plan.buttonVariant}
//                   className={`w-full rounded-lg py-3 text-base font-medium ${
//                     plan.popular
//                       ? "bg-primary hover:opacity-90 text-white shadow-lg hover:shadow-xl"
//                       : "hover:bg-accent"
//                   } transition-all duration-200 hover:scale-105`}
//                 >
//                   {plan.buttonText}
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 bg-linear-to-br from-accent-foreground/5 via-background to-blue-600/5">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
//             Ready to transform your business?
//           </h2>
//           <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
//             Join hundreds of businesses already using Zevaux to automate their
//             customer interactions and boost efficiency.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Link href="/signup">
//               <Button className="bg-primary hover:opacity-90 text-white text-lg px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
//                 Get Started
//               </Button>
//             </Link>
//             <Button
//               variant="outline"
//               className="text-lg px-8 py-3 rounded-lg border-2 group hover:bg-accent transition-all duration-200"
//             >
//               Schedule a Demo
//               <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//             </Button>
//           </div>
//           <p className="text-muted-foreground/70 mt-6 text-sm">
//             Setup in 5 minutes
//           </p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-border/40 bg-background py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
//             <div className="lg:col-span-2">
//               <div className="text-2xl font-bold bg-primary bg-clip-text text-transparent mb-4">
//                 Zevaux
//               </div>
//               <p className="text-muted-foreground text-sm max-w-md">
//                 AI-powered receptionist for modern businesses. Automate your
//                 customer interactions with intelligent voice AI that never
//                 misses a call.
//               </p>
//             </div>

//             {[
//               {
//                 title: "Product",
//                 links: ["Features", "Pricing", "Security", "Integrations"],
//               },
//               {
//                 title: "Company",
//                 links: ["About", "Blog", "Careers", "Contact"],
//               },
//               {
//                 title: "Legal",
//                 links: ["Privacy", "Terms", "Compliance", "GDPR"],
//               },
//             ].map((section, index) => (
//               <div key={index}>
//                 <h4 className="font-semibold text-foreground mb-4">
//                   {section.title}
//                 </h4>
//                 <ul className="space-y-2 text-sm">
//                   {section.links.map((link, linkIndex) => (
//                     <li key={linkIndex}>
//                       <Link
//                         href="#"
//                         className="text-muted-foreground hover:text-foreground transition-colors duration-200"
//                       >
//                         {link}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-border/40 pt-8 text-center text-muted-foreground text-sm">
//             <p>
//               &copy; 2025 Zevaux. All rights reserved. Built for modern
//               businesses.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </main>
//   );
// }
