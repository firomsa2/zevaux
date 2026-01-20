"use client";

import { toast, notify, sonnerToast } from "@/lib/toast";

/**
 * Hook for accessing toast notifications
 * 
 * @example
 * const { toast, notify } = useToast();
 * 
 * // Simple notifications
 * toast.success("Saved!");
 * toast.error("Something went wrong");
 * 
 * // Pre-configured notifications
 * notify.auth.loginSuccess("John");
 * notify.crud.createSuccess("Agent");
 * notify.clipboard.copied("Phone number");
 */
export function useToast() {
  return {
    toast,
    notify,
    sonnerToast, // Direct access to sonner if needed
  };
}

// Re-export for convenience
export { toast, notify } from "@/lib/toast";
