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
  completedSteps: initialCompletedSteps,
}: OnboardingGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Use local state to allow client-side verification updates
  const [completedSteps, setCompletedSteps] = useState(initialCompletedSteps);
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync with prop if it changes
  useEffect(() => {
    setCompletedSteps(initialCompletedSteps);
  }, [initialCompletedSteps]);

  useEffect(() => {
    const isOnboardingPage =
      pathname?.includes("/dashboard/onboarding") ?? false;

    console.log("[OnboardingGuard] Check:", {
      pathname,
      completedSteps,
      isOnboardingPage,
      isVerifying,
      shouldVerify: completedSteps < 3 && !isOnboardingPage && !isVerifying,
    });

    // If less than 3 steps completed and not on onboarding page, verify before redirecting
    if (completedSteps < 3 && !isOnboardingPage) {
      if (!isVerifying) {
        setIsVerifying(true);
        console.log(
          "[OnboardingGuard] Local state indicates incomplete onboarding. Verifying with API...",
        );

        fetch("/api/onboarding/progress")
          .then(async (res) => {
            if (res.ok) {
              const data = await res.json();
              console.log(
                "[OnboardingGuard] API Verification result:",
                data.completedSteps,
              );

              if (typeof data.completedSteps === "number") {
                if (data.completedSteps >= 3) {
                  // If API says we are good, update state and allow access
                  setCompletedSteps(data.completedSteps);
                  return;
                }
              }
            }
            // If API also says < 3 or fails, proceed with redirect
            console.log(
              "[OnboardingGuard] Confirmation failed or incomplete. Redirecting to /dashboard/onboarding",
            );
            router.replace("/dashboard/onboarding");
          })
          .catch((err) => {
            console.error("[OnboardingGuard] verification error:", err);
            router.replace("/dashboard/onboarding");
          })
          .finally(() => {
            // We don't set isVerifying(false) here immediately to prevent loops if redirect is pending
            // But if we updated completedSteps to >= 3, the effect will re-run and fallback to "else" branch
            // If we redirected, component unmounts or pathname changes
          });
      }
    } else {
      if (completedSteps >= 3) {
        // console.log("[OnboardingGuard] Allowing access - 3+ steps completed");
      }
    }
  }, [completedSteps, pathname, router]);

  // If less than 3 steps completed and not on onboarding page, don't render children
  const isOnboardingPage = pathname?.includes("/dashboard/onboarding") ?? false;
  if (completedSteps < 3 && !isOnboardingPage) {
    return null; // Showing nothing while verifying or redirecting
  }

  return <>{children}</>;
}
