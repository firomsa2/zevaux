"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function TeamSwitcher({
  teams,
  showLogo = true,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  showLogo?: boolean;
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  // Update activeTeam when teams prop changes
  React.useEffect(() => {
    if (teams && teams.length > 0) {
      setActiveTeam(teams[0]);
    }
  }, [teams]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link
            href="/dashboard"
            className="flex gap-2  items-center justify-center"
          >
            {showLogo && (
              <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
            )}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-xl">
                {activeTeam.name}
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
