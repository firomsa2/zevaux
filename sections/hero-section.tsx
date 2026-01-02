// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import {
//   ArrowRight,
//   Check,
//   Play,
//   Sparkles,
//   Zap,
//   ShieldCheck,
//   Clock,
//   Star,
//   TrendingUp,
//   Volume2,
//   Phone,
//   Calendar,
//   MessageSquare,
//   Users,
//   ChevronRight,
// } from "lucide-react";
// import Link from "next/link";

// const STATS = [
//   { label: "Answer Rate", value: "98.7%", change: "+2.3%" },
//   { label: "Conversion", value: "42%", change: "+8%" },
//   { label: "Uptime", value: "99.9%", change: "99.9%" },
//   { label: "Cost Saved", value: "$1,240", change: "/month" },
// ];

// export default function HeroSection() {
//   const [activeStat, setActiveStat] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveStat((prev) => (prev + 1) % STATS.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.2),transparent_50%)]" />

//         {/* Grid pattern */}
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
//                            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
//             backgroundSize: "50px 50px",
//           }}
//         />
//       </div>

//       {/* Floating elements */}
//       <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
//       <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

//       <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Left Content */}
//           <div className="z-10">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/30 px-4 py-2 rounded-full mb-6">
//               <Zap className="w-4 h-4 text-primary" />
//               <span className="text-sm font-semibold text-white">
//                 🎁 Get 500 Free Minutes
//               </span>
//               <span className="text-xs text-gray-300">Limited time offer</span>
//             </div>

//             {/* Headline */}
//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
//               <span className="block text-white leading-tight">
//                 Never Miss a Customer Call
//               </span>
//               <span className="block bg-gradient-to-r from-blue-400 via-primary to-purple-400 bg-clip-text text-transparent mt-2">
//                 AI Receptionist That Works 24/7
//               </span>
//             </h1>

//             {/* Subtitle */}
//             <p className="text-xl text-gray-300 mb-8 max-w-xl">
//               Professional AI that answers calls, books appointments, captures
//               leads, and follows up—sounding perfectly human while integrating
//               with your existing tools.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-12">
//               <Button
//                 size="lg"
//                 className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 group"
//                 asChild
//               >
//                 <Link href="/checkout" className="flex items-center gap-2">
//                   Start Free Trial - 500 Minutes
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//               </Button>

//               <div className="flex items-center gap-4">
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   className="border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-6 py-6 rounded-xl group"
//                 >
//                   <div className="flex items-center gap-2">
//                     <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                     Watch Demo
//                   </div>
//                 </Button>

//                 {/* Trust badge */}
//                 <div className="hidden sm:block">
//                   <div className="flex items-center gap-2 text-sm text-gray-300">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                         />
//                       ))}
//                     </div>
//                     <span>4.8/5 from 2,000+ reviews</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
//               {STATS.map((stat, index) => (
//                 <div
//                   key={index}
//                   className={`p-4 rounded-lg backdrop-blur-sm transition-all duration-300 ${
//                     activeStat === index
//                       ? "bg-white/10 border border-primary/30"
//                       : "bg-white/5 border border-white/10"
//                   }`}
//                 >
//                   <div className="text-2xl font-bold text-white mb-1">
//                     {stat.value}
//                   </div>
//                   <div className="text-xs text-gray-300">{stat.label}</div>
//                   <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
//                     <TrendingUp className="w-3 h-3" />
//                     {stat.change}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Trust indicators */}
//             <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
//               <div className="flex items-center gap-2">
//                 <ShieldCheck className="w-4 h-4 text-green-400" />
//                 <span>HIPAA & SOC2 Compliant</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4 text-blue-400" />
//                 <span>3-Minute Setup</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4 text-purple-400" />
//                 <span>5,000+ Businesses</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Content - Interactive Demo */}
//           <div className="relative">
//             {/* Main Phone Mockup */}
//             <div className="relative mx-auto max-w-md">
//               {/* Phone Frame */}
//               <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl border border-gray-700">
//                 {/* Notch */}
//                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-lg z-20" />

//                 {/* Screen */}
//                 <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2rem] overflow-hidden">
//                   {/* Live Call Interface */}
//                   <div className="p-4">
//                     {/* Status Bar */}
//                     <div className="flex justify-between items-center mb-6">
//                       <div className="text-sm text-gray-400">12:45 PM</div>
//                       <div className="flex items-center gap-2">
//                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                         <span className="text-sm font-medium text-white">
//                           Live Call
//                         </span>
//                       </div>
//                     </div>

//                     {/* Caller Info */}
//                     <div className="text-center mb-8">
//                       <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
//                         <Volume2 className="w-8 h-8 text-white" />
//                       </div>
//                       <h3 className="text-xl font-bold text-white mb-2">
//                         AI Receptionist
//                       </h3>
//                       <p className="text-sm text-gray-400">
//                         Active • Medical Practice Inc.
//                       </p>
//                     </div>

//                     {/* Conversation */}
//                     <div className="space-y-4 mb-8">
//                       {/* Customer Message */}
//                       <div className="flex items-start gap-3">
//                         <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
//                           <Users className="w-4 h-4 text-blue-400" />
//                         </div>
//                         <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
//                           <p className="text-sm text-white">
//                             "Hi, I need to schedule a dental cleaning for next
//                             week."
//                           </p>
//                         </div>
//                       </div>

//                       {/* AI Response */}
//                       <div className="flex items-start gap-3 justify-end">
//                         <div className="bg-gradient-to-r from-primary to-primary/70 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
//                           <p className="text-sm text-white">
//                             "I'd be happy to help with that! We have openings on
//                             Monday at 2 PM or Wednesday at 11 AM. Which works
//                             better for you?"
//                           </p>
//                         </div>
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
//                           <Volume2 className="w-4 h-4 text-white" />
//                         </div>
//                       </div>

//                       {/* Appointment Booked */}
//                       <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4 text-green-400" />
//                             <span className="text-sm font-medium text-white">
//                               Appointment Booked
//                             </span>
//                           </div>
//                           <span className="text-xs text-green-400">+$150</span>
//                         </div>
//                         <p className="text-xs text-gray-300 mt-1">
//                           Monday, 2 PM • Confirmation sent
//                         </p>
//                       </div>
//                     </div>

//                     {/* Quick Stats */}
//                     <div className="grid grid-cols-3 gap-3">
//                       <div className="text-center p-2 bg-gray-800/50 rounded-lg">
//                         <div className="text-sm font-bold text-white">12</div>
//                         <div className="text-xs text-gray-400">Today</div>
//                       </div>
//                       <div className="text-center p-2 bg-gray-800/50 rounded-lg">
//                         <div className="text-sm font-bold text-white">4</div>
//                         <div className="text-xs text-gray-400">Booked</div>
//                       </div>
//                       <div className="text-center p-2 bg-gray-800/50 rounded-lg">
//                         <div className="text-sm font-bold text-white">$600</div>
//                         <div className="text-xs text-gray-400">Revenue</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Floating Elements */}
//               <div className="absolute -top-4 -right-4">
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
//                   <TrendingUp className="w-3 h-3" />
//                   Live Demo
//                 </div>
//               </div>

//               <div className="absolute -bottom-4 -left-4">
//                 <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
//                   <Check className="w-3 h-3" />
//                   98% Customer Satisfaction
//                 </div>
//               </div>
//             </div>

//             {/* Background Phone Elements */}
//             <div className="absolute top-1/4 -left-20 w-40 h-80 rotate-12 opacity-60">
//               <div className="relative w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-2">
//                 <div className="w-full h-full bg-gray-900 rounded-xl"></div>
//               </div>
//             </div>

//             <div className="absolute bottom-1/4 -right-20 w-40 h-80 -rotate-12 opacity-60">
//               <div className="relative w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-2">
//                 <div className="w-full h-full bg-gray-900 rounded-xl"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Scrolling Indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
//         <div className="animate-bounce">
//           <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
//         </div>
//       </div>
//     </section>
//   );
// }

// components/hero-conversation-enhanced.tsx
// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   Play,
//   Pause,
//   Zap,
//   CheckCircle,
//   TrendingUp,
//   Users,
//   Clock,
//   Phone,
//   Volume2,
//   Calendar,
//   MessageSquare,
//   RotateCcw,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface ConversationMessage {
//   id: number;
//   speaker: "caller" | "ai";
//   text: string;
//   delay: number;
//   typingDuration?: number;
// }

// const CONVERSATION_SCENARIOS = [
//   {
//     id: 1,
//     industry: "Dental Clinic",
//     color: "from-blue-500 to-cyan-500",
//     conversation: [
//       {
//         id: 1,
//         speaker: "caller",
//         text: "Hi, I need to schedule a dental cleaning for next week.",
//         delay: 1000,
//         typingDuration: 800,
//       },
//       {
//         id: 2,
//         speaker: "ai",
//         text: "I'd be happy to help! We have openings on Monday at 2 PM or Wednesday at 11 AM.",
//         delay: 1800,
//         typingDuration: 1200,
//       },
//       {
//         id: 3,
//         speaker: "caller",
//         text: "Wednesday at 11 AM works for me.",
//         delay: 1200,
//         typingDuration: 600,
//       },
//       {
//         id: 4,
//         speaker: "ai",
//         text: "Perfect! I've booked you for Wednesday at 11 AM. A confirmation is being sent to your phone now.",
//         delay: 2000,
//         typingDuration: 1400,
//       },
//     ],
//   },
//   {
//     id: 2,
//     industry: "Legal Office",
//     color: "from-purple-500 to-pink-500",
//     conversation: [
//       {
//         id: 1,
//         speaker: "caller",
//         text: "I need to speak with an attorney about a contract review.",
//         delay: 1000,
//         typingDuration: 900,
//       },
//       {
//         id: 2,
//         speaker: "ai",
//         text: "I can help with that. Can you tell me if this is for a business or personal matter?",
//         delay: 2000,
//         typingDuration: 1300,
//       },
//       {
//         id: 3,
//         speaker: "caller",
//         text: "It's for my small business - a vendor agreement.",
//         delay: 1300,
//         typingDuration: 700,
//       },
//       {
//         id: 4,
//         speaker: "ai",
//         text: "Thank you. Our business attorney has availability tomorrow. I'll send you a calendar link to choose a time.",
//         delay: 2200,
//         typingDuration: 1600,
//       },
//     ],
//   },
//   {
//     id: 3,
//     industry: "Real Estate",
//     color: "from-orange-500 to-red-500",
//     conversation: [
//       {
//         id: 1,
//         speaker: "caller",
//         text: "I saw your listing for the 3-bedroom on Maple Street.",
//         delay: 1000,
//         typingDuration: 800,
//       },
//       {
//         id: 2,
//         speaker: "ai",
//         text: "Great choice! That property is still available. Would you like to schedule a showing this week?",
//         delay: 1800,
//         typingDuration: 1200,
//       },
//       {
//         id: 3,
//         speaker: "caller",
//         text: "Yes, I'm available Thursday afternoon.",
//         delay: 1200,
//         typingDuration: 600,
//       },
//       {
//         id: 4,
//         speaker: "ai",
//         text: "Excellent! I've scheduled you for Thursday at 3 PM. Your agent will meet you there.",
//         delay: 2000,
//         typingDuration: 1400,
//       },
//     ],
//   },
// ];

// const ACTIVE_CALLS = [
//   {
//     id: 1,
//     type: "New Lead",
//     business: "Auto Repair",
//     duration: "0:45",
//     status: "qualifying",
//   },
//   {
//     id: 2,
//     type: "Appointment",
//     business: "Medical Spa",
//     duration: "1:22",
//     status: "booking",
//   },
//   {
//     id: 3,
//     type: "Follow-up",
//     business: "Law Firm",
//     duration: "2:15",
//     status: "converting",
//   },
// ];

// export default function HeroConversationEnhanced() {
//   const [activeMessages, setActiveMessages] = useState<number[]>([1]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [callTimer, setCallTimer] = useState(0);
//   const [scenarioIndex, setScenarioIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [activeCalls, setActiveCalls] = useState(ACTIVE_CALLS);
//   const timerRef = useRef<NodeJS.Timeout>();
//   const loopRef = useRef<NodeJS.Timeout>();

//   const currentScenario = CONVERSATION_SCENARIOS[scenarioIndex];
//   const currentConversation = currentScenario.conversation;

//   // Handle conversation animation
//   useEffect(() => {
//     if (!isPlaying) return;

//     let currentDelay = 0;
//     const timers: NodeJS.Timeout[] = [];

//     currentConversation.forEach((msg) => {
//       // Show typing indicator before AI messages
//       if (msg.speaker === "ai") {
//         timers.push(
//           setTimeout(() => {
//             setIsTyping(true);
//           }, currentDelay)
//         );

//         timers.push(
//           setTimeout(() => {
//             setIsTyping(false);
//             setActiveMessages((prev) => [...prev, msg.id]);
//             setCurrentStep(msg.id);
//           }, currentDelay + (msg.typingDuration || 1000))
//         );
//       } else {
//         timers.push(
//           setTimeout(() => {
//             setActiveMessages((prev) => [...prev, msg.id]);
//             setCurrentStep(msg.id);
//           }, currentDelay + msg.delay)
//         );
//       }

//       currentDelay += msg.delay + (msg.typingDuration || 0);
//     });

//     // Rotate to next scenario after completion
//     const rotationTimer = setTimeout(() => {
//       setActiveMessages([1]);
//       setCurrentStep(0);
//       setScenarioIndex((prev) => (prev + 1) % CONVERSATION_SCENARIOS.length);
//     }, currentDelay + 2000);

//     timers.push(rotationTimer);

//     return () => {
//       timers.forEach((timer) => clearTimeout(timer));
//       setIsTyping(false);
//     };
//   }, [isPlaying, scenarioIndex, currentConversation]);

//   // Handle call timer
//   useEffect(() => {
//     if (isPlaying) {
//       timerRef.current = setInterval(() => {
//         setCallTimer((prev) => prev + 1);
//       }, 1000);
//     } else {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [isPlaying]);

//   // Update active calls periodically
//   useEffect(() => {
//     loopRef.current = setInterval(() => {
//       setActiveCalls((prev) =>
//         prev.map((call) => ({
//           ...call,
//           duration: incrementDuration(call.duration),
//         }))
//       );
//     }, 3000);

//     return () => {
//       if (loopRef.current) {
//         clearInterval(loopRef.current);
//       }
//     };
//   }, []);

//   const incrementDuration = (duration: string) => {
//     const [minutes, seconds] = duration.split(":").map(Number);
//     const totalSeconds = minutes * 60 + seconds + 3;
//     const newMinutes = Math.floor(totalSeconds / 60);
//     const newSeconds = totalSeconds % 60;
//     return `${newMinutes}:${newSeconds.toString().padStart(2, "0")}`;
//   };

//   const formatTimer = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const togglePlay = () => setIsPlaying(!isPlaying);

//   const resetDemo = () => {
//     setActiveMessages([1]);
//     setCurrentStep(0);
//     setCallTimer(0);
//     setScenarioIndex(0);
//     setIsTyping(false);
//     if (!isPlaying) setIsPlaying(true);
//   };

//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       {/* Light mode background elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
//         <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse dark:bg-blue-500/10" />
//         <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl dark:bg-purple-500/10" />

//         {/* Grid pattern for light mode */}
//         <div
//           className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
//           style={{
//             backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
//                            linear-gradient(to bottom, #000 1px, transparent 1px)`,
//             backgroundSize: "40px 40px",
//           }}
//         />
//       </div>

//       <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//           {/* Left Column - Content */}
//           <div className="z-10">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/20 dark:to-primary/10 backdrop-blur-sm border border-primary/20 dark:border-primary/30 px-4 py-2 rounded-full mb-6">
//               <Zap className="w-4 h-4 text-primary" />
//               <span className="text-sm font-semibold text-gray-800 dark:text-white">
//                 🎁 Get 500 Free Minutes
//               </span>
//               <span className="text-xs text-gray-600 dark:text-gray-300">
//                 Limited time
//               </span>
//             </div>

//             {/* Headline */}
//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
//               <span className="block text-gray-900 dark:text-white leading-tight">
//                 Your AI Receptionist
//               </span>
//               <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-blue-400 dark:via-primary dark:to-purple-400 bg-clip-text text-transparent mt-2">
//                 Books Appointments 24/7
//               </span>
//             </h1>

//             {/* Subtitle */}
//             <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-xl">
//               Professional AI that answers calls, captures leads, and schedules
//               appointments—sounding perfectly human while working with your
//               tools.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-12">
//               <Button
//                 size="lg"
//                 className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group"
//                 asChild
//               >
//                 <Link href="/checkout" className="flex items-center gap-2">
//                   Start Free Trial - 500 Minutes
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//               </Button>

//               <Button
//                 variant="outline"
//                 size="lg"
//                 onClick={togglePlay}
//                 className="border-2 border-gray-300 dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white px-6 py-6 rounded-xl group"
//               >
//                 <div className="flex items-center gap-2">
//                   {isPlaying ? (
//                     <Pause className="w-5 h-5" />
//                   ) : (
//                     <Play className="w-5 h-5" />
//                   )}
//                   {isPlaying ? "Pause" : "Play"} Demo
//                 </div>
//               </Button>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-4 mb-8">
//               {[
//                 {
//                   label: "Answer Rate",
//                   value: "98.7%",
//                   icon: TrendingUp,
//                   color: "text-green-600",
//                 },
//                 {
//                   label: "Lead Capture",
//                   value: "42%",
//                   icon: Users,
//                   color: "text-blue-600",
//                 },
//                 {
//                   label: "Setup Time",
//                   value: "3 min",
//                   icon: Clock,
//                   color: "text-purple-600",
//                 },
//               ].map((stat, index) => (
//                 <div
//                   key={index}
//                   className="text-center p-4 rounded-xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-sm"
//                 >
//                   <stat.icon
//                     className={cn("w-6 h-6 mx-auto mb-2", stat.color)}
//                   />
//                   <div className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-300">
//                     {stat.label}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Live Stats Bar */}
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
//                       <Phone className="w-4 h-4 text-white" />
//                     </div>
//                     <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white dark:border-gray-800 flex items-center justify-center">
//                       <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                       Live Demo Active
//                     </div>
//                     <div className="text-xs text-gray-600 dark:text-gray-400">
//                       {formatTimer(callTimer)} • Scenario {scenarioIndex + 1}/3
//                     </div>
//                   </div>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={resetDemo}
//                   className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//                 >
//                   <RotateCcw className="w-4 h-4 mr-2" />
//                   Reset
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Interactive Demo */}
//           <div className="relative">
//             {/* Main Conversation Container */}
//             <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-300 dark:border-gray-700/50 shadow-xl">
//               {/* Header with Active Call Info */}
//               <div className="flex items-center justify-between mb-8">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <div
//                       className={cn(
//                         "w-10 h-10 rounded-full flex items-center justify-center shadow-md",
//                         `bg-gradient-to-br ${currentScenario.color}`
//                       )}
//                     >
//                       <Volume2 className="w-5 h-5 text-white" />
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
//                       <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
//                     </div>
//                   </div>
//                   <div>
//                     <div className="font-semibold text-gray-900 dark:text-white">
//                       Zevaux AI Receptionist
//                     </div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400">
//                       <span className="inline-flex items-center gap-1">
//                         <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                         Active • {currentScenario.industry}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
//                     {formatTimer(callTimer)}
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     Call duration
//                   </div>
//                 </div>
//               </div>

//               {/* Active Calls Sidebar */}
//               <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                     Active Calls
//                   </div>
//                   <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
//                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                     3 calls in progress
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   {activeCalls.map((call) => (
//                     <div
//                       key={call.id}
//                       className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={cn(
//                             "w-8 h-8 rounded-full flex items-center justify-center",
//                             call.type === "New Lead"
//                               ? "bg-blue-100 dark:bg-blue-900/30"
//                               : call.type === "Appointment"
//                               ? "bg-green-100 dark:bg-green-900/30"
//                               : "bg-purple-100 dark:bg-purple-900/30"
//                           )}
//                         >
//                           {call.type === "New Lead" && (
//                             <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                           )}
//                           {call.type === "Appointment" && (
//                             <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
//                           )}
//                           {call.type === "Follow-up" && (
//                             <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                           )}
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900 dark:text-white">
//                             {call.type}
//                           </div>
//                           <div className="text-xs text-gray-600 dark:text-gray-400">
//                             {call.business}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-mono text-gray-900 dark:text-white">
//                           {call.duration}
//                         </div>
//                         <div className="text-xs text-gray-600 dark:text-gray-400">
//                           Duration
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Conversation Window */}
//               <div className="space-y-4 min-h-[240px] max-h-[300px] overflow-y-auto p-2">
//                 {currentConversation.map((message) => (
//                   <div
//                     key={message.id}
//                     className={cn(
//                       "flex gap-3 transition-all duration-500",
//                       message.speaker === "ai"
//                         ? "flex-row"
//                         : "flex-row-reverse",
//                       !activeMessages.includes(message.id) &&
//                         "opacity-0 translate-y-4"
//                     )}
//                   >
//                     {/* Avatar */}
//                     <div
//                       className={cn(
//                         "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
//                         message.speaker === "ai"
//                           ? `bg-gradient-to-br ${currentScenario.color} text-white`
//                           : "bg-blue-600 text-white"
//                       )}
//                     >
//                       {message.speaker === "ai" ? "AI" : "👤"}
//                     </div>

//                     {/* Message Bubble */}
//                     <div
//                       className={cn(
//                         "rounded-2xl px-4 py-3 max-w-[75%] transition-all duration-300 shadow-sm",
//                         message.speaker === "ai"
//                           ? "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none"
//                           : "bg-blue-600 text-white rounded-tr-none",
//                         currentStep === message.id &&
//                           "ring-2 ring-primary/30 dark:ring-primary/50"
//                       )}
//                     >
//                       <div
//                         className={cn(
//                           "text-sm leading-relaxed",
//                           message.speaker === "ai"
//                             ? "text-gray-900 dark:text-white"
//                             : "text-white"
//                         )}
//                       >
//                         {message.text}
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Typing Indicator (shows BEFORE next AI message) */}
//                 {isTyping && (
//                   <div className="flex gap-3">
//                     <div
//                       className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${currentScenario.color} text-white shadow-sm`}
//                     >
//                       AI
//                     </div>
//                     <div className="rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none">
//                       <div className="flex gap-1">
//                         {[1, 2, 3].map((dot) => (
//                           <div
//                             key={dot}
//                             className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
//                             style={{ animationDelay: `${dot * 200}ms` }}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Demo Controls Footer */}
//               <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700/50">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     <span className="inline-flex items-center gap-2">
//                       <span className="flex items-center gap-1">
//                         <div className="w-2 h-2 rounded-full bg-green-500" />
//                         Demo auto-rotates every call
//                       </span>
//                       • Scenario {scenarioIndex + 1}/3
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={togglePlay}
//                       className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
//                     >
//                       {isPlaying ? (
//                         <>
//                           <Pause className="w-4 h-4 mr-2" />
//                           Pause
//                         </>
//                       ) : (
//                         <>
//                           <Play className="w-4 h-4 mr-2" />
//                           Resume
//                         </>
//                       )}
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={resetDemo}
//                       className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//                     >
//                       <RotateCcw className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Floating Result Badges */}
//             <div className="absolute -top-4 -right-4">
//               <div
//                 className={cn(
//                   "text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 animate-bounce",
//                   `bg-gradient-to-r ${currentScenario.color}`
//                 )}
//               >
//                 <CheckCircle className="w-4 h-4" />
//                 Appointment Booked
//               </div>
//             </div>

//             <div className="absolute -bottom-4 -left-4">
//               <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4" />
//                 +$150 Revenue Generated
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// components/hero-vertical.tsx

// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowRight,
//   Play,
//   Pause,
//   Zap,
//   CheckCircle,
//   TrendingUp,
//   Users,
//   Clock,
//   Phone,
//   Volume2,
//   Calendar,
//   MessageSquare,
//   RotateCcw,
//   ChevronDown,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface ConversationMessage {
//   id: number;
//   speaker: "caller" | "ai";
//   text: string;
//   delay: number;
//   typingDuration?: number;
// }

// const CONVERSATION_SCENARIOS = [
//   {
//     id: 1,
//     industry: "Dental Clinic",
//     color: "from-blue-500 to-cyan-500",
//     icon: "🦷",
//     conversation: [
//       {
//         id: 1,
//         speaker: "caller",
//         text: "Hi, I need to schedule a dental cleaning for next week.",
//         delay: 1000,
//         typingDuration: 800,
//       },
//       {
//         id: 2,
//         speaker: "ai",
//         text: "I'd be happy to help! We have openings on Monday at 2 PM or Wednesday at 11 AM.",
//         delay: 1800,
//         typingDuration: 1200,
//       },
//       {
//         id: 3,
//         speaker: "caller",
//         text: "Wednesday at 11 AM works for me.",
//         delay: 1200,
//         typingDuration: 600,
//       },
//       {
//         id: 4,
//         speaker: "ai",
//         text: "Perfect! I've booked you for Wednesday at 11 AM. A confirmation is being sent to your phone now.",
//         delay: 2000,
//         typingDuration: 1400,
//       },
//     ],
//   },
//   {
//     id: 2,
//     industry: "Legal Office",
//     color: "from-purple-500 to-pink-500",
//     icon: "⚖️",
//     conversation: [
//       {
//         id: 1,
//         speaker: "caller",
//         text: "I need to speak with an attorney about a contract review.",
//         delay: 1000,
//         typingDuration: 900,
//       },
//       {
//         id: 2,
//         speaker: "ai",
//         text: "I can help with that. Can you tell me if this is for a business or personal matter?",
//         delay: 2000,
//         typingDuration: 1300,
//       },
//       {
//         id: 3,
//         speaker: "caller",
//         text: "It's for my small business - a vendor agreement.",
//         delay: 1300,
//         typingDuration: 700,
//       },
//       {
//         id: 4,
//         speaker: "ai",
//         text: "Thank you. Our business attorney has availability tomorrow. I'll send you a calendar link to choose a time.",
//         delay: 2200,
//         typingDuration: 1600,
//       },
//     ],
//   },
// ];

// export default function HeroVertical() {
//   const [activeMessages, setActiveMessages] = useState<number[]>([1]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [callTimer, setCallTimer] = useState(0);
//   const [scenarioIndex, setScenarioIndex] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const demoRef = useRef<HTMLDivElement>(null);
//   const timerRef = useRef<NodeJS.Timeout>(null);

//   const currentScenario = CONVERSATION_SCENARIOS[scenarioIndex];
//   const currentConversation = currentScenario.conversation;

//   // Handle conversation animation
//   useEffect(() => {
//     if (!isPlaying) return;

//     let currentDelay = 0;
//     const timers: NodeJS.Timeout[] = [];

//     currentConversation.forEach((msg) => {
//       if (msg.speaker === "ai") {
//         timers.push(
//           setTimeout(() => {
//             setIsTyping(true);
//           }, currentDelay)
//         );

//         timers.push(
//           setTimeout(() => {
//             setIsTyping(false);
//             setActiveMessages((prev) => [...prev, msg.id]);
//             setCurrentStep(msg.id);
//           }, currentDelay + (msg.typingDuration || 1000))
//         );
//       } else {
//         timers.push(
//           setTimeout(() => {
//             setActiveMessages((prev) => [...prev, msg.id]);
//             setCurrentStep(msg.id);
//           }, currentDelay + msg.delay)
//         );
//       }

//       currentDelay += msg.delay + (msg.typingDuration || 0);
//     });

//     const rotationTimer = setTimeout(() => {
//       setActiveMessages([1]);
//       setCurrentStep(0);
//       setScenarioIndex((prev) => (prev + 1) % CONVERSATION_SCENARIOS.length);
//     }, currentDelay + 2000);

//     timers.push(rotationTimer);

//     return () => {
//       timers.forEach((timer) => clearTimeout(timer));
//       setIsTyping(false);
//     };
//   }, [isPlaying, scenarioIndex, currentConversation]);

//   // Handle call timer
//   useEffect(() => {
//     if (isPlaying) {
//       timerRef.current = setInterval(() => {
//         setCallTimer((prev) => prev + 1);
//       }, 1000);
//     } else {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [isPlaying]);

//   const formatTimer = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const togglePlay = () => setIsPlaying(!isPlaying);

//   const resetDemo = () => {
//     setActiveMessages([1]);
//     setCurrentStep(0);
//     setCallTimer(0);
//     setScenarioIndex(0);
//     setIsTyping(false);
//     if (!isPlaying) setIsPlaying(true);
//   };

//   const scrollToDemo = () => {
//     demoRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950">
//       {/* Background elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
//         <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse dark:bg-blue-500/10" />
//         <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl dark:bg-purple-500/10" />
//       </div>

//       <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
//         {/* TOP SECTION: Content & Stats */}
//         <div className="pt-16 lg:pt-20">
//           {/* Badge */}
//           <div className="flex justify-center mb-8">
//             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/20 dark:to-primary/10 backdrop-blur-sm border border-primary/20 dark:border-primary/30 px-5 py-2.5 rounded-full">
//               <Zap className="w-4 h-4 text-primary" />
//               <span className="text-sm font-semibold text-gray-800 dark:text-white">
//                 🎁 Get 500 Free Minutes
//               </span>
//               <span className="text-xs text-gray-600 dark:text-gray-300">
//                 Limited time
//               </span>
//             </div>
//           </div>

//           {/* Headline - Centered */}
//           <div className="text-center max-w-6xl mx-auto mb-8">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
//               <span className="block text-gray-900 dark:text-white">
//                 Never Miss a Customer Call
//               </span>
//               {/* <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-blue-400 dark:via-primary dark:to-purple-400 bg-clip-text text-transparent mt-3">
//                 AI Receptionist That Works 24/7
//               </span> */}
//             </h1>

//             {/* Subtitle */}
//             <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
//               Professional AI that answers calls, books appointments, captures
//               leads, and follows up—sounding perfectly human.
//             </p>
//           </div>

//           {/* CTA Buttons - Centered */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group"
//               asChild
//             >
//               <Link href="/checkout" className="flex items-center gap-2">
//                 Start Free Trial - 500 Minutes
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Link>
//             </Button>

//             <Button
//               variant="outline"
//               size="lg"
//               onClick={scrollToDemo}
//               className="border border-gray-600 dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white px-8 py-6 rounded-xl group"
//             >
//               <div className="flex items-center gap-2">
//                 <Play className="w-5 h-5" />
//                 Watch Live Demo
//               </div>
//             </Button>
//           </div>

//           {/* Stats Bar - 4 Column */}
//           {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
//             {[
//               {
//                 label: "Call Answer Rate",
//                 value: "98.7%",
//                 icon: TrendingUp,
//                 color: "text-green-600",
//                 change: "+2.3%",
//               },
//               {
//                 label: "Lead Conversion",
//                 value: "42%",
//                 icon: Users,
//                 color: "text-blue-600",
//                 change: "+8%",
//               },
//               {
//                 label: "Customer Satisfaction",
//                 value: "4.8/5",
//                 icon: "⭐",
//                 color: "text-yellow-600",
//                 change: "2k+ reviews",
//               },
//               {
//                 label: "Setup Time",
//                 value: "3 min",
//                 icon: Clock,
//                 color: "text-purple-600",
//                 change: "No IT needed",
//               },
//             ].map((stat, index) => (
//               <div
//                 key={index}
//                 className="text-center p-5 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
//                   {stat.label}
//                 </div>
//                 <div className="text-xs text-gray-600 dark:text-gray-400">
//                   {stat.change}
//                 </div>
//               </div>
//             ))}
//           </div> */}

//           {/* Trust Indicators */}
//           <div className="text-center">
//             <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
//               Trusted by 5,000+ businesses
//               {/* including */}
//             </p>
//             {/* <div className="flex flex-wrap justify-center items-center gap-8">
//               {[
//                 "Healthcare",
//                 "Legal",
//                 "Real Estate",
//                 "Finance",
//                 "E-commerce",
//                 "Education",
//               ].map((industry, i) => (
//                 <div
//                   key={i}
//                   className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
//                 >
//                   {industry}
//                 </div>
//               ))}
//             </div> */}
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="flex justify-center pb-2">
//           <button
//             onClick={scrollToDemo}
//             className="group flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
//           >
//             {/* <span className="text-sm mb-2">See it in action</span> */}
//             <ChevronDown className="w-6 h-6 animate-bounce group-hover:animate-none" />
//           </button>
//         </div>
//       </div>

//       {/* BOTTOM SECTION: Interactive Demo (Full Width) */}
//       <div
//         ref={demoRef}
//         className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
//           <div className="max-w-6xl mx-auto">
//             {/* Demo Header */}
//             <div className="text-center mb-12">
//               <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/20 dark:to-primary/10 px-4 py-2 rounded-full mb-4">
//                 <Volume2 className="w-4 h-4 text-primary" />
//                 <span className="text-sm font-semibold text-gray-800 dark:text-white">
//                   Live AI Demo
//                 </span>
//               </div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//                 See Your AI Receptionist in Action
//               </h2>
//               <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
//                 Watch how Zevaux handles real customer conversations across
//                 different industries
//               </p>
//             </div>

//             {/* Interactive Demo Container */}
//             <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-300 dark:border-gray-700/50 shadow-xl overflow-hidden">
//               {/* Demo Header Bar */}
//               <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/50">
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <div
//                         className={cn(
//                           "w-10 h-10 rounded-full flex items-center justify-center shadow-md",
//                           `bg-gradient-to-br ${currentScenario.color}`
//                         )}
//                       >
//                         <span className="text-lg">{currentScenario.icon}</span>
//                       </div>
//                       <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
//                         <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
//                       </div>
//                     </div>
//                     <div>
//                       <div className="font-semibold text-gray-900 dark:text-white">
//                         Live Demo • {currentScenario.industry}
//                       </div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">
//                         <span className="inline-flex items-center gap-1">
//                           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                           Scenario {scenarioIndex + 1}/
//                           {CONVERSATION_SCENARIOS.length} • Auto-rotating
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <div className="text-right">
//                       <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
//                         {formatTimer(callTimer)}
//                       </div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">
//                         Call duration
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={togglePlay}
//                         className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
//                       >
//                         {isPlaying ? (
//                           <>
//                             <Pause className="w-4 h-4 mr-2" />
//                             Pause
//                           </>
//                         ) : (
//                           <>
//                             <Play className="w-4 h-4 mr-2" />
//                             Resume
//                           </>
//                         )}
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={resetDemo}
//                         className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//                       >
//                         <RotateCcw className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Conversation Area */}
//               <div className="p-6 md:p-8">
//                 <div className="grid lg:grid-cols-3 gap-8">
//                   {/* Left: Active Calls Panel */}
//                   <div className="lg:col-span-1">
//                     <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                           Active Calls
//                         </div>
//                         <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
//                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                           3 calls in progress
//                         </div>
//                       </div>

//                       <div className="space-y-3">
//                         {[
//                           {
//                             type: "New Lead",
//                             business: "Auto Repair",
//                             duration: "0:45",
//                             icon: "🚗",
//                             color: "bg-blue-100 dark:bg-blue-900/30",
//                           },
//                           {
//                             type: "Appointment",
//                             business: "Medical Spa",
//                             duration: "1:22",
//                             icon: "💆",
//                             color: "bg-green-100 dark:bg-green-900/30",
//                           },
//                           {
//                             type: "Follow-up",
//                             business: "Law Firm",
//                             duration: "2:15",
//                             icon: "⚖️",
//                             color: "bg-purple-100 dark:bg-purple-900/30",
//                           },
//                         ].map((call, i) => (
//                           <div
//                             key={i}
//                             className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/50"
//                           >
//                             <div className="flex items-center gap-3">
//                               <div
//                                 className={`w-10 h-10 rounded-full ${call.color} flex items-center justify-center`}
//                               >
//                                 <span className="text-lg">{call.icon}</span>
//                               </div>
//                               <div>
//                                 <div className="text-sm font-medium text-gray-900 dark:text-white">
//                                   {call.type}
//                                 </div>
//                                 <div className="text-xs text-gray-600 dark:text-gray-400">
//                                   {call.business}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
//                                 {call.duration}
//                               </div>
//                               <div className="text-xs text-gray-600 dark:text-gray-400">
//                                 Duration
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Quick Stats */}
//                       <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700/50">
//                         <div className="grid grid-cols-2 gap-3">
//                           <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
//                             <div className="text-lg font-bold text-gray-900 dark:text-white">
//                               12
//                             </div>
//                             <div className="text-xs text-gray-600 dark:text-gray-400">
//                               Today
//                             </div>
//                           </div>
//                           <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
//                             <div className="text-lg font-bold text-gray-900 dark:text-white">
//                               4
//                             </div>
//                             <div className="text-xs text-gray-600 dark:text-gray-400">
//                               Booked
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right: Conversation Panel */}
//                   <div className="lg:col-span-2">
//                     <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700/50 h-full">
//                       <div className="flex items-center justify-between mb-5">
//                         <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                           Live Conversation
//                         </div>
//                         <div className="text-xs text-gray-600 dark:text-gray-400">
//                           {isTyping ? "AI is typing..." : "Real-time demo"}
//                         </div>
//                       </div>

//                       {/* Conversation Messages */}
//                       <div className="space-y-4 min-h-[280px]">
//                         {currentConversation.map((message) => (
//                           <div
//                             key={message.id}
//                             className={cn(
//                               "flex gap-3 transition-all duration-500",
//                               message.speaker === "ai"
//                                 ? "flex-row"
//                                 : "flex-row-reverse",
//                               !activeMessages.includes(message.id) &&
//                                 "opacity-0 translate-y-4"
//                             )}
//                           >
//                             <div
//                               className={cn(
//                                 "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
//                                 message.speaker === "ai"
//                                   ? `bg-gradient-to-br ${currentScenario.color} text-white`
//                                   : "bg-blue-600 text-white"
//                               )}
//                             >
//                               {message.speaker === "ai" ? "AI" : "👤"}
//                             </div>

//                             <div
//                               className={cn(
//                                 "rounded-2xl px-5 py-3 max-w-[80%] transition-all duration-300 shadow-sm",
//                                 message.speaker === "ai"
//                                   ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none"
//                                   : "bg-blue-600 text-white rounded-tr-none",
//                                 currentStep === message.id &&
//                                   "ring-2 ring-primary/30 dark:ring-primary/50"
//                               )}
//                             >
//                               <div
//                                 className={cn(
//                                   "text-base leading-relaxed",
//                                   message.speaker === "ai"
//                                     ? "text-gray-900 dark:text-white"
//                                     : "text-white"
//                                 )}
//                               >
//                                 {message.text}
//                               </div>
//                             </div>
//                           </div>
//                         ))}

//                         {/* Typing Indicator */}
//                         {isTyping && (
//                           <div className="flex gap-3">
//                             <div
//                               className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${currentScenario.color} text-white shadow-sm`}
//                             >
//                               AI
//                             </div>
//                             <div className="rounded-2xl px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none">
//                               <div className="flex gap-1.5">
//                                 {[1, 2, 3].map((dot) => (
//                                   <div
//                                     key={dot}
//                                     className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse"
//                                     style={{ animationDelay: `${dot * 200}ms` }}
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {/* Result Badge */}
//                       {activeMessages.includes(currentConversation.length) && (
//                         <div
//                           className={cn(
//                             "mt-6 p-4 rounded-xl border text-white flex items-center justify-between",
//                             `bg-gradient-to-r ${currentScenario.color} border-transparent`
//                           )}
//                         >
//                           <div className="flex items-center gap-3">
//                             <CheckCircle className="w-5 h-5" />
//                             <div>
//                               <div className="font-semibold">
//                                 Appointment Successfully Booked
//                               </div>
//                               <div className="text-sm opacity-90">
//                                 Confirmation sent • Added to calendar
//                               </div>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="text-2xl font-bold">+$150</div>
//                             <div className="text-sm opacity-90">
//                               Revenue generated
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Demo Footer */}
//                 <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/50">
//                   <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">
//                       This is a real simulation of how Zevaux handles customer
//                       conversations.
//                       <span className="inline-flex items-center gap-2 ml-3">
//                         <span className="flex items-center gap-1">
//                           <div className="w-2 h-2 rounded-full bg-green-500" />
//                           Next scenario in: {10 - (callTimer % 10)}s
//                         </span>
//                       </span>
//                     </div>
//                     <Button
//                       variant="outline"
//                       onClick={resetDemo}
//                       className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
//                     >
//                       <RotateCcw className="w-4 h-4 mr-2" />
//                       Reset Demo
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Trust Signals Below Demo */}
//             <div className="mt-12 text-center">
//               <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
//                 Enterprise-grade security & reliability
//               </p>
//               <div className="flex flex-wrap justify-center items-center gap-4">
//                 {[
//                   { label: "SOC2 Certified", icon: "🛡️" },
//                   { label: "HIPAA Compliant", icon: "🏥" },
//                   { label: "GDPR Ready", icon: "🌐" },
//                   { label: "99.9% Uptime", icon: "⚡" },
//                   { label: "24/7 Support", icon: "🕒" },
//                   { label: "Bank-Level Security", icon: "🔒" },
//                 ].map((badge, i) => (
//                   <div
//                     key={i}
//                     className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-2"
//                   >
//                     <span>{badge.icon}</span>
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {badge.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// components/hero-vertical-fixed.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Pause,
  Zap,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  Phone,
  Volume2,
  Calendar,
  MessageSquare,
  RotateCcw,
  ChevronDown,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationMessage {
  id: number;
  speaker: "caller" | "ai";
  text: string;
  delay: number;
  typingDuration?: number;
}

interface Scenario {
  id: number;
  industry: string;
  color: string;
  icon: string;
  revenue: string;
  conversation: ConversationMessage[];
}

const CONVERSATION_SCENARIOS: Scenario[] = [
  {
    id: 1,
    industry: "Dental Clinic",
    color: "from-blue-500 to-cyan-500",
    icon: "🦷",
    revenue: "+$150",
    conversation: [
      {
        id: 1,
        speaker: "caller",
        text: "Hi, I need to schedule a dental cleaning for next week.",
        delay: 1000,
        typingDuration: 800,
      },
      {
        id: 2,
        speaker: "ai",
        text: "I'd be happy to help! We have openings on Monday at 2 PM or Wednesday at 11 AM.",
        delay: 1800,
        typingDuration: 1200,
      },
      {
        id: 3,
        speaker: "caller",
        text: "Wednesday at 11 AM works for me.",
        delay: 1200,
        typingDuration: 600,
      },
      {
        id: 4,
        speaker: "ai",
        text: "Perfect! I've booked you for Wednesday at 11 AM. A confirmation is being sent to your phone now.",
        delay: 2000,
        typingDuration: 1400,
      },
    ],
  },
  {
    id: 2,
    industry: "Legal Office",
    color: "from-purple-500 to-pink-500",
    icon: "⚖️",
    revenue: "+$350",
    conversation: [
      {
        id: 1,
        speaker: "caller",
        text: "I need to speak with an attorney about a contract review.",
        delay: 1000,
        typingDuration: 900,
      },
      {
        id: 2,
        speaker: "ai",
        text: "I can help with that. Can you tell me if this is for a business or personal matter?",
        delay: 2000,
        typingDuration: 1300,
      },
      {
        id: 3,
        speaker: "caller",
        text: "It's for my small business - a vendor agreement.",
        delay: 1300,
        typingDuration: 700,
      },
      {
        id: 4,
        speaker: "ai",
        text: "Thank you. Our business attorney has availability tomorrow. I'll send you a calendar link to choose a time.",
        delay: 2200,
        typingDuration: 1600,
      },
    ],
  },
  {
    id: 3,
    industry: "Real Estate",
    color: "from-orange-500 to-red-500",
    icon: "🏠",
    revenue: "+$850",
    conversation: [
      {
        id: 1,
        speaker: "caller",
        text: "I saw your listing for the 3-bedroom on Maple Street.",
        delay: 1000,
        typingDuration: 800,
      },
      {
        id: 2,
        speaker: "ai",
        text: "Great choice! That property is still available. Would you like to schedule a showing this week?",
        delay: 1800,
        typingDuration: 1200,
      },
      {
        id: 3,
        speaker: "caller",
        text: "Yes, I'm available Thursday afternoon.",
        delay: 1200,
        typingDuration: 600,
      },
      {
        id: 4,
        speaker: "ai",
        text: "Excellent! I've scheduled you for Thursday at 3 PM. Your agent will meet you there.",
        delay: 2000,
        typingDuration: 1400,
      },
    ],
  },
];

const SCENARIO_DURATION = 15000; // 15 seconds per scenario
const MAX_CALL_TIMER = 45; // Reset timer after 45 seconds

export default function HeroVerticalFixed() {
  const [activeMessages, setActiveMessages] = useState<number[]>([1]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [callTimer, setCallTimer] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [nextScenarioCountdown, setNextScenarioCountdown] = useState(10);
  const [activeCalls, setActiveCalls] = useState([
    {
      id: 1,
      type: "New Lead",
      business: "Auto Repair",
      duration: "0:45",
      icon: "🚗",
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: 2,
      type: "Appointment",
      business: "Medical Spa",
      duration: "1:22",
      icon: "💆",
      color: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: 3,
      type: "Follow-up",
      business: "Law Firm",
      duration: "2:15",
      icon: "⚖️",
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]);

  const demoRef = useRef<HTMLDivElement>(null);
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);
  const rotationRef = useRef<NodeJS.Timeout>(null);
  const countdownRef = useRef<NodeJS.Timeout>(null);
  const scenarioTimerRef = useRef<NodeJS.Timeout>(null);

  const currentScenario = CONVERSATION_SCENARIOS[scenarioIndex];
  const currentConversation = currentScenario.conversation;

  // Handle conversation animation
  useEffect(() => {
    if (!isPlaying) {
      // Clear any ongoing timers
      if (timerRef.current) clearInterval(timerRef.current);
      if (scenarioTimerRef.current) clearTimeout(scenarioTimerRef.current);
      return;
    }

    let currentDelay = 0;
    const timers: NodeJS.Timeout[] = [];

    currentConversation.forEach((msg) => {
      if (msg.speaker === "ai") {
        timers.push(
          setTimeout(() => {
            setIsTyping(true);
          }, currentDelay)
        );

        timers.push(
          setTimeout(() => {
            setIsTyping(false);
            setActiveMessages((prev) => [...prev, msg.id]);
            setCurrentStep(msg.id);
          }, currentDelay + (msg.typingDuration || 1000))
        );
      } else {
        timers.push(
          setTimeout(() => {
            setActiveMessages((prev) => [...prev, msg.id]);
            setCurrentStep(msg.id);
          }, currentDelay + msg.delay)
        );
      }

      currentDelay += msg.delay + (msg.typingDuration || 0);
    });

    // Reset call timer for this scenario
    setCallTimer(0);

    // Set scenario rotation timer
    scenarioTimerRef.current = setTimeout(() => {
      rotateToNextScenario();
    }, SCENARIO_DURATION);

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      setIsTyping(false);
      if (scenarioTimerRef.current) clearTimeout(scenarioTimerRef.current);
    };
  }, [isPlaying, scenarioIndex, currentConversation]);

  // Handle call timer (resets with each scenario)
  useEffect(() => {
    if (isPlaying && callTimer < MAX_CALL_TIMER) {
      timerRef.current = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, callTimer]);

  // Handle countdown to next scenario
  useEffect(() => {
    if (isPlaying) {
      countdownRef.current = setInterval(() => {
        setNextScenarioCountdown((prev) => {
          if (prev <= 1) {
            return 10; // Reset to 10 when rotating
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) clearInterval(countdownRef.current);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isPlaying]);

  // Rotate active calls periodically
  useEffect(() => {
    rotationRef.current = setInterval(() => {
      setActiveCalls((prev) =>
        prev.map((call) => ({
          ...call,
          duration: incrementDuration(call.duration),
        }))
      );
    }, 3000);

    return () => {
      if (rotationRef.current) clearInterval(rotationRef.current);
    };
  }, []);

  const rotateToNextScenario = () => {
    setActiveMessages([1]);
    setCurrentStep(0);
    setIsTyping(false);
    setNextScenarioCountdown(10);

    // Reset call timer
    setCallTimer(0);

    // Move to next scenario
    setScenarioIndex((prev) => (prev + 1) % CONVERSATION_SCENARIOS.length);
  };

  const incrementDuration = (duration: string) => {
    const [minutes, seconds] = duration.split(":").map(Number);
    const totalSeconds = minutes * 60 + seconds + 3;
    const newMinutes = Math.floor(totalSeconds / 60);
    const newSeconds = totalSeconds % 60;
    return `${newMinutes}:${newSeconds.toString().padStart(2, "0")}`;
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Restart the scenario timer
      scenarioTimerRef.current = setTimeout(() => {
        rotateToNextScenario();
      }, SCENARIO_DURATION);
    }
  };

  const resetDemo = () => {
    // Clear all timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (scenarioTimerRef.current) clearTimeout(scenarioTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Reset states
    setActiveMessages([1]);
    setCurrentStep(0);
    setCallTimer(0);
    setScenarioIndex(0);
    setIsTyping(false);
    setNextScenarioCountdown(10);

    // Restart if not playing
    if (!isPlaying) setIsPlaying(true);
  };

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse dark:bg-blue-500/10" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl dark:bg-purple-500/10" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP SECTION: Content & Stats */}
        <div className="pt-16 lg:pt-20">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/20 dark:to-primary/10 backdrop-blur-sm border border-primary/20 dark:border-primary/30 px-5 py-2.5 rounded-full">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                🎁 Get 500 Free Minutes
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Limited time
              </span>
            </div>
          </div>

          {/* Headline - Centered */}
          <div className="text-center max-w-6xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-gray-900 dark:text-white">
                Never Miss a Customer Call
              </span>
              {/* <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 dark:from-blue-400 dark:via-primary dark:to-purple-400 bg-clip-text text-transparent mt-3">
                AI Receptionist That Works 24/7
              </span> */}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Professional AI that answers calls, books appointments, captures
              leads, and follows up sounding perfectly human.
            </p>
          </div>

          {/* CTA Buttons - Centered */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group"
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
              onClick={scrollToDemo}
              className="border-2 border-gray-300 dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white px-8 py-6 rounded-xl group"
            >
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Live Demo
              </div>
            </Button>
          </div>

          {/* Stats Bar - 4 Column */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            {[
              {
                label: "Call Answer Rate",
                value: "98.7%",
                icon: TrendingUp,
                color: "text-green-600",
                change: "+2.3%",
              },
              {
                label: "Lead Conversion",
                value: "42%",
                icon: Users,
                color: "text-blue-600",
                change: "+8%",
              },
              {
                label: "Customer Satisfaction",
                value: "4.8/5",
                icon: Star,
                color: "text-yellow-600",
                change: "2k+ reviews",
              },
              {
                label: "Setup Time",
                value: "3 min",
                icon: Clock,
                color: "text-purple-600",
                change: "No IT needed",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-5 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.change}
                </div>
              </div>
            ))}
          </div> */}

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Trusted by 5,000+ businesses
              {/* including */}
            </p>
            {/* <div className="flex flex-wrap justify-center items-center gap-8">
              {[
                "Healthcare",
                "Legal",
                "Real Estate",
                "Finance",
                "E-commerce",
                "Education",
              ].map((industry, i) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {industry}
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center pb-8">
          <button
            onClick={scrollToDemo}
            className="group flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            {/* <span className="text-sm mb-2">See it in action</span> */}
            <ChevronDown className="w-6 h-6 animate-bounce group-hover:animate-none" />
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION: Interactive Demo (Full Width) */}
      <div
        ref={demoRef}
        className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto">
            {/* Demo Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/20 dark:to-primary/10 px-4 py-2 rounded-full mb-4">
                <Volume2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  Live AI Demo
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                See Your AI Receptionist in Action
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Watch how Zevaux handles real customer conversations across
                different industries
              </p>
            </div>

            {/* Interactive Demo Container */}
            <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-300 dark:border-gray-700/50 shadow-xl overflow-hidden">
              {/* Demo Header Bar */}
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shadow-md",
                          `bg-gradient-to-br ${currentScenario.color}`
                        )}
                      >
                        <span className="text-lg">{currentScenario.icon}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Live Demo • {currentScenario.industry}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          Scenario {scenarioIndex + 1}/
                          {CONVERSATION_SCENARIOS.length}
                          {/* • */}
                          {/* <span className="ml-1 text-primary font-medium">
                            Next in {nextScenarioCountdown}s
                          </span> */}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                        {formatTimer(callTimer)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Call duration
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={togglePlay}
                        className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetDemo}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Area */}
              <div className="p-2 md:p-4">
                <div className="grid lg:grid-cols-3 gap-4">
                  {/* Left: Active Calls Panel */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          Active Calls
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          3 calls in progress
                        </div>
                      </div>

                      <div className="space-y-3">
                        {activeCalls.map((call, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700/50"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full ${call.color} flex items-center justify-center`}
                              >
                                <span className="text-lg">{call.icon}</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {call.type}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {call.business}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                                {call.duration}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Duration
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Stats */}
                      <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700/50">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              12
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Today
                            </div>
                          </div>
                          <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              4
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Booked
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Conversation Panel - Fixed Height */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50 h-full min-h-[400px]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          Live Conversation
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {isTyping ? "AI is typing..." : "Real-time demo"}
                        </div>
                      </div>

                      {/* Conversation Messages Container - Fixed Height with Scroll */}
                      <div
                        ref={conversationContainerRef}
                        className="space-y-3 h-[280px] overflow-y-auto"
                      >
                        {currentConversation.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-2 transition-all duration-500",
                              message.speaker === "ai"
                                ? "flex-row"
                                : "flex-row-reverse",
                              !activeMessages.includes(message.id) &&
                                "opacity-0 translate-y-4"
                            )}
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                                message.speaker === "ai"
                                  ? `bg-gradient-to-br ${currentScenario.color} text-white`
                                  : "bg-blue-600 text-white"
                              )}
                            >
                              {message.speaker === "ai" ? "AI" : "👤"}
                            </div>

                            <div
                              className={cn(
                                "rounded-2xl px-3 py-1.5 max-w-[80%] transition-all duration-300 shadow-sm",
                                message.speaker === "ai"
                                  ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none"
                                  : "bg-blue-600 text-white rounded-tr-none",
                                currentStep === message.id &&
                                  "ring-2 ring-primary/30 dark:ring-primary/50"
                              )}
                            >
                              <div
                                className={cn(
                                  "text-xs leading-relaxed",
                                  message.speaker === "ai"
                                    ? "text-gray-900 dark:text-white"
                                    : "text-white"
                                )}
                              >
                                {message.text}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Typing Indicator - Positioned properly */}
                        {isTyping && (
                          <div className="flex gap-2 mt-0">
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${currentScenario.color} text-white shadow-sm`}
                            >
                              AI
                            </div>
                            <div className="rounded-2xl px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none">
                              <div className="flex gap-1">
                                {[1, 2, 3].map((dot) => (
                                  <div
                                    key={dot}
                                    className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
                                    style={{ animationDelay: `${dot * 200}ms` }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Result Badge */}
                      {activeMessages.includes(currentConversation.length) && (
                        <div
                          className={cn(
                            " py-1 px-2 rounded-xl border text-white flex items-center justify-between",
                            `bg-gradient-to-r ${currentScenario.color} border-transparent`
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <div>
                              <div className="font-semibold text-sm">
                                Appointment Successfully Booked
                              </div>
                              <div className="text-xs opacity-90">
                                Confirmation sent • Added to calendar
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">
                              {currentScenario.revenue}
                            </div>
                            <div className="text-xs opacity-90">
                              Revenue generated
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scenario Progress Bar */}
                {/* <div className="mt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Current scenario: {currentScenario.industry}</span>
                    <span>Next in {nextScenarioCountdown}s</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-1000",
                        `bg-gradient-to-r ${currentScenario.color}`
                      )}
                      style={{
                        width: `${100 - (nextScenarioCountdown / 10) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Scenario {scenarioIndex + 1}</span>
                    <span>Auto-rotating every 15s</span>
                    <span>{scenarioIndex + 1}/3</span>
                  </div>
                </div> */}

                {/* Demo Footer */}
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      This is a real simulation of how Zevaux handles customer
                      conversations. Timer resets with each scenario.
                    </div>
                    <Button
                      variant="outline"
                      onClick={resetDemo}
                      className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signals Below Demo */}
            {/* <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Enterprise-grade security & reliability
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                {[
                  { label: "SOC2 Certified", icon: "🛡️" },
                  { label: "HIPAA Compliant", icon: "🏥" },
                  { label: "GDPR Ready", icon: "🌐" },
                  { label: "99.9% Uptime", icon: "⚡" },
                  { label: "24/7 Support", icon: "🕒" },
                  { label: "Bank-Level Security", icon: "🔒" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center gap-2"
                  >
                    <span>{badge.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
