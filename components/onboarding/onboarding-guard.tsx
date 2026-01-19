"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface OnboardingGuardProps {
  children: React.ReactNode;
  completedSteps: number;
}

/**
 * Client component that checks onboarding progress and redirects if needed
 * Allows access if 3+ steps are completed, otherwise redirects to onboarding
 */
export function OnboardingGuard({
  children,
  completedSteps,
}: OnboardingGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const isOnboardingPage = pathname?.includes("/dashboard/onboarding") ?? false;

    console.log("[OnboardingGuard] Check:", {
      pathname,
      completedSteps,
      isOnboardingPage,
      shouldRedirect: completedSteps < 3 && !isOnboardingPage,
    });

    // If less than 3 steps completed and not on onboarding page, redirect
    if (completedSteps < 3 && !isOnboardingPage) {
      console.log("[OnboardingGuard] Redirecting to /dashboard/onboarding");
      setShouldRedirect(true);
      // Use replace to avoid adding to history stack
      router.replace("/dashboard/onboarding");
    } else {
      setShouldRedirect(false);
      if (completedSteps >= 3) {
        console.log("[OnboardingGuard] Allowing access - 3+ steps completed");
      } else if (isOnboardingPage) {
        console.log("[OnboardingGuard] Allowing access - already on onboarding page");
      }
    }
  }, [completedSteps, pathname, router]);

  // If we're redirecting, don't render children to prevent flash
  if (shouldRedirect) {
    return null;
  }

  // If less than 3 steps completed and not on onboarding page, don't render children
  const isOnboardingPage = pathname?.includes("/dashboard/onboarding") ?? false;
  if (completedSteps < 3 && !isOnboardingPage) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
