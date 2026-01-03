import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import Logout from "@/components/Logout";
import {
  Phone,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Volume2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default async function ProfessionalNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Zevaux
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                AI Receptionist
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" passHref>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary">
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-6 grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                          Industries
                        </div>
                        {[
                          { name: "Healthcare", icon: "🏥" },
                          { name: "Legal Services", icon: "⚖️" },
                          { name: "Real Estate", icon: "🏠" },
                          { name: "Financial Services", icon: "💼" },
                        ].map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            <span>{item.icon}</span>
                            <span className="text-sm">{item.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                          Use Cases
                        </div>
                        {[
                          { name: "Appointment Booking", icon: "📅" },
                          { name: "Lead Qualification", icon: "🎯" },
                          { name: "Customer Support", icon: "🤝" },
                          { name: "24/7 Answering", icon: "🌙" },
                        ].map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            <span>{item.icon}</span>
                            <span className="text-sm">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="#features" passHref>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                      Features
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="#pricing" passHref>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="#customers" passHref>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                      Customers
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>24/7 Support</span>
                </div>
                <ModeToggle />
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Sign In
                  </Button>
                </Link>
                {/* <Link href="/checkout">
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                    Start Free Trial
                  </Button>
                </Link> */}
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <ModeToggle />
                <Logout />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
