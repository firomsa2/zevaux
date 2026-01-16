"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReceptionistProgressCard } from "./receptionist-progress";
import type { ReceptionistProgress } from "@/types/onboarding";

/**
 * Optimized wrapper for receptionist progress
 * Uses event-driven updates + smart polling
 */
export function ReceptionistProgressWrapper() {
  const [progress, setProgress] = useState<ReceptionistProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const fetchingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIntervalRef = useRef(15000); // Start with 15 seconds

  const fetchProgress = async (force = false) => {
    // Prevent duplicate requests
    if (fetchingRef.current && !force) return;
    
    // Don't fetch if tab is hidden
    if (document.hidden && !force) return;

    fetchingRef.current = true;

    try {
      const response = await fetch("/api/onboarding/progress", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.receptionistProgress) {
          const newProgress = data.receptionistProgress;
          
          // Check if progress changed
          const hasChanged =
            !progress ||
            newProgress.completedSubSteps !== progress.completedSubSteps ||
            newProgress.isComplete !== progress.isComplete;

          if (hasChanged) {
            setProgress(newProgress);
            currentIntervalRef.current = 15000; // Reset interval
          } else {
            // Increase interval if no changes
            currentIntervalRef.current = Math.min(
              currentIntervalRef.current * 1.5,
              30000 // Max 30 seconds
            );
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch receptionist progress:", error);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  // Event-driven: Refresh on navigation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProgress(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  // Listen for custom refresh events (triggered after saves)
  useEffect(() => {
    const handleRefresh = () => {
      fetchProgress(true);
    };

    window.addEventListener("onboarding:refresh", handleRefresh);

    return () => {
      window.removeEventListener("onboarding:refresh", handleRefresh);
    };
  }, [fetchProgress]);

  // Smart polling: Only when visible and not complete
  useEffect(() => {
    if (progress?.isComplete) {
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
        if (!document.hidden && !progress?.isComplete) {
          fetchProgress();
        }
        if (!progress?.isComplete) {
          scheduleNext();
        }
      }, currentIntervalRef.current);
    };

    scheduleNext();

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      } else {
        if (!timeoutRef.current && !progress?.isComplete) {
          fetchProgress(true);
          scheduleNext();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [progress?.isComplete]);

  if (loading || !progress || progress.isComplete) {
    return null;
  }

  return <ReceptionistProgressCard progress={progress} />;
}

