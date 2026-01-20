import { toast as sonnerToast, ExternalToast } from "sonner";

/**
 * Professional toast notification utility for Zevaux
 * Wraps Sonner with pre-configured styles and easy-to-use functions
 */

type ToastOptions = ExternalToast;

// ===== SUCCESS NOTIFICATIONS =====
export const toast = {
  /**
   * Display a success notification
   * @example toast.success("Settings saved successfully!")
   */
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      ...options,
    });
  },

  /**
   * Display an error notification
   * @example toast.error("Failed to save changes")
   */
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      ...options,
    });
  },

  /**
   * Display a warning notification
   * @example toast.warning("Your session will expire soon")
   */
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      ...options,
    });
  },

  /**
   * Display an info notification
   * @example toast.info("New features available")
   */
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      ...options,
    });
  },

  /**
   * Display a loading notification that can be updated
   * @example const id = toast.loading("Saving..."); toast.dismiss(id);
   */
  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      ...options,
    });
  },

  /**
   * Display a custom notification
   * @example toast.message("Hello!", { description: "Welcome back" })
   */
  message: (message: string, options?: ToastOptions) => {
    return sonnerToast.message(message, {
      ...options,
    });
  },

  /**
   * Dismiss a specific toast or all toasts
   * @example toast.dismiss() // dismiss all
   * @example toast.dismiss(toastId) // dismiss specific
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  /**
   * Execute an async function with loading/success/error states
   * @example toast.promise(saveData(), { loading: "Saving...", success: "Saved!", error: "Failed" })
   */
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
      description?: string;
      finally?: () => void;
    }
  ) => {
    return sonnerToast.promise(promise, options);
  },
};

// ===== PRE-CONFIGURED NOTIFICATIONS FOR COMMON SCENARIOS =====

export const notify = {
  // === Auth Notifications ===
  auth: {
    loginSuccess: (name?: string) =>
      toast.success(name ? `Welcome back, ${name}!` : "Welcome back!", {
        description: "You have been signed in successfully.",
      }),
    loginError: (message?: string) =>
      toast.error("Sign in failed", {
        description: message || "Please check your credentials and try again.",
      }),
    logoutSuccess: () =>
      toast.success("Signed out", {
        description: "You have been signed out successfully.",
      }),
    sessionExpired: () =>
      toast.warning("Session expired", {
        description: "Please sign in again to continue.",
      }),
    unauthorized: () =>
      toast.error("Access denied", {
        description: "You don't have permission to access this resource.",
      }),
  },

  // === CRUD Operations ===
  crud: {
    createSuccess: (item: string) =>
      toast.success(`${item} created`, {
        description: `The ${item.toLowerCase()} has been created successfully.`,
      }),
    createError: (item: string, message?: string) =>
      toast.error(`Failed to create ${item.toLowerCase()}`, {
        description: message || "Please try again.",
      }),
    updateSuccess: (item: string) =>
      toast.success(`${item} updated`, {
        description: `The ${item.toLowerCase()} has been updated successfully.`,
      }),
    updateError: (item: string, message?: string) =>
      toast.error(`Failed to update ${item.toLowerCase()}`, {
        description: message || "Please try again.",
      }),
    deleteSuccess: (item: string) =>
      toast.success(`${item} deleted`, {
        description: `The ${item.toLowerCase()} has been deleted successfully.`,
      }),
    deleteError: (item: string, message?: string) =>
      toast.error(`Failed to delete ${item.toLowerCase()}`, {
        description: message || "Please try again.",
      }),
    saveSuccess: () =>
      toast.success("Changes saved", {
        description: "Your changes have been saved successfully.",
      }),
    saveError: (message?: string) =>
      toast.error("Failed to save changes", {
        description: message || "Please try again.",
      }),
  },

  // === Form Notifications ===
  form: {
    validationError: (message?: string) =>
      toast.error("Validation error", {
        description: message || "Please check the form and try again.",
      }),
    submitSuccess: () =>
      toast.success("Form submitted", {
        description: "Your form has been submitted successfully.",
      }),
    submitError: (message?: string) =>
      toast.error("Submission failed", {
        description: message || "Please try again later.",
      }),
  },

  // === Network/API Notifications ===
  network: {
    offline: () =>
      toast.warning("You're offline", {
        description: "Some features may be unavailable.",
      }),
    online: () =>
      toast.success("You're back online", {
        description: "All features are now available.",
      }),
    serverError: () =>
      toast.error("Server error", {
        description: "Something went wrong. Please try again later.",
      }),
    timeout: () =>
      toast.error("Request timed out", {
        description: "Please check your connection and try again.",
      }),
  },

  // === Feature-specific (Zevaux) ===
  call: {
    incoming: (callerName?: string) =>
      toast.info("Incoming call", {
        description: callerName ? `Call from ${callerName}` : "New incoming call",
        duration: 10000,
      }),
    missed: (callerName?: string) =>
      toast.warning("Missed call", {
        description: callerName ? `Missed call from ${callerName}` : "You missed a call",
      }),
    ended: () =>
      toast.info("Call ended", {
        description: "The call has been completed.",
      }),
    transferred: (destination: string) =>
      toast.success("Call transferred", {
        description: `Call has been transferred to ${destination}.`,
      }),
  },

  // === Settings & Preferences ===
  settings: {
    saved: () =>
      toast.success("Settings saved", {
        description: "Your preferences have been updated.",
      }),
    resetToDefault: () =>
      toast.info("Settings reset", {
        description: "All settings have been restored to defaults.",
      }),
  },

  // === Billing/Subscription ===
  billing: {
    paymentSuccess: () =>
      toast.success("Payment successful", {
        description: "Thank you! Your payment has been processed.",
      }),
    paymentFailed: (message?: string) =>
      toast.error("Payment failed", {
        description: message || "Please check your payment details and try again.",
      }),
    subscriptionUpdated: () =>
      toast.success("Subscription updated", {
        description: "Your subscription has been updated successfully.",
      }),
    trialEnding: (daysLeft: number) =>
      toast.warning("Trial ending soon", {
        description: `Your trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Upgrade to continue.`,
        duration: 8000,
      }),
  },

  // === Copy/Clipboard ===
  clipboard: {
    copied: (item?: string) =>
      toast.success(item ? `${item} copied` : "Copied to clipboard", {
        description: "Ready to paste.",
        duration: 2000,
      }),
    copyFailed: () =>
      toast.error("Failed to copy", {
        description: "Please try again or copy manually.",
      }),
  },
};

// Re-export for direct access to sonner's toast if needed
export { sonnerToast };
