"use client";

import { useEffect, useState } from "react";
import type { Feature } from "@/lib/features";

export function useFeatureAccess(feature: Feature) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch(`/api/features/check?feature=${feature}`);
        const data = await response.json();
        setHasAccess(data.hasAccess);
      } catch (error) {
        console.error("Error checking feature access:", error);
        setHasAccess(false);
      }
    }

    checkAccess();
  }, [feature]);

  return hasAccess;
}
