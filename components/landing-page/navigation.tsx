"use client";

import { useState, useEffect, Fragment } from "react";
import { LogOut, Phone, ArrowRight, LayoutDashboard } from "lucide-react";
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

  const router = useRouter();
  const supabase = createClient();

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
      className="
        sticky top-0 z-50
        border-b border-border
        bg-background/80 backdrop-blur-xl
        supports-[backdrop-filter]:bg-background/60
        transition-colors
      "
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
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
                    text-sm font-medium
                    text-muted-foreground
                    hover:text-foreground
                    transition-colors
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
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>

                      <Button size="sm" asChild>
                        <Link
                          href="/signup"
                          className="flex items-center gap-2"
                        >
                          Get Started
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
            {!isLoading && (
              <>
                {user ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    Menu
                  </Button>
                ) : (
                  <Button size="sm" asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div
          className="
            lg:hidden
            border-t border-border
            bg-background/95 backdrop-blur-md
            px-4 py-4
          "
        >
          <div className="space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  block py-2 text-sm
                  text-muted-foreground
                  hover:text-foreground
                "
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 space-y-2 border-t border-border">
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
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
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>

                      <Button size="sm" className="w-full" asChild>
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
