// import {
//   XCircle,
//   Clock,
//   DollarSign,
//   PhoneOff,
//   Sparkles,
//   ArrowRight,
//   Phone,
//   Zap,
//   Shield,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export function ProblemSolution() {
//   const problems = [
//     {
//       icon: PhoneOff,
//       title: "Answer every call yourself",
//       pain: "Constant interruptions during the day",
//       subPoints: [
//         "Wasted time on spam calls",
//         "Can't focus on actual work",
//         "Always chasing people down",
//       ],
//     },
//     {
//       icon: Clock,
//       title: "Send calls to voicemail",
//       pain: "Most people don't leave a message",
//       subPoints: [
//         "Hard to find time to call back",
//         "Impossible to reach them again",
//         "Lost revenue opportunities",
//       ],
//     },
//     {
//       icon: DollarSign,
//       title: "Pay for an answering service",
//       pain: "Every call costs $2-5/minute",
//       subPoints: [
//         "Long hold times for callers",
//         "Inconsistent service quality",
//         "Untrained on your business",
//       ],
//     },
//   ];

//   const solutions = [
//     {
//       icon: Phone,
//       title: "Always Available",
//       description:
//         "Zevaux answers every call 24/7/365, even when you're with clients or sleeping.",
//     },
//     {
//       icon: Sparkles,
//       title: "Trained on Your Business",
//       description:
//         "Learns your services, pricing, and FAQs to give accurate, personalized responses.",
//     },
//     {
//       icon: Zap,
//       title: "One Low Monthly Price",
//       description:
//         "Unlimited calls, no per-minute charges. Predictable costs that grow with you.",
//     },
//     {
//       icon: Shield,
//       title: "Professional & Consistent",
//       description:
//         "Every caller gets the same excellent experience, no matter when they call.",
//     },
//   ];

//   return (
//     <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
//       {/* Background */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
//       </div>

//       <div className="mx-auto max-w-7xl">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
//             Currently, You Have Three{" "}
//             <span className="text-destructive">Bad Options</span>
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Traditional solutions for handling business calls are expensive,
//             unreliable, or time-consuming. There&apos;s a better way.
//           </p>
//         </div>

//         {/* Problems Grid */}
//         <div className="grid md:grid-cols-3 gap-6 mb-20">
//           {problems.map((problem, index) => {
//             const Icon = problem.icon;
//             return (
//               <div
//                 key={problem.title}
//                 className="relative group"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div className="h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-destructive/30 hover:shadow-lg">
//                   {/* Problem Header */}
//                   <div className="flex items-start gap-4 mb-4">
//                     <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
//                       <Icon className="h-6 w-6 text-destructive" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">
//                         {problem.title}
//                       </h3>
//                       <p className="text-sm text-destructive font-medium">
//                         {problem.pain}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Sub-points */}
//                   <ul className="space-y-2 pl-16">
//                     {problem.subPoints.map((point) => (
//                       <li
//                         key={point}
//                         className="flex items-center gap-2 text-sm text-muted-foreground"
//                       >
//                         <XCircle className="h-4 w-4 text-destructive/60 flex-shrink-0" />
//                         {point}
//                       </li>
//                     ))}
//                   </ul>

//                   {/* Strikethrough effect on hover */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Transition Arrow */}
//         <div className="flex justify-center mb-16">
//           <div className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-full">
//             <span className="text-lg font-semibold text-foreground">
//               There&apos;s a smarter way
//             </span>
//             <ArrowRight className="h-5 w-5 text-primary" />
//           </div>
//         </div>

//         {/* Solution Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
//             <Sparkles className="h-4 w-4 text-primary" />
//             <span className="text-sm font-medium text-primary">
//               Meet Zevaux
//             </span>
//           </div>
//           <h3 className="text-2xl font-bold text-foreground sm:text-3xl mb-4">
//             Your AI Receptionist That Never Misses a Call
//           </h3>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             AI-powered, always available, and trained to understand your
//             services. Zevaux picks up every call and delivers accurate
//             answers—every time.
//           </p>
//         </div>

//         {/* Solutions Grid */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {solutions.map((solution, index) => {
//             const Icon = solution.icon;
//             return (
//               <div
//                 key={solution.title}
//                 className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-primary/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
//                   <Icon className="h-7 w-7 text-primary" />
//                 </div>
//                 <h4 className="font-semibold text-foreground mb-2">
//                   {solution.title}
//                 </h4>
//                 <p className="text-sm text-muted-foreground">
//                   {solution.description}
//                 </p>
//               </div>
//             );
//           })}
//         </div>

//         {/* CTA */}
//         <div className="text-center">
//           <Button
//             asChild
//             size="lg"
//             className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             <Link href="/signup" className="flex items-center gap-2">
//               Start Free Trial
//               <ArrowRight className="h-5 w-5" />
//             </Link>
//           </Button>
//           <p className="text-sm text-muted-foreground mt-4">
//             No credit card required • Setup in 5 minutes
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }



import {
  XCircle,
  Clock,
  DollarSign,
  PhoneOff,
  Sparkles,
  ArrowRight,
  Phone,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProblemSolution() {
  const problems = [
    {
      icon: PhoneOff,
      title: "You Answer Every Call",
      pain: "Constant interruptions = lost focus & momentum",
      subPoints: [
        "Spam calls break your concentration mid-task",
        "Can't focus on actual business-growing work",
        "Prospects get frustrated with voicemails",
      ],
    },
    {
      icon: Clock,
      title: "You Send Calls to Voicemail",
      pain: "Most callers never leave a message",
      subPoints: [
        "You never know who called or why",
        "Impossible to follow up with lost leads",
        "Revenue walks out the door daily",
      ],
    },
    {
      icon: DollarSign,
      title: "You Pay for Answering Services",
      pain: "Expensive ($2-5/min) and unreliable",
      subPoints: [
        "Callers wait on hold, frustrated and leaving",
        "Inconsistent service quality & availability",
        "Services don't understand your business",
      ],
    },
  ];

  const solutions = [
    {
      icon: Phone,
      title: "Never Miss Another Lead",
      description:
        "Every caller gets answered instantly, 24/7. Even at 2 AM, during holidays, or while you're closing other deals.",
    },
    {
      icon: Sparkles,
      title: "Sounds Like Your Receptionist",
      description:
        "Trained on your services, pricing, and FAQs. Callers think they're talking to your real team—because the AI IS your team.",
    },
    {
      icon: Zap,
      title: "Affordable & Predictable",
      description:
        "No per-minute charges. One low monthly fee covers unlimited calls. Scale affordably as you grow.",
    },
    {
      icon: Shield,
      title: "Consistent Excellence",
      description:
        "Every caller gets the same professional experience. No tired receptionists, no bad days, no dropped calls.",
    },
  ];

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
            Right Now, You&apos;re Losing Leads Every Single Day
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Between missed calls, unanswered voicemails, and expensive answering services, you&apos;re leaving money on the table. Most business owners choose between three impossible options. But there&apos;s a smarter way.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className="relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-destructive/30 hover:shadow-lg">
                  {/* Problem Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-destructive font-medium">
                        {problem.pain}
                      </p>
                    </div>
                  </div>

                  {/* Sub-points */}
                  <ul className="space-y-2 pl-16">
                    {problem.subPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <XCircle className="h-4 w-4 text-destructive/60 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Strikethrough effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Transition Arrow */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-full">
            <span className="text-lg font-semibold text-foreground">
              There&apos;s a smarter way
            </span>
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Solution Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Introducing Zevaux
            </span>
          </div>
          <h3 className="text-2xl font-bold text-foreground sm:text-3xl mb-4">
            The AI Receptionist That Captures Leads While You Sleep
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Zevaux answers every call like your best receptionist would. It learns your business, qualifies leads in real-time, and books appointments automatically. No more lost revenue. No more missed opportunities.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.title}
                className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-primary/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {solution.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Setup in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
