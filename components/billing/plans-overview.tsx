// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { PLANS } from "@/lib/products";
// import { Check } from "lucide-react";
// import Link from "next/link";

// export function PlansOverview({ currentPlan }: { currentPlan?: string }) {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {PLANS.map((plan) => (
//           <Card
//             key={plan.id}
//             className={`relative ${
//               plan.popular ? "border-accent border-2 md:scale-105" : ""
//             }`}
//           >
//             {plan.popular && (
//               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                 <Badge className="bg-accent text-white">Most Popular</Badge>
//               </div>
//             )}

//             <CardHeader>
//               <CardTitle>{plan.name}</CardTitle>
//               <CardDescription>{plan.description}</CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-6">
//               {/* Pricing */}
//               <div>
//                 {plan.pricePerMonth > 0 ? (
//                   <>
//                     <div className="text-4xl font-bold">
//                       ${plan.pricePerMonth}
//                     </div>
//                     <p className="text-sm text-text-tertiary">
//                       per month, billed monthly
//                     </p>
//                   </>
//                 ) : (
//                   <div className="text-2xl font-bold">Custom Pricing</div>
//                 )}
//               </div>

//               {/* Features */}
//               <div className="space-y-3">
//                 <p className="text-sm font-medium">Includes:</p>
//                 <ul className="space-y-2">
//                   <li className="flex items-start gap-2 text-sm">
//                     <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span>
//                       {plan.voiceMinutes.toLocaleString()} voice minutes/month
//                     </span>
//                   </li>
//                   <li className="flex items-start gap-2 text-sm">
//                     <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span>
//                       {plan.phoneNumbers} phone number
//                       {plan.phoneNumbers > 1 ? "s" : ""}
//                     </span>
//                   </li>
//                   {plan.features.slice(0, 3).map((feature, idx) => (
//                     <li key={idx} className="flex items-start gap-2 text-sm">
//                       <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* CTA Button */}
//               {currentPlan === plan.id ? (
//                 <Button disabled className="w-full">
//                   Current Plan
//                 </Button>
//               ) : plan.id === "enterprise" ? (
//                 <Button className="w-full btn-primary">Contact Sales</Button>
//               ) : (
//                 <Link href={`/checkout?plan=${plan.id}`}>
//                   <Button className="w-full btn-primary">
//                     Upgrade to {plan.name}
//                   </Button>
//                 </Link>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* All Features Comparison */}
//       <Card>
//         <CardHeader>
//           <CardTitle>All Features</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border">
//                   <th className="text-left py-3 px-4 font-medium">Feature</th>
//                   {PLANS.map((plan) => (
//                     <th
//                       key={plan.id}
//                       className="text-center py-3 px-4 font-medium"
//                     >
//                       {plan.name}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {PLANS[0].features.map((feature, idx) => (
//                   <tr key={idx} className="border-b border-border">
//                     <td className="py-3 px-4">{feature}</td>
//                     {PLANS.map((plan) => (
//                       <td key={plan.id} className="text-center py-3 px-4">
//                         {plan.features.includes(feature) ? (
//                           <Check className="w-5 h-5 text-green-500 mx-auto" />
//                         ) : (
//                           <span className="text-text-tertiary">-</span>
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Business, Plan } from "@/types/database";

interface PlansOverviewProps {
  business: Business;
  currentPlan: Plan | null;
  plans: Plan[];
}

export function PlansOverview({
  business,
  currentPlan,
  plans,
}: PlansOverviewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setLoading(planId);
    try {
      const response = await fetch("/api/stripe/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          planId: planId,
        }),
      });

      const data = await response.json();

      if (data.session_id) {
        // Redirect to Stripe checkout
        window.location.href = `https://checkout.stripe.com/pay/${data.session_id}`;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  // Ensure plans is an array before sorting
  if (!plans || !Array.isArray(plans) || plans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No plans available at the moment.
        </p>
      </div>
    );
  }

  const sortedPlans = [...plans].sort(
    (a, b) => (a.monthly_price || 0) - (b.monthly_price || 0)
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedPlans.map((plan) => {
          const isCurrentPlan = currentPlan?.id === plan.id;
          const isPopular = plan.name === "Pro";

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                isPopular ? "border-accent border-2 md:scale-105" : ""
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-white">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  Perfect for growing businesses
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                <div>
                  <div className="text-4xl font-bold">
                    ${plan.monthly_price}
                  </div>
                  <p className="text-sm text-text-secondary">
                    per month, billed monthly
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Includes:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        {plan.minutes_limit?.toLocaleString() || "Unlimited"}{" "}
                        minutes/month
                      </span>
                    </li>
                    {plan.features && typeof plan.features === "object" ? (
                      Object.entries(plan.features)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <li
                            key={key}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{String(value)}</span>
                          </li>
                        ))
                    ) : (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Advanced features</span>
                      </li>
                    )}
                  </ul>
                </div>

                {isCurrentPlan ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : plan.name === "Enterprise" ? (
                  <Button className="w-full btn-primary">Contact Sales</Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading === plan.id}
                    className="w-full btn-primary"
                  >
                    {loading === plan.id
                      ? "Upgrading..."
                      : "Upgrade to " + plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
