"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { OnboardingProgress } from "@/types/onboarding";

interface UseOnboardingProgressOptions {
  enabled?: boolean;
  refetchInterval?: number;
  onComplete?: () => void;
}

/**
 * Production-ready hook for onboarding progress tracking
 * Features:
 * - Event-driven updates (on navigation)
 * - Smart polling (only when visible, with exponential backoff)
 * - Request deduplication
 * - Automatic cleanup
 */
export function useOnboardingProgress(
  initialProgress: OnboardingProgress,
  options: UseOnboardingProgressOptions = {}
) {
  const {
    enabled = true,
    refetchInterval = 15000, // 15 seconds default
    onComplete,
  } = options;

  const [progress, setProgress] = useState<OnboardingProgress>(initialProgress);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  
  // Request deduplication
  const fetchingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveNoChangeRef = useRef(0);
  const currentIntervalRef = useRef(refetchInterval);

  const fetchProgress = useCallback(async (force = false) => {
    // Prevent duplicate requests
    if (fetchingRef.current && !force) {
      return;
    }

    // Don't fetch if tab is hidden
    if (document.hidden && !force) {
      return;
    }

    // Don't fetch if already complete
    if (progress.isComplete && !force) {
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await fetch("/api/onboarding/progress", {
        // Add cache control for production
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.ok) {
        const newProgress: OnboardingProgress = await response.json();

        // Check if progress actually changed
        const hasChanged =
          newProgress.completedSteps !== progress.completedSteps ||
          newProgress.isComplete !== progress.isComplete ||
          newProgress.progressPercentage !== progress.progressPercentage;

        if (hasChanged) {
          setProgress(newProgress);
          consecutiveNoChangeRef.current = 0;
          currentIntervalRef.current = refetchInterval; // Reset interval

          // Call onComplete callback if newly completed
          if (newProgress.isComplete && !progress.isComplete && onComplete) {
            onComplete();
          }
        } else {
          consecutiveNoChangeRef.current++;
          // Exponential backoff: increase interval if no changes
          if (consecutiveNoChangeRef.current > 2) {
            currentIntervalRef.current = Math.min(
              currentIntervalRef.current * 1.5,
              60000 // Max 60 seconds
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch onboarding progress:", error);
      // On error, increase interval to reduce load
      currentIntervalRef.current = Math.min(
        currentIntervalRef.current * 2,
        60000
      );
    } finally {
      fetchingRef.current = false;
      setIsLoading(false);
    }
  }, [progress, refetchInterval, onComplete]);

  // Event-driven: Refresh on navigation
  useEffect(() => {
    if (!enabled || progress.isComplete) return;
    
    // Small delay to allow page to load
    const timeoutId = setTimeout(() => {
      fetchProgress(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [pathname, enabled, progress.isComplete, fetchProgress]);

  // Listen for custom refresh events (triggered after saves)
  useEffect(() => {
    if (!enabled || progress.isComplete) return;

    const handleRefresh = () => {
      fetchProgress(true);
    };

    // Listen for custom event
    window.addEventListener("onboarding:refresh", handleRefresh);

    return () => {
      window.removeEventListener("onboarding:refresh", handleRefresh);
    };
  }, [enabled, progress.isComplete, fetchProgress]);

  // Smart polling: Only when visible and not complete
  useEffect(() => {
    if (!enabled || progress.isComplete) {
      // Clear any existing intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const scheduleNext = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (!document.hidden && !progress.isComplete) {
          fetchProgress();
        }
        scheduleNext();
      }, currentIntervalRef.current);
    };

    // Start polling
    scheduleNext();

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause polling when tab is hidden
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else {
        // Resume polling when tab becomes visible
        if (!timeoutRef.current && !progress.isComplete) {
          // Immediate fetch when tab becomes visible
          fetchProgress(true);
          scheduleNext();
        }
      }
    };

    // Handle window focus/blur
    const handleFocus = () => {
      if (!progress.isComplete) {
        fetchProgress(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [enabled, progress.isComplete, fetchProgress]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchProgress(true);
  }, [fetchProgress]);

  return {
    progress,
    isLoading,
    refresh,
  };
}

