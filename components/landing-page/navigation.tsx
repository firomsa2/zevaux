"use client";

import { useState, useEffect } from "react";
import {
  LogOut,
  Phone,
  ArrowRight,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { ModeToggle } from "../mode-toggle";

interface User {
  id: string;
  email?: string;
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser({
            id: user.id,
            email: user.email ?? undefined,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`
        sticky top-0 z-50
        border-b transition-all duration-300
        ${
          isScrolled
            ? "border-border bg-background/95 backdrop-blur-xl shadow-sm"
            : "border-transparent bg-background/80 backdrop-blur-md"
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary transition-transform duration-300 group-hover:scale-105">
              <Phone className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              Zevaux
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    relative text-sm font-medium
                    text-muted-foreground
                    hover:text-foreground
                    transition-colors
                    after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0
                    after:bg-primary after:transition-all after:duration-300
                    hover:after:w-full
                  "
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-4">
              <ModeToggle />

              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="
                          flex items-center gap-2 text-sm font-medium
                          text-muted-foreground hover:text-foreground
                          transition-colors
                        "
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="hover:bg-muted"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>

                      <Button
                        size="sm"
                        asChild
                        className="shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Link
                          href="/signup"
                          className="flex items-center gap-2"
                        >
                          Start Free Trial
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* MOBILE ACTION */}
          <div className="lg:hidden flex items-center gap-3">
            <ModeToggle />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`
          lg:hidden
          overflow-hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="border-t border-border bg-background px-4 py-4">
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  block py-3 px-4 rounded-lg text-base font-medium
                  text-muted-foreground
                  hover:text-foreground hover:bg-muted
                  transition-colors
                "
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-4 space-y-2 border-t border-border">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full justify-start text-muted-foreground"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>

                    <Button size="lg" className="w-full" asChild>
                      <Link href="/signup" className="flex items-center gap-2">
                        Start Free Trial
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
