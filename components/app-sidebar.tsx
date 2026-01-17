// "use client";

// import * as React from "react";
// import {
//   AlignVerticalJustifyStartIcon,
//   AudioWaveform,
//   Bot,
//   BotIcon,
//   ChartBar,
//   ChartBarIncreasing,
//   Command,
//   CreditCard,
//   Files,
//   GalleryVerticalEnd,
//   Home,
//   LayoutDashboard,
//   MessageCircle,
//   MessageSquare,
//   Phone,
//   PhoneCall,
//   PhoneForwarded,
//   PhoneIncoming,
//   PlugZapIcon,
//   Settings,
//   SquareTerminal,
//   User2,
//   VectorSquare,
//   ZapIcon,
// } from "lucide-react";

// import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
// import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
// } from "@/components/ui/sidebar";
// import { User } from "@supabase/supabase-js";
// import { createClient } from "@/utils/supabase/client";

// // This is sample data.
// const data = {
//   // user: {
//   //   name: "shadcn",
//   //   email: "m@example.com",
//   //   avatar: "/avatars/shadcn.jpg",
//   // },
//   teams: [
//     {
//       name: "Zevaux Inc",
//       logo: PlugZapIcon,
//       plan: "Enterprise",
//     },
//     {
//       name: "Zevaux",
//       logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       logo: Command,
//       plan: "Free",
//     },
//   ],
//   navItems: [
//     { title: "Overview", url: "/dashboard", icon: Home },
//     {
//       title: "Receptionist",
//       url: "/dashboard/dashboard",
//       icon: Bot,
//       items: [
//         { title: "Agents", url: "/dashboard/dashboard/agent" },
//         { title: "Flows", url: "/dashboard/dashboard/flows" },
//       ],
//     },
//     { title: "Knowledge Base", url: "/dashboard/knowledge", icon: Files },
//     { title: "Phone Numbers", url: "/dashboard/phone-numbers", icon: Phone },
//     { title: "Call Logs", url: "/dashboard/calls", icon: PhoneCall },
//     { title: "SMS", url: "/dashboard/sms", icon: MessageCircle },
//     // { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
//     // { title: "Settings", url: "/dashboard/settings", icon: Settings },
//   ],
//   navMain: [
//     {
//       title: "Overview",
//       url: "/dashboard",
//       icon: LayoutDashboard,
//       isActive: true,
//       items: [
//         {
//           title: "History",
//           url: "#",
//         },
//         {
//           title: "Starred",
//           url: "#",
//         },
//         {
//           title: "Settings",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Analytics",
//       url: "#",
//       icon: ChartBar,
//       items: [
//         {
//           title: "Genesis",
//           url: "#",
//         },
//         {
//           title: "Explorer",
//           url: "#",
//         },
//         {
//           title: "Quantum",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Receptionist",
//       url: "/dashboard/dashboard",
//       icon: BotIcon,
//       items: [
//         {
//           title: "History",
//           url: "#",
//         },
//         {
//           title: "Starred",
//           url: "#",
//         },
//         {
//           title: "Settings",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Phone Numbers",
//       url: "/dashboard/phone-numbers",
//       icon: PhoneIncoming,
//     },
//     {
//       title: "Call Logs",
//       url: "/dashboard/calls",
//       icon: Phone,
//       items: [
//         {
//           title: "Introduction",
//           url: "#",
//         },
//         {
//           title: "Get Started",
//           url: "#",
//         },
//         {
//           title: "Tutorials",
//           url: "#",
//         },
//         {
//           title: "Changelog",
//           url: "#",
//         },
//       ],
//     },

//     {
//       title: "Sms",
//       url: "/dashboard/sms",
//       icon: MessageSquare,
//       items: [
//         {
//           title: "General",
//           url: "#",
//         },
//         {
//           title: "Team",
//           url: "#",
//         },
//         {
//           title: "Billing",
//           url: "#",
//         },
//         {
//           title: "Limits",
//           url: "#",
//         },
//       ],
//     },
//     // {
//     //   title: "Setup",
//     //   url: "#",
//     //   icon: User2,
//     //   items: [
//     //     {
//     //       title: "General",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Team",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Billing",
//     //       url: "#",
//     //     },
//     //     {
//     //       title: "Limits",
//     //       url: "#",
//     //     },
//     //   ],
//     // },
//   ],
//   projects: [
//     // {
//     //   name: "Design Engineering",
//     //   url: "#",
//     //   icon: Frame,
//     // },
//     {
//       name: "Billing",
//       url: "#",
//       icon: CreditCard,
//     },
//     {
//       name: "Settings",
//       url: "/dashboard/settings",
//       icon: Settings,
//     },
//   ],
// };

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const [user, setUser] = React.useState<User | null>(null);

//   React.useEffect(() => {
//     async function getUser() {
//       const supabase = await createClient();
//       const { data, error } = await supabase.auth.getUser();

//       if (error) {
//         console.error("Error fetching user:", error.message);
//         console.log("No user is logged in.");
//       } else {
//         setUser(data?.user);
//       }
//     }
//     getUser();
//   }, []);

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <TeamSwitcher teams={data.teams} />
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navItems} />
//         {/* <NavProjects projects={data.projects} /> */}
//       </SidebarContent>
//       <SidebarFooter>
//         <NavProjects projects={data.projects} />
//         {/* <NavUser user={user} /> */}
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   );
// }

"use client";

import * as React from "react";
import {
  Bot,
  Files,
  Phone,
  PhoneCall,
  MessageCircle,
  CreditCard,
  Settings,
  Home,
  BarChart,
  Users,
  Clock,
  Calendar,
  Building,
  Globe,
  Mic,
  MessageSquare,
  Zap,
  Bell,
  Shield,
  Package,
  Rocket,
  PlugZap,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { NavProjects } from "./nav-projects";
import { getUserWithBusiness } from "@/utils/supabase/user";
import { getBusinessById } from "@/utils/supabase/business";
import { phoneNumberService } from "@/utils/supabase/phone-numbers";

// Format phone number to (XXX) XXX-XXXX format
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // If it's 11 digits and starts with 1, format as +1 (XXX) XXX-XXXX
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Return original if it doesn't match expected format
  return phone;
}

const data = {
  teams: [
    {
      name: "Loading...",
      logo: Building,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Quick Start Guide",
      url: "/dashboard/onboarding",
      icon: Rocket,
      isActive: false,
    },
    {
      title: "Overview",
      url: "/dashboard",
      icon: Home,
      isActive: true, // Only Overview should be active by default on /dashboard
    },
    {
      title: "Receptionist",
      url: "#", // No navigation, just toggle dropdown
      icon: Bot,
      isActive: false,
      items: [
        {
          title: "Configuration",
          url: "/dashboard/receptionist/configure",
          icon: Settings,
        },
        {
          title: "Services",
          url: "/dashboard/receptionist/services",
          icon: Package,
        },
        {
          title: "Voice & Language",
          url: "/dashboard/receptionist/voice",
          icon: Mic,
        },
        {
          title: "Business Hours",
          url: "/dashboard/receptionist/hours",
          icon: Clock,
        },
      ],
    },
    {
      title: "Knowledge Base",
      url: "/dashboard/knowledge",
      icon: Files,
      isActive: false,
      items: [
        // {
        //   title: "FAQs",
        //   url: "/dashboard/knowledge/faqs",
        //   icon: MessageSquare,
        // },
        // {
        //   title: "Website Content",
        //   url: "/dashboard/knowledge/website",
        //   icon: Globe,
        // },
        // {
        //   title: "Documents",
        //   url: "/dashboard/knowledge/documents",
        //   icon: Files,
        // },
        // {
        //   title: "Training",
        //   url: "/dashboard/knowledge/training",
        //   icon: Zap,
        // },
      ],
    },
    {
      title: "Phone Numbers",
      url: "/dashboard/phone-numbers",
      icon: Phone,
      isActive: false,
      items: [
        // {
        //   title: "Manage Numbers",
        //   url: "/dashboard/phone-numbers/manage",
        //   icon: Phone,
        // },
        // {
        //   title: "Assignments",
        //   url: "/dashboard/phone-numbers/assign",
        //   icon: Users,
        // },
        // {
        //   title: "Call Routing",
        //   url: "/dashboard/phone-numbers/routing",
        //   icon: Bell,
        // },
      ],
    },
    {
      title: "Call Logs",
      url: "/dashboard/calls",
      icon: PhoneCall,
      isActive: false,
      items: [
        // {
        //   title: "All Calls",
        //   url: "/dashboard/calls/all",
        //   icon: PhoneCall,
        // },
        // {
        //   title: "Voicemails",
        //   url: "/dashboard/calls/voicemail",
        //   icon: Mic,
        // },
        // {
        //   title: "Missed Calls",
        //   url: "/dashboard/calls/missed",
        //   icon: Clock,
        // },
        // {
        //   title: "Analytics",
        //   url: "/dashboard/calls/analytics",
        //   icon: BarChart,
        // },
      ],
    },
    {
      title: "SMS",
      url: "/dashboard/sms",
      icon: MessageCircle,
      isActive: false,
      items: [
        // {
        //   title: "Inbox",
        //   url: "/dashboard/sms/inbox",
        //   icon: MessageSquare,
        // },
        // {
        //   title: "Automations",
        //   url: "/dashboard/sms/automations",
        //   icon: Zap,
        // },
        // {
        //   title: "Templates",
        //   url: "/dashboard/sms/templates",
        //   icon: Files,
        // },
      ],
    },
    {
      title: "Integrations",
      url: "/dashboard/integrations",
      icon: PlugZap,
      isActive: false,
    },
  ],
  projects: [
    {
      name: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      name: "Account Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null);
  const [teams, setTeams] = React.useState(data.teams);
  const [phoneNumber, setPhoneNumber] = React.useState<string | null>(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = React.useState<
    number | null
  >(null);

  // Calculate days remaining in trial
  const calculateTrialDaysRemaining = (
    trialEnd: string | null,
  ): number | null => {
    if (!trialEnd) return null;
    const trialEndDate = new Date(trialEnd);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  console.log("🚀 ~ Sidebar render, user:", user, "teams:", teams);
  React.useEffect(() => {
    async function loadData() {
      try {
        const {
          user: userData,
          businessId,
          error,
        } = await getUserWithBusiness();
        console.log("🚀 ~ Sidebar fetched user with business:", {
          userData,
          businessId,
          error,
        });

        if (userData) {
          setUser(userData);
        }

        if (businessId) {
          const supabase = createClient();

          // Fetch business data and subscription in parallel
          const [businessResult, subscriptionResult] = await Promise.all([
            getBusinessById(businessId),
            supabase
              .from("subscriptions")
              .select("status, trial_end")
              .eq("business_id", businessId)
              .maybeSingle(),
          ]);

          const { data: businessData } = businessResult;
          const { data: subscription } = subscriptionResult;

          if (businessData) {
            setTeams([
              {
                name: businessData.name,
                logo: Building,
                plan: businessData.billing_plan || "Pro",
              },
            ]);

            // Get phone number from business or phone endpoints
            if (businessData.phone_main) {
              setPhoneNumber(businessData.phone_main);
            } else {
              // Try to get from phone endpoints
              const { data: phoneNumbers } =
                await phoneNumberService.getPhoneNumbers(businessId);
              if (phoneNumbers && phoneNumbers.length > 0) {
                // Get the primary or first active phone number
                const primaryPhone =
                  phoneNumbers.find((p) => p.is_primary) ||
                  phoneNumbers.find((p) => p.is_active);
                if (primaryPhone) {
                  setPhoneNumber(primaryPhone.phone_number);
                }
              }
            }
          }

          // Check if user is on trial and calculate days remaining
          if (
            subscription &&
            subscription.status === "trialing" &&
            subscription.trial_end
          ) {
            const daysRemaining = calculateTrialDaysRemaining(
              subscription.trial_end,
            );
            setTrialDaysRemaining(daysRemaining);
          }
        }
        console.log("🚀 ~ Sidebar updated teams:", teams);
      } catch (error) {
        console.error("Error loading sidebar data:", error);
      }
    }
    loadData();
  }, []);

  console.log(
    "🚀 ~ Sidebar render after data load, user:",
    user,
    "teams:",
    teams,
  );

  const ActiveLogo = teams && teams.length > 0 ? teams[0].logo : Building;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <ActiveLogo className="size-4" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-primary">
              Zevaux
            </span>
          </div>
          <div className=" w-full flex items-center justify-center">
            <TeamSwitcher teams={teams} showLogo={false} />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavProjects projects={data.projects} />
        {(phoneNumber || trialDaysRemaining !== null) && (
          <div className="px-2 py-3 border-t border-sidebar-border space-y-2">
            {trialDaysRemaining !== null && (
              <div className="text-xs text-sidebar-foreground/60 text-center">
                {trialDaysRemaining === 0
                  ? "Trial ends today"
                  : trialDaysRemaining === 1
                    ? "1 day left in your free trial"
                    : `${trialDaysRemaining} days left in your free trial`}
              </div>
            )}
            {phoneNumber && (
              <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                <Phone className="h-4 w-4" />
                <span className="font-medium">
                  {formatPhoneNumber(phoneNumber)}
                </span>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
