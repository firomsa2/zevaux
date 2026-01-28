// import type React from "react";
// import { redirect } from "next/navigation";
// import { createClient } from "@/utils/supabase/server";

// export default async function OnboardingLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect("/login");
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
//       {children}
//     </div>
//   );
// }

import type React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (userData?.business_id) {
    const { data: business } = await supabase
      .from("businesses")
      .select("onboarding_completed")
      .eq("id", userData.business_id)
      .single();

    // If onboarding is complete, redirect to dashboard
    if (business?.onboarding_completed) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {children}
    </div>
  );
}
