"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export function ResponsiveHeader({ user, profile }: any) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-30">
      <div className="container-max py-4 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-accent truncate">
            Zevaux
          </h1>
          <p className="text-xs md:text-sm text-text-secondary truncate">
            {user?.business_name || "My Business"}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/dashboard/settings" className="hidden md:block">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
