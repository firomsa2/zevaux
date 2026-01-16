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
          const { data: businessData } = await getBusinessById(businessId);
          if (businessData) {
            setTeams([
              {
                name: businessData.name,
                logo: Building,
                plan: businessData.billing_plan || "Pro",
              },
            ]);
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
    teams
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavProjects projects={data.projects} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
