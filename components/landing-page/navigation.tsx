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
            ? "border-white/10 bg-[var(--rich-bg)]/90 backdrop-blur-xl shadow-sm supports-[backdrop-filter]:bg-[var(--rich-bg)]/60"
            : "border-transparent bg-[var(--rich-bg)]"
        }
      `}
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-16">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary transition-transform duration-300 group-hover:scale-105">
              <Phone className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">
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
                    text-white/70
                    hover:text-white
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
                          text-white/70 hover:text-white
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
                        className="text-white hover:text-white hover:bg-white/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-white hover:text-white hover:bg-white/10"
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>

                      <Button
                        size="sm"
                        asChild
                        className="bg-white text-[var(--rich-bg)] hover:bg-white/90 shadow-md hover:shadow-lg transition-all"
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
              className="p-2 text-white hover:text-white hover:bg-white/10"
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
        <div className="border-t border-white/10 bg-[var(--rich-bg)] px-4 py-4">
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  block py-3 px-4 rounded-lg text-base font-medium
                  text-white/70
                  hover:text-white hover:bg-white/10
                  transition-colors
                "
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-4 space-y-2 border-t border-white/10">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
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
                      className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
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
                      className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                      asChild
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>

                    <Button
                      size="lg"
                      className="w-full bg-white text-[var(--rich-bg)] hover:bg-white/90"
                      asChild
                    >
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
