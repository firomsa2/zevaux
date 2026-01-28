// import { AppSidebar } from "@/components/app-sidebar";
// import { ModeToggle } from "@/components/mode-toggle";
// import { NavUser } from "@/components/nav-user";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { createClient } from "@/utils/supabase/server";
// import { Bell, HelpCircle } from "lucide-react";
// import { redirect } from "next/navigation";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) redirect("/login");

//   const { data: me } = await supabase
//     .from("users")
//     .select("role")
//     .eq("email", user.email)
//     .single();
//   if (me?.role !== "admin") redirect("/dashboard/calls");

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//           <div className="flex items-center justify-between px-4 w-full">
//             <div className="flex items-center justify-center">
//               <SidebarTrigger className="-ml-1" />
//               <Separator
//                 orientation="vertical"
//                 className="mr-2 data-[orientation=vertical]:h-4" */}
//         {/* /> */}
//         {/* <Breadcrumb>
//                 <BreadcrumbList>
//                   <BreadcrumbItem className="hidden md:block">
//                     <BreadcrumbLink href="#">Zevaux</BreadcrumbLink>
//                   </BreadcrumbItem>
//                   <BreadcrumbSeparator className="hidden md:block" />
//                   <BreadcrumbItem>
//                     <BreadcrumbPage>Overview</BreadcrumbPage>
//                   </BreadcrumbItem>
//                 </BreadcrumbList>
//               </Breadcrumb> */}
//         {/* </div>
//             <div className="flex items-center">
//               <ModeToggle />
//               <NavUser user={user} />
//             </div>
//           </div>
//         </header> */}
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b">
//           <div className="flex items-center justify-between px-4 w-full">
//             {/* Left Section */}
//             <div className="flex items-center">
//               <SidebarTrigger className="-ml-1" />
//               <Separator
//                 orientation="vertical"
//                 className="mx-2 data-[orientation=vertical]:h-4"
//               />
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center gap-4">
//               {/* Notification Bell */}
//               <button
//                 className="p-2 rounded-md hover:bg-muted transition"
//                 aria-label="Notifications"
//               >
//                 <Bell className="h-5 w-5" />
//               </button>

//               {/* Help Icon */}
//               <button
//                 className="p-2 rounded-md hover:bg-muted transition"
//                 aria-label="Help"
//               >
//                 <HelpCircle className="h-5 w-5" />
//               </button>

//               {/* Theme Toggle */}
//               <ModeToggle />

//               {/* User Dropdown */}
//               <NavUser
//                 user={{
//                   name: user?.user_metadata?.name || "User",
//                   email: user?.email || "",
//                   avatar: user?.user_metadata?.avatar_url,
//                 }}
//               />
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 px-12">{children}</main>
//         {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//           <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//           </div>
//           <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
//         </div> */}
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// "use client"

import type React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  getBillingStateForUser,
  getTrialDaysRemaining,
  getBillingStateForBusiness,
} from "@/lib/billing";
import { createClient } from "@/utils/supabase/server";
import { Bell, HelpCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OnboardingGuard } from "@/components/onboarding/onboarding-guard";
import { getOnboardingProgress } from "@/utils/onboarding";
import { DashboardLayoutWrapper } from "@/components/dashboard/layout-wrapper";
// import { useState } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("users")
    .select("role")
    .eq("email", user.email)
    .single();
  // if (me?.role !== "admin") redirect("/dashboard/calls");

  // Check onboarding progress using the same logic as the API
  // This function checks multiple tables: onboarding_progress, businesses, phone_endpoints, business_configs
  let completedSteps = 0;
  try {
    const progress = await getOnboardingProgress(user.id);
    completedSteps = progress.completedSteps;
    console.log("[Dashboard Layout] Onboarding check:", {
      userId: user.id,
      completedSteps,
      shouldRedirect: completedSteps < 3,
      progressDetails: progress.steps.map((s) => ({
        id: s.id,
        completed: s.completed,
      })),
    });
  } catch (error) {
    console.error(
      "[Dashboard Layout] Error fetching onboarding progress:",
      error,
    );
    // If there's an error, default to 0 (redirect to onboarding)
    completedSteps = 0;
  }

  // const [isCelebrationDismissed, setIsCelebrationDismissed] = useState(false)

  // Resolve billing state to enforce trial / subscription gating at layout level.
  const billingState = await getBillingStateForUser(user.id);
  const trialDaysLeft = billingState
    ? getTrialDaysRemaining(billingState)
    : null;
  const showTrialBanner =
    typeof trialDaysLeft === "number" && trialDaysLeft >= 0;

  let businessData = null;
  let phoneNumber = null;
  let nudgeUsageData = null; // For Nudge

  if (billingState?.businessId) {
    const { data: b } = await supabase
      .from("businesses")
      .select("name, billing_plan, phone_main")
      .eq("id", billingState.businessId)
      .single();

    if (b) {
      businessData = { name: b.name, plan: b.billing_plan || "Pro" };
      phoneNumber = b.phone_main || null;

      if (!phoneNumber) {
        // fetch from endpoints if not in business table
        const { data: endpoints } = await supabase
          .from("phone_endpoints")
          .select("phone_number")
          .eq("business_id", billingState.businessId)
          .eq("status", "active")
          .limit(1);
        if (endpoints && endpoints.length > 0) {
          phoneNumber = endpoints[0].phone_number;
        }
      }

      // Fetch usage for Nudge
      const { data: usage } = await supabase
        .from("usage_tracking")
        .select("minutes_used, purchased_minutes")
        .eq("business_id", billingState.businessId)
        .order("period_end", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (usage) {
        nudgeUsageData = {
          businessId: billingState.businessId,
          usage: {
            minutesUsed: usage.minutes_used || 0,
            purchasedMinutes: usage.purchased_minutes || 0,
            planSlug: b.billing_plan || "starter",
          },
        };
      }
    }
  }

  // If trial has expired and there's no active subscription, we still allow access
  // to the dashboard shell but expect individual pages/APIs to enforce billing
  // (e.g. redirect to /dashboard/billing or return 402). This avoids hard-coding
  // a redirect here that might conflict with onboarding flows.
  // You can tighten this later if you want a global redirect from the layout.

  return (
    <OnboardingGuard completedSteps={completedSteps}>
      <div className="flex h-screen bg-background">
        <SidebarProvider>
          <AppSidebar
            user={user}
            trialDaysLeft={trialDaysLeft}
            businessData={businessData}
            phoneNumber={phoneNumber}
          />
          <SidebarInset className="overflow-hidden">
            <DashboardLayoutWrapper businessData={nudgeUsageData}>
              {showTrialBanner && (
                <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium py-2 px-4 text-center">
                  <span className="font-bold border border-white/20 dark:border-black/10 bg-white/10 dark:bg-black/5 px-2 py-0.5 rounded text-xs mr-2">
                    TRIAL ACTIVE
                  </span>
                  You have {trialDaysLeft} days remaining in your free trial.{" "}
                  <Link
                    href="/dashboard/billing"
                    className="underline underline-offset-4 hover:text-zinc-300 dark:hover:text-zinc-600 transition-colors font-semibold"
                  >
                    Upgrade now for full access.
                  </Link>
                </div>
              )}
              <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:hidden">
                <SidebarTrigger />
                <div className="font-semibold text-primary">Zevaux</div>
              </header>
              <main className="flex-1 h-full overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto w-full">{children}</div>
              </main>
            </DashboardLayoutWrapper>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </OnboardingGuard>
  );
}
