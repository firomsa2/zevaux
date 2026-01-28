// import {
//   PhoneOff,
//   Calendar,
//   Zap,
//   Clock,
//   Mic,
//   LinkIcon,
//   Shield,
//   MessageSquare,
//   Globe,
//   BarChart3,
//   Users,
//   Bell,
//   ArrowRight,
//   CheckCircle2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export function Features() {
//   const mainFeatures = [
//     {
//       icon: PhoneOff,
//       title: "24/7 Call Answering",
//       description:
//         "Never miss a call again. Zevaux answers every incoming call instantly, any time of day or night, holidays included.",
//       highlights: [
//         "Answer calls in under 1 second",
//         "Handle multiple calls simultaneously",
//         "No hold music or wait times",
//       ],
//     },
//     {
//       icon: Calendar,
//       title: "Appointment Booking",
//       description:
//         "Seamlessly book appointments during calls. Integrates with Google Calendar, Calendly, Acuity, and more.",
//       highlights: [
//         "Real-time calendar sync",
//         "Automatic confirmations sent",
//         "Smart conflict prevention",
//       ],
//     },
//     {
//       icon: Zap,
//       title: "Lead Qualification",
//       description:
//         "Capture and qualify leads automatically. Ask custom questions, gather contact info, and route to the right person.",
//       highlights: [
//         "Custom qualification questions",
//         "Instant lead notifications",
//         "CRM integration ready",
//       ],
//     },
//     {
//       icon: Mic,
//       title: "Natural Human Voice",
//       description:
//         "Advanced AI that sounds like a real receptionist. Professional, friendly, and trained on your brand voice.",
//       highlights: [
//         "Multiple voice options",
//         "Custom greetings & scripts",
//         "Natural conversation flow",
//       ],
//     },
//   ];

//   const additionalFeatures = [
//     {
//       icon: Shield,
//       title: "Spam Filtering",
//       description:
//         "Automatically block robocalls and sales calls so you only hear from real customers.",
//     },
//     {
//       icon: MessageSquare,
//       title: "SMS & Text Links",
//       description:
//         "Send booking links, directions, or follow-up texts during calls.",
//     },
//     {
//       icon: Globe,
//       title: "Multi-Language",
//       description:
//         "Support for English, Spanish, and more. Connect with diverse customers.",
//     },
//     {
//       icon: BarChart3,
//       title: "Call Analytics",
//       description:
//         "Detailed recordings, transcripts, and insights for every call.",
//     },
//     {
//       icon: Users,
//       title: "Call Transfers",
//       description:
//         "Seamlessly transfer important calls to the right team member.",
//     },
//     {
//       icon: Bell,
//       title: "Instant Notifications",
//       description:
//         "Get email and SMS alerts for new calls, leads, and bookings.",
//     },
//     {
//       icon: LinkIcon,
//       title: "Easy Integration",
//       description:
//         "Works with your existing phone number. No hardware or system changes.",
//     },
//     {
//       icon: Clock,
//       title: "Custom Hours",
//       description:
//         "Set business hours, holiday schedules, and after-hours behavior.",
//     },
//   ];

//   return (
//     <section
//       id="features"
//       className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
//     >
//       {/* Background */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
//       </div>

//       <div className="mx-auto max-w-7xl">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
//             <Zap className="h-4 w-4 text-primary" />
//             <span className="text-sm font-medium text-primary">
//               Powerful Features
//             </span>
//           </div>
//           <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
//             Everything You Need to{" "}
//             <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               Never Miss a Call
//             </span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             From call answering to appointment booking, Zevaux handles it all
//             automatically.
//           </p>
//         </div>

//         {/* Main Features - Large Cards */}
//         <div className="grid md:grid-cols-2 gap-6 mb-16">
//           {mainFeatures.map((feature, index) => {
//             const Icon = feature.icon;
//             return (
//               <div
//                 key={feature.title}
//                 className="group relative bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
//               >
//                 {/* Icon */}
//                 <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                   <Icon className="h-7 w-7 text-primary" />
//                 </div>

//                 {/* Title & Description */}
//                 <h3 className="text-xl font-bold text-foreground mb-3">
//                   {feature.title}
//                 </h3>
//                 <p className="text-muted-foreground mb-6">
//                   {feature.description}
//                 </p>

//                 {/* Highlights */}
//                 <ul className="space-y-2">
//                   {feature.highlights.map((highlight) => (
//                     <li
//                       key={highlight}
//                       className="flex items-center gap-2 text-sm text-foreground"
//                     >
//                       <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
//                       {highlight}
//                     </li>
//                   ))}
//                 </ul>

//                 {/* Hover gradient */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
//               </div>
//             );
//           })}
//         </div>

//         {/* Additional Features - Smaller Grid */}
//         <div className="mb-12">
//           <h3 className="text-xl font-bold text-center text-foreground mb-8">
//             Plus Even More Features
//           </h3>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {additionalFeatures.map((feature) => {
//               const Icon = feature.icon;
//               return (
//                 <div
//                   key={feature.title}
//                   className="bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
//                       <Icon className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-foreground text-sm mb-1">
//                         {feature.title}
//                       </h4>
//                       <p className="text-xs text-muted-foreground">
//                         {feature.description}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="text-center">
//           <Button
//             asChild
//             size="lg"
//             className="bg-primary hover:bg-primary/90 text-primary-foreground"
//           >
//             <Link href="/signup" className="flex items-center gap-2">
//               See All Features
//               <ArrowRight className="h-5 w-5" />
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// }


import {
  PhoneOff,
  Calendar,
  Zap,
  Clock,
  Mic,
  LinkIcon,
  Shield,
  MessageSquare,
  Globe,
  BarChart3,
  Users,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Features() {
  const mainFeatures = [
    {
      icon: PhoneOff,
      title: "Never Miss Another Lead",
      description:
        "Every caller gets answered instantly, 24/7. No more voicemails, no lost opportunities. Your AI receptionist is always available—even when you're not.",
      highlights: [
        "Answer calls in under 1 second",
        "Handles multiple calls at once",
        "Works holidays and after-hours",
      ],
    },
    {
      icon: Calendar,
      title: "Instantly Book More Appointments",
      description:
        "Stop chasing leads to schedule them. Zevaux books appointments live on the call, syncs to your calendar automatically, and sends confirmations.",
      highlights: [
        "Real-time calendar integration",
        "Automatic SMS confirmations",
        "Smart scheduling prevents double-bookings",
      ],
    },
    {
      icon: Zap,
      title: "Qualify Leads Instantly",
      description:
        "Ask the right questions during every call. Zevaux qualifies leads in real-time, captures details, and gets them to you immediately so you can focus on closing.",
      highlights: [
        "Custom qualification questions",
        "Instant push notifications",
        "Seamless CRM sync",
      ],
    },
    {
      icon: Mic,
      title: "Sounds Genuinely Human",
      description:
        "Callers think they're talking to your receptionist. Natural conversation, empathy, and personality built-in. No robotic scripts. No awkward pauses.",
      highlights: [
        "12+ natural-sounding voices",
        "Learns your business voice",
        "Handles unexpected conversations",
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Block Time-Wasting Calls",
      description:
        "Automatically filter spam, scams, and sales calls. Only real customers reach your inbox.",
    },
    {
      icon: MessageSquare,
      title: "Send Info During Calls",
      description:
        "Share booking links, directions, or documents via text—right when they ask.",
    },
    {
      icon: Globe,
      title: "Reach More Customers",
      description:
        "Speak Spanish, English, or more. Connect with your entire market.",
    },
    {
      icon: BarChart3,
      title: "Understand Every Call",
      description:
        "Review recordings, read transcripts, and spot patterns. Data-driven insights included.",
    },
    {
      icon: Users,
      title: "Route Calls Intelligently",
      description:
        "Transfer important calls to your team members or department instantly.",
    },
    {
      icon: Bell,
      title: "Get Notified Immediately",
      description:
        "Real-time alerts for new calls, leads, and bookings—never miss the moment.",
    },
    {
      icon: LinkIcon,
      title: "Setup in Minutes",
      description:
        "No hardware, no installation. Works with your existing phone number immediately.",
    },
    {
      icon: Clock,
      title: "Business Hours Control",
      description:
        "Set custom schedules, holidays, and after-hours messages. Always on your terms.",
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Proven to Convert
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              More Calls. More Bookings. More Revenue.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed to help you capture leads, convert them into bookings, and grow your business without lifting a finger.
          </p>
        </div>

        {/* Main Features - Large Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {feature.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Additional Features - Smaller Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-center text-foreground mb-8">
            Plus Even More Features
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {additionalFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/signup" className="flex items-center gap-2">
              See All Features
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
