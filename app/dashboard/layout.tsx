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
import { createClient } from "@/utils/supabase/server";
import { Bell, HelpCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { OnboardingGuard } from "@/components/onboarding/onboarding-guard";
import { getOnboardingProgress } from "@/utils/onboarding";
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
  // This function checks multiple tables: onboarding_progress, businesses, phone_endpoints, knowledge_base_documents
  let completedSteps = 0;
  try {
    const progress = await getOnboardingProgress(user.id);
    completedSteps = progress.completedSteps;
  } catch (error) {
    console.error("Error fetching onboarding progress:", error);
    // If there's an error, default to 0 (redirect to onboarding)
    completedSteps = 0;
  }

  // const [isCelebrationDismissed, setIsCelebrationDismissed] = useState(false)

  return (
    <OnboardingGuard completedSteps={completedSteps}>
      <div className="flex h-screen bg-background">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b">
              <div className="flex items-center justify-between px-4 w-full">
                {/* Left Section */}
                <div className="flex items-center">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                  />
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                  {/* Notification Bell */}
                  <button
                    className="p-2 rounded-md hover:bg-muted transition"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </button>

                  {/* Help Icon */}
                  <button
                    className="p-2 rounded-md hover:bg-muted transition"
                    aria-label="Help"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </button>

                  {/* Theme Toggle */}
                  <ModeToggle />

                  {/* User Dropdown */}
                  <NavUser
                    user={{
                      name: user?.user_metadata?.name || "User",
                      email: user?.email || "",
                      avatar: user?.user_metadata?.avatar_url,
                    }}
                  />
                </div>
              </div>
            </header>

            <main className="flex-1 px-12">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </OnboardingGuard>
  );
}
