"use client";

import { Business, Plan } from "@/types/database";
import { getPlanDetails } from "@/lib/billing-calculation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, Crown } from "lucide-react";

interface UpgradeNudgeProps {
  businessId: string;
  usage: {
    minutesUsed: number;
    purchasedMinutes: number;
    planSlug: string;
  };
  openOverride?: boolean;
}

export function UpgradeNudge({
  businessId,
  usage,
  openOverride = false,
}: UpgradeNudgeProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"usage" | "overage" | null>(null);

  useEffect(() => {
    // Determine if we should show nudge
    const plan = getPlanDetails(usage.planSlug || "starter");
    const totalMinutes = plan.minutesIncluded + (usage.purchasedMinutes || 0);

    if (totalMinutes <= 0) return;

    const percentage = (usage.minutesUsed / totalMinutes) * 100;
    const isOverage = usage.minutesUsed > totalMinutes;

    // Logic:
    // 1. Overage > 0: High urgency (Red)
    // 2. Remaining <= 20% (i.e. > 80% used): Warning (Amber)

    // Check if dismissed recently (localStorage)
    const lastDismissed = localStorage.getItem(`nudge_${businessId}`);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (openOverride) {
      setOpen(true);
      setType(isOverage ? "overage" : "usage");
      return;
    }

    if (lastDismissed && now - parseInt(lastDismissed) < oneDay) {
      return; // Don't annoy
    }

    if (isOverage) {
      setType("overage");
      setOpen(true);
    } else if (percentage >= 80) {
      setType("usage");
      setOpen(true);
    }
  }, [usage.minutesUsed, usage.planSlug, businessId, openOverride]);

  const handleDismiss = () => {
    setOpen(false);
    localStorage.setItem(`nudge_${businessId}`, Date.now().toString());
  };

  if (!type) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleDismiss()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            {type === "overage" ? (
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            ) : (
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            )}
            <DialogTitle>
              {type === "overage"
                ? "You've exceeded your included minutes"
                : "Running low on minutes"}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {type === "overage"
              ? "You are now being billed for overage minutes. Upgrade to a higher plan to save money and get more included minutes."
              : "You have used over 80% of your monthly minutes. Upgrade now to avoid interruption or overage charges."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleDismiss}>
            Maybe Later
          </Button>
          <Link href="/dashboard/billing">
            <Button className="w-full sm:w-auto">View Plans & Upgrade</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
