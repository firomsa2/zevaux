// "use client";

// import type React from "react";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export function CheckoutForm({ plan, user }: any) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Stripe checkout would be handled here
//       // For now, we'll show a placeholder
//       console.log("Processing payment for plan:", plan.id);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Payment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Payment Information</CardTitle>
//         <CardDescription>
//           Enter your payment details to complete the purchase
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={user?.email}
//               disabled
//               className="mt-2 bg-surface"
//             />
//           </div>

//           <div>
//             <Label htmlFor="card">Card Number</Label>
//             <Input
//               id="card"
//               placeholder="4242 4242 4242 4242"
//               className="mt-2"
//               disabled={loading}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="expiry">Expiry Date</Label>
//               <Input
//                 id="expiry"
//                 placeholder="MM/YY"
//                 className="mt-2"
//                 disabled={loading}
//               />
//             </div>
//             <div>
//               <Label htmlFor="cvc">CVC</Label>
//               <Input
//                 id="cvc"
//                 placeholder="123"
//                 className="mt-2"
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full btn-primary"
//           >
//             {loading ? "Processing..." : `Pay $${plan.pricePerMonth}/month`}
//           </Button>

//           <p className="text-xs text-text-tertiary text-center">
//             Your payment information is secure and encrypted
//           </p>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutForm({ plan, user }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Stripe checkout would be handled here
      // For now, we'll show a placeholder
      console.log("Processing payment for plan:", plan.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Enter your payment details to complete the purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email}
              disabled
              className="mt-2 bg-surface"
            />
          </div>

          <div>
            <Label htmlFor="card">Card Number</Label>
            <Input
              id="card"
              placeholder="4242 4242 4242 4242"
              className="mt-2"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                className="mt-2"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                className="mt-2"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? "Processing..." : `Pay $${plan.pricePerMonth}/month`}
          </Button>

          <p className="text-xs text-text-tertiary text-center">
            Your payment information is secure and encrypted
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
