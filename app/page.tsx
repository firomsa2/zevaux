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
//   Globe,
//   Clock,
//   TrendingUp,
// } from "lucide-react";
// import { createClient } from "@/utils/supabase/server";
// import Logout from "@/components/Logout";
// import { ModeToggle } from "@/components/mode-toggle";
// import { Fragment } from "react";
// import Image from "next/image";
// import skylightlogo from "../public/Ethiopian-Skylight-hotel-logo.png";

// function deadlineLabel() {
//   const d = new Date(2025, 11, 15);
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
//               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70" />
//               <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
//                 Zevaux
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center gap-8">
//               <Link
//                 href="#features"
//                 className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Features
//               </Link>
//               <Link
//                 href="#industries"
//                 className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Industries
//               </Link>
//               <Link
//                 href="#testimonials"
//                 className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Results
//               </Link>
//               <div className="flex items-center gap-4">
//                 {!user ? (
//                   <Fragment>
//                     <ModeToggle />
//                     <Button variant="ghost" size="sm" asChild>
//                       <Link href="/login">Sign In</Link>
//                     </Button>
//                     <Button
//                       className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
//                       asChild
//                     >
//                       <Link href="/checkout">Start Free Trial</Link>
//                     </Button>
//                   </Fragment>
//                 ) : (
//                   <Fragment>
//                     <Link
//                       href="/dashboard"
//                       className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       Dashboard
//                     </Link>
//                     <div className="text-sm text-muted-foreground">
//                       {user?.email}
//                     </div>
//                     <ModeToggle />
//                     <Logout />
//                   </Fragment>
//                 )}
//               </div>
//             </div>

//             {/* Mobile Navigation */}
//             <div className="lg:hidden flex items-center gap-2">
//               <Button size="sm" asChild className="bg-primary text-white">
//                 <Link href="/checkout">Start Trial</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
//         <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
//           <div className="text-center max-w-4xl mx-auto">
//             <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
//               <span className="text-sm font-semibold text-primary">
//                 December Limited Offer
//               </span>
//               <span className="text-xs text-muted-foreground">
//                 Ends {deadlineLabel()}
//               </span>
//             </div>

//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
//               <span className="block">AI-Powered Receptionist</span>
//               <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//                 500 Free Minutes Included
//               </span>
//             </h1>

//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
//               Answers calls 24/7, books appointments for you, and automatically
//               follows up with existing leads without additional costs.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
//               <Button
//                 size="lg"
//                 className="bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
//                 asChild
//               >
//                 <Link href="/checkout">Claim 500 Free Minutes</Link>
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="border-2 px-8 py-3 rounded-lg text-lg"
//               >
//                 <Play className="w-5 h-5 mr-2" />
//                 View Demo
//               </Button>
//             </div>

//             {/* Trust Indicators */}
//             <div className="space-y-6">
//               <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-2">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                       />
//                     ))}
//                   </div>
//                   <span>4.8/5 Customer Rating</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Users className="w-4 h-4" />
//                   <span>2,000+ Active Businesses</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4" />
//                   <span>24/7 Availability</span>
//                 </div>
//               </div>

//               <div className="flex flex-wrap justify-center gap-4 text-sm">
//                 <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
//                   <ShieldCheck className="w-4 h-4" />
//                   <span>Zero Setup Fees</span>
//                 </div>
//                 <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
//                   <Check className="w-4 h-4" />
//                   <span>Card Verification Only</span>
//                 </div>
//                 <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
//                   <Zap className="w-4 h-4" />
//                   <span>3-Minute Activation</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Core Features */}
//       <section id="features" className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Here’s What You Get
//             </h2>
//             {/* <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Everything you need to transform phone operations into a
//               revenue-generating asset
//             </p> */}
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Phone,
//                 title: "24/7 Call Answering",
//                 description:
//                   "Never miss important client calls with AI receptionists that handle every inquiry professionally.",
//                 gradient: "from-blue-500/10 to-blue-500/5",
//                 iconColor: "text-blue-600",
//               },
//               {
//                 icon: MessageSquare,
//                 title: "Automatically Follows Up with Old Leads",
//                 description:
//                   "Convert inactive contacts into active opportunities with intelligent follow-up campaigns.",
//                 gradient: "from-green-500/10 to-green-500/5",
//                 iconColor: "text-green-600",
//               },
//               {
//                 icon: Globe,
//                 title: "Multilingual Support",
//                 description:
//                   "Serve customers in their preferred language with natural-sounding AI conversations.",
//                 gradient: "from-purple-500/10 to-purple-500/5",
//                 iconColor: "text-purple-600",
//               },
//               {
//                 icon: Calendar,
//                 title: "Automatically Book Into Your CRM",
//                 description:
//                   "Seamlessly sync appointments and contacts with your existing business systems.",
//                 gradient: "from-orange-500/10 to-orange-500/5",
//                 iconColor: "text-orange-600",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Performance Analytics",
//                 description:
//                   "Track conversions, call quality, and revenue impact through detailed insights.",
//                 gradient: "from-red-500/10 to-red-500/5",
//                 iconColor: "text-red-600",
//               },
//               {
//                 icon: TrendingUp,
//                 title: "Growth Optimization",
//                 description:
//                   "Identify patterns and opportunities to maximize customer acquisition efficiency.",
//                 gradient: "from-primary/10 to-primary/5",
//                 iconColor: "text-primary",
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className="p-8 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
//               >
//                 <div
//                   className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
//                 >
//                   <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
//                 <p className="text-muted-foreground">{feature.description}</p>
//               </Card>
//             ))}
//           </div>

//           <div className="text-center mt-12">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-3"
//               asChild
//             >
//               <Link href="/checkout">Begin 4-Month Free Trial</Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Industry Applications */}
//       <section id="industries" className="py-20 bg-muted/30">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               {/* Listen to real-time calls managed by our AI Receptionist */}
//               Listen to live calls with our AI Receptionist
//             </h2>
//             {/* <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Listen in on real-time calls managed by our AI Receptionist
//             </p> */}
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8">
//             {[
//               {
//                 icon: "❄️",
//                 title: "HVAC & Home Services",
//                 description:
//                   "Capture emergency service calls, schedule urgent appointments, and dispatch technicians efficiently with AI that understands your business priorities.",
//                 highlights: [
//                   "Same-day booking",
//                   "Priority dispatch",
//                   "Emergency response",
//                 ],
//               },
//               {
//                 icon: "🦷",
//                 title: "Healthcare Practices",
//                 description:
//                   "Handle patient inquiries, appointment scheduling, and follow-up reminders while maintaining compliance and patient confidentiality standards.",
//                 highlights: [
//                   "HIPAA compliant",
//                   "Patient intake",
//                   "Reminder system",
//                 ],
//               },
//               {
//                 icon: "🍽️",
//                 title: "Resturant & Dining",
//                 description:
//                   "Manage reservations, take orders, and handle customer inquiries without additional staff, enhancing guest experience and operational efficiency.",
//                 highlights: [
//                   "Reservation management",
//                   "Order taking",
//                   "Waitlist handling",
//                 ],
//               },
//               {
//                 icon: "🧼",
//                 title: "Professional Services",
//                 description:
//                   "Convert inquiries into booked appointments, qualify leads automatically, and ensure consistent customer communication across all touchpoints.",
//                 highlights: [
//                   "Lead qualification",
//                   "Appointment booking",
//                   "Follow-up automation",
//                 ],
//               },
//             ].map((industry, index) => (
//               <Card
//                 key={index}
//                 className="p-8 hover:shadow-lg transition-shadow"
//               >
//                 <div className="flex items-start gap-4 mb-6">
//                   <span className="text-3xl">{industry.icon}</span>
//                   <div>
//                     <h3 className="text-2xl font-semibold mb-2">
//                       {industry.title}
//                     </h3>
//                     <p className="text-muted-foreground mb-6">
//                       {industry.description}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="space-y-3 mb-8">
//                   {industry.highlights.map((highlight, i) => (
//                     <div key={i} className="flex items-center gap-3">
//                       <div className="w-2 h-2 rounded-full bg-primary" />
//                       <span className="text-sm">{highlight}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <Button variant="outline" className="w-full">
//                   <Play className="w-4 h-4 mr-2" />
//                   Listen to Sample Conversation
//                 </Button>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Results & Social Proof */}
//       <section id="testimonials" className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Proven Business Impact
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Join thousands of businesses already transforming their operations
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 mb-16">
//             {[
//               { value: "98%", label: "Call Answer Rate" },
//               { value: "40%", label: "Lead Recovery Improvement" },
//               { value: "3 min", label: "Average Setup Time" },
//             ].map((stat, index) => (
//               <Card key={index} className="p-8 text-center">
//                 <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
//                   {stat.value}
//                 </div>
//                 <div className="text-muted-foreground">{stat.label}</div>
//               </Card>
//             ))}
//           </div>

//           {/* Trusted Companies */}
//           <div className="text-center mb-8">
//             <h3 className="text-lg font-semibold text-muted-foreground mb-6">
//               Trusted by Industry Leaders
//             </h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 space-y-6">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 // <div
//                 //   key={i}
//                 //   className="h-32 rounded-xl border border-border/40 bg-card/50 flex items-center justify-center text-muted-foreground/60 hover:text-muted-foreground transition-colors"
//                 // >
//                 <Image
//                   src={skylightlogo}
//                   width={300}
//                   height={50}
//                   alt="Partner Logo"
//                 />
//                 // </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-3xl mx-auto text-center">
//             <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
//               <span className="text-sm font-semibold text-primary">
//                 Limited Time Offer
//               </span>
//             </div>

//             <h2 className="text-3xl md:text-4xl font-bold mb-6">
//               Start Your 4-Month Free Trial Today
//             </h2>
//             <p className="text-xl text-muted-foreground mb-10">
//               Experience full platform capabilities with 500 included minutes.
//               No charges until your trial period ends.
//             </p>

//             <Card className="p-8 mb-10">
//               <form className="space-y-6" action="/checkout" method="get">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Business Name *
//                     </label>
//                     <Input
//                       name="company"
//                       placeholder="Enter business name"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Website URL</label>
//                     <Input
//                       name="website"
//                       placeholder="yourbusiness.com"
//                       type="url"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">
//                     Primary Contact *
//                   </label>
//                   <Input name="fullName" placeholder="Full name" required />
//                 </div>

//                 <Button
//                   type="submit"
//                   size="lg"
//                   className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-3"
//                 >
//                   Activate Free Trial
//                 </Button>
//               </form>
//             </Card>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
//                 <ShieldCheck className="w-5 h-5 text-primary" />
//                 <span>Enterprise Security</span>
//               </div>
//               <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
//                 <Headphones className="w-5 h-5 text-primary" />
//                 <span>Dedicated Support</span>
//               </div>
//               <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
//                 <Check className="w-5 h-5 text-primary" />
//                 <span>Transparent Pricing</span>
//               </div>
//               <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
//                 <Rocket className="w-5 h-5 text-primary" />
//                 <span>Rapid Deployment</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-border/40 bg-background py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           {/* <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
//             <div className="flex items-center gap-3">
//               <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70" />
//               <div className="text-xl font-bold">Zevaux</div>
//             </div>

//             <div className="text-center md:text-left">
//               <p className="text-xs text-muted-foreground max-w-md">
//                 This platform operates independently and is not affiliated with
//                 Facebook, Inc. Facebook is a registered trademark of Facebook,
//                 Inc.
//               </p>
//             </div>
//           </div> */}

//           <div className="pt-8 border-t border-border/40">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-muted-foreground">
//                 © {new Date().getFullYear()} Zevaux Technologies. All rights
//                 reserved.
//               </div>

//               <div className="flex items-center gap-6 text-sm">
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   Privacy Policy
//                 </Link>
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   Terms of Service
//                 </Link>
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   Contact Support
//                 </Link>
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   Company Website
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </main>
//   );
// }

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
//   Globe,
//   Clock,
//   TrendingUp,
//   ArrowRight,
//   ChevronRight,
//   Volume2,
//   Mic,
//   Settings,
//   Lock,
//   BadgeCheck,
// } from "lucide-react";
// import { createClient } from "@/utils/supabase/server";
// import Logout from "@/components/Logout";
// import { ModeToggle } from "@/components/mode-toggle";
// import { Fragment } from "react";
// import Image from "next/image";
// import skylightlogo from "../public/Ethiopian-Skylight-hotel-logo.png";

// function deadlineLabel() {
//   const d = new Date(2025, 11, 15);
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
//       {/* Navigation - Enhanced */}
//       <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             <Link href="/" className="flex items-center gap-3">
//               <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
//                 <Volume2 className="w-5 h-5 text-white" />
//               </div>
//               <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
//                 Zevaux AI
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center gap-10">
//               <div className="flex items-center gap-8">
//                 <Link
//                   href="#features"
//                   className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:scale-105"
//                 >
//                   Features
//                 </Link>
//                 <Link
//                   href="#demos"
//                   className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:scale-105"
//                 >
//                   Live Demos
//                 </Link>
//                 <Link
//                   href="#results"
//                   className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:scale-105"
//                 >
//                   Results
//                 </Link>
//                 <Link
//                   href="#pricing"
//                   className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:scale-105"
//                 >
//                   Pricing
//                 </Link>
//               </div>
//               <div className="flex items-center gap-4">
//                 {!user ? (
//                   <Fragment>
//                     <ModeToggle />
//                     <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5">
//                       <Link href="/login">Sign In</Link>
//                     </Button>
//                     <Button
//                       className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
//                       asChild
//                     >
//                       <Link href="/checkout" className="flex items-center gap-2">
//                         Start Free Trial
//                         <ArrowRight className="w-4 h-4" />
//                       </Link>
//                     </Button>
//                   </Fragment>
//                 ) : (
//                   <Fragment>
//                     <Link
//                       href="/dashboard"
//                       className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       Dashboard
//                     </Link>
//                     <div className="text-sm text-muted-foreground">
//                       {user?.email}
//                     </div>
//                     <ModeToggle />
//                     <Logout />
//                   </Fragment>
//                 )}
//               </div>
//             </div>

//             {/* Mobile Navigation */}
//             <div className="lg:hidden flex items-center gap-3">
//               <ModeToggle />
//               <Button size="sm" asChild className="bg-primary text-white hover:bg-primary/90">
//                 <Link href="/checkout">Start Trial</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section - Redesigned */}
//       <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
//         <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))]" />
//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
//                 <Zap className="w-4 h-4 text-primary" />
//                 <span className="text-sm font-semibold text-primary">
//                   December Limited Offer
//                 </span>
//                 <span className="text-xs text-muted-foreground">
//                   Ends {deadlineLabel()}
//                 </span>
//               </div>

//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
//                 <span className="block text-foreground">Goodbye Missed Calls.</span>
//                 <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//                   Hello AI Receptionist.
//                 </span>
//               </h1>

//               <p className="text-xl text-muted-foreground mb-10 max-w-xl">
//                 Turn missed calls into new customers with an AI Receptionist that answers 24/7,
//                 books appointments automatically, and follows up with leads—all while working with any phone system.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 mb-12">
//                 <Button
//                   size="lg"
//                   className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group"
//                   asChild
//                 >
//                   <Link href="/checkout" className="flex items-center gap-2">
//                     Claim 500 Free Minutes
//                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="border-2 px-8 py-6 rounded-xl text-lg hover:bg-primary/5 group"
//                 >
//                   <Play className="w-5 h-5 mr-2 group-hover:text-primary" />
//                   Watch Live Demo
//                 </Button>
//               </div>

//               {/* Trust Indicators */}
//               <div className="space-y-6">
//                 <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-2">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                         />
//                       ))}
//                     </div>
//                     <span className="font-medium">4.8/5 (2,000+ reviews)</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <ShieldCheck className="w-4 h-4 text-primary" />
//                     <span>Enterprise Security</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-primary" />
//                     <span>3-Minute Setup</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Hero Visual */}
//             <div className="relative">
//               <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                     <div className="text-sm font-medium">Live AI Receptionist Demo</div>
//                   </div>

//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
//                       <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
//                         <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium">Incoming Call</div>
//                         <div className="text-sm text-muted-foreground">New customer inquiry</div>
//                       </div>
//                       <BadgeCheck className="w-5 h-5 text-green-500" />
//                     </div>

//                     <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
//                       <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
//                         <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium">Appointment Booked</div>
//                         <div className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</div>
//                       </div>
//                       <div className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
//                         +$500
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
//                       <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
//                         <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium">Lead Follow-up</div>
//                         <div className="text-sm text-muted-foreground">3 old leads contacted</div>
//                       </div>
//                       <div className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
//                         Automated
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Setup Process - New Section */}
//       <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Set Up and Start Answering Calls
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Get your AI Receptionist working in minutes—no IT support needed
//             </p>
//           </div>

//           <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
//             {[
//               {
//                 step: "1",
//                 icon: Settings,
//                 title: "Pick Your AI",
//                 description: "Choose a professional voice & personality that matches your brand",
//                 color: "from-blue-500/20 to-blue-500/10",
//               },
//               {
//                 step: "2",
//                 icon: Mic,
//                 title: "Train in Minutes",
//                 description: "Upload your website, FAQs, or documents to customize knowledge",
//                 color: "from-green-500/20 to-green-500/10",
//               },
//               {
//                 step: "3",
//                 icon: Phone,
//                 title: "Customize Routing",
//                 description: "Set up rules for call routing, scheduling, and lead capture",
//                 color: "from-purple-500/20 to-purple-500/10",
//               },
//               {
//                 step: "4",
//                 icon: Zap,
//                 title: "Go Live",
//                 description: "Activate and start answering calls 24/7 automatically",
//                 color: "from-orange-500/20 to-orange-500/10",
//               },
//             ].map((step, index) => (
//               <div key={index} className="relative">
//                 <Card className="p-8 text-center border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
//                   <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${step.color} border-2 border-background flex items-center justify-center font-bold text-primary`}>
//                     {step.step}
//                   </div>
//                   <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-6`}>
//                     <step.icon className="w-6 h-6 text-primary" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
//                   <p className="text-muted-foreground text-sm">{step.description}</p>
//                 </Card>
//                 {index < 3 && (
//                   <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-transparent transform translate-x-4"></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Core Features - Enhanced */}
//       <section id="features" className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Your Always-On, Reliable Front Desk
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Handle more calls with consistent, friendly service—no extra staff needed
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Phone,
//                 title: "24/7 Call Answering",
//                 subhead: "Never miss a business opportunity",
//                 description: "AI receptionists handle every inquiry professionally, even after hours and during peak times.",
//                 gradient: "from-blue-500/20 to-blue-500/10",
//                 iconColor: "text-blue-600",
//                 features: ["No voicemail jail", "Multilingual support", "Instant response"],
//               },
//               {
//                 icon: MessageSquare,
//                 title: "Automated Lead Follow-up",
//                 subhead: "Convert inactive contacts into revenue",
//                 description: "Intelligent follow-up campaigns re-engage old leads and capture missed opportunities.",
//                 gradient: "from-green-500/20 to-green-500/10",
//                 iconColor: "text-green-600",
//                 features: ["CRM integration", "Personalized messages", "Timed sequences"],
//               },
//               {
//                 icon: Globe,
//                 title: "Multilingual Support",
//                 subhead: "Serve customers in their language",
//                 description: "Natural conversations in multiple languages with mid-call language switching.",
//                 gradient: "from-purple-500/20 to-purple-500/10",
//                 iconColor: "text-purple-600",
//                 features: ["English, Spanish, French", "Accent adaptation", "Cultural context"],
//               },
//               {
//                 icon: Calendar,
//                 title: "Smart Appointment Booking",
//                 subhead: "Seamless calendar integration",
//                 description: "Syncs with your CRM and calendar to book, reschedule, and confirm appointments 24/7.",
//                 gradient: "from-orange-500/20 to-orange-500/10",
//                 iconColor: "text-orange-600",
//                 features: ["Calendar sync", "Auto-confirmations", "Reminder texts"],
//               },
//               {
//                 icon: BarChart3,
//                 title: "Performance Analytics",
//                 subhead: "Data-driven insights",
//                 description: "Track conversions, call quality, and revenue impact with detailed dashboards.",
//                 gradient: "from-red-500/20 to-red-500/10",
//                 iconColor: "text-red-600",
//                 features: ["Call transcripts", "Conversion tracking", "ROI reporting"],
//               },
//               {
//                 icon: TrendingUp,
//                 title: "Growth Optimization",
//                 subhead: "Maximize customer acquisition",
//                 description: "Identify patterns and opportunities to improve conversion rates and efficiency.",
//                 gradient: "from-primary/20 to-primary/10",
//                 iconColor: "text-primary",
//                 features: ["Trend analysis", "Optimization tips", "A/B testing"],
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className="p-8 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
//               >
//                 <div
//                   className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}
//                 >
//                   <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-primary font-medium text-sm mb-3">{feature.subhead}</p>
//                 <p className="text-muted-foreground mb-6">{feature.description}</p>
//                 <div className="space-y-2">
//                   {feature.features.map((item, i) => (
//                     <div key={i} className="flex items-center gap-2 text-sm">
//                       <Check className="w-4 h-4 text-primary" />
//                       <span>{item}</span>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             ))}
//           </div>

//           <div className="text-center mt-16">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-6 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
//               asChild
//             >
//               <Link href="/checkout" className="flex items-center gap-2">
//                 Begin 4-Month Free Trial
//                 <ChevronRight className="w-5 h-5" />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Live Demos - New Section */}
//       <section id="demos" className="py-20 bg-muted/30">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Experience AI Receptionists in Action
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Hear how our AI handles real-world conversations across different industries
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//             {[
//               {
//                 name: "Stanley",
//                 role: "for Financial Services",
//                 description: "Answers customer FAQs for banks and financial institutions",
//                 color: "bg-blue-100 dark:bg-blue-900",
//                 icon: "🏦",
//               },
//               {
//                 name: "Kirsten",
//                 role: "for Healthcare",
//                 description: "Schedules appointments and triages patient concerns",
//                 color: "bg-green-100 dark:bg-green-900",
//                 icon: "👩⚕️",
//               },
//               {
//                 name: "Naomi",
//                 role: "for Insurance",
//                 description: "Texts quote forms and captures policy inquiries",
//                 color: "bg-purple-100 dark:bg-purple-900",
//                 icon: "📋",
//               },
//               {
//                 name: "Natalie",
//                 role: "for Legal Teams",
//                 description: "Routes incoming calls and collects case details",
//                 color: "bg-orange-100 dark:bg-orange-900",
//                 icon: "⚖️",
//               },
//               {
//                 name: "Charlotte",
//                 role: "for Construction",
//                 description: "Routes calls by location and answers project FAQs",
//                 color: "bg-red-100 dark:bg-red-900",
//                 icon: "🏗️",
//               },
//               {
//                 name: "Jonah",
//                 role: "for Real Estate",
//                 description: "Shares property details and books showings",
//                 color: "bg-indigo-100 dark:bg-indigo-900",
//                 icon: "🏠",
//               },
//             ].map((demo, index) => (
//               <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/50 group cursor-pointer">
//                 <div className="flex items-start gap-4 mb-4">
//                   <div className={`w-12 h-12 rounded-full ${demo.color} flex items-center justify-center text-xl`}>
//                     {demo.icon}
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h3 className="text-lg font-semibold">{demo.name}</h3>
//                       <BadgeCheck className="w-4 h-4 text-primary" />
//                     </div>
//                     <p className="text-sm text-primary font-medium">{demo.role}</p>
//                   </div>
//                 </div>
//                 <p className="text-muted-foreground text-sm mb-6">{demo.description}</p>
//                 <Button variant="outline" className="w-full group-hover:bg-primary/5 group-hover:text-primary">
//                   <Play className="w-4 h-4 mr-2" />
//                   Listen to Sample Call
//                 </Button>
//               </Card>
//             ))}
//           </div>

//           <div className="text-center">
//             <Button
//               variant="ghost"
//               className="text-primary hover:bg-primary/5"
//               asChild
//             >
//               <Link href="#">
//                 View All Industry Demos
//                 <ArrowRight className="w-4 h-4 ml-2" />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Results & Social Proof - Enhanced */}
//       <section id="results" className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Real Businesses. Real Results.
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Join thousands of businesses transforming their phone operations
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8 mb-16">
//             <Card className="p-8">
//               <div className="flex items-start gap-6">
//                 <div className="flex-shrink-0">
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xl font-bold">
//                     HP
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2 mb-4">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                       ))}
//                     </div>
//                     <span className="text-sm font-medium">Healthcare Practice</span>
//                   </div>
//                   <p className="text-lg italic text-muted-foreground mb-6">
//                     "New patient intakes increased by 60%—translating to a projected $1.7M additional revenue."
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-semibold">Liesel Perez</div>
//                       <div className="text-sm text-muted-foreground">Cofounder & CEO</div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold text-primary">60%</div>
//                       <div className="text-sm text-muted-foreground">Increase</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             <Card className="p-8">
//               <div className="flex items-start gap-6">
//                 <div className="flex-shrink-0">
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center text-white text-xl font-bold">
//                     TC
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2 mb-4">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                       ))}
//                     </div>
//                     <span className="text-sm font-medium">Tech Company</span>
//                   </div>
//                   <p className="text-lg italic text-muted-foreground mb-6">
//                     "We've tripled outbound call volumes and saved 20 hours weekly per agent with AI Receptionist."
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-semibold">April Chastain</div>
//                       <div className="text-sm text-muted-foreground">Director of Operations</div>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold text-primary">20 hrs</div>
//                       <div className="text-sm text-muted-foreground">Weekly savings</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 mb-16">
//             {[
//               { value: "98%", label: "Call Answer Rate", change: "+42%" },
//               { value: "60%", label: "Lead Recovery Rate", change: "+35%" },
//               { value: "90%", label: "Spam Call Reduction", change: "-90%" },
//             ].map((stat, index) => (
//               <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
//                 <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
//                   {stat.value}
//                 </div>
//                 <div className="text-muted-foreground mb-4">{stat.label}</div>
//                 <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium">
//                   <TrendingUp className="w-3 h-3" />
//                   {stat.change}
//                 </div>
//               </Card>
//             ))}
//           </div>

//           {/* Trusted Companies */}
//           <div className="text-center">
//             <h3 className="text-lg font-semibold text-muted-foreground mb-8">
//               Trusted by Industry Leaders
//             </h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-24 rounded-xl border border-border/40 bg-card/50 flex items-center justify-center hover:bg-card transition-colors"
//                 >
//                   <div className="text-muted-foreground/60 text-lg font-semibold">
//                     Client {i + 1}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Security & Trust - New Section */}
//       <section className="py-20 bg-gradient-to-b from-background to-muted/20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Built on a Secure and Reliable Platform
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Your data security and privacy are our top priority
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
//             {[
//               {
//                 icon: Lock,
//                 title: "Enterprise Security",
//                 description: "Bank-level encryption and SOC 2 Type II compliance",
//               },
//               {
//                 icon: ShieldCheck,
//                 title: "Data Privacy",
//                 description: "Your data is never used to train our AI models",
//               },
//               {
//                 icon: BadgeCheck,
//                 title: "Compliance Focused",
//                 description: "HIPAA, GDPR, and industry-specific compliance",
//               },
//               {
//                 icon: Users,
//                 title: "Ethical AI",
//                 description: "Regular bias testing and accessibility reviews",
//               },
//             ].map((item, index) => (
//               <Card key={index} className="p-6 text-center border-border/40">
//                 <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
//                   <item.icon className="w-6 h-6 text-primary" />
//                 </div>
//                 <h3 className="font-semibold mb-2">{item.title}</h3>
//                 <p className="text-sm text-muted-foreground">{item.description}</p>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section - Enhanced */}
//       <section id="pricing" className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-3xl mx-auto text-center">
//             <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
//               <Zap className="w-4 h-4 text-primary" />
//               <span className="text-sm font-semibold text-primary">
//                 Limited Time Offer
//               </span>
//             </div>

//             <h2 className="text-3xl md:text-4xl font-bold mb-6">
//               Start Your 4-Month Free Trial Today
//             </h2>
//             <p className="text-xl text-muted-foreground mb-10">
//               Get 500 included minutes. No charges until your trial period ends. Cancel anytime.
//             </p>

//             <Card className="p-8 mb-10 border-primary/20 shadow-2xl">
//               <div className="grid md:grid-cols-3 gap-6 mb-8">
//                 {[
//                   { label: "500 Free Minutes", value: "Included" },
//                   { label: "24/7 Support", value: "Included" },
//                   { label: "All Features", value: "Unlocked" },
//                 ].map((item, index) => (
//                   <div key={index} className="text-center p-4 rounded-lg bg-primary/5">
//                     <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
//                     <div className="text-lg font-semibold text-primary">{item.value}</div>
//                   </div>
//                 ))}
//               </div>

//               <form className="space-y-6" action="/checkout" method="get">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Business Name *
//                     </label>
//                     <Input
//                       name="company"
//                       placeholder="Enter business name"
//                       required
//                       className="border-border/40 focus:border-primary"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Website URL</label>
//                     <Input
//                       name="website"
//                       placeholder="yourbusiness.com"
//                       type="url"
//                       className="border-border/40 focus:border-primary"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Contact Name *
//                     </label>
//                     <Input name="fullName" placeholder="Full name" required />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">
//                       Email Address *
//                     </label>
//                     <Input name="email" placeholder="email@company.com" type="email" required />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   size="lg"
//                   className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
//                 >
//                   Activate Free Trial - Get 500 Minutes
//                 </Button>
//               </form>

//               <p className="text-center text-sm text-muted-foreground mt-6">
//                 No credit card required for trial. Cancel anytime.
//               </p>
//             </Card>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
//                 <ShieldCheck className="w-5 h-5 text-primary" />
//                 <span>Zero Setup Fees</span>
//               </div>
//               <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
//                 <Headphones className="w-5 h-5 text-primary" />
//                 <span>24/7 Support</span>
//               </div>
//               <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
//                 <Check className="w-5 h-5 text-primary" />
//                 <span>Cancel Anytime</span>
//               </div>
//               <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50">
//                 <Rocket className="w-5 h-5 text-primary" />
//                 <span>Instant Activation</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer - Enhanced */}
//       <footer className="border-t border-border/40 bg-background py-12">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
//                   <Volume2 className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="text-xl font-bold">Zevaux AI</div>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 The AI receptionist that answers calls 24/7, books appointments, and grows your business.
//               </p>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4">Product</h4>
//               <ul className="space-y-3 text-sm">
//                 <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
//                 <li><Link href="#demos" className="text-muted-foreground hover:text-primary transition-colors">Live Demos</Link></li>
//                 <li><Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">API Docs</Link></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4">Company</h4>
//               <ul className="space-y-3 text-sm">
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Press</Link></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-semibold mb-4">Resources</h4>
//               <ul className="space-y-3 text-sm">
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Community</Link></li>
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Sales</Link></li>
//                 <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Status</Link></li>
//               </ul>
//             </div>
//           </div>

//           <div className="pt-8 border-t border-border/40">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-muted-foreground">
//                 © {new Date().getFullYear()} Zevaux Technologies. All rights reserved.
//               </div>

//               <div className="flex items-center gap-6 text-sm">
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   Privacy Policy
//                 </Link>
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   Terms of Service
//                 </Link>
//                 <Link
//                   href="#"
//                   className="text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   Cookie Policy
//                 </Link>
//                 <ModeToggle />
//               </div>
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

// function deadlineLabel() {
//   const d = new Date(2025, 11, 15);
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
//     <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
//       {/* Navigation - Enhanced for Gradient Background */}
//       <nav className="sticky top-0 z-50 border-b border-primary/20 bg-gradient-to-b from-primary/10 to-primary/5 backdrop-blur-xl supports-backdrop-filter:bg-primary/10">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             <Link href="/" className="flex items-center gap-3">
//               <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
//                 <Volume2 className="w-5 h-5 text-white" />
//               </div>
//               <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
//                 Zevaux AI
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center gap-10">
//               <div className="flex items-center gap-8">
//                 <Link
//                   href="#features"
//                   className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:scale-105"
//                 >
//                   Features
//                 </Link>
//                 <Link
//                   href="#demos"
//                   className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:scale-105"
//                 >
//                   Live Demos
//                 </Link>
//                 <Link
//                   href="#results"
//                   className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:scale-105"
//                 >
//                   Results
//                 </Link>
//                 <Link
//                   href="#pricing"
//                   className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:scale-105"
//                 >
//                   Pricing
//                 </Link>
//               </div>
//               <div className="flex items-center gap-4">
//                 {!user ? (
//                   <Fragment>
//                     <ModeToggle />
//                     <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 text-foreground/80">
//                       <Link href="/login">Sign In</Link>
//                     </Button>
//                     <Button
//                       className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
//                       asChild
//                     >
//                       <Link href="/checkout" className="flex items-center gap-2">
//                         Start Free Trial
//                         <ArrowRight className="w-4 h-4" />
//                       </Link>
//                     </Button>
//                   </Fragment>
//                 ) : (
//                   <Fragment>
//                     <Link
//                       href="/dashboard"
//                       className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
//                     >
//                       <LayoutDashboard className="w-4 h-4" />
//                       Dashboard
//                     </Link>
//                     <div className="text-sm text-foreground/80">
//                       {user?.email}
//                     </div>
//                     <ModeToggle />
//                     <Logout />
//                   </Fragment>
//                 )}
//               </div>
//             </div>

//             {/* Mobile Navigation */}
//             <div className="lg:hidden flex items-center gap-3">
//               <ModeToggle />
//               <Button size="sm" asChild className="bg-gradient-to-r from-primary to-primary/90 text-white hover:opacity-90">
//                 <Link href="/checkout">Start Trial</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section - Enhanced Primary Gradient */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
//         {/* Animated background pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute inset-0" style={{
//             backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
//             backgroundSize: '40px 40px'
//           }}></div>
//         </div>

//         {/* Floating gradient orbs */}
//         <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>

//         <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
//                 <Zap className="w-4 h-4 text-white" />
//                 <span className="text-sm font-semibold text-white">
//                   December Limited Offer
//                 </span>
//                 <span className="text-xs text-white/80">
//                   Ends {deadlineLabel()}
//                 </span>
//               </div>

//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
//                 <span className="block text-white">Goodbye Missed Calls.</span>
//                 <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
//                   Hello AI Receptionist.
//                 </span>
//               </h1>

//               <p className="text-xl text-white/90 mb-10 max-w-xl">
//                 Turn missed calls into new customers with an AI Receptionist that answers 24/7,
//                 books appointments automatically, and follows up with leads—all while working with any phone system.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 mb-12">
//                 <Button
//                   size="lg"
//                   className="bg-white hover:bg-white/90 text-primary px-8 py-6 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 group"
//                   asChild
//                 >
//                   <Link href="/checkout" className="flex items-center gap-2">
//                     Claim 500 Free Minutes
//                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                   </Link>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-6 rounded-xl text-lg group"
//                 >
//                   <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
//                   Watch Live Demo
//                 </Button>
//               </div>

//               {/* Trust Indicators */}
//               <div className="space-y-6">
//                 <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
//                   <div className="flex items-center gap-2">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className="w-4 h-4 fill-yellow-300 text-yellow-300"
//                         />
//                       ))}
//                     </div>
//                     <span className="font-medium">4.8/5 (2,000+ reviews)</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <ShieldCheck className="w-4 h-4 text-white" />
//                     <span>Enterprise Security</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-white" />
//                     <span>3-Minute Setup</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Hero Visual */}
//             <div className="relative">
//               <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
//                     <div className="text-sm font-medium text-white">Live AI Receptionist Demo</div>
//                   </div>

//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
//                       <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
//                         <Phone className="w-4 h-4 text-blue-300" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium text-white">Incoming Call</div>
//                         <div className="text-sm text-white/70">New customer inquiry</div>
//                       </div>
//                       <BadgeCheck className="w-5 h-5 text-green-300" />
//                     </div>

//                     <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
//                       <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
//                         <Calendar className="w-4 h-4 text-green-300" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium text-white">Appointment Booked</div>
//                         <div className="text-sm text-white/70">Tomorrow, 2:00 PM</div>
//                       </div>
//                       <div className="text-xs px-2 py-1 bg-green-400/20 text-green-300 rounded border border-green-400/30">
//                         +$500
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
//                       <div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center">
//                         <MessageSquare className="w-4 h-4 text-purple-300" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-medium text-white">Lead Follow-up</div>
//                         <div className="text-sm text-white/70">3 old leads contacted</div>
//                       </div>
//                       <div className="text-xs px-2 py-1 bg-purple-400/20 text-purple-300 rounded border border-purple-400/30">
//                         Automated
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Setup Process - Enhanced with Gradient */}
//       <section className="py-20 bg-gradient-to-b from-primary/10 via-background to-background">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Set Up and Start Answering Calls
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Get your AI Receptionist working in minutes—no IT support needed
//             </p>
//           </div>

//           <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
//             {[
//               {
//                 step: "1",
//                 icon: Settings,
//                 title: "Pick Your AI",
//                 description: "Choose a professional voice & personality that matches your brand",
//                 color: "from-blue-500/20 to-blue-500/10",
//                 gradient: "from-blue-400 to-blue-600",
//               },
//               {
//                 step: "2",
//                 icon: Mic,
//                 title: "Train in Minutes",
//                 description: "Upload your website, FAQs, or documents to customize knowledge",
//                 color: "from-green-500/20 to-green-500/10",
//                 gradient: "from-green-400 to-green-600",
//               },
//               {
//                 step: "3",
//                 icon: Phone,
//                 title: "Customize Routing",
//                 description: "Set up rules for call routing, scheduling, and lead capture",
//                 color: "from-purple-500/20 to-purple-500/10",
//                 gradient: "from-purple-400 to-purple-600",
//               },
//               {
//                 step: "4",
//                 icon: Zap,
//                 title: "Go Live",
//                 description: "Activate and start answering calls 24/7 automatically",
//                 color: "from-orange-500/20 to-orange-500/10",
//                 gradient: "from-orange-400 to-orange-600",
//               },
//             ].map((step, index) => (
//               <div key={index} className="relative">
//                 <Card className="p-8 text-center border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white/95 backdrop-blur-sm">
//                   <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${step.gradient} border-2 border-white flex items-center justify-center font-bold text-white shadow-lg`}>
//                     {step.step}
//                   </div>
//                   <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-6`}>
//                     <step.icon className="w-6 h-6 text-primary" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
//                   <p className="text-muted-foreground text-sm">{step.description}</p>
//                 </Card>
//                 {index < 3 && (
//                   <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-transparent transform translate-x-4"></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

function deadlineLabel() {
  const d = new Date(2025, 11, 15);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// Mock phone image URL - replace with your actual image
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

      {/* Hero Section - Professional Voice Call Interface */}
      {/* <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div> */}

      {/* Floating elements */}
      {/* <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div> */}

      {/* Sparkle effects */}
      {/* <div className="absolute top-1/4 left-1/4 animate-pulse">
          <Sparkles className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-pulse delay-300">
          <Sparkles className="w-4 h-4 text-white/30" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-20 md:pb-32">
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
              </div> */}

      {/* Trust Indicators */}
      {/* <div className="space-y-6">
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

                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-sm text-white/90">
                      No Credit Card Required
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Volume2 className="w-4 h-4 text-white" />
                    <span className="text-sm text-white/90">
                      Human-Sounding AI
                    </span>
                  </div>
                </div>
              </div>
            </div> */}

      {/* Professional Voice Call Phone Interface */}
      {/* <div className="relative">
              <div className="relative w-full max-w-[280px] mx-auto"> */}
      {/* Phone Frame - Compact & Professional */}
      {/* <div className="relative w-full aspect-[9/19] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-1 border-[6px] border-gray-900 shadow-2xl"> */}
      {/* Phone Notch */}
      {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/5 h-3 bg-gray-900 rounded-b-lg z-20"></div> */}

      {/* Phone Screen - Professional Call Interface */}
      {/* <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white rounded-[1.8rem] overflow-hidden relative flex flex-col"> */}
      {/* Status Bar */}
      {/* <div className="pt-2 px-3 flex justify-between items-center border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-900">
                        12:45 PM
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs text-gray-700 font-medium">
                          Live
                        </span>
                      </div>
                    </div> */}

      {/* Call Header */}
      {/* <div className="text-center px-3 pt-2">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-base font-bold text-gray-900">
                        AI Receptionist
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Active • Professional Services Inc.
                      </div> */}

      {/* Call Duration */}
      {/* <div className="mt-2">
                        <div className="text-2xl font-mono font-bold text-gray-900">
                          01:28
                        </div>
                        <div className="text-xs text-gray-500">
                          Active call duration
                        </div>
                      </div>
                    </div> */}

      {/* Live Conversation Display */}
      {/* <div className="flex-1 px-3 py-2 overflow-hidden">
                      <div className="bg-gray-50 rounded-lg p-2 h-full border border-gray-200">
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          Live Conversation
                        </div>

                        <div className="space-y-3 max-h-52 overflow-y-auto pr-1"> */}
      {/* Customer Message */}
      {/* <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <User className="w-2.5 h-2.5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-900">
                                Caller
                              </div>
                              <div className="text-xs text-gray-700 leading-tight">
                                "I'd like to schedule a consultation for next
                                week."
                              </div>
                            </div>
                          </div> */}

      {/* AI Response */}
      {/* <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Volume2 className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-900">
                                AI Receptionist
                              </div>
                              <div className="text-xs text-gray-700 leading-tight">
                                "Certainly! I can help with that. Are you
                                looking for Monday or Friday?"
                              </div>
                            </div>
                          </div> */}

      {/* Booking Progress */}
      {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-2 border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </div>
                              <div className="text-xs font-medium text-green-700">
                                Appointment booked: Mon 2:30 PM
                              </div>
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              Confirmation sent • Added to calendar
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}

      {/* Call Controls */}
      {/* <div className="px-3 py-3 bg-gray-50 border-t border-gray-200">
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

                      <div className="mt-2 flex items-center justify-center gap-2">
                        <div className="text-[10px] text-gray-600">
                          Voice Quality:
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`w-1 h-${i} rounded-full ${
                                i <= 4 ? "bg-green-500" : "bg-gray-300"
                              } animate-pulse`}
                              style={{
                                animationDelay: `${i * 100}ms`,
                                height: `${i * 3}px`,
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className="text-[10px] font-medium text-green-600">
                          Excellent
                        </div>
                      </div>
                    </div>
                  </div> */}

      {/* Side Buttons */}
      {/* <div className="absolute right-0 top-1/3 h-10 w-0.5 bg-gray-800 rounded-l"></div>
                  <div className="absolute right-0 top-2/3 h-10 w-0.5 bg-gray-800 rounded-l"></div>
                </div> */}

      {/* Floating Achievement Badges */}
      {/* <div className="absolute -top-2 -right-2">
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
                </div> */}

      {/* Voice Wave Animation */}
      {/* <div className="absolute -top-2 -right-2 w-12 h-12 opacity-70">
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
              </div> */}

      {/* Phone Glow Effect */}
      {/* <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[120%] bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-[2rem] blur-2xl"></div> */}

      {/* Stats Highlights */}
      {/* <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">98% Answer Rate</span>
                </div>
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">24/7 Active</span>
                </div>
              </div>
            </div>
          </div> */}

      {/* Scrolling Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
            <div className="animate-bounce">
              <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
            </div>
          </div>
        </div>
      </section> */}

      {/* Hero Section - Overlapping Phone Display */}
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

                      {/* Revenue Impact */}
                      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 rounded-lg p-3 border border-purple-800/30">
                        <div className="text-[9px] text-gray-300 mb-2">
                          Revenue Impact
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-xl font-bold text-white">
                              $2,850
                            </div>
                            <div className="text-[8px] text-gray-400">
                              Today's Value
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-400">
                              +$450
                            </div>
                            <div className="text-[8px] text-gray-400">
                              vs. yesterday
                            </div>
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

                          {/* Voice Quality */}
                          {/* <div className="mt-2 flex items-center justify-center gap-2">
                            <div className="text-[10px] text-gray-600">
                              Voice Quality:
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`w-1 h-${i} rounded-full ${
                                    i <= 4 ? "bg-green-500" : "bg-gray-300"
                                  } animate-pulse`}
                                  style={{
                                    animationDelay: `${i * 100}ms`,
                                    height: `${i * 3}px`,
                                  }}
                                ></div>
                              ))}
                            </div>
                            <div className="text-[10px] font-medium text-green-600">
                              Excellent
                            </div>
                          </div> */}
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

                  {/* Stats Highlights */}
                  {/* <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-gray-700">98% Answer Rate</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700">24/7 Active</span>
                    </div>
                  </div> */}
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

          <div className="grid md:grid-cols-3 gap-8 mb-16">
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
          </div>

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

      {/* Security & Trust - Enhanced with Gradient */}
      {/* <section className="py-20 bg-gradient-to-b from-background via-primary/10 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built on a Secure and Reliable Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your data security and privacy are our top priority
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Bank-level encryption and SOC 2 Type II compliance",
                gradient: "from-blue-400 to-blue-600",
              },
              {
                icon: ShieldCheck,
                title: "Data Privacy",
                description: "Your data is never used to train our AI models",
                gradient: "from-green-400 to-green-600",
              },
              {
                icon: BadgeCheck,
                title: "Compliance Focused",
                description: "HIPAA, GDPR, and industry-specific compliance",
                gradient: "from-purple-400 to-purple-600",
              },
              {
                icon: Users,
                title: "Ethical AI",
                description: "Regular bias testing and accessibility reviews",
                gradient: "from-orange-400 to-orange-600",
              },
            ].map((item, index) => (
              <Card key={index} className="p-6 text-center border-primary/20 bg-gradient-to-b from-white to-white/95 backdrop-blur-sm">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient}/10 mb-4`}>
                  <item.icon className={`w-6 h-6 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section - Enhanced Gradient */}
      {/* <section id="pricing" className="py-20 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Limited Time Offer
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your 4-Month Free Trial Today
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Get 500 included minutes. No charges until your trial period ends. Cancel anytime.
            </p>

            <Card className="p-8 mb-10 border-primary/30 bg-gradient-to-b from-white to-white/95 backdrop-blur-sm shadow-2xl">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "500 Free Minutes", value: "Included", gradient: "from-blue-400 to-blue-600" },
                  { label: "24/7 Support", value: "Included", gradient: "from-green-400 to-green-600" },
                  { label: "All Features", value: "Unlocked", gradient: "from-purple-400 to-purple-600" },
                ].map((item, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                    <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                    <div className={`text-lg font-semibold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

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
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website URL</label>
                    <Input
                      name="website"
                      placeholder="yourbusiness.com"
                      type="url"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Contact Name *
                    </label>
                    <Input name="fullName" placeholder="Full name" required className="border-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email Address *
                    </label>
                    <Input name="email" placeholder="email@company.com" type="email" required className="border-primary/20" />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Activate Free Trial - Get 500 Minutes
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                No credit card required for trial. Cancel anytime.
              </p>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-b from-white to-white/95 border border-primary/20">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Zero Setup Fees</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-b from-white to-white/95 border border-primary/20">
                <Headphones className="w-5 h-5 text-primary" />
                <span>24/7 Support</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-b from-white to-white/95 border border-primary/20">
                <Check className="w-5 h-5 text-primary" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-b from-white to-white/95 border border-primary/20">
                <Rocket className="w-5 h-5 text-primary" />
                <span>Instant Activation</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

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
                © {new Date().getFullYear()} Zevaux Technologies. All rights
                reserved.
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
                  Cookie Policy
                </Link>
                <ModeToggle />
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
