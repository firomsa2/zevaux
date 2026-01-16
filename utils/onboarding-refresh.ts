/**
 * Utility to trigger onboarding progress refresh
 * Call this after user actions that might affect onboarding progress
 */
export function triggerOnboardingRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("onboarding:refresh"));
  }
}

